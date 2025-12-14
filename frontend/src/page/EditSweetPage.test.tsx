import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import EditSweetPage from "./EditSweetPage";
import * as sweetApi from "../api/sweets";

vi.mock("../api/sweets", () => ({
  getSweetById: vi.fn(),
  updateSweet: vi.fn(),
}));

describe("EditSweetPage", () => {
  it("pre-fills form and submits update", async () => {
    // Mock Fetch Response
    (sweetApi.getSweetById as any).mockResolvedValue({
      data: { name: "Old Name", category: "Old Cat", price: 5, quantity: 10 },
    });
    (sweetApi.updateSweet as any).mockResolvedValue({});

    // We use MemoryRouter to simulate being on /edit/123
    render(
      <MemoryRouter initialEntries={["/admin/edit/123"]}>
        <Routes>
          <Route path="/admin/edit/:id" element={<EditSweetPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Check Pre-fill
    await waitFor(() =>
      expect(screen.getByDisplayValue("Old Name")).toBeInTheDocument()
    );

    // Change Name
    const nameInput = screen.getByDisplayValue("Old Name");
    fireEvent.change(nameInput, { target: { value: "New Name" } });

    // Submit
    const saveBtn = screen.getByText(/save changes/i);
    fireEvent.click(saveBtn);

    // Verify Update Call
    await waitFor(() => {
      expect(sweetApi.updateSweet).toHaveBeenCalledWith(
        "123",
        expect.objectContaining({
          name: "New Name",
        })
      );
    });
  });
});
