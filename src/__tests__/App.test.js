// src/__tests__/App.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../components/App";

test("displays question prompts after fetching", async () => {
  render(<App />);
  fireEvent.click(screen.getByText(/View Questions/i));

  expect(await screen.findByText(/lorem testum 1/i)).toBeInTheDocument();
  expect(await screen.findByText(/lorem testum 2/i)).toBeInTheDocument();
});

test("creates a new question when the form is submitted", async () => {
  render(<App />);

  fireEvent.click(screen.getByText(/New Question/i));

  fireEvent.change(screen.getByLabelText(/Prompt:/i), {
    target: { value: "Test Prompt" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 1:/i), {
    target: { value: "Test A" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 2:/i), {
    target: { value: "Test B" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 3:/i), {
    target: { value: "Test C" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 4:/i), {
    target: { value: "Test D" },
  });
  fireEvent.change(screen.getByLabelText(/Correct Answer:/i), {
    target: { value: "2" },
  });

  fireEvent.click(screen.getByText(/Submit Question/i));
  fireEvent.click(screen.getByText(/View Questions/i));

  expect(await screen.findByText(/Test Prompt/i)).toBeInTheDocument();
});

test("deletes the question when the delete button is clicked", async () => {
  render(<App />);
  fireEvent.click(screen.getByText(/View Questions/i));

  const questionText = await
