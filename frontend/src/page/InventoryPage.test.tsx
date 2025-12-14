import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import InventoryPage from "./InventroyPage";
import * as sweetApi from "../api/sweets";

vi.mock("../api/sweets", () => ({
  getSweets: vi.fn(),
  deleteSweet: vi.fn(),
}));

describe("InventoryPage", () => {
  const mockSweets = [
    { _id: "1", name: "Alpha Candy", category: "Hard", price: 10, quantity: 5 },
    { _id: "2", name: "Beta Choco", category: "Soft", price: 20, quantity: 0 },
  ];

  beforeEach(() => {
    (sweetApi.getSweets as any).mockResolvedValue({ data: mockSweets });
  });

  it("renders inventory table and filters by search", async () => {
    render(
      <BrowserRouter>
        <InventoryPage />
      </BrowserRouter>
    );

    // Wait for items
    await waitFor(() => screen.getByText("Alpha Candy"));
    expect(screen.getByText("Beta Choco")).toBeInTheDocument();

    // Test Search Filter
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: "Alpha" } });

    // Beta should disappear, Alpha should stay
    await waitFor(() => {
      expect(screen.getByText("Alpha Candy")).toBeInTheDocument();
      expect(screen.queryByText("Beta Choco")).not.toBeInTheDocument();
    });
  });
});
