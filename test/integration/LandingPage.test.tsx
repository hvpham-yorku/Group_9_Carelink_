/*
    run npm install --save-dev @testing-library/react @testing-library/jest-dom jest
    then run npm i --save-dev @types/jest
*/

import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import LandingPage from "../../src/pages/LandingPage";

/* Test LandingPage.tsx */

describe("LandingPage Integration", () => {
  it("contains the smooth scroll behavior in the document structure", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );

    // Check if the IDs targeted by the Navbar all exist on one page
    const ids = ["about", "features", "benefits", "who-its-for"];
    ids.forEach((id) => {
      const element = document.getElementById(id);
      expect(element).not.toBeNull();
    });
  });
});
