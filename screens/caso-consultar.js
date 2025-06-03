import React from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';

import NavBar from '../components/nav';
import ConsultaCaseInfoCard from '../components/ConsultaCaseInfoCard';
import EvidenceConsultaCard from '../components/EvidenceConsultaCard';

export default function ConsultarCaso({ route, navigation }) {
  const caseData = route.params?.caseData || {
    name: 'Identificação de vítima em afogamento no Capibaribe',
    description: 'Um corpo em avançado estado de decomposição foi encontrado nas margens do Rio Capibaribe, no bairro de Santo Amaro. A arcada dentária é um dos únicos elementos disponíveis para identificação da vítima, e o caso foi encaminhado à equipe de odontologia legal para análise comparativa com prontuários odontológicos de pessoas desaparecidas.',
    status: 'em andamento',
    location: 'Recife - PE',
    date: '2025-05-28',
    hour: '08:45',
    category: 'identificação humana',
  };


  return (
    <View style={styles.container}>
      <NavBar navigation={navigation} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Consultar Casos Pericial</Text>

        <ConsultaCaseInfoCard caseData={caseData} />
        <EvidenceConsultaCard />
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
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a',
    textAlign: 'center',
    marginTop: 16, // Ajuste esse valor conforme necessário
  },
});
