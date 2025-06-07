import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

// Importe os componentes REAIS das abas de consulta
import EvidenciasConsultaTab from '../screens/consulta/tabs/EvidenciasConsultaTab';
import VitimasConsultaTab from '../screens/consulta/tabs/VitimasConsultaTab';
import EquipeConsultaTab from '../screens/consulta/tabs/EquipeConsultaTab';

const Tab = createMaterialTopTabNavigator();

const CasoConsultaTabNavigator = ({ caseId }) => { // Nome corrigido
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarIndicatorStyle: { backgroundColor: '#1e40af' },
        tabBarLabelStyle: { fontSize: 12, textTransform: 'capitalize' },
      }}
    >
      <Tab.Screen name="Evidências">{() => <EvidenciasConsultaTab caseId={caseId} />}</Tab.Screen>
      <Tab.Screen name="Vítimas">{() => <VitimasConsultaTab caseId={caseId} />}</Tab.Screen>
      <Tab.Screen name="Equipe">{() => <EquipeConsultaTab caseId={caseId} />}</Tab.Screen>
    </Tab.Navigator>
  );
};

export default CasoConsultaTabNavigator; // Exporta com o nome correto