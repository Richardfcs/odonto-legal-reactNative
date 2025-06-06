import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Button, ActivityIndicator, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import EvidenceCard from '../../components/EvidenceCard';
import EvidenceModal from '../../components/EvidenceModal';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import ReportContentModal from '../../components/ReportContentModal';

const API_URL = 'https://odonto-legal-backend.onrender.com';

const EvidenciasTab = ({ caseId }) => {
  const [evidences, setEvidences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEvidence, setEditingEvidence] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isEvidencesReportModalVisible, setIsEvidencesReportModalVisible] = useState(false);
  const [exportingEvidences, setExportingEvidences] = useState(false);

  // CORREÇÃO: useFocusEffect agora segue o padrão correto
  useFocusEffect(
    useCallback(() => {
      // Definimos a função async aqui dentro
      const fetchEvidences = async () => {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        try {
          const res = await fetch(`${API_URL}/api/evidence/${caseId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || 'Erro ao buscar evidências');
          setEvidences(data.evidences || []);
        } catch (error) {
          Alert.alert("Erro", error.message);
        } finally {
          setLoading(false);
        }
      };

      // E a chamamos imediatamente
      fetchEvidences();
    }, [caseId]) // A dependência caseId garante que a busca seja refeita se o ID do caso mudar
  );

  const handleExportEvidencesReport = async (reportContent) => {
    setExportingEvidences(true);
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/api/report/evidence`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ caseId, evidenceIds: selectedIds, content: reportContent })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Erro ao gerar laudo.");

      const filename = `Laudo_Evidencias_${caseId.slice(-4)}_${result.reportId.slice(-6)}.pdf`;
      const fileUri = FileSystem.documentDirectory + filename;
      const { uri } = await FileSystem.downloadAsync(result.pdfUrl, fileUri);

      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Compartilhar Laudo de Evidências' });
      setSelectedIds([]); // Limpa a seleção após exportar

    } catch (error) {
      Alert.alert("Erro de Exportação", error.message);
    } finally {
      setExportingEvidences(false);
    }
  };

  const handleOpenModal = (evidence = null) => {
    setEditingEvidence(evidence);
    setIsModalVisible(true);
  };

  // Função para recarregar as evidências, chamada após uma ação de sucesso
  const refreshEvidences = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/evidence/${caseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erro ao buscar evidências');
      setEvidences(data.evidences || []);
    } catch (error) {
      Alert.alert("Erro", error.message);
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = (evidenceId) => {
    Alert.alert("Confirmar Exclusão", "Tem certeza que deseja excluir esta evidência?", [
      { text: "Cancelar" },
      {
        text: "Excluir", style: 'destructive', onPress: async () => {
          const token = await AsyncStorage.getItem('token');
          try {
            const res = await fetch(`${API_URL}/api/evidence/${evidenceId}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${token}` }
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || 'Erro ao excluir');
            Alert.alert("Sucesso", "Evidência excluída.");
            refreshEvidences(); // Recarrega a lista
          } catch (error) {
            Alert.alert("Erro", error.message);
          }
        }
      },
    ]);
  };

  const handleSubmit = async (formData) => {
    const token = await AsyncStorage.getItem('token');
    const isEditing = !!editingEvidence;
    const url = isEditing ? `${API_URL}/api/evidence/${editingEvidence._id}` : `${API_URL}/api/evidence/${caseId}`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Erro ao salvar evidência');

      Alert.alert("Sucesso", `Evidência ${isEditing ? 'atualizada' : 'adicionada'} com sucesso.`);
      setIsModalVisible(false);
      refreshEvidences();
    } catch (error) {
      Alert.alert("Erro", error.message);
    }
  };

  const handleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={evidences}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <EvidenceCard
            evidence={item}
            onEdit={handleOpenModal}
            onDelete={handleDelete}
            onSelect={handleSelect}
            isSelected={selectedIds.includes(item._id)}
          />
        )}
        ListHeaderComponent={() => (
          <View style={styles.buttonContainer}>
            <Button icon="plus" mode="contained" onPress={() => handleOpenModal(null)}>Adicionar Evidência</Button>
            <Button
              icon="file-document-outline"
              mode="outlined"
              disabled={selectedIds.length === 0 || exportingEvidences}
              loading={exportingEvidences}
              onPress={() => setIsEvidencesReportModalVisible(true)} // Abre o modal
            >
              Gerar Laudo
            </Button>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma evidência encontrada.</Text>}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <EvidenceModal
        visible={isModalVisible}
        onDismiss={() => setIsModalVisible(false)}
        onSubmit={handleSubmit}
        initialData={editingEvidence}
      />
      <ReportContentModal
        visible={isEvidencesReportModalVisible}
        onDismiss={() => setIsEvidencesReportModalVisible(false)}
        onSubmit={handleExportEvidencesReport}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', padding: 16 },
  emptyText: { textAlign: 'center', marginTop: 50, color: 'gray' }
});

export default EvidenciasTab;