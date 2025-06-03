import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';  // IMPORT CORRETO DO PICKER

export default function AIAnalysisCard() {
  const [selectedAction, setSelectedAction] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  function handleAnalyze() {
    if (!selectedAction) return;
    setLoading(true);
    setResult('');
    // Simulação de análise com IA (aqui você conecta sua API real)
    setTimeout(() => {
      setLoading(false);
      setResult(`Resultado simulado para ação: ${selectedAction}`);
    }, 2000);
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Análise com IA (Experimental)</Text>
      <Text style={styles.description}>
        Use IA para auxiliar na análise das evidências textuais. Os resultados são sugestões e DEVEM ser verificados por um perito.
      </Text>

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Tipo de Análise:</Text>
        <Picker
          selectedValue={selectedAction}
          onValueChange={(itemValue) => setSelectedAction(itemValue)}
          style={styles.picker}
          mode="dropdown"
        >
          <Picker.Item label="Selecione uma ação..." value="" />
          <Picker.Item label="Resumir Evidências Textuais" value="summarize" />
          {/* <Picker.Item label="Comparar Duas Evidências" value="compare" /> */}
          <Picker.Item label="Gerar Hipóteses Iniciais" value="hypothesize" />
          <Picker.Item label="Verificar Inconsistências Potenciais" value="check_inconsistencies" />
        </Picker>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Analisar com IA"
          onPress={handleAnalyze}
          disabled={!selectedAction || loading}
          color="#4F46E5"
        />
      </View>

      <View style={styles.resultArea}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#4F46E5" />
            <Text style={styles.loadingText}>Analisando...</Text>
          </View>
        ) : (
          <ScrollView>
            <Text style={styles.resultText}>{result}</Text>
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    width: '90%',
    marginTop: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 16,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  label: {
    color: '#1E40AF',
    fontWeight: '600',
    marginBottom: 6,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  resultArea: {
    minHeight: 100,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    padding: 12,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: 8,
    color: '#6B7280',
  },
  resultText: {
    color: '#374151',
    fontSize: 14,
  },
});
