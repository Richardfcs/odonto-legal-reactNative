import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const victimsData = [
  {
    id: '68325e706b33623008c8a9be',
    name: 'Genivalda Soares',
    status: 'identificada',
    age: 59,
    gender: 'feminino',
  },
  {
    id: '683259756b33623008c8a9b4',
    name: 'Desconhecida',
    status: 'nao_identificada',
    age: 48,
    gender: 'desconhecido',
  },
  {
    id: '6831ea44f25ce47e57729eba',
    name: 'Desconhecida',
    status: 'nao_identificada',
    age: null,
    gender: 'feminino',
  },
];

export default function VictimsCard({ onAddVictim }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Vítimas Relacionadas ao Caso</Text>
        <TouchableOpacity style={styles.addButton} onPress={onAddVictim}>
          <Text style={styles.addButtonText}>+ Adicionar Vítima</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.victimsList}>
        {victimsData.map((victim) => (
          <TouchableOpacity
            key={victim.id}
            style={styles.victimCard}
            onPress={() => alert(`Detalhes da vítima: ${victim.name}`)}
          >
            <Text style={styles.victimName}>{victim.name}</Text>
            <Text style={styles.victimInfo}>
              Status: <Text style={styles.infoValue}>{victim.status}</Text>
            </Text>
            {victim.age !== null && (
              <Text style={styles.victimInfo}>
                Idade: <Text style={styles.infoValue}>{victim.age}</Text>
              </Text>
            )}
            <Text style={styles.victimInfo}>
              Gênero: <Text style={styles.infoValue}>{victim.gender}</Text>
            </Text>
          </TouchableOpacity>
        ))}
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
  header: {
    // flexDirection: 'row', // remover essa linha para ficar coluna (padrão)
    justifyContent: 'flex-start', // alinha ao topo/esquerda
    alignItems: 'flex-start', // para ficar alinhado à esquerda
    marginBottom: 16,
    gap: 8, // espaçamento vertical entre título e botão (RN 0.70+)
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  addButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  victimsList: {
    gap: 12, // espaçamento vertical entre vítimas (funciona RN 0.70+)
  },
  victimCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  victimName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 8,
  },
  victimInfo: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 4,
  },
  infoValue: {
    fontWeight: '500',
  },
});
