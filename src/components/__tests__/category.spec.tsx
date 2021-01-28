import { render } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Category } from "../category";

describe("<Category />", () => {
  it("renders OK with props", () => {
    const categoryProps = {
      id: "1",
      coverImg: "img",
      name: "nameTest",
      slug: "slugTest",
    };
    const { getByText, container } = render(
      <Router>
        <Category {...categoryProps} />
      </Router>
    );
    getByText(categoryProps.name);
    expect(container.firstChild).toHaveAttribute(
      "href",
      `/category/${categoryProps.slug}`
    );
  });
});
