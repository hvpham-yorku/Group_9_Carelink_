/*
    run npm install --save-dev @testing-library/react @testing-library/jest-dom jest
    then run npm i --save-dev @types/jest
*/
import '@testing-library/jest-dom';

import { render, screen } from "@testing-library/react";
import LoginText from "../components/login/LoginText";

/*
    Tests whether the LoginText component exists and renders correctly.
    Checks whether the text appears correctly.
*/
describe("LoginText", () => {
  it("renders the correct heading text", () => {
    render(<LoginText />);

    const heading = screen.getByRole("heading", {
      name: /login to carelink!/i,
    });

    expect(heading).toBeInTheDocument();
  });
});

