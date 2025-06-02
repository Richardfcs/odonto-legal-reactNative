import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Telas
import LoginScreen from './screens/login';
import MainHomeScreen from './screens/home';
import CaseDetailsScreen from './screens/detalhes-do-caso'; // ✅ import da tela de detalhes

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} // Oculta o cabeçalho da tela de login
        />
        <Stack.Screen 
          name="MainHome" 
          component={MainHomeScreen} 
          options={{ title: 'Início' }} // Nome visível no cabeçalho
        />
        <Stack.Screen 
          name="CaseDetails" 
          component={CaseDetailsScreen} 
          options={{ title: 'Detalhes do Caso' }} // ✅ nova rota adicionada
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
