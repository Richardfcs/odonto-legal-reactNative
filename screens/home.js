// src/screens/CaseDetailsScreen.js
import React from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';

import NavBar from '../components/nav';
import CaseDetailCard from '../components/CaseDetailCard';
import VictimsCard from '../components/VictimsCard';
import EvidenceCardContainer from '../components/EvidenceCardContainer';
import CaseActionsCard from '../components/CaseActionsCard';
import TeamManagementCard from '../components/TeamManagementCard';
import AIAnalysisCard from '../components/AIAnalysisCard';
import Footer from '../components/footer'; // Importa o footer

export default function CaseDetailsScreen({ route, navigation }) {
  // Dados recebidos via navegação
  const caseData = route.params?.caseData || {
    name: 'Caso misterioso no rio do Recife',
    description: 'atualizando dados',
    status: 'finalizado',
    location: 'Recife',
    date: '01/05/2025',
    hour: '15:41',
    category: 'exame criminal',
  };

  function handleAddVictim() {
    alert('Aqui vai seu fluxo para adicionar vítima');
  }

  function handleAddEvidence() {
    alert('Adicionar evidência clicado');
  }
  function handleGenerateSelectedReport() {
    alert('Gerar laudo para evidências selecionadas clicado');
  }
  function handleExportReport() {
    alert('Exportar laudo clicado');
  }
  function handleEditCase() {
    alert('Editar caso clicado');
  }
  function handleDeleteCase() {
    alert('Deletar caso clicado');
  }

  return (
    <View style={styles.container}>
      <NavBar navigation={navigation} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Detalhes do Caso Pericial</Text>

        <CaseDetailCard caseData={caseData} />
        <VictimsCard onAddVictim={handleAddVictim} />
        <EvidenceCardContainer />
        <CaseActionsCard
          onAddEvidence={handleAddEvidence}
          onGenerateSelectedReport={handleGenerateSelectedReport}
          onExportReport={handleExportReport}
          onEditCase={handleEditCase}
          onDeleteCase={handleDeleteCase}
          disableGenerateSelected={true}
        />
        <TeamManagementCard />
        <AIAnalysisCard />
        <Footer /> {/* Footer dentro do ScrollView para acompanhar o conteúdo */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  content: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a',
    textAlign: 'center',
    marginTop: 16,
  },
});
