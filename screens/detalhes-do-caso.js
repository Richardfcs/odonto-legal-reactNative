import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import * as Print from 'expo-print'; // ✅ Importação do expo-print

import NavBar from '../components/nav';
import CaseDetailCard from '../components/CaseDetailCard';
import VictimsCard from '../components/VictimsCard';
import EvidenceCardContainer from '../components/EvidenceCardContainer';
import CaseActionsCard from '../components/CaseActionsCard';
import TeamManagementCard from '../components/TeamManagementCard';
import AIAnalysisCard from '../components/AIAnalysisCard';
import Footer from '../components/footer';
import AddEvidenceForm from '../components/AddEvidenceForm';
import EditCaseForm from '../components/EditCaseForm';
import EditEvidenceForm from '../components/EditEvidenceCard';
import VictimFormCard from '../components/VictimFormCard';

export default function CaseDetailsScreen({ route, navigation }) {
  const [caseData, setCaseData] = useState(route.params?.caseData || {
    name: 'Caso misterioso no rio do Recife',
    description: 'atualizando dados',
    status: 'finalizado',
    location: 'Recife',
    date: '01/05/2025',
    hour: '15:41',
    category: 'exame criminal',
  });

  const [showForm, setShowForm] = useState(false);
  const [showEditCaseForm, setShowEditCaseForm] = useState(false);
  const [showEditEvidenceForm, setShowEditEvidenceForm] = useState(false);
  const [evidenceToEdit, setEvidenceToEdit] = useState(null);
  const [showVictimForm, setShowVictimForm] = useState(false);

  function handleAddVictim() {
    setShowVictimForm(true);
  }

  function handleAddEvidence() {
    setShowForm(true);
  }

  function handleGenerateSelectedReport() {
    alert('Gerar laudo para evidências selecionadas clicado');
  }

  // ✅ Função para exportar PDF
  async function handleExportReport() {
    const htmlContent = `
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Laudo Pericial</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #1e40af; }
            p { margin-bottom: 8px; }
          </style>
        </head>
        <body>
          <h1>Laudo Pericial</h1>
          <p><strong>Nome do Caso:</strong> ${caseData.name}</p>
          <p><strong>Descrição:</strong> ${caseData.description}</p>
          <p><strong>Status:</strong> ${caseData.status}</p>
          <p><strong>Local:</strong> ${caseData.location}</p>
          <p><strong>Data:</strong> ${caseData.date}</p>
          <p><strong>Hora:</strong> ${caseData.hour}</p>
          <p><strong>Categoria:</strong> ${caseData.category}</p>
          <br />
          <p><em>Este laudo foi gerado automaticamente via aplicativo Odonto Forense.</em></p>
        </body>
      </html>
    `;

    try {
      await Print.printAsync({
        html: htmlContent,
      });
    } catch (error) {
      alert('Erro ao exportar PDF: ' + error.message);
    }
  }

  function handleEditCase() {
    setShowEditCaseForm(true);
  }

  function handleDeleteCase() {
    alert('Deletar caso clicado');
  }

  function handleSubmitEditCase(editedData) {
    setCaseData(editedData);
    setShowEditCaseForm(false);
  }

  function handleCancelEditCase() {
    setShowEditCaseForm(false);
  }

  function handleSubmitEvidence(data) {
    console.log('Evidência enviada:', data);
    setShowForm(false);
  }

  function handleCancelEvidence() {
    setShowForm(false);
  }

  function handleEditEvidence(evidence) {
    setEvidenceToEdit(evidence);
    setShowEditEvidenceForm(true);
  }

  function handleSubmitEditEvidence(editedEvidence) {
    console.log('Evidência editada:', editedEvidence);
    setShowEditEvidenceForm(false);
    setEvidenceToEdit(null);
  }

  function handleCancelEditEvidence() {
    setShowEditEvidenceForm(false);
    setEvidenceToEdit(null);
  }

  function handleCancelVictimForm() {
    setShowVictimForm(false);
  }

  return (
    <View style={styles.container}>
      <NavBar navigation={navigation} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Detalhes do Caso Pericial</Text>

        {showEditCaseForm ? (
          <EditCaseForm
            initialData={caseData}
            onSubmit={handleSubmitEditCase}
            onCancel={handleCancelEditCase}
          />
        ) : showEditEvidenceForm ? (
          <EditEvidenceForm
            initialData={evidenceToEdit}
            onSubmit={handleSubmitEditEvidence}
            onCancel={handleCancelEditEvidence}
          />
        ) : showVictimForm ? (
          <>
            <VictimFormCard />
            <View style={{ marginTop: 10 }}>
              <Text
                style={{ color: '#1e40af', textAlign: 'center' }}
                onPress={handleCancelVictimForm}
              >
                Cancelar
              </Text>
            </View>
          </>
        ) : (
          <>
            <CaseDetailCard caseData={caseData} />
            <VictimsCard onAddVictim={handleAddVictim} />
            <EvidenceCardContainer onEditEvidence={handleEditEvidence} />
            <CaseActionsCard
              onAddEvidence={handleAddEvidence}
              onGenerateSelectedReport={handleGenerateSelectedReport}
              onExportReport={handleExportReport}
              onEditCase={handleEditCase}
              onDeleteCase={handleDeleteCase}
              disableGenerateSelected={true}
            />
            {showForm && (
              <AddEvidenceForm
                onSubmit={handleSubmitEvidence}
                onCancel={handleCancelEvidence}
              />
            )}
            <TeamManagementCard />
            <AIAnalysisCard />
            <Footer />
          </>
        )}
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
