// components/ConsultaCaseInfoCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ConsultaCaseInfoCard({ caseData }) {
  const {
    name = 'Nome não informado',
    description = 'Descrição não informada',
    status = 'Não informado',
    location = 'Não informado',
    date = 'Não informada',
    hour = 'Não informada',
    category = 'outros',
  } = caseData;

  return (
    <View style={styles.card}>
      <Text style={styles.caseName}>{name}</Text>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.grid}>
        <View style={styles.item}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{status}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Local:</Text>
          <Text style={styles.value}>{location}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Data:</Text>
          <Text style={styles.value}>{date}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Hora:</Text>
          <Text style={styles.value}>{hour}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Categoria:</Text>
          <Text style={styles.value}>{category}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 30,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  caseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a', // text-blue-900
    marginBottom: 8,
  },
  description: {
    color: '#1f2937', // text-gray-800
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  item: {
    width: '48%',
    marginBottom: 12,
  },
  label: {
    fontWeight: '600',
    color: '#111827', // text-gray-900
  },
  value: {
    color: '#374151', // text-gray-700
  },
});
