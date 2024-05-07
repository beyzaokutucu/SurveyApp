import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal  } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getLoggedInUserId, getSurveyProgress, updateSurveyProgress, saveAnswer } from '../database';

function Survey({ navigation, route }) {
  const totalQuestions = 5;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [timer, setTimer] = useState(60);  // Initialize timer

  useEffect(() => {
    const userId = getLoggedInUserId();
    getSurveyProgress(userId).then(progress => {
      if (progress !== null) {
        setCurrentQuestionIndex(progress);
      }
    });
  const timerId = setInterval(() => {
    setTimer(prevTimer => prevTimer > 0 ? prevTimer - 1 : clearInterval(timerId));
  }, 1000);

  return () => clearInterval(timerId);
}, []);
  console.log("Route Params:", route.params);
  const { nickname } = route.params || {};

  const questions = [
    { title: "Fransa'nın başkenti neresidir?", options: ["Paris", "Berlin", "Roma"], correct: 0 },
    { title: "Portakal hangi vitaminden zengindir?", options: ["Vitamin A", "Vitamin B", "Vitamin C"], correct: 2 },
    { title: "Mona Lisa tablosunu kim çizmiştir?", options: ["Van Gogh", "Da Vinci", "Picasso"], correct: 1 },
    { title: "Dünya üzerindeki en sert doğal madde nedir?", options: ["Altın", "Demir", "Elmas"], correct: 2 },
    { title: "Bitkiler atmosferden hangi gazı emer?", options: ["Oksijen", "Karbondioksit", "Azot"], correct: 1 },
  ];

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (index) => {
    setSelectedOption(index);
  };

  const handleNext = () => {
    if (selectedOption === null) {
      Alert.alert("Uyarı", "Lütfen bir seçenek seçiniz.");
      return;
    }
    saveAnswer(getLoggedInUserId(), currentQuestionIndex, selectedOption);
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < totalQuestions) {
      setCurrentQuestionIndex(nextIndex);
      setSelectedOption(null);
    } else {
      setModalVisible(true); // Show confirmation for submitting
    }
  };
  

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(null); // Reset selected option when going back
    }
  };

  const handleSubmit = () => {
    // Submit the survey results here
    Alert.alert("Anket Gönderildi", "Anket sonuçları başarıyla gönderildi.", [
      {
        text: "OK",
        onPress: () => {
          navigation.navigate('Home',{nickname});
          updateSurveyProgress(getLoggedInUserId(), 0);
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.leftContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Home',{nickname})}>
            <Ionicons name="home" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
          <Text style={styles.title}>Anket Soruları</Text>
        <Text style={styles.questionInfo}>Soru {currentQuestionIndex + 1}/{totalQuestions}</Text>
          </View>
        </View>
        <Text style={styles.timerText}>{timer}</Text>
      </View>
      <ScrollView style={styles.content}>
        <Text style={styles.questionText}>{currentQuestion.title}</Text>
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedOption === index && { backgroundColor: '#e36414',},
            ]}
            onPress={() => handleAnswerSelect(index)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {!modalVisible && (
        <View style={styles.footer}>
          <TouchableOpacity onPress={handleBack} style={styles.navButton}>
            <Text style={styles.navButtonText}>Geri</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNext} style={styles.navButton}>
            <Text style={styles.navButtonText}>İleri</Text>
          </TouchableOpacity>
        </View>
      )}
      <Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => {
    Alert.alert("Modal has been closed.");
    setModalVisible(false);
  }}
>
  <View style={styles.centeredView}>
    <View style={styles.modalView}>
      <Text style={styles.modalText}>Anketi göndermek istediğinizden emin misiniz?</Text>
      <TouchableOpacity
        style={[styles.button, styles.buttonClose]}
        onPress={handleSubmit}
      >
        <Text style={styles.textStyle}>Gönder</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding:'15%',
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#425FEC',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  leftContainer: {
    alignItems: 'flex-start',
    marginTop:'15%'
  },
  titleContainer: {
    marginTop: '42%',  // Home ikonundan sonra biraz boşluk
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  questionInfo: {
    fontSize: 16,
    color: 'white',
  },
  timerText: {
    fontSize: 20,
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  questionContainer: {
    flex: 1,
  },
  questionText: {
    fontSize: 20,
    marginBottom: 10,
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginVertical: 5,
    backgroundColor: '#E1E1E1',
    borderRadius: 10,
  },
  optionText: {
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  navButton: {
    backgroundColor: '#425FEC',
    padding: '2.2%',
    width:'30%',
    borderRadius: 5,
    marginRight:'5%',
    marginLeft:'5%',
    marginBottom:'10%'
  },
  navButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign:'center'

  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Semi-transparent background
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  button: {
    borderRadius: 15,
    padding: 10,
    elevation: 2
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },

});

export default Survey; 