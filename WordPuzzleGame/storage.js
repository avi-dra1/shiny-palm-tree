// storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// Save a word as favorite
export const saveFavoriteWord = async (word) => {
  try {
    await AsyncStorage.setItem(`favorite-${word}`, word);
    return true;  // Return true on success
  } catch (error) {
    console.error('Failed to save word:', error);
    return false;  // Return false on failure
  }
};

// Remove a word from favorites
export const removeFavoriteWord = async (word) => {
  try {
    await AsyncStorage.removeItem(`favorite-${word}`);
    return true;
  } catch (error) {
    console.error('Failed to remove word:', error);
    return false;
  }
};

// Get all favorite words
export const getAllFavoriteWords = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const result = await AsyncStorage.multiGet(keys.filter(key => key.startsWith('favorite-')));
    return result.map(item => item[1]);  // Return array of words
  } catch (error) {
    console.error('Failed to fetch words:', error);
    return [];
  }
};
