import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Alert, Platform } from 'react-native';
import { Button, ActivityIndicator, Text, Card, Title, Menu, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://odonto-legal-backend.onrender.com';

const AnaliseIATab = ({ caseId }) => {
  // Ações de IA disponíveis
  const aiActions = [
    { key: 'summarize', label: 'Resumir Evidências Textuais' },
    { key: 'hypothesize', label: 'Gerar Hipóteses Iniciais' },
    { key: 'check_inconsistencies', label: 'Verificar Inconsistências Potenciais' },
  ];

  const [selectedAction, setSelectedAction] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');

  const handleAnalyze = async () => {
    if (!selectedAction) {
      Alert.alert("Atenção", "Por favor, selecione um tipo de análise.");
      return;
    }

    setLoading(true);
    setAnalysisResult('');
    const token = await AsyncStorage.getItem('token');

    try {
      const response = await fetch(`${API_URL}/api/case/${caseId}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ action: selectedAction.key }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || result.message || "Erro na análise da IA.");
      }

      setAnalysisResult(result.analysis || "Nenhuma análise retornada.");

    } catch (error) {
      setAnalysisResult(`Erro ao realizar análise: ${error.message}`);
      Alert.alert("Erro na Análise", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Análise com Inteligência Artificial</Title>
          <Text style={styles.description}>
            Use a IA para auxiliar na análise das evidências. Os resultados são sugestões e devem ser verificados por um perito.
          </Text>

          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button 
                mode="outlined" 
                onPress={() => setMenuVisible(true)}
                style={styles.menuButton}
              >
                {selectedAction ? selectedAction.label : 'Selecione uma Ação de IA'}
              </Button>
            }
          >
            {aiActions.map(action => (
              <Menu.Item
                key={action.key}
                onPress={() => {
                  setSelectedAction(action);
                  setMenuVisible(false);
                }}
                title={action.label}
              />
            ))}
          </Menu>

          <Button
            mode="contained"
            icon="brain"
            onPress={handleAnalyze}
            loading={loading}
            disabled={!selectedAction || loading}
            style={styles.analyzeButton}
          >
            Analisar com IA
          </Button>
        </Card.Content>
      </Card>

      {(loading || analysisResult) && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Resultado da Análise</Title>
            <Divider />
            {loading ? (
              <ActivityIndicator style={styles.resultArea} />
            ) : (
              // A MUDANÇA ESTÁ AQUI
              <Text style={styles.resultArea} selectable={true}>
                {analysisResult}
              </Text>
            )}
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  card: { 
    margin: 16 
  },
  description: {
    marginVertical: 8,
    color: 'gray',
    fontSize: 14,
  },
  menuButton: {
    marginTop: 10,
  },
  analyzeButton: {
    marginTop: 16,
  },
  resultArea: {
    marginTop: 16,
    minHeight: 100,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    // A fonte monoespaçada é ótima para exibir texto de código ou IA
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  }
});

export default AnaliseIATab;