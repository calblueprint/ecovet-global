import { useState } from "react";

export function NewRole() {
  return (
    <fieldset>
      <legend>New Role</legend>
      <label>
        Role Title:
        <input type="text" name="role_title" placeholder="da role" />
      </label>
      <label>
        Role Description:
        <input type="text" name="role_description" placeholder="da descript" />
      </label>
    </fieldset>
  );
}

function Question({ index }: { index: number }) {
  return (
    <label>
      question {index}:
      <input type="text" name="phase_question" placeholder="what's 9 + 10?" />
    </label>
  );
}

function PhaseRole({ role }: { role: string }) {
  const [questions, setQuestions] = useState([
    <Question index={0 + 1} key={0} />,
  ]);

  const newQuestion = () => {
    setQuestions([
      ...questions,
      <Question index={questions.length + 1} key={questions.length} />,
    ]);
  };
  return (
    <>
      <fieldset>
        <legend>{role} questions</legend>
        {questions.map(question => question)}
        <button onClick={newQuestion}>+</button>
      </fieldset>
    </>
  );
}

export function NewPhase({ roles }: { roles: string[] }) {
  return (
    <fieldset>
      <legend>New Phase</legend>
      <label>
        Phase Title:
        <input type="text" name="phase_title" placeholder="da phase" />
      </label>
      <label>
        Phase Description:
        <input type="text" name="phase_description" placeholder="da descript" />
      </label>
      {roles.map(role => (
        <PhaseRole role={role} key={role} />
      ))}
    </fieldset>
  );
}
