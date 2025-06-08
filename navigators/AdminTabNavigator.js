import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Appbar } from 'react-native-paper'; // Importamos o Appbar para usar no header
import { useNavigation } from '@react-navigation/native'; // Para o botão de perfil

// --- Importando as telas que serão exibidas nas abas ---
import AdminHomeScreen from '../screensAdm/home';
import GerenciarFuncionariosScreen from '../screensAdm/funcionario-gerenciar';
import DashboardScreen from '../screensAdm/dashboard-principal';
import LogsScreen from '../screensAdm/logs';

const Tab = createBottomTabNavigator();

// Um componente customizado para o botão de perfil no header
const ProfileButton = () => {
    const navigation = useNavigation();
    return (
        <Appbar.Action
          icon="account-circle"
          color="white" 
          onPress={() => navigation.navigate('AdminProfile')}
        />
    );
};

const AdminTabNavigator = () => {
  return (
    // <Stack.Group screenOptions={{
    //         headerStyle: {
    //           backgroundColor: '#0f172a', // Cor escura
    //         },
    //         headerTintColor: '#fff', // Cor do texto e ícone de voltar
    //         headerTitleStyle: {
    //           fontWeight: 'bold',
    //         },
    //       }}>
    
    <Tab.Navigator
      initialRouteName="Cases" // A aba inicial será "Gerenciar Casos"
      screenOptions={{
        headerStyle: {
               backgroundColor: '#0f172a', // Cor escura
             },
             headerTintColor: '#fff', // Cor do texto e ícone de voltar
             headerTitleStyle: {
               fontWeight: 'bold',
             },
        tabBarActiveTintColor: '#007bff', // Cor do ícone e texto da aba ativa
        tabBarInactiveTintColor: 'gray',   // Cor do ícone e texto da aba inativa
        // Definindo um header padrão para todas as abas, com o botão de perfil
        headerRight: () => <ProfileButton />,
      }}
    >
      <Tab.Screen
        name="Cases"
        component={AdminHomeScreen}
        options={{
          title: 'Gerenciar Casos', // Título que aparece no header da tela
          tabBarLabel: 'Casos',      // Texto que aparece abaixo do ícone na aba
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="folder-text-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Employees"
        component={GerenciarFuncionariosScreen}
        options={{
          title: 'Gerenciar Funcionários',
          tabBarLabel: 'Funcionários',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-group-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Logs"
        component={LogsScreen}
        options={{
          title: 'Logs do Sistema',
          tabBarLabel: 'Logs',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="clipboard-text-clock-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AdminTabNavigator;