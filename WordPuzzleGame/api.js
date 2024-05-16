import axios from 'axios';
import { Alert } from 'react-native';

const sendLettersToGPT = async (apiUrl, letters, setServerWordResponse, setAllWords) => {
    try {
        const response = await axios.post(`${apiUrl}/generate-word`, { letters });
        if (response.data && response.data.word) {
            setServerWordResponse(response.data.word);
            console.log("Server Response", response.data.word);
            const newWords = response.data.word;
            setAllWords(allWords => [...allWords, ...newWords]);
        } else {
            Alert.alert("Error", "No response from server");
        }
    } catch (error) {
        console.error('Error in:', error);
        Alert.alert("Error", error.message);
        setServerWordResponse("Error: " + error.message);
    }
};

export default sendLettersToGPT;
