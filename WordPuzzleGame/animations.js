// animations.js
import React, { useEffect } from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

export const CentralAnimation = ({ data, setAnimationData }) => {
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

export const ScoreComparisonModal = ({ scoreComparisonModalVisible, setScoreComparisonModalVisible, score, PlayerWords, gptScore, verifiedGPTWords }) => {
    useEffect(() => {
        const timeout = setTimeout(() => {
            setScoreComparisonModalVisible(false);
        }, 300);

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

export const TurnAnnouncementModal = ({ turnAnnounceModalVisible, setTurnAnnounceModalVisible, isPlayerTurn }) => {
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
};

export const FullScreenAnimationModal = ({ visible, setVisible, winner }) => {
    const animationSource = winner === 'GPT' ? require('./aiwins1.json') : require('./humanwins1.json');

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => setVisible(false)}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <LottieView
                        source={animationSource}
                        autoPlay
                        loop={false}
                        onAnimationFinish={() => setVisible(false)}
                        style={styles.lottieFullScreenAnimation}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
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
    bottomView: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 0,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'black',
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
    modalText: {
        fontSize: 16,
        color: 'white',
        padding: 5,
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
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    }
});
