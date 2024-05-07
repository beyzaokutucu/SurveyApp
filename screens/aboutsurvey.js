import React, { useState } from 'react'; // Correctly import useState
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

const AboutSurvey = () => {
  const surveys = [
    { id: 1, date: '2024-05-01', time: '15:30', mood: '30' },
    { id: 2, date: '2024-05-02', time: '12:20', mood: '70' },
    { id: 3, date: '2024-05-02', time: '12:20', mood: '70' },
  ];

  const [expandedIds, setExpandedIds] = useState([]);

  const toggleExpand = (id) => {
    setExpandedIds(prevState =>
      prevState.includes(id) ? prevState.filter(eId => eId !== id) : [...prevState, id]
    );
  };

  const surveyStats = {
    points: 128,
    completedSurveys: 34,
    surveysFilledToday: 3,
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Tamamlanan Anketler</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.number}>{surveyStats.points}</Text>
          <Text style={styles.label}>Puan</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.number}>{surveyStats.completedSurveys}</Text>
          <Text style={styles.label}>Doldurulan</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.number}>{surveyStats.surveysFilledToday}</Text>
          <Text style={styles.label}>Bugün</Text>
        </View>
      </View>
      {surveys.map((survey) => (
        <Card key={survey.id} style={styles.card}>
          <Card.Content>
          <Text style={styles.txt}> Anket</Text>
            <View style={styles.row}>
              <MaterialCommunityIcons name="calendar" size={24} color="#425FEC" marginTop="5%" />
              <Text style={styles.text}>{survey.date}</Text>
              <MaterialCommunityIcons name="clock-time-four-outline" size={24} color="black" style={styles.icon} />
              <Text style={styles.text}>{survey.time}</Text>
            </View>
            <TouchableOpacity onPress={() => toggleExpand(survey.id)} style={styles.expandButton}>
  <MaterialIcons name={expandedIds.includes(survey.id) ? "keyboard-arrow-down" : "keyboard-arrow-right"} size={30} color="black" style={styles.arrowIcon} />
</TouchableOpacity>

            {expandedIds.includes(survey.id) && (
              <View style={styles.details}>
                <Text style={styles.modtext}>Modunuz: {survey.mood}</Text>
              </View>
            )}
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'normal',
    textAlign: 'center',
    marginTop: '8%',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  number: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2A28A8',
    marginTop: '8%',
  },
  label: {
    fontSize: 16,
    color: '#777',
    marginTop: '6%',
  },
  divider: {
    height: '60%', // Adjustable height
    width: 1,
    backgroundColor: '#e0e0e0',
  },
  card: {
    marginVertical: 8,
    backgroundColor:'#EEEEEE',
    width:'90%',
    marginLeft:'5%'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '3%',
  },
  text: {
    fontSize: 14,
    marginLeft: 10,
    marginTop:'5%'
  },
  icon: {
    marginLeft:'7%',
    color:'#425FEC',
    marginTop:'5%'
  },
  expandButton: {
    alignItems: 'center',
    marginTop: '0%',
    width: '100%', // Genişlemesi için tam genişlik sağlayabilirsiniz.
  },
  
  arrowIcon: {
    alignSelf: 'flex-end', // Sağa hizalama
    marginRight: '3%', // Sağ kenardan boşluk
    marginTop:'-13%'
  },
  
  details: {
    marginTop: '7%',
    backgroundColor:'#425FEC',
    borderRadius:30,
    width:'45%',
    padding:'3%',
    marginLeft:'48%'
  },
  modtext:{
    textAlign:'center',
    color:'white',
    fontSize:14,
  },
  txt:{
    fontWeight:'bold',
    color:'#425FEC',
    fontSize:16,
  }
});

export default AboutSurvey;
