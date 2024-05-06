import React, { useState, useEffect } from 'react';
import { Modal, View, Text, FlatList, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { getAllFavoriteWords } from './storage';  // Assuming the storage utility functions are correctly set up

const FavoriteWordsModal = ({ isVisible, onClose }) => {
  const [favoriteWords, setFavoriteWords] = useState([]);

  useEffect(() => {
    if (isVisible) {
      fetchFavoriteWords();
    }
  }, [isVisible]);

  const fetchFavoriteWords = async () => {
    const words = await getAllFavoriteWords();
    setFavoriteWords(words);
  };

  return (
    <Modal
    animationType="slide"
    transparent={true}
    visible={isVisible}
    onRequestClose={onClose}
  >
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback>
          <View style={styles.modalView}>
            <FlatList
              data={favoriteWords}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.listItemContainer}>
                  <Text style={styles.modalText}>{item}</Text>
                </View>
              )}
              contentContainerStyle={styles.flatListContentContainer}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
  );
};

const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
      width: 300,
      height: 300,
      backgroundColor: 'white',
      borderRadius: 20,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    flatListContentContainer: {
      flexGrow: 1,  // Allows the content to expand to fit content appropriately
      justifyContent: 'flex-start'  // Aligns content at the start
    },
    modalText: {
      fontSize: 16,
      marginVertical: 10,  // Ensures each item is spaced adequately
    },
    listItemContainer: {
      alignItems: 'center',  // Centers content within each list item
      width: '100%'  // Ensures each item takes full width of the container
    }
  });
  
  export default FavoriteWordsModal;