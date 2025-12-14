import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import * as sweetApi from "../api/sweets";

// Mock the API
vi.mock("../api/sweets", () => ({
  getAdminStats: vi.fn(),
  getSweets: vi.fn(), // Mock getSweets as well to prevent errors if tabs switch
  deleteSweet: vi.fn(),
}));

describe("AdminDashboard", () => {
  it("renders analytics stats correctly", async () => {
    // 1. Mock the API response
    (sweetApi.getAdminStats as any).mockResolvedValue({
      data: {
        totalRevenue: 5000,
        totalOrders: 20,
        totalProducts: 10,
        totalCustomers: 5,
        avgOrderValue: 250,
        todayOrders: 2,
        lowStockItems: [],
        recentOrders: [],
      },
    });

    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    // 2. Check for the NEW Loading Text
    // Your component now renders: "Opening the books..."
    expect(screen.getByText(/Opening the books.../i)).toBeInTheDocument();

    // 3. Wait for Data to appear
    await waitFor(() => {
      // Total Revenue ($5000.00)
      expect(screen.getByText("$5000.00")).toBeInTheDocument();

      // Total Orders (20)
      expect(screen.getByText("20")).toBeInTheDocument();

      // Total Products (10)
      expect(screen.getByText("10")).toBeInTheDocument();

      // Total Customers (5)
      expect(screen.getByText("5")).toBeInTheDocument();
    });
  });
});
