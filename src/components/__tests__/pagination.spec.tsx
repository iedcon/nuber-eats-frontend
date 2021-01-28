import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Pagination } from "../pagination";

describe("<Pagination />", () => {
  const setPage = jest.fn();
  it("render empty div with no totalPages", () => {
    const paginationProps = {
      page: 1,
      setPage,
    };
    render(
      <Router>
        <Pagination {...paginationProps} />
      </Router>
    );
  });
  it("renders OK with left right button", async () => {
    const paginationProps = {
      page: 2,
      setPage,
      totalPages: 3,
    };
    const { getByText, getAllByRole } = render(
      <Router>
        <Pagination {...paginationProps} />
      </Router>
    );
    const buttons = getAllByRole("button");
    getByText(`Page ${paginationProps.page} of ${paginationProps.totalPages}`);
    getByText("←");
    getByText("→");
    await waitFor(() => {
      userEvent.click(buttons[0]);
    });
    await waitFor(() => {
      userEvent.click(buttons[1]);
    });
    expect(setPage).toHaveBeenCalledTimes(2);
  });
  it("renders OK without left button", async () => {
    const paginationProps = {
      page: 1,
      setPage,
      totalPages: 3,
    };
    const { getByText, queryByText, getByRole } = render(
      <Router>
        <Pagination {...paginationProps} />
      </Router>
    );
    const rightBtn = getByRole("button");
    getByText(`Page ${paginationProps.page} of ${paginationProps.totalPages}`);
    getByText("→");
    expect(queryByText("←")).toBeNull();
    await waitFor(() => {
      userEvent.click(rightBtn);
    });
    expect(setPage).toHaveBeenCalledTimes(1);
  });
  it("renders OK without right button", async () => {
    const paginationProps = {
      page: 3,
      setPage,
      totalPages: 3,
    };
    const { getByText, queryByText, getByRole } = render(
      <Router>
        <Pagination {...paginationProps} />
      </Router>
    );
    const leftBtn = getByRole("button");
    getByText(`Page ${paginationProps.page} of ${paginationProps.totalPages}`);
    getByText("←");
    expect(queryByText("→")).toBeNull();
    await waitFor(() => {
      userEvent.click(leftBtn);
    });
    expect(setPage).toHaveBeenCalledTimes(1);
  });
  it("renders OK without button", () => {
    const paginationProps = {
      page: 1,
      setPage,
      totalPages: 1,
    };
    const { queryByText, getByText } = render(
      <Router>
        <Pagination {...paginationProps} />
      </Router>
    );
    getByText(`Page ${paginationProps.page} of ${paginationProps.totalPages}`);
    expect(queryByText("←")).toBeNull();
    expect(queryByText("→")).toBeNull();
  });
});
