// wordHandlers.js
import { throttle } from 'lodash';

export const handlePressLetter = (currentWordRef, setCurrentWord) => throttle((letter) => {
    const updatedWord = currentWordRef.current + letter;  // Update the ref synchronously
    currentWordRef.current = updatedWord;
    setCurrentWord(updatedWord);
}, 100);

export const handleSubmitWord = (currentWord, setCurrentWord, currentWordRef, setPlayerWords) => () => {
    if (currentWord.length > 1) {
        console.log("Submitted Word:", currentWord);
        // Handle the submitted word, e.g., adding to a list
        setPlayerWords(prevWords => [...prevWords, currentWord.toLowerCase()]);
        setCurrentWord('');  // Reset current word state
        currentWordRef.current = ''; // Reset the ref
    } else {
        console.log("Word is too short");
    }
};
