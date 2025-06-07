import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text } from 'react-native';

import EvidenciasUserTab from '../screens/casoTabs/EvidenciasUserTab';
import VitimasUserTab from '../screens/casoTabs/VitimasUserTab';
import EquipeUserTab from '../screens/casoTabs/EquipeUserTab';
import AnaliseIAUserTab from '../screens/casoTabs/AnaliseIAUserTab';

const Tab = createMaterialTopTabNavigator();

const CasoUserTabNavigator = ({ caseId }) => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarIndicatorStyle: { backgroundColor: '#1e40af' },
        tabBarLabelStyle: { fontSize: 12, textTransform: 'capitalize' },
      }}
    >
      <Tab.Screen name="Evidências">
        {() => <EvidenciasUserTab caseId={caseId} />}
      </Tab.Screen>
      <Tab.Screen name="Vítimas">
        {() => <VitimasUserTab caseId={caseId} />}
      </Tab.Screen>
      <Tab.Screen name="Equipe">
        {() => <EquipeUserTab caseId={caseId} />}
      </Tab.Screen>
      <Tab.Screen name="Análise IA">
        {() => <AnaliseIAUserTab caseId={caseId} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default CasoUserTabNavigator;