/*
    run npm install --save-dev @testing-library/react @testing-library/jest-dom jest
    then run npm i --save-dev @types/jest
*/
import '@testing-library/jest-dom';

import { render, screen } from "@testing-library/react";
import LoginText from "../components/login/LoginText";
import LoginTextBox from "../components/login/LoginTextBox";


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

/*

    This tests the LoginTextBox component. It tests whether the component renders, the props were passed correctly,
    and that the attributes were applied correctly.
    
*/

describe("LoginTextBox", () => {
  it("renders an input with correct attributes", () => {
    render(
      <LoginTextBox
        name="username"
        id="username"
        placeholder="Enter username"
      />
    );

    const input = screen.getByPlaceholderText(/enter username/i);

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("name", "username");
    expect(input).toHaveAttribute("id", "username");
    expect(input).toHaveAttribute("type", "text");
  });
});

