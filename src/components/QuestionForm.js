// src/components/QuestionForm.js
import React, { useState } from "react";

function QuestionForm({ onAddQuestion }) {
  const [formData, setFormData] = useState({
    prompt: "",
    answers: ["", "", "", ""],
    correctIndex: 0,
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleAnswerChange(index, value) {
    const newAnswers = [...formData.answers];
    newAnswers[index] = value;
    setFormData({ ...formData, answers: newAnswers });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const newQuestion = {
      prompt: formData.prompt,
      answers: formData.answers,
      correctIndex: parseInt(formData.correctIndex),
    };

    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newQuestion),
    })
      .then((r) => r.json())
      .then((newQ) => onAddQuestion(newQ));
  }

  return (
    <section>
      <h1>New Question</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Prompt:
          <input name="prompt" value={formData.prompt} onChange={handleChange} />
        </label>
        {formData.answers.map((ans, i) => (
          <label key={i}>
            Answer {i + 1}:
            <input
              value={ans}
              onChange={(e) => handleAnswerChange(i, e.target.value)}
            />
          </label>
        ))}
        <label>
          Correct Answer:
          <select
            name="correctIndex"
            value={formData.correctIndex}
            onChange={handleChange}
          >
            {formData.answers.map((_, i) => (
              <option key={i} value={i}>
                {`Choice ${i + 1}`}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Submit Question</button>
      </form>
    </section>
  );
}

export default QuestionForm;
