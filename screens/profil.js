import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert, Modal, TextInput, Button, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getUserInfo, updateUserInfo } from '../database';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';


const Profil = ({ route }) => {
  const navigation = useNavigation(); 
  const { nickname } = route.params;
  const [userInfo, setUserInfo] = useState({
      nickname: '',
      email: '',
      birthDate: new Date(),
      gender: '',
  });
  const [tempUserInfo, setTempUserInfo] = useState({ ...userInfo });
  const [isModalVisible, setModalVisible] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fieldLabels = {
      nickname: 'Kullanıcı Adı',
      email: 'E-posta',
      birthDate: 'Doğum Tarihi',
      gender: 'Cinsiyet',
  };

  useEffect(() => {
      const fetchUserInfo = async () => {
          try {
              const data = await getUserInfo(nickname);
              setUserInfo({
                  nickname: data.nickname,
                  email: data.email,
                  birthDate: new Date(data.birthdate),
                  gender: data.gender,
              });
          } catch (error) {
              Alert.alert('Error', `Unable to load user information: ${error}`);
          }
      };

      fetchUserInfo();
  }, [nickname]);

  const handleEdit = (field) => {
      setEditingField(field);
      setTempUserInfo({ ...userInfo });
      setModalVisible(true);
      if (field === 'birthDate') {
          setShowDatePicker(true);
      }
  };

  const handleDateChange = (event, selectedDate) => {
      setShowDatePicker(Platform.OS === 'ios');
      if (selectedDate) {
          setTempUserInfo({ ...tempUserInfo, birthDate: selectedDate });
      }
  };

  const handleSave = async () => {
      try {
          await updateUserInfo(nickname, tempUserInfo);
          setUserInfo(tempUserInfo);
          Alert.alert('Success', 'User information updated successfully.');
      } catch (error) {
          Alert.alert('Error', `Failed to update user information: ${error}`);
      }
      setModalVisible(false);
      setShowDatePicker(false);
  };

  const handleLogout = () => {
      Alert.alert("Çıkış Yap", "Çıkış yapmak istediğinizden emin misiniz?", [
          { text: "Geri", style: "cancel" },
          { 
            text: "Çıkış Yap", 
            onPress: () => {
              console.log("User logged out");
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            }
          }
      ]);
  };

  return (
      <View style={styles.container}>
          <Modal
              animationType="slide"
              transparent={true}
              visible={isModalVisible}
              onRequestClose={() => setModalVisible(false)}
          >
              <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                      {editingField === 'birthDate' && showDatePicker && (
                          <DateTimePicker
                              value={tempUserInfo.birthDate}
                              mode="date"
                              display="default"
                              onChange={handleDateChange}
                          />
                      )}
                      {editingField === 'gender' && (
    <View style={styles.genderButtonContainer}>
        {['Kadın', 'Erkek'].map(gender => (
            <TouchableOpacity
                key={gender}
                style={[styles.genderButton, tempUserInfo.gender === gender && styles.selectedGender]}
                onPress={() => setTempUserInfo({ ...tempUserInfo, gender })}
            >
                <Text style={styles.genderText}>{gender}</Text>
            </TouchableOpacity>
        ))}
    </View>
)}
                      {editingField !== 'birthDate' && editingField !== 'gender' && (
                          <TextInput
                              style={styles.modalText}
                              value={tempUserInfo[editingField]}
                              onChangeText={(text) => setTempUserInfo({ ...tempUserInfo, [editingField]: text })}
                              keyboardType={editingField === 'email' ? 'email-address' : 'default'}
                          />
                      )}
                    <View style={styles.modalButtons}>
    <TouchableOpacity style={styles.buttonStyle} onPress={handleSave}>
        <Text style={styles.buttonText}>Kaydet</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.buttonStyle} onPress={() => setModalVisible(false)}>
        <Text style={styles.buttonText}>Geri</Text>
    </TouchableOpacity>
</View>

                  </View>
              </View>
          </Modal>

          <View style={styles.accountInfo}>
              <Text style={styles.sectionTitle}>Hesap Bilgileri</Text>
              {Object.entries(userInfo).map(([key, value], index) => (
                  <View style={styles.inputContainer} key={index}>
                      <Text style={styles.label}>{fieldLabels[key]}: </Text>
                      <View style={styles.inputAndIcon}>
                          <Text style={styles.inputText}>
                              {key === 'birthDate' ? moment(value).format('DD-MM-YYYY') : value}
                          </Text>
                          <TouchableOpacity onPress={() => handleEdit(key)}>
                              <FontAwesome name="edit" size={24} color="#425FEC" />
                          </TouchableOpacity>
                      </View>
                  </View>
              ))}
          </View>
          <View style={styles.about}>
              <Text style={styles.sectionTitle}>Hakkında</Text>
              <TouchableOpacity onPress={() => openURL('https://example.com/privacy-policy')}>
                  <Text style={styles.link}>Gizlilik Politikası</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openURL('https://example.com/terms-and-conditions')}>
                  <Text style={styles.link}>Şartlar ve Koşullar</Text>
              </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
          </TouchableOpacity>
      </View>
  );};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFF',
    },
    accountInfo: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    inputContainer: {
        backgroundColor: '#F6F6F6',
        padding: '3%',
        borderRadius: 10,
        marginBottom: 15,
    },
    label: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    inputAndIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    inputText: {
        flex: 1,
        fontSize: 14,
        color: '#333',
    },
    about: {
        marginTop: '-1%',
    },
    link: {
        color: '#007AFF',
        marginBottom: 10,
        textDecorationLine: 'underline',
    },
    logoutButton: {
        backgroundColor: '#425FEC',
        padding: 15,
        borderRadius: 8,
        marginTop: 20,
    },
    logoutButtonText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
      position: 'absolute',
      width: '100%',
      height: '100%',
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
        elevation: 5,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      marginTop:'15%',
  },
  buttonStyle: {
      backgroundColor: '#425FEC', // Mavi arkaplan
      borderRadius: 15, // Kenarları yuvarlat
      paddingVertical: 10, // Dikey padding
      paddingHorizontal: 20, // Yatay padding
      elevation: 2, // Android için gölge
      shadowOpacity: 0.2, // iOS için gölge opaklığı
      shadowRadius: 3, // iOS için gölge yarıçapı
      shadowOffset: { width: 0, height: 2 }, // iOS için gölge yönü
     
  },
  buttonText: {
      color: 'white', // Metin rengi
      fontSize: 15, // Metin boyutu
      textAlign: 'center' // Metin hizalaması
  },
  genderButtonContainer: {
    flexDirection: 'row', // Butonları yan yana diz
    justifyContent: 'space-around', // Butonlar arasında boşluk bırak
    width: '100%', // Konteyner genişliği
    padding: 10, // İç padding
},
genderButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#ddd', // Normal arkaplan rengi
    flex: 1, // Esneklik ekleyerek her iki butonun da eşit genişlikte olmasını sağla
    margin: 5, // Her buton arasında boşluk bırak
    alignItems: 'center', // Metinleri ortala
    justifyContent: 'center' // İçerikleri dikey olarak ortala
},
selectedGender: {
    backgroundColor: '#425FEC', // Seçili butonun arkaplan rengi
},
genderText: {
    color: '#ffffff', // Metin rengi
},
});

export default Profil;
