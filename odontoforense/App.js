import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/login'
import HomeScreen from './screens/home';
import { Image } from 'react-native';

const Stack = createStackNavigator();

export default function App() {
  return (
    
    <NavigationContainer>  
      <Stack.Navigator
        initialRouteName="OdontoForense"
        screenOptions={{
          headerRight: () => (
            <Image
              source={require('./img/logoodontoforense.png')}
              style={{ width: 50, height: 50, marginRight: 15}}
              resizeMode="contain"
            />
          ),
         headerRightAlign: 'right',
          headerStyle: {
            backgroundColor: '#ffffff',
          },
        }}
      >
        <Stack.Screen name="OdontoForense" component={LoginScreen} />

        <Stack.Screen name="Home" component={HomeScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

        