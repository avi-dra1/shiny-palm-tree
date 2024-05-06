// WordCard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { saveFavoriteWord, removeFavoriteWord } from './storage';

const WordCard = ({ word, onFavoritePress, isFavorite, iconType }) => {
  const iconName = iconType === 1 ? "android" : isFavorite ? "star" : "star-o";
  const iconColor = isFavorite || iconType === 1 ? "gold" : "green";

  const handlePress = async () => {
    const newFavorite = !isFavorite;
    const success = newFavorite
      ? await saveFavoriteWord(word)
      : await removeFavoriteWord(word);

    if (success) {
      onFavoritePress(newFavorite);
      console.log(`Word ${word} ${newFavorite ? 'added to' : 'removed from'} favorites`);
    }
  };

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.wordTextStyle}>{word}</Text>
      <TouchableOpacity onPress={handlePress} style={styles.cardContainer}>
        <Icon
          name={iconName}
          size={24}
          color={iconColor}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
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
  wordTextStyle: {
    fontSize: 18,
    color: '#333',
  }
});

export default WordCard;
