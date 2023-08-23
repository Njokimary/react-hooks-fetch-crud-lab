import React, { useEffect, useState } from "react";
import QuestionItem from "./QuestionItem";

function QuestionList() {
  const [questions,setQuestions] = useState([]);
  const [newQuestion,setNewQuestion] = useState({
    prompt : "",
    answers: ["", "", "", ""],
    correctIndex: 0,
  });

  const handleDeleteQuestion = (questionId) => {
    const updatedQuestions = questions.filter((question) => question.id !== questionId);
    setQuestions(updatedQuestions);

    fetch(`http://localhost:4000/questions/${questionId}`, {
      method: "DELETE",
    })
      .catch((err) => console.error("Error deleting question:", err));
  };

  const questionItem = questions.map((question) => (
    <QuestionItem key={question.id} question={question} onDelete={handleDeleteQuestion} />
  ));



  const handleNewQuestionChange = (event) => {
    const { name, value } = event.target;
    if (name === "answers") {
      const updatedAnswers = [...newQuestion.answers];
      const index = parseInt(event.target.dataset.index, 10);
      updatedAnswers[index] = value;
      setNewQuestion((prevQuestion) => ({
        ...prevQuestion,
        answers: updatedAnswers,
      }));
    } else {
      setNewQuestion((prevQuestion) => ({
        ...prevQuestion,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch("http://localhost:4000/questions",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body:JSON.stringify(newQuestion),
    })
    .then((response) => response.json())
    .then((data) => {
      setQuestions([...questions,data]);
      setNewQuestion({
        prompt: "",
        answers: ["", "", "", ""],
        correctIndex: 0,
      })
    })
    .catch((err) => console.error("Error adding question:", err));
  }

  useEffect(() =>{
    fetch("http://localhost:4000/questions")
    .then(response => response.json())
    .then(data => setQuestions(data))
    .catch(err =>console.error("Error fetching questions:", err));
  },[]);

  const questionItems = questions.map(question => (
    <QuestionItem key={question.id} question={question} />
  ));

  return (
    <section>
    <h1>Quiz Questions</h1>
    <form onSubmit={handleSubmit}>
      <label>
        Prompt:
        <input
          type="text"
          name="prompt"
          value={newQuestion.prompt}
          onChange={handleNewQuestionChange}
        />
      </label>
      {newQuestion.answers.map((answer, index) => (
        <div key={index}>
          <label>
            Answer {index}:
            <input
              type="text"
              name="answers"
              value={answer}
              data-index={index}
              onChange={handleNewQuestionChange}
            />
          </label>
        </div>
      ))}
      <label>
        Correct Answer Index:
        <select
          name="correctIndex"
          value={newQuestion.correctIndex}
          onChange={handleNewQuestionChange}
        >
          {newQuestion.answers.map((_, index) => (
            <option key={index} value={index}>
              {index}
            </option>
          ))}
        </select>
      </label>
      <button>Add Question</button>
    </form>
    <ul>{questionItems}</ul>
  </section>
  );
}

export default QuestionList;
