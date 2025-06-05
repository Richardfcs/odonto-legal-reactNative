import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CaseDetailCard({ caseData }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{caseData.name}</Text>
      <Text style={styles.description}>{caseData.description}</Text>

      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{caseData.status}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Local:</Text>
          <Text style={styles.value}>{caseData.location}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Data:</Text>
          <Text style={styles.value}>{caseData.date}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Hora:</Text>
          <Text style={styles.value}>{caseData.hour}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Categoria:</Text>
          <Text style={styles.value}>{caseData.category}</Text>
        </View>
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
    color: '#1e40af',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#334155',
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  infoItem: {
    width: '50%',
    marginBottom: 8,
  },
  label: {
    fontWeight: '600',
    color: '#1e293b',
  },
  value: {
    color: '#475569',
  },
});
