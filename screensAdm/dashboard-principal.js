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
    // SafeAreaView garante que nada fique atrás de notches ou da barra de status
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        {/* Este View é o cabeçalho com os botões segmentados */}
        <View style={styles.headerContainer}>
            <ScrollView 
                horizontal={true} 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContent}
            >
                <SegmentedButtons
                    value={value}
                    onValueChange={setValue}
                    buttons={[
                        { value: 'geral', label: 'Geral' },
                        { value: 'casos', label: 'Casos' },
                        { value: 'vitimas', label: 'Vítimas' },
                        { value: 'usuarios', label: 'Usuários' },
                        { value: 'locais', label: 'Locais' },
                        { value: 'atividades', label: 'Atividades' },
                        { value: 'ia', label: 'Análise IA' },
                    ]}
                    style={styles.segmentedButtons}
                />
            </ScrollView>
        </View>

        {/* 
          Este ScrollView agora ocupa o espaço restante. 
          Não usamos flex: 1 nele, mas sim no seu conteúdo para garantir 
          que ele se estique corretamente quando o conteúdo for pequeno.
        */}
        <ScrollView contentContainerStyle={styles.dashboardContent}>
            {renderDashboard()}
        </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // O container principal ocupa toda a tela
    backgroundColor: '#f4f7fa',
  },
  headerContainer: {
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  scrollViewContent: {
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  segmentedButtons: {
    // A largura será definida pelo seu conteúdo
  },
  dashboardContent: {
    padding: 8,
    // Adicionamos um padding na parte inferior para garantir que o último 
    // elemento não fique colado na barra de abas
    paddingBottom: 24, 
  },
});

export default DashboardScreen;