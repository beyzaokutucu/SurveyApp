import React, { useState, useEffect } from 'react';
import {
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  Alert
} from 'react-native';
import { TextInput, Button, RadioButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { init, insertUser } from '../../database';

const Register = ({ navigation }) => {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthdate, setBirthdate] = useState(new Date());
  const [gender, setGender] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    init().then(() => {
      console.log('Database initialization succeeded!');
    }).catch((err) => {
      console.error('Database initialization failed:', err);
    });
  }, []);

  const validateForm = () => {
    let newErrors = {};
    if (!nickname) newErrors.nickname = 'Kullanıcı adı zorunludur';
    if (!email) newErrors.email = 'E-posta zorunludur';
    if (!password) newErrors.password = 'Şifre zorunludur';
    if (!birthdate) newErrors.birthdate = 'Doğum tarihi zorunludur';
    if (!gender) newErrors.gender = 'Cinsiyet zorunludur';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = () => {
    if (validateForm()) {
      insertUser(nickname, password, email, birthdate.toISOString(), gender).then(() => {
        console.log('User added successfully!');
        navigation.navigate('KVKK'); // KVKK sayfasına yönlendirme
      }).catch((err) => {
        console.error('Failed to add user:', err);
        Alert.alert("Kayıt Hatası", "Kullanıcı kaydı başarısız oldu.");
      });
    }
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthdate(selectedDate);
      setErrors({ ...errors, birthdate: null });
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      <Image
        source={require('../../images/register.png')}
        style={styles.image}
      />
      <View style={styles.form}>
        <Text style={styles.radioLabel}>Cinsiyetinizi Seçin:</Text>
        <RadioButton.Group onValueChange={newValue => { setGender(newValue); setErrors({...errors, gender: null}); }} value={gender}>
          <View style={styles.radioContainer}>
            <RadioButton.Item label="Kadın" value="female" />
            <RadioButton.Item label="Erkek" value="male" />
          </View>
        </RadioButton.Group>
        {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
        <TextInput
          label="Nickname"
          value={nickname}
          onChangeText={text => { setNickname(text); setErrors({...errors, nickname: null}); }}
          style={styles.input}
          mode="outlined"
          error={!!errors.nickname}
        />
        <TextInput
          label="E-posta"
          value={email}
          onChangeText={text => { setEmail(text); setErrors({...errors, email: null}); }}
          style={styles.input}
          mode="outlined"
          keyboardType="email-address"
          error={!!errors.email}
        />
        <TextInput
          label="Şifre"
          secureTextEntry
          value={password}
          onChangeText={text => { setPassword(text); setErrors({...errors, password: null}); }}
          style={styles.input}
          mode="outlined"
          error={!!errors.password}
        />
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerInput}>
        <Text style={styles.inputLabel}>Doğum Tarihi</Text>
        <Text style={styles.dateText}>
          {birthdate ? birthdate.toLocaleDateString('tr-TR') : "Tarih seçiniz"}
        </Text>
      </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={birthdate}
            mode="date"
            display="default"
            onChange={onChangeDate}
            maximumDate={new Date()}
            locale="tr-TR"
          />
        )}
        {errors.birthdate && <Text style={styles.errorText}>{errors.birthdate}</Text>}
        <Button mode="contained" onPress={handleRegister} style={styles.button}>
          Kayıt Ol
        </Button>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkContainer}>
          <Text style={styles.linkText}>Üye misiniz? Giriş Yap</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    image: {
      width: '100%',
      height: '30%',
      resizeMode: 'contain',
      marginTop: '15%',
    },
    form: {
      flex: 1,
      padding: 20,
    },
    radioContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: '1%',
    },
    radioLabel: {
      fontSize: 16,
      marginBottom: 10,
    },
    input: {
      marginBottom: 15,
    },
    button: {
      marginTop: 10,
      backgroundColor: '#425FEC',
    },
    linkContainer: {
      marginTop: 15,
      alignItems: 'center',
    },
    linkText: {
      color: '#390D9F',
      textDecorationLine: 'underline',
      
    },
    errorText: {
      fontSize: 14,
      color: 'red',
      marginBottom: 5,
    },
 
    datePickerInput: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'white',
      paddingHorizontal: 10,
      paddingVertical: 10,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: 'grey',
      borderRadius: 5,
    },
    inputLabel: {
      fontSize: 16,
      color: '#666',
    },
    dateText: {
      fontSize: 16,
      color: 'black',
    },
});

export default Register;
