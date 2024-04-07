import { render, screen } from "@testing-library/react";
import "jest-canvas-mock";
import Dashboard from "./Dashboard";
import { MemoryRouter } from "react-router-dom";

jest.mock("react-chartjs-2", () => {
  const chart = {
    Line: () => null,
    Bar: () => null,
    PolarArea: () => null,
  };
  return chart;
});

test("<dashboard />", () => {
  render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>,
  );
  const linkElement = screen.getByTestId("refresh-time-div");
  expect(linkElement).toBeInTheDocument();
});
