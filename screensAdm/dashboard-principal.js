import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SegmentedButtons } from 'react-native-paper';


// Importe os componentes de dashboard
import GeralDashboard from '../components/dashboard/GeralDashboard';
import CasosDashboard from '../components/dashboard/CasosDashboard';
import VitimasDashboard from '../components/dashboard/VitimasDashboard';
import UsuariosDashboard from '../components/dashboard/UsuariosDashboard';
import LocaisDashboard from '../components/dashboard/LocaisDashboard';
import AtividadesDashboard from '../components/dashboard/AtividadesDashboard';
import IADashboard from '../components/dashboard/IADashboard';

const DashboardScreen = () => {
  const [value, setValue] = useState('geral');

  const renderDashboard = () => {
    switch (value) {
      case 'geral':
        return <GeralDashboard />;
      case 'casos':
        return <CasosDashboard />;
      case 'vitimas':
        return <VitimasDashboard />;
      case 'usuarios':
        return <UsuariosDashboard />;
      case 'locais':
        return <LocaisDashboard />;
      case 'atividades':
        return <AtividadesDashboard />;
      case 'ia':
        return <IADashboard />;
      default:
        return <GeralDashboard />;
    }
  };

  return (
    <SafeAreaView style={styles.flex1} edges={['bottom', 'left', 'right']}>
      <View style={styles.flex1}>
        {/* Envolvemos os botões segmentados em um ScrollView horizontal */}
        <View style={styles.headerContainer}>
            <ScrollView 
                horizontal={true} 
                showsHorizontalScrollIndicator={false} // Oculta a barra de scroll visual
                contentContainerStyle={styles.scrollViewContent} // Estilo para o conteúdo do scroll
            >
                <SegmentedButtons
                    value={value}
                    onValueChange={setValue}
                    buttons={[
                        { value: 'geral', label: 'Geral', },
                        { value: 'casos', label: 'Casos', },
                        { value: 'vitimas', label: 'Vítimas', },
                        { value: 'usuarios', label: 'Usuários' },
                        { value: 'locais', label: 'Locais' },
                        { value: 'atividades', label: 'Atividades' },
                        { value: 'ia', label: 'Análise IA' },
                    ]}
                    style={styles.segmentedButtons}
                />
            </ScrollView>
        </View>

        {/* O conteúdo do dashboard agora usa um ScrollView vertical separado */}
        <ScrollView style={styles.dashboardContainer}>
            <View style={styles.dashboardContent}>
                {renderDashboard()}
            </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
    backgroundColor: '#f4f7fa', // Cor de fundo para consistência
  },
  headerContainer: {
    paddingVertical: 8,
    backgroundColor: '#fff', // Cor de fundo para o cabeçalho
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  scrollViewContent: {
    paddingHorizontal: 8, // Adiciona um padding nas laterais dentro do scroll
    alignItems: 'center', // Alinha verticalmente os botões
  },
  segmentedButtons: {
    // A largura será definida pelo conteúdo, não precisa de estilo específico aqui
  },
  dashboardContainer: {
    flex: 1,
  },
  dashboardContent: {
    padding: 8,
  },
});

export default DashboardScreen;