import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function CaseActionsCard({
  onAddEvidence,
  onGenerateSelectedReport,
  onExportReport,
  onEditCase,
  onDeleteCase,
  disableGenerateSelected = false,
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Ações do Caso</Text>
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.green} onPress={onAddEvidence}>
          <Text style={styles.buttonText}>Adicionar Evidência</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.purple, disableGenerateSelected && styles.disabled]}
          onPress={onGenerateSelectedReport}
          disabled={disableGenerateSelected}
        >
          <Text style={styles.buttonText}>Gerar Laudo para Evidências Selecionadas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.blue} onPress={onExportReport}>
          <Text style={styles.buttonText}>Exportar Laudo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.yellow} onPress={onEditCase}>
          <Text style={styles.buttonText}>Editar Caso</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.red} onPress={onDeleteCase}>
          <Text style={styles.buttonText}>Deletar Caso</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginVertical: 12,
    width: '90%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonGroup: {
    gap: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  green: {
    backgroundColor: '#22c55e',
    borderRadius: 8,
  },
  purple: {
    backgroundColor: '#a855f7',
    borderRadius: 8,
  },
  blue: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
  },
  yellow: {
    backgroundColor: '#facc15',
    borderRadius: 8,
  },
  red: {
    backgroundColor: '#ef4444',
    borderRadius: 8,
  },
  disabled: {
    opacity: 0.5,
  },
});
