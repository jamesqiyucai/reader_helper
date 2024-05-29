"use client";

import { SetStateAction, useState } from "react";
import Sentence from "./components/sentence";

interface Explanation {
  word: string;
  explanation: string;
}

interface Sentence {
  sentence: string;
  explanation: Explanation[]; // Array of explanation objects
}

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [submitEnabled, setSubmitEnabled] = useState(true)

  const handleInputChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setInputValue(e.target.value)
  }

  const handleSubmit = async () => {
    console.log(inputValue)
    setSubmitEnabled(false)
    try {
      const response = await fetch('/api/paragraph_explainer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputValue }),
      });
      const data = await response.json();
      setSentences(data); // Assuming the response has a 'sentences' key
    } catch (error) {
      console.error('Failed to fetch sentences:', error);
    }
    setSubmitEnabled(true)
  }

  // const sentences = [
  //   {
  //     sentence: "a b c",
  //     explanation: [
  //       {
  //         word: "a",
  //         explanation: "aaa"
  //       },
  //       {
  //         word: "b",
  //         explanation: "bbb"
  //       },
  //       {
  //         word: "c",
  //         explanation: "ccc"
  //       }
  //     ]
  //   },
  //   {
  //     sentence: "d e f",
  //     explanation: [
  //       {
  //         word: "d",
  //         explanation: "ddd"
  //       },
  //       {
  //         word: "e",
  //         explanation: "eee"
  //       },
  //       {
  //         word: "f",
  //         explanation: "fff"
  //       }
  //     ]
  //   }
  // ]

  const sentenceComponents = sentences.map(sentence => sentence.explanation).map((sentence, index) => {
    return <Sentence key={index} words={sentence}></Sentence>
  })

  return (
    <div>
      <h1>Welcome to use text explainer.</h1>
      <h1>This tool can be used to explain French or English texts.</h1>
      <textarea
        value={inputValue}
        onChange={handleInputChange}
        style={{width: "1000px", height: "100px"}}
      />
      <button onClick={handleSubmit} disabled={!submitEnabled}>Submit</button>
      <div>
        {sentenceComponents}
      </div>
    </div>
  );
}
