import React, { useEffect, useState } from "react";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

function App() {
  const [questions, setQuestions] = useState([]);
  const [view, setView] = useState("form");

  // GET /questions
  useEffect(() => {
    fetch("http://localhost:4000/questions")
      .then((res) => res.json())
      .then(setQuestions)
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  // POST
  function handleAddQuestion(newQuestion) {
    setQuestions([...questions, newQuestion]);
  }

  // DELETE
  function handleDeleteQuestion(deletedId) {
    setQuestions(questions.filter((q) => q.id !== deletedId));
  }

  // PATCH
  function handleUpdateQuestion(updatedQuestion) {
    const updatedList = questions.map((q) =>
      q.id === updatedQuestion.id ? updatedQuestion : q
    );
    setQuestions(updatedList);
  }

  return (
    <main>
      <nav>
        <button onClick={() => setView("form")}>New Question</button>
        <button onClick={() => setView("list")}>View Questions</button>
      </nav>
      {view === "form" ? (
        <QuestionForm onAddQuestion={handleAddQuestion} />
      ) : (
        <QuestionList
          questions={questions}
          onDeleteQuestion={handleDeleteQuestion}
          onUpdateQuestion={handleUpdateQuestion}
        />
      )}
    </main>
  );
}

export default App;
