import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import DashboardPage from "./DashboardPage";
import { getSweets } from "../api/sweets";

// ---- MOCK API ----
vi.mock("../api/sweets", () => ({
  getSweets: vi.fn(),
}));

// ---- MOCK AUTH CONTEXT ----
// We mock a logged-in user so the cart logic works immediately without redirect
vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    user: { role: "user" },
    logout: vi.fn(),
  }),
}));

// ---- MOCK CART CONTEXT ----
const addToCartMock = vi.fn();

vi.mock("../context/CartContext", () => ({
  useCart: () => ({
    cart: [],
    addToCart: addToCartMock,
  }),
}));

describe("DashboardPage", () => {
  const mockSweets = [
    {
      _id: "1",
      name: "Chocolate Bar",
      price: 5,
      quantity: 10,
      category: "Choco",
    },
    {
      _id: "2",
      name: "Gummy Bears",
      price: 3,
      quantity: 0,
      category: "Gummy",
    },
  ];

  it("renders a list of sweets fetched from API", async () => {
    (getSweets as any).mockResolvedValue({ data: mockSweets });

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      // Check for Item Names
      expect(screen.getByText("Chocolate Bar")).toBeInTheDocument();
      expect(screen.getByText("Gummy Bears")).toBeInTheDocument();

      // Check for Price (The UI renders "${sweet.price}")
      expect(screen.getByText("$5")).toBeInTheDocument();
    });
  });

  it("adds item to cart when Add button (+) is clicked", async () => {
    (getSweets as any).mockResolvedValue({ data: mockSweets });

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByText("Chocolate Bar"));

    // The AbSweets UI uses "+" as the button label
    // We have multiple items, so we grab all "+" buttons.
    // Index 0 corresponds to "Chocolate Bar" (the first item).
    const addButtons = screen.getAllByRole("button", { name: "+" });
    const chocoBtn = addButtons[0];

    fireEvent.click(chocoBtn);

    expect(addToCartMock).toHaveBeenCalledWith(mockSweets[0]);
  });

  it("disables button when item is out of stock", async () => {
    (getSweets as any).mockResolvedValue({ data: mockSweets });

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByText("Gummy Bears"));

    // Index 1 corresponds to "Gummy Bears" (the second item)
    const addButtons = screen.getAllByRole("button", { name: "+" });
    const gummyBtn = addButtons[1];

    expect(gummyBtn).toBeDisabled();
  });
});
