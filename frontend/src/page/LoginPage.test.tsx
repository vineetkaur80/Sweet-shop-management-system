// import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import LoginPage from "./LoginPagee"; // Ensure this path is correct
import { describe, test, beforeEach, vi, expect } from "vitest";

// 1. Mock the AuthContext
const mockLogin = vi.fn();
vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

// 2. Mock useNavigate from react-router-dom CORRECTLY
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  // correctly import the actual module
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("LoginPage Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
  };

  test("renders the AbSweets login UI correctly", () => {
    renderComponent();

    expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
    expect(screen.getByText(/Back!/i)).toBeInTheDocument();
    expect(screen.getByText(/Please sign in to continue/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Customer/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Admin/i })).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Sign In/i })
    ).toBeInTheDocument();

    expect(screen.getByText(/Skip & Continue as Guest/i)).toBeInTheDocument();
  });

  test("defaults to Customer role and pre-fills customer credentials", async () => {
    renderComponent();

    const usernameInput = screen.getByPlaceholderText(/Enter username/i);
    const passwordInput = screen.getByPlaceholderText(/••••••••/i);

    await waitFor(() => {
      expect(usernameInput).toHaveValue("abhay_user@mail");
      expect(passwordInput).toHaveValue("abhay123");
    });
  });

  test("switches to Admin role and pre-fills admin credentials", async () => {
    renderComponent();

    const adminButton = screen.getByRole("button", { name: /Admin/i });

    fireEvent.click(adminButton);

    const usernameInput = screen.getByPlaceholderText(/Enter username/i);
    const passwordInput = screen.getByPlaceholderText(/••••••••/i);

    await waitFor(() => {
      expect(usernameInput).toHaveValue("abhay@mail");
      expect(passwordInput).toHaveValue("abhay");
    });
  });

  test('calls login and navigates to dashboard ("/") on successful Customer login', async () => {
    renderComponent();

    mockLogin.mockResolvedValueOnce(true);

    const submitButton = screen.getByRole("button", { name: /Sign In/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        username: "abhay_user@mail",
        password: "abhay123",
      });
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  test('navigates to ("/admin") only if username is "admin"', async () => {
    renderComponent();
    mockLogin.mockResolvedValueOnce(true);

    const usernameInput = screen.getByPlaceholderText(/Enter username/i);
    const submitButton = screen.getByRole("button", { name: /Sign In/i });

    // Manually change input to "admin" to trigger specific redirect logic
    fireEvent.change(usernameInput, { target: { value: "admin" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/admin");
    });
  });

  test("displays error message on login failure", async () => {
    renderComponent();

    mockLogin.mockRejectedValueOnce(new Error("Auth failed"));

    const submitButton = screen.getByRole("button", { name: /Sign In/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });

  test("navigates to register page when clicking Create Account", () => {
    renderComponent();

    const registerLink = screen.getByRole("link", {
      name: /Create an Account/i,
    });

    expect(registerLink).toHaveAttribute("href", "/register");
  });
});
