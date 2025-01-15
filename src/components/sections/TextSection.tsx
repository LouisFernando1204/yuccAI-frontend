import React, { useState } from "react";

interface TextSectionProps {
  askByText: (question: string) => void;
  isDisabled: boolean;
}

export const TextSection: React.FC<TextSectionProps> = ({
  askByText,
  isDisabled,
}) => {
  const [question, setQuestion] = useState("");

  return (
    <div className="flex justify-center items-center py-2 rounded-full bg-cream">
      <div className="rounded-full w-full">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          type="text"
          placeholder="Type your message..."
          className="outline-none text-darkOrange rounded-full items-center flex px-4 text-xs md:text-lg bg-cream placeholder-darkOrange"
        />
      </div>
      <div className="mr-2 shadow-md flex items-center justify-center rounded-full bg-lightOrange">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="size-6 md:size-20 p-1 text-darkOrange"
          fill="currentColor"
          onClick={() => {
            if (!isDisabled) {
              askByText(question)
            }
            setQuestion("")
          }}
        >
          <path
            fillRule="evenodd"
            d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
            clipRule="evenodd"
          />
        </svg>
      </div>{" "}
    </div>
  );
};
