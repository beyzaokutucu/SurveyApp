import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import LoginScreen from './screens/loginScreen/login';
import Register from './screens/loginScreen/register';
import KVKK from './screens/loginScreen/kvkk';
import Profil from './screens/profil';
import Home from './screens/home';
import AboutSurvey from './screens/aboutsurvey';
import Survey from './screens/survey';

// Stack ve Tab Navigatorlarınızı oluşturma
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator({ route }) { // TabNavigator'a route parametresi eklenmiştir.
  const { nickname } = route.params;

  return (
    <Tab.Navigator
  screenOptions={({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;
      if (route.name === 'Ana Sayfa') {
        iconName = focused ? 'home' : 'home-outline';
      } else if (route.name === 'Anket') {
        iconName = focused ? 'list' : 'list-outline';
      } else if (route.name === 'Profil') {
        iconName = focused ? 'person' : 'person-outline';
      }
      return <Ionicons name={iconName} size={focused ? 30 : 25} color={color} />;
    },
    tabBarActiveTintColor: '#425FEC',
    tabBarInactiveTintColor: 'gray',
  })}
  initialRouteName="Ana Sayfa" // Ensure Home is the initial tab
>

    
      <Tab.Screen 
        name="Anket" 
        component={AboutSurvey}
        initialParams={{ nickname }}  // nickname değerini Anket ekranına initialParams ile geçir
      />
      <Tab.Screen 
        name="Ana Sayfa" 
        component={Home}
        initialParams={{ nickname }}  // nickname değerini Ana Sayfa ekranına initialParams ile geçir
      />
      <Tab.Screen 
        name="Profil" 
        component={Profil}
        initialParams={{ nickname }}  // nickname değerini Profil ekranına initialParams ile geçir
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Home" component={TabNavigator} />
        <Stack.Screen name="KVKK" component={KVKK} />
        <Stack.Screen name="Survey" component={Survey} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
