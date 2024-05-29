"use client";

import React, { useState } from 'react';

export interface WordProps {
    word: string;
    explanation: string
}

const Word: React.FC<WordProps> = ({ word, explanation }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <span 
            onMouseEnter={() => setShowTooltip(true)} 
            onMouseLeave={() => setShowTooltip(false)}
            style={{ cursor: 'help', position: 'relative', marginRight: '5px' }}
        >
            {word}
            {showTooltip && (
                <span style={{
                    visibility: showTooltip ? 'visible' : 'hidden',
                    position: 'absolute',
                    left: '50%',
                    bottom: '100%',
                    backgroundColor: 'white',
                    border: '1px solid black',
                    padding: '5px',
                    zIndex: 100,
                    width: 'max-content',
                    maxWidth: '200px'
                }}>
                    {explanation}
                </span>
            )}
        </span>
    );
};

export default Word;
