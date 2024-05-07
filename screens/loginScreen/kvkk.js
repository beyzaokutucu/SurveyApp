import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Checkbox, Button } from 'react-native-paper';

const KVKK = ({ navigation }) => {
  const [isAccepted, setIsAccepted] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ alignItems: 'center' }}>
      <Image
        source={require('../../images/kvkk.png')}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.header}>KVKK Bilgilendirme ve Onayı</Text>
        <Text style={styles.text}>
          Kişisel verilerinizin korunmasına yönelik açıklama metnimizi okuyunuz.
        </Text>
        <Checkbox.Item
          label="KVKK metnini okudum ve kabul ediyorum."
          status={isAccepted ? 'checked' : 'unchecked'}
          onPress={() => setIsAccepted(!isAccepted)}
          uncheckedColor="#425FEC"  // Checkbox rengi değiştiğinde kullanılacak renk
          color="#425FEC"            // Checkbox işaretli olduğunda kullanılacak renk
        />
        <Button
          mode="contained"
          disabled={!isAccepted}
          onPress={() => navigation.navigate('Login')}
          style={styles.button}
        >
          İlerle
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',  // Arka plan rengi eklendi
  },
  image: {
    width: 300,  // Görüntü boyutu optimize edildi
    height: 300, // Görüntü boyutu optimize edildi
    resizeMode: 'contain',
    marginTop: 20,  // Üst boşluk düzenlendi
  },
  content: {
    padding: 20,
    width: '90%',  // İçerik genişliği sınırlı
    alignItems: 'center',  // Metin ve öğeleri merkezlemek için
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,  // Boşluk oranı değiştirildi
    textAlign: 'center'  // Başlık metni merkezlendi
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'justify'  // Metin hizalaması eklendi
  },
  button: {
    marginTop: 20,
    backgroundColor: '#425FEC',  // Buton rengi belirtildi
    width: '100%',  // Buton genişliği eklendi
  }
});

export default KVKK;
