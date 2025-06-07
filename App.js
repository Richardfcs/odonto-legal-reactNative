import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, useColorScheme } from 'react-native'; // Usado para os placeholders restantes
import { Provider as PaperProvider } from 'react-native-paper';

// --- Telas Principais e Navegadores ---
import LoginScreen from './screens/login';
import UserTabNavigator from './navigators/UserTabNavigator';
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
import EditarCasoScreen from './screensAdm/editarCaso';

import DetalhesCasoUserScreen from './screens/DetalhesCasoUserScreen';
import DetalhesVitimaUserScreen from './screens/DetalhesVitimaUserScreen';
import EditarVitimaUserScreen from './screens/EditarVitimaUserScreen';
import OdontogramaUserScreen from './screens/OdontogramaUserScreen';
import CriarCasoUserScreen from './screens/CriarCasoUserScreen';
import EditarCasoUserScreen from './screens/EditarCasoUserScreen';
import CadastrarVitimaUserScreen from './screens/CadastrarVitimaUserScreen';

import DetalhesCasoConsultaScreen from './screens/consulta/DetalhesCasoConsultaScreen';
import ConsultaVictimDetailsScreen from './screens/consulta/ConsultaVictimDetailsScreen';
import ConsultaOdontogramaScreen from './screens/consulta/ConsultaOdontograma';

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>
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

          <Stack.Screen
            name="AdminEditCase"
            component={EditarCasoScreen}
            options={{ title: 'Editar Dados do Caso' }}
          />

          <Stack.Screen
            name="UserTabs"
            component={UserTabNavigator}
            options={{ headerShown: false }} // O navegador de abas tem seu próprio header
          />

          <Stack.Screen
            name="UserCreateCase"
            component={CriarCasoUserScreen} // Aponta para o componente real
            options={{ title: 'Criar Novo Caso' }}
          />

          <Stack.Screen
            name="UserCaseDetails"
            component={DetalhesCasoUserScreen} // Aponta para o componente real
            options={{ title: 'Detalhes do Caso' }}
          />

          <Stack.Screen
            name="UserVictimDetails"
            component={DetalhesVitimaUserScreen}
            options={{ title: 'Detalhes da Vítima' }}
          />

          <Stack.Screen
            name="UserEditVictim"
            component={EditarVitimaUserScreen} // Aponta para o componente real
            options={{ title: 'Editar Dados da Vítima' }}
          />

          <Stack.Screen
            name="UserOdontograma"
            component={OdontogramaUserScreen}
            options={{ title: 'Registro Odontológico' }}
          />

          <Stack.Screen
            name="UserEditCase"
            component={EditarCasoUserScreen}
            options={{ title: 'Editar Caso' }}
          />

          <Stack.Screen
            name="UserCreateVictim"
            component={CadastrarVitimaUserScreen}
            options={{ title: 'Adicionar Vítima ao Caso' }}
          />

          <Stack.Screen
            name="ConsultaCaseDetails"
            component={DetalhesCasoConsultaScreen}
            options={{ title: 'Consulta de Caso' }}
          />

          <Stack.Screen
            name="ConsultaVictimDetails"
            component={ConsultaVictimDetailsScreen}
            options={{ title: 'Consulta de Vítima' }}
          />

          <Stack.Screen
            name="ConsultaOdontograma"
            component={ConsultaOdontogramaScreen}
            options={{ title: 'Consulta de Odontograma' }}
          />

        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}