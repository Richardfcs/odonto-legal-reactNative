// components/CaseCard.js
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function caseCards({ titulo, descricao, status, data, onPress }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{titulo}</Text>
      <Text style={styles.description}>{descricao}</Text>
      <Text style={styles.status}>Status: {status}</Text>
      <Text style={styles.date}>Data: {new Date(data).toLocaleDateString()}</Text>
      <Button title="Visualizar" onPress={onPress} color="#2563eb" />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  description: {
    marginBottom: 6,
  },
  status: {
    fontStyle: 'italic',
    marginBottom: 6,
  },
  date: {
    marginBottom: 10,
  },
});
