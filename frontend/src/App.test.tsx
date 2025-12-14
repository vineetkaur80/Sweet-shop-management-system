import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext"; // Ensure this path is correct
import { describe, it } from "vitest";

describe("App Routing", () => {
  it("renders without crashing", () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </AuthProvider>
    );
    // Since we don't have pages yet, we just check if it runs.
    // If your App.tsx has a "Login" text placeholder, check for that:
    // expect(screen.getByText(/login/i)).toBeInTheDocument();
  });
});
