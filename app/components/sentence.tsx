import React from 'react';
import Word, { WordProps } from './word';

interface SentenceProps {
    words: WordProps[]
}

const Sentence: React.FC<SentenceProps> = ({ words }) => {

    const wordComponents = words.map((word, index) => {
        return <Word key={index} word={word.word} explanation={word.explanation || ''} />;
    });

    return (
        <div style={{ margin: '10px 0' }}>
            {wordComponents}
        </div>
    );
};

export default Sentence;
