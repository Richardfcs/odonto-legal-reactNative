import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text } from 'react-native';

// Importa a aba real que acabamos de criar
import EvidenciasTab from '../screensAdm/casoTabs/EvidenciasTab';
import VitimasTab from '../screensAdm/casoTabs/VitimasTab';
import EquipeTab from '../screensAdm/casoTabs/EquipeTab';
import AnaliseIATab from '../screensAdm/casoTabs/AnaliseIATab';

// Placeholders para as outras abas

const Tab = createMaterialTopTabNavigator();

const CasoTabNavigator = ({ caseId }) => {
  return (
    <Tab.Navigator
      // ... (opções do navigator)
    >
      <Tab.Screen name="Evidencias">
        {/* Substitui o placeholder pelo componente real */}
        {() => <EvidenciasTab caseId={caseId} />}
      </Tab.Screen>
      <Tab.Screen name="Vítimas">
        {() => <VitimasTab caseId={caseId} />}
      </Tab.Screen>
      <Tab.Screen name="Equipe">
        {() => <EquipeTab caseId={caseId} />}
      </Tab.Screen>
      <Tab.Screen name="Análise IA">
        {() => <AnaliseIATab caseId={caseId} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default CasoTabNavigator;