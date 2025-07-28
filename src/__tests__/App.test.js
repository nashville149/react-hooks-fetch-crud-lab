import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../App.js";

// Mock fetch globally
beforeEach(() => {
  jest.spyOn(global, "fetch").mockImplementation((url, options) => {
    if (url.endsWith("/questions") && !options) {
      // GET /questions
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: 1,
              prompt: "Test Question 1",
              answers: ["A", "B", "C", "D"],
              correctIndex: 0,
            },
          ]),
      });
    }

    if (url.endsWith("/questions") && options?.method === "POST") {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 2,
            prompt: "Test Prompt",
            answers: ["A", "B", "C", "D"],
            correctIndex: 1,
          }),
      });
    }

    if (url.includes("/questions/") && options?.method === "PATCH") {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 1,
            prompt: "Test Question 1",
            answers: ["A", "B", "C", "D"],
            correctIndex: 2,
          }),
      });
    }

    if (url.includes("/questions/") && options?.method === "DELETE") {
      return Promise.resolve({ ok: true });
    }

    return Promise.reject(new Error("Unhandled fetch"));
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("displays question prompts after fetching", async () => {
  render(<App />);
  fireEvent.click(screen.getByText("View Questions"));
  expect(await screen.findByText(/Test Question 1/i)).toBeInTheDocument();
});

test("creates a new question when the form is submitted", async () => {
  render(<App />);
  fireEvent.click(screen.getByText("New Question"));

  fireEvent.change(screen.getByLabelText(/Prompt:/i), {
    target: { value: "Test Prompt" },
  });

  fireEvent.change(screen.getByLabelText(/Answer 1:/i), {
    target: { value: "A" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 2:/i), {
    target: { value: "B" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 3:/i), {
    target: { value: "C" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 4:/i), {
    target: { value: "D" },
  });
  fireEvent.change(screen.getByLabelText(/Correct Answer:/i), {
    target: { value: "1" },
  });

  fireEvent.click(screen.getByText("Submit Question"));

  fireEvent.click(screen.getByText("View Questions"));
  expect(await screen.findByText(/Test Prompt/i)).toBeInTheDocument();
});

test("deletes the question when the delete button is clicked", async () => {
  render(<App />);
  fireEvent.click(screen.getByText("View Questions"));

  const question = await screen.findByText(/Test Question 1/i);
  const deleteButton = screen.getByText("Delete Question");
  fireEvent.click(deleteButton);

  await waitFor(() =>
    expect(screen.queryByText(/Test Question 1/i)).not.toBeInTheDocument()
  );
});

test("updates the answer when the dropdown is changed", async () => {
  render(<App />);
  fireEvent.click(screen.getByText("View Questions"));

  const select = await screen.findByDisplayValue("A");
  fireEvent.change(select, { target: { value: "2" } });

  await waitFor(() =>
    expect(screen.getByDisplayValue("C")).toBeInTheDocument()
  );
});
