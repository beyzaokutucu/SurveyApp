import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { validateUser } from '../../database'; // Yol doğru olduğundan emin olun

const Login = ({ navigation }) => {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // Boş alan kontrolü
    if (nickname.trim() === '' || password.trim() === '') {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurunuz.');
      return;
    }
  
    try {
      const user = await validateUser(nickname, password);
      console.log('Login successful', nickname); // Kontrol için
      navigation.navigate('Home', { nickname: nickname });
    } catch (error) {
      Alert.alert('Giriş Başarısız', error.toString());
    }
  };  


  return (
    <View style={styles.container}>
      <Image
        source={require('../../images/giris.png')}
        style={styles.image}
      />
      <Text style={styles.welcomeText}>Hoşgeldiniz!</Text>
      <TextInput
        label="Nickname"
        value={nickname}
        onChangeText={setNickname}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Şifre"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        mode="outlined"
      />
      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.loginButton}
      >
        <Text style={styles.loginText}>Giriş Yap</Text>
      </Button>
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Üye Değil Misiniz? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerButton}>Hesap Oluşturun</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: '75%',
    height: '40%',
    marginBottom: '11%',
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: '10%',
    fontWeight: '500'
  },
  input: {
    width: '90%',
    height: 50,
    marginBottom: 15,
    fontSize: 16,
  },
  loginButton: {
    width: '90%',
    padding: 10,
    backgroundColor: '#425FEC',
    borderRadius: 10,
    marginTop: 20,
  },
  loginText: {
    color: 'white',
    fontSize: 16,
  },
  registerContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  registerText: {
    fontSize: 16,
    color: 'gray',
  },
  registerButton: {
    fontSize: 16,
    color: '#390D9F',
    textDecorationLine: 'underline',
  },
});

export default Login;
