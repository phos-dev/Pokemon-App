import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './src/screens/home/home.screen';
import Favorites from './src/screens/favorite/fav.screen';
import Poke from './src/screens/pokemon/poke.screen';

const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Fav" component={Favorites} />
        <Stack.Screen name="Poke" component={Poke} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
