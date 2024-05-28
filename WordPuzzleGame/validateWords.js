// validateWords.js

import axios from 'axios';

export const validateAllPlayerWords = async (PlayerWords, setScore, setPlayerWordsChecked) => {
    const results = await Promise.all(
        PlayerWords.map(async (word) => {
            try {
                const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
                if (response.data && response.data.length > 0) {
                    return { word, isValid: true };
                }
                return { word, isValid: false }; // No entries means the word is not valid
            } catch (error) {
                return { word, isValid: false };
            }
        })
    );

    // Process the validation results here, e.g., update scores, show alerts, etc.
    let newScore = 0;
    results.forEach(result => {
        if (result.isValid) {
            newScore += 1; // Increment score if the word is valid
        } else {
            console.log(`${result.word} is not a valid word.`);
        }
    });
    setScore(prevScore => prevScore + newScore);
    setPlayerWordsChecked(true);
};
