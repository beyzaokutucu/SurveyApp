import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const Home = ({ route, navigation }) => {
  console.log("Route Params:", route.params); // Parametreleri loglayın
  const { nickname } = route.params || {}; // 'nickname' parametresini güvenli bir şekilde al

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../images/home.png')}
          style={styles.image}
        />
      </View>
      <View style={styles.contentContainer}>
        {/* Hoşgeldiniz mesajı ve kullanıcı adı */}
        <Text style={styles.welcomeText}>Hoşgeldiniz, {nickname}</Text>
        {/* Ankete başlama butonu */}
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('Survey' )}
        >
          <Text style={styles.buttonText}>Ankete Başla</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#EEEEEE',
  },
  imageContainer: {
    width: '100%',
    height: '55%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '5%',
  },
  image: {
    width: '120%',
    height: '110%',
    resizeMode: 'contain',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',  // iOS mavi rengi
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,  // Oval şekil için yuvarlak kenarlar
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,  // Android için gölge efekti
    shadowOpacity: 0.3,  // iOS için gölge efekti
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default Home;
