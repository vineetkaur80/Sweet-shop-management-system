import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import RegisterPage from "./RegisterPage";
import * as authApi from "../api/auth"; // We will create this file next

// Mock the API
vi.mock("../api/auth", () => ({
  registerUser: vi.fn(),
}));

describe("RegisterPage", () => {
  it("submits form with username and password", async () => {
    (authApi.registerUser as any).mockResolvedValue({
      data: { message: "User created" },
    });

    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    // Fill inputs
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "newuser" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "secret123" },
    });

    // Click register
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(authApi.registerUser).toHaveBeenCalledWith({
        username: "newuser",
        password: "secret123",
      });
    });
  });
});
