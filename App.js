import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text } from 'react-native'; // Usado para os placeholders restantes

// --- Telas Principais e Navegadores ---
import LoginScreen from './screens/login';
import MainHomeScreen from './screens/home'; // Tela para Perito/Assistente
import AdminTabNavigator from './navigators/AdminTabNavigator'; // Navegador de abas do Admin

// --- Telas do Administrador (acessadas de dentro do fluxo do Admin) ---
import ProfileScreen from './screensAdm/perfil';
// Importamos a nova tela que acabamos de criar
import GerenciarPermissoesScreen from './screensAdm/gerenciarPermissoes';
import CadastrarFuncionarioScreen from './screensAdm/funcionario-cadastro';
import CriarCasoScreen from './screensAdm/caso-criar';
import DetalhesCasoScreen from './screensAdm/detalhesCaso';
import CadastrarVitimaScreen from './screensAdm/cadastrarVitima';
import DetalhesVitimaScreen from './screensAdm/detalhesVitima';
import EditarVitimaScreen from './screensAdm/editarVitima';
import OdontogramaScreen from './screensAdm/odontograma';

// --- Componentes Placeholder para rotas futuras ---
const AdminCaseDetailsScreen = () => <View><Text>Tela de Detalhes do Caso (Admin)</Text></View>;
const AdminCreateCaseScreen = () => <View><Text>Tela de Criação de Caso (Admin)</Text></View>;
const AdminCreateFuncionarioScreen = () => <View><Text>Tela de Cadastrar Funcionário</Text></View>;

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
      >
        {/* Telas que não têm o layout de abas */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        
        {/* Rota para o conjunto de telas do Admin (o Tab Navigator) */}
        <Stack.Screen 
          name="AdminTabs" 
          component={AdminTabNavigator} 
          options={{ headerShown: false }}
        />
        
        {/* Rota para Peritos/Assistentes */}
        <Stack.Screen name="MainHome" component={MainHomeScreen} />

        {/* ================================================================== */}
        {/* Telas que serão abertas POR CIMA do fluxo de abas do Admin        */}
        {/* ================================================================== */}
        
        <Stack.Screen 
          name="AdminProfile" 
          component={ProfileScreen}
          options={{ title: 'Meu Perfil' }}
        />
        
        {/* ROTA ATUALIZADA */}
        <Stack.Screen 
          name="AdminManagePermissions" 
          component={GerenciarPermissoesScreen} // Agora aponta para o componente real
          options={{ title: 'Gerenciar Funcionário' }} // Título do header da tela
        />

        <Stack.Screen 
          name="AdminCreateFuncionario" 
          component={CadastrarFuncionarioScreen}
          options={{ title: 'Cadastrar Funcionário' }}
        />

        {/* Rotas de Casos (ainda como placeholder) */}
        <Stack.Screen 
          name="AdminCaseDetails" 
          component={DetalhesCasoScreen}
          options={{ title: 'Detalhes do Caso' }} // O título do header
        />

        <Stack.Screen 
          name="AdminCreateCase" 
          component={CriarCasoScreen}
          options={{ title: 'Criar Novo Caso' }}
        />

        <Stack.Screen 
          name="AdminCreateVictim"
          component={CadastrarVitimaScreen}
          options={{ title: 'Adicionar Vítima ao Caso' }}
        />

        <Stack.Screen 
          name="AdminVictimDetails"
          component={DetalhesVitimaScreen} // Agora aponta para o componente real
          options={{ title: 'Detalhes da Vítima' }}
        />

        {/* ADICIONANDO A NOVA ROTA DE EDIÇÃO DE VÍTIMA */}
        <Stack.Screen 
          name="AdminEditVictim"
          component={EditarVitimaScreen}
          options={{ title: 'Editar Dados da Vítima' }}
        />

        <Stack.Screen 
          name="AdminOdontograma"
          component={OdontogramaScreen}
          options={{ title: 'Registro Odontológico' }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}