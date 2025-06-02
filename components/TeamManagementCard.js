import React from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';

export default function TeamManagementCard() {
  const teamMembers = [
    { name: 'Dr. Ana Silva', role: 'Perito Responsável', type: 'admin', canRemove: false },
    { name: 'Bruno Silva', role: 'Assistente', type: 'assistente', canRemove: true },
    { name: 'Dr Marcos Oliveira', role: 'Perito', type: 'perito', canRemove: true },
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Equipe do Caso</Text>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Membros Atuais:</Text>
        {teamMembers.map((member, index) => (
          <View key={index} style={styles.memberRow}>
            <Text style={styles.memberText}>
              {member.name} (<Text style={styles.italic}>{member.type}</Text>)
              {member.role ? ` - ${member.role}` : ''}
            </Text>
            {member.canRemove && (
              <TouchableOpacity style={styles.removeButton}>
                <Text style={styles.removeButtonText}>Remover</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      {/* Formulário visível apenas para admin/responsável */}
      <View style={styles.formContainer}>
        <Text style={styles.subtitle}>Adicionar Membro à Equipe</Text>

        <Text style={styles.label}>Buscar Usuário (Perito/Assistente) por Nome ou CRO:</Text>
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Digite nome ou CRO"
          />
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Buscar</Text>
          </TouchableOpacity>
        </View>

        {/* Resultados da busca */}
        <ScrollView style={styles.resultsContainer}>
          {/* Resultados dinâmicos aqui */}
        </ScrollView>

        <TouchableOpacity style={styles.submitButton} disabled={true}>
          <Text style={styles.submitButtonText}>Adicionar Usuário Selecionado à Equipe</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    width: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e3a8a',
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 8,
  },
  memberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  memberText: {
    color: '#374151',
  },
  italic: {
    fontStyle: 'italic',
  },
  removeButton: {
    borderColor: '#fca5a5',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  removeButtonText: {
    fontSize: 12,
    color: '#b91c1c',
  },
  formContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16,
    marginTop: 16,
  },
  label: {
    fontSize: 14,
    color: '#4b5563',
  },
  searchRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  searchButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  resultsContainer: {
    marginTop: 8,
    maxHeight: 150,
  },
  submitButton: {
    marginTop: 12,
    backgroundColor: '#22c55e',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    opacity: 0.5, // desativado por padrão
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
