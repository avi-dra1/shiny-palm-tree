// Code for the Word Puzzle Game
import Constants from 'expo-constants';
import WordCard from './WordCard'; // Adjust the path as necessary
import FavoriteWordsModal from './FavoriteWordsModal';



import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert, Dimensions, ImageBackground } from 'react-native';
import axios, { all } from 'axios';
import LottieView from 'lottie-react-native';
//import * as Animatable from 'react-native-animatable';
import aiWinsAnimation from './aiwins.json';
import humanWinsAnimation from './humanwins.json';
import sendIcon from './assets/send.png';
import Icon from 'react-native-vector-icons/FontAwesome';

import { Modal } from 'react-native';

// Import icons for validation
const checkIcon = require('./assets/check.png');
const crossIcon = require('./assets/cross.png');



// Define your alphabet and image requires here
const images = {
  A: require('./assets/A.png'),
  B: require('./assets/B.png'),
  C: require('./assets/C.png'),
  D: require('./assets/D.png'),
  E: require('./assets/E.png'),
  F: require('./assets/F.png'),
  G: require('./assets/G.png'),
  H: require('./assets/H.png'),
  I: require('./assets/I.png'),
  J: require('./assets/J.png'),
  K: require('./assets/K.png'),
  L: require('./assets/L.png'),
  M: require('./assets/M.png'),
  N: require('./assets/N.png'),
  O: require('./assets/O.png'),
  P: require('./assets/P.png'),
  Q: require('./assets/Q.png'),
  R: require('./assets/R.png'),
  S: require('./assets/S.png'),
  T: require('./assets/T.png'),
  U: require('./assets/U.png'),
  V: require('./assets/V.png'),
  W: require('./assets/W.png'),
  X: require('./assets/X.png'),
  Y: require('./assets/Y.png'),
  Z: require('./assets/Z.png'),
};

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const App = () => {

  const [isFavoritesModalVisible, setFavoritesModalVisible] = useState(false);

  const toggleFavoritesModal = () => {
    setFavoritesModalVisible(!isFavoritesModalVisible);
  };



  const [savedWords, setSavedWords] = useState({});  // Tracks saved words

  const [serverWordResponse, setServerWordResponse] = useState([]);

  const apiUrl  = Constants.expoConfig?.extra?.apiUrl;

  const [winner, setWinner] = useState(''); // To track the winner of the game

  const [allWords, setAllWords] = useState([]); // To store all the words generated by the GPT
  //const animationRef = React.useRef(null);

  const [PlayerWords, setPlayerWords] = useState([]); // To store all the words generated by the Player

  useEffect(() => {
    //console.log("Expo Config:", Constants.expoConfig);
    console.log("API URL:", Constants.expoConfig?.extra?.apiUrl);
  }, []);

  const [currentWord, setCurrentWord] = useState('');
  const [letters, setLetters] = useState([]);
  const [isValid, setIsValid] = useState(null);

  //score
  const [score, setScore] = useState(0);

  //timer
  const [timeLeft, setTimeLeft] = useState(30);

  const [isPlayerTurn, setIsPlayerTurn] = useState(true); // To track whose turn it is
  const [showSubmit, setShowSubmit] = useState(true); // Control the display of the submit button
  const [gptScore, setGptScore] = useState(0);

  const [gameOver, setGameOver] = useState(false);
  const [verifiedGPTWords, setVerifiedGPTWords] = useState([]);
  const [verifiedGPTScores, setVerifiedGPTScores] = useState([]);

  const [scoreComparisonModalVisible, setScoreComparisonModalVisible] = useState(false);

  const [animationData, setAnimationData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  //const [winnerModalVisible, setWinnerModalVisible] = useState(false);
  const [turnAnnounceModalVisible, setTurnAnnounceModalVisible] = useState(false);

  useEffect(() => {
    
    //implement timer here
    const timer = timeLeft > 0 && setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    console.log("Updated All Words: ", allWords);
    fetchWords(allWords);
  }, [allWords.length > 0]);
  
  //implement turn based game logic
  useEffect(() => {
    if (timeLeft === 30) {
      generateRandomLetters();
    }else if (timeLeft === 10) {
        setIsPlayerTurn(false);
        setShowSubmit(false);
        console.log("Player Words", PlayerWords);
        sendLettersToGPT();
        setTurnAnnounceModalVisible(true);
      }else if((timeLeft < 10) && (timeLeft > 0)) {
        setIsPlayerTurn(false);
        setShowSubmit(false);
        setGptScore(allWords.length);
      }} , [timeLeft]);

  useEffect (() => {
    if (timeLeft === 0) {
      //fetchWords(allWords);
      setGameOver(true);
      console.log("GPT Score", gptScore);
      console.log("Verified GPT Words", verifiedGPTWords);
      console.log("Verified GPT Score", verifiedGPTScores);
      setWinner(gptScore > score ? 'GPT' : 'Player');
      setScoreComparisonModalVisible(true);
      setTimeout(resetGame, 5000);
    }} , [timeLeft]);



  const resetGame = () => {
    // Reset the game state
    setTimeLeft(30); // Reset timer
    setCurrentWord('');
    generateRandomLetters();
    setScore(0);
    setGptScore(0);
    setIsPlayerTurn(true);
    setShowSubmit(true);
    setServerWordResponse([]);
    setWinner('');
    setGameOver(false);
    setAllWords([]);
    setPlayerWords([]);
    setVerifiedGPTWords([]);
    setVerifiedGPTScores([]);
    setScoreComparisonModalVisible(false);
    setTurnAnnounceModalVisible(true);
  } ;

  const fetchWords = async (verifyWords) => {
    try{
      const response = await axios.post(`${apiUrl}/find-unique-words`,verifyWords);
      if (response.data && response.data.uniqueWords) {
        //console.log("Unique GPT Words", response.data.uniqueWords);
        //console.log("Unique GPT Words Count", response.data.totalWords);
        setVerifiedGPTWords(response.data.uniqueWords);
        setVerifiedGPTScores(response.data.totalWords);
      }
    }
    catch (error) {
      console.error('Error in:', error);
      Alert.alert("Error", error.message);
      setServerWordResponse("Error: " + error.message);
    }
  };

  // Generate random letters for the game
  const generateRandomLetters = () => {
    let randomLetters = [];
  const vowels = 'AEIOU'.split('');  // Define vowels
  const numVowels = 1 + Math.floor(Math.random() * 2);  // Ensure at least one vowel, maximum two

  // First, fill the required vowel slots
  for (let i = 0; i < numVowels; i++) {
    const randomVowelIndex = Math.floor(Math.random() * vowels.length);
    randomLetters.push(vowels[randomVowelIndex]);
  }

  // Fill the rest of the slots with random letters
  for (let i = numVowels; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    randomLetters.push(alphabet[randomIndex]);
  }

  // Shuffle the letters to mix vowels and consonants
  randomLetters = randomLetters.sort(() => Math.random() - 0.5);

  setLetters(randomLetters);
  };

  const sendLettersToGPT = async () => {
    try {
      const response = await axios.post(`${apiUrl}/generate-word`, { letters });
      if (response.data && response.data.word) {
        setServerWordResponse(response.data.word);
        //check number of words

        console.log("Server Response", response.data.word);

        const newWords = response.data.word;
        setAllWords(allWords => [...allWords, ...newWords]);
        }

      else {
        Alert.alert("Error", "No response from server");
      }
    } catch (error) {
      console.error('Error in:', error);
      Alert.alert("Error", error.message);
      setServerWordResponse("Error: " + error.message);
    }
  };

  const handlePressLetter = (letter) => {
    setCurrentWord(prev => prev + letter);
    //setIsValid(null); // Reset validation state on new input
  };

  const handleSubmitWord = async () => {
    if (currentWord.length > 1) {
    try {
      const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${currentWord.toLowerCase()}`);
      if (response.data && response.status === 200) {
        setIsValid(true);
        //Alert.alert("Correct", "This is a valid word!");
        setScore(score + 1);
        setPlayerWords([...PlayerWords, currentWord]);
      }
    } catch (error) {
      setIsValid(false);
      //Alert.alert("Incorrect", "This is not a valid word.");
    }
  } else {
    setIsValid(false);
    console.log("Word is too short");
  }
    setTimeout(() => setIsValid(null), 2000);
    setCurrentWord('');
  };

  const handleWordPress = (word) => {
    // Save the word to the list of saved words
    setSavedWords(prev => ({ ...prev, [word]: true }));
    //Alert.alert("Word Saved", "This word has been saved!");
    setAnimationData(require('./save-animation.json'));
    setModalVisible(true);
  };

  const CentralAnimation = ({ data }) => {
    if (!data) return null;
  
    return (
      <View style={styles.CentralAnimationContainer}>
        <LottieView
          source={data}
          autoPlay
          loop={false}
          onAnimationFinish={() => setAnimationData(null)}
          style={styles.lottieFullScreenAnimation}
        />
      </View>
    );
  };

  const ScoreComparisonModal = () => {
    useEffect(() => {
      const timeout = setTimeout(() => {
        setScoreComparisonModalVisible(false);
        //setWinnerModalVisible // This will trigger the winner announcement modal after 3 seconds.
      }, 3000);
  
      return () => clearTimeout(timeout);
    }, []); 

    return (
      <Modal
      animationType="slide"
      transparent={true}
      visible={scoreComparisonModalVisible}
      onRequestClose={() => setScoreComparisonModalVisible(false)}
    >
      <View style={styles.bottomView}>
        <View style={styles.modalView}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={styles.modalText}>Player Score: {score}</Text>
              {PlayerWords.map((word, index) => (
                <Text key={index} style={styles.wordCard}>{word}</Text>
              ))}
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={styles.modalText}>GPT Score: {gptScore}</Text>
              {verifiedGPTWords.map((word, index) => (
                <Text key={index} style={styles.wordCard}>{word}</Text>
              ))}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const LetterTile = ({ letter, onPress }) => {
  return (
    <TouchableOpacity style={styles.letterTile} onPress={() => onPress(letter)}>
      <Text style={styles.letterText}>{letter}</Text>
    </TouchableOpacity>
  );
};

const TurnAnnouncementModal = () => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      setTurnAnnounceModalVisible(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, []); 

  return (
    <Modal
    animationType="slide"
    transparent={true}
    visible={turnAnnounceModalVisible}
    onRequestClose={() => setTurnAnnounceModalVisible(false)}
  >
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Text style={styles.modalText}>{isPlayerTurn ? 'Your Turn!' : 'GPT Turn'}</Text>
      </View>
    </View>
  </Modal>
);
}

// Modify your render method to include this component in a grid
<View style={styles.lettersContainer}>
  {letters.map((letter, index) => (
    <LetterTile key={index} letter={letter} onPress={handlePressLetter} />
  ))}
</View>


  return (
    <ImageBackground
      source={require('./assets/game-bg.jpg')}  // Ensure you have a thematic background image
      style={styles.container}
      resizeMode="cover"
    >
    <Text style={styles.timer}>{timeLeft}seconds</Text>
    <TurnAnnouncementModal />
    <View style={styles.gamePlayArea}>
      <Text style={styles.score}>Your Score: {score}</Text>
      <View style={styles.lettersContainer}>
        {letters.map((letter, index) => (
          <LetterTile key={index} letter={letter} onPress={handlePressLetter} />
        ))}
      {isPlayerTurn && showSubmit && (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmitWord}>
         <Icon name="send" size={72} color="#FFFFFF" style={styles.sendIcon} />
        </TouchableOpacity>
      )}
      </View>
      {!gameOver && (
      <View style={styles.gamePlayArea}>
      {PlayerWords.map((word, index) => (
        <WordCard
          key={index}
          word={word}
          onFavoritePress={() => console.log('Favorite pressed')}
          isFavorite={false}
          iconType={0}
        />
      ))}
      </View>
      )}
      <ScoreComparisonModal/>
      {!isPlayerTurn && (
        <Text style={styles.score}>GPT Score: {gptScore}</Text>
      )}
      {isPlayerTurn && isValid != null && (
        <Icon
        name={isValid ? "check" : "times"}
        size={60}  // Adjust size as needed
        color={isValid ? "green" : "red"}  // Adjust color as needed
        style={styles.validationIcon}
      />
      )}
      <View style={styles.wordCardContainer}>
        {serverWordResponse.map((word, index) => (
          <WordCard
          key={index}
          word={word}
          onFavoritePress={() => console.log('Favorite pressed')}
          isFavorite={false}
          iconType={1}
        />
        ))}
      </View>
      
    {gameOver && !isPlayerTurn && (
      <Text style={styles.result}>
      {winner} wins! {winner === 'GPT' ? 'Better luck next time!' : 'Congratulations!'} 
    </Text>
    )}
    {gameOver && !isPlayerTurn && (
    <View style={styles.fullScreen}>    
    <View style={styles.centeredView}>
     <View style={styles.modalView}>
      <LottieView
      source={winner === 'GPT' ? aiWinsAnimation : humanWinsAnimation}
      autoPlay
      loop={false}
      onAnimationFinish={() => {
        setAnimationData(null);
        setModalVisible(false); // Hide the modal when the animation is done
      }}
      style={styles.lottieFullScreenAnimation}
    />
    </View>
    </View>
    </View>
    )}
     <View style={styles.wordCardContainer}>
      <TouchableOpacity style={styles.saveIcon} onPress={toggleFavoritesModal}>
        <Icon name="star" size={60} color="#ffd700" />
      </TouchableOpacity>
      <FavoriteWordsModal
        isVisible={isFavoritesModalVisible}
        onClose={toggleFavoritesModal}
      />
    </View>
    </View>

    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  lettersContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    width: 75,
    height: 75,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterTile: {
    width: '25%',  // Adjust size based on your layout preference
    aspectRatio: 1,  // Keeps tile square
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    backgroundColor: '#f0f0f0',  // Tile background color
    borderRadius: 10,
  },
  letterText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  letterButton: {
    padding: 10,
    margin: 5,
  },
  letterImage: {
    width: 50,
    height: 50,
  },
  currentWord: {
    fontSize: 30,
    margin: 10,
  },
  submitButton: {
    backgroundColor: '#aff0fe',
    padding: 10,
    borderRadius: 5,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 20,
  },
  validationIcon: {
    width: 50,
    height: 50,
    marginBottom: 20,
  },
  timer: {
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
    margin: 10,
  },
  score: {
    fontSize:36,
    color: '#ffffde',
    margin: 20,
  },
  wordCardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  wordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    margin: 5,
    backgroundColor: '#FFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  wordText: {
    fontSize: 16,
    color: '#333',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  bottomView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 0,
  },
  lottieAnimation: {
    position: 'absolute',
    width: 100,
    height: 100,
    backgroundColor: 'transparent',
  },
  CentralAnimationContainer: {
    position: 'absolute',
    top: '80%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10, // Make sure it's above other content
  },
  lottieFullScreenAnimation: {
    width: 200,
    height: 200,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  result: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    padding: 20,
    textAlign: 'center',
  },
  fullScreen: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    padding: 5,
  },
  wordsDisplay: {
    flexDirection: 'row',  // Horizontal layout for words
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  gamePlayArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveIcon: {
    position: 'absolute',
    top: -850,
    right: -200,
  }
});

export default App;