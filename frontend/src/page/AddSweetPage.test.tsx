import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import AddSweetPage from "./AddSweetPage";
import * as sweetApi from "../api/sweets";

// Mock API
vi.mock("../api/sweets", () => ({
  createSweet: vi.fn(),
}));

describe("AddSweetPage", () => {
  it("submits form with correct values", async () => {
    // Mock the API response
    (sweetApi.createSweet as any).mockResolvedValue({ data: {} });

    render(
      <BrowserRouter>
        <AddSweetPage />
      </BrowserRouter>
    );

    // 1. Fill inputs (Updated selectors to match UI labels)
    fireEvent.change(screen.getByLabelText(/sweet name/i), {
      target: { value: "New Candy" },
    });

    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: "Hard" },
    });

    fireEvent.change(screen.getByLabelText(/price/i), {
      target: { value: "5" },
    });

    // FIX: Label is "Initial Stock", not "Quantity"
    fireEvent.change(screen.getByLabelText(/initial stock/i), {
      target: { value: "50" },
    });

    // 2. Click submit
    // FIX: Button text is "Save to Pantry", so we search for /save/i instead of /create/i
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    // 3. Assertions
    await waitFor(() => {
      // Use objectContaining because the form might send extra fields like 'image' (empty string)
      expect(sweetApi.createSweet).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "New Candy",
          category: "Hard",
          price: 5, // React Hook Form `valueAsNumber` converts this
          quantity: 50, // React Hook Form `valueAsNumber` converts this
        })
      );
    });
  });
});
