import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Telas que farão parte das abas
import MeusCasosScreen from '../screens/MeusCasosScreen';
// Placeholders para as outras abas
import BancoDeCasosScreen from '../screens/BancoDeCasosScreen';
import PerfilScreen from '../screensAdm/perfil'; // Reutilizaremos a tela de perfil

const Tab = createBottomTabNavigator();

const UserTabNavigator = () => {
    return (
        <Tab.Navigator
            initialRouteName="MeusCasos"
            screenOptions={{
                // APLICAÇÃO DOS NOVOS ESTILOS
                headerStyle: {
                    backgroundColor: '#0f172a', // Cor de fundo escura, como no seu CSS de referência
                },
                headerTintColor: '#fff', // Cor do texto e ícones do header (branco)
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                tabBarActiveTintColor: '#1e40af', // Cor da aba ativa (azul forte)
                tabBarInactiveTintColor: 'gray',
                headerShown: true,
            }}
        >
            <Tab.Screen
                name="MeusCasos"
                component={MeusCasosScreen}
                options={{
                    title: 'Meus Casos',
                    tabBarLabel: 'Meus Casos',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="folder-account-outline" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="BancoDeCasos"
                component={BancoDeCasosScreen} // Aponta para o componente real
                options={{
                    title: 'Banco de Casos',
                    tabBarLabel: 'Banco de Casos',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="bank-outline" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Perfil"
                component={PerfilScreen}
                options={{
                    title: 'Meu Perfil',
                    tabBarLabel: 'Perfil',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account-circle-outline" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default UserTabNavigator;