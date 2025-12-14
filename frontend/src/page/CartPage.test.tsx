import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import CartPage from "./CartPage";
import * as sweetApi from "../api/sweets";
import * as CartContext from "../context/CartContext";

// Mock API and Context
vi.mock("../api/sweets", () => ({ purchaseSweet: vi.fn() }));

describe("CartPage", () => {
  it("renders cart items and handles checkout", async () => {
    // Mock the Cart Context State
    const mockClearCart = vi.fn();
    const mockRemove = vi.fn();

    vi.spyOn(CartContext, "useCart").mockReturnValue({
      cart: [
        {
          _id: "1",
          name: "Test Sweet",
          price: 10,
          quantity: 5,
          category: "Test",
          cartQty: 2,
        },
      ],
      totalPrice: 20,
      addToCart: vi.fn(),
      removeFromCart: mockRemove,
      clearCart: mockClearCart,
    });

    (sweetApi.purchaseSweet as any).mockResolvedValue({});

    render(
      <BrowserRouter>
        <CartPage />
      </BrowserRouter>
    );

    // 1. Check Render
    expect(screen.getByText("Test Sweet")).toBeInTheDocument();

    // The AbSweets UI splits "Total" and the price into separate spans
    expect(screen.getByText("Total")).toBeInTheDocument();

    // FIX: Use getAllByText because "$20.00" appears in item row, subtotal, and total
    const priceElements = screen.getAllByText("$20.00");
    expect(priceElements.length).toBeGreaterThan(0);

    // 2. Click Checkout
    // The button text is "Checkout" (and contains an SVG)
    const checkoutBtn = screen.getByRole("button", { name: /checkout/i });
    fireEvent.click(checkoutBtn);

    // 3. Verify API Call
    await waitFor(() => {
      expect(sweetApi.purchaseSweet).toHaveBeenCalledWith("1", 2);
      expect(mockClearCart).toHaveBeenCalled();
    });
  });
});
