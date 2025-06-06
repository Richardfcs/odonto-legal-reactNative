import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Title, Paragraph, ActivityIndicator, Button, Portal, Menu, Appbar, Divider, Provider as PaperProvider, Dialog } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CasoTabNavigator from '../navigators/CasoTabNavigator'; // Importa nosso navegador de abas

const API_URL = 'https://odonto-legal-backend.onrender.com';

const DetalhesCasoScreen = ({ route, navigation }) => {
  const { caseId } = route.params;

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

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
    navigation.setOptions({
      headerRight: () => (
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={<Appbar.Action icon="dots-vertical" onPress={() => setMenuVisible(true)} />}
        >
          <Menu.Item onPress={() => { /* Navegar para tela de edição */ setMenuVisible(false); }} title="Editar Caso" />
          <Menu.Item onPress={() => { setDeleteDialogVisible(true); setMenuVisible(false); }} title="Excluir Caso" />
          <Menu.Item onPress={() => { /* Lógica de exportar */ setMenuVisible(false); }} title="Exportar Relatório" />
        </Menu>
      ),
    });
  }, [navigation, menuVisible]);

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
                        <Paragraph><Title style={styles.detailTitle}>Status:</Title> {caseData.status } </Paragraph>
                        <Paragraph><Title style={styles.detailTitle}>Local:</Title> {caseData.location } </Paragraph>
                    </View>
                </Card.Content>
            </Card>

            {/* Renderiza o navegador de abas */}
            <CasoTabNavigator caseId={caseId} />

            {/* Diálogo de Exclusão do Caso */}
            <Portal>
                <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
                    <Dialog.Title>Confirmar Exclusão</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>Tem certeza que deseja excluir este caso e todas as suas evidências, vítimas e dados associados? Esta ação é irreversível.</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setDeleteDialogVisible(false)}>Cancelar</Button>
                        <Button onPress={handleDeleteCase} labelStyle={{ color: 'red' }}>Excluir</Button>
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