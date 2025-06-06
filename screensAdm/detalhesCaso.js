import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Title, Paragraph, ActivityIndicator, Button, Portal, Menu, Appbar, Divider, Provider as PaperProvider, Dialog, Button as PaperButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CasoTabNavigator from '../navigators/CasoTabNavigator'; // Importa nosso navegador de abas
import * as FileSystem from 'expo-file-system'; // Import FileSystem
import * as Sharing from 'expo-sharing'; // Import Sharing
import ReportContentModal from '../components/ReportContentModal';

const API_URL = 'https://odonto-legal-backend.onrender.com';

const DetalhesCasoScreen = ({ route, navigation }) => {
  const { caseId } = route.params;

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [exporting, setExporting] = useState(false);

  const loadCaseData = useCallback(async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/case/${caseId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erro ao carregar o caso');
      setCaseData(data);
    } catch (error) {
      Alert.alert("Erro", error.message);
    } finally {
      setLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    loadCaseData();
  }, [loadCaseData]);

  // Adiciona o menu de opções no header da tela
  useLayoutEffect(() => {
    // Só executa a configuração do header DEPOIS que caseData tiver um valor
    if (caseData) {
      navigation.setOptions({
        title: caseData.nameCase, // Agora é seguro acessar .nameCase
        headerRight: () => (
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={<Appbar.Action icon="dots-vertical" color="black" onPress={() => setMenuVisible(true)} />}
          >
            <Menu.Item
              onPress={() => {
                navigation.navigate('AdminEditCase', { caseId: caseData._id });
                setMenuVisible(false);
              }}
              title="Editar Caso"
            />
            <Menu.Item
              onPress={() => {
                setDeleteDialogVisible(true);
                setMenuVisible(false);
              }}
              title="Excluir Caso"
              titleStyle={{ color: 'red' }}
            />
            <Divider />
            <Menu.Item 
                onPress={() => { setIsReportModalVisible(true); setMenuVisible(false); }} 
                title="Exportar Laudo do Caso"
                disabled={exporting}
            />
          </Menu>
        ),
      });
    }
  }, [navigation, menuVisible, caseData, exporting]);

  const handleDeleteCase = async () => {
    setDeleteDialogVisible(false);
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/case/${caseId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Erro ao excluir caso');
      Alert.alert("Sucesso", "Caso excluído com sucesso!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", error.message);
    }
  };

  const handleExportCaseReport = async (reportContent) => {
    setExporting(true);
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/api/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ caseId, content: reportContent })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Erro ao gerar laudo.");

      const filename = `Laudo_${caseData.nameCase.replace(/\s/g, '_')}_${result.reportId.slice(-6)}.pdf`;
      const fileUri = FileSystem.documentDirectory + filename;

      const { uri } = await FileSystem.downloadAsync(result.pdfUrl, fileUri);

      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Compartilhar Laudo' });

    } catch (error) {
      Alert.alert("Erro de Exportação", error.message);
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" style={styles.centered} />;
  if (!caseData) return <View style={styles.centered}><Title>Caso não encontrado</Title></View>;

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        <Card style={styles.headerCard}>
          <Card.Content>
            <Title>{caseData.nameCase}</Title>
            <Paragraph>{caseData.Description}</Paragraph>
            <Divider style={styles.divider} />
            <View style={styles.detailsRow}>
              <Paragraph><Title style={styles.detailTitle}>Status:</Title> {caseData.status} </Paragraph>
              <Paragraph><Title style={styles.detailTitle}>Local:</Title> {caseData.location} </Paragraph>
            </View>
          </Card.Content>
        </Card>
        <CasoTabNavigator caseId={caseId} />

        <Portal>
          <ReportContentModal
            visible={isReportModalVisible}
            onDismiss={() => setIsReportModalVisible(false)}
            onSubmit={handleExportCaseReport}
          />
          <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
            <Dialog.Title>Confirmar Exclusão do Caso</Dialog.Title>
            <Dialog.Content>
              <Paragraph>Tem certeza que deseja excluir "{caseData.nameCase}"? Todas as suas evidências, vítimas e dados associados serão perdidos permanentemente.</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <PaperButton onPress={() => setDeleteDialogVisible(false)}>Cancelar</PaperButton>
              <PaperButton onPress={handleDeleteCase} labelStyle={{ color: 'red' }}>Excluir</PaperButton>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerCard: { margin: 8, elevation: 2 },
  divider: { marginVertical: 8 },
  detailsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  detailTitle: { fontSize: 16 }
});

export default DetalhesCasoScreen;