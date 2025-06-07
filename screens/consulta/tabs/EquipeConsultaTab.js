import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { ActivityIndicator, Text, List, Card, Title } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const API_URL = 'https://odonto-legal-backend.onrender.com';

const EquipeConsultaTab = ({ caseId }) => {
  const [team, setTeam] = useState([]);
  const [responsibleExpert, setResponsibleExpert] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchTeamData = async () => {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        try {
          const res = await fetch(`${API_URL}/api/case/${caseId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || 'Erro ao buscar dados da equipe');

          setTeam(data.team || []);
          setResponsibleExpert(data.responsibleExpert || null);
        } catch (error) {
          Alert.alert("Erro", error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchTeamData();
    }, [caseId])
  );
  
  if (loading) return <ActivityIndicator style={styles.centered} size="large" />;

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Equipe do Caso</Title>
          {responsibleExpert ? (
            <List.Item
              title={responsibleExpert.name}
              description="Perito Responsável"
              left={props => <List.Icon {...props} icon="account-star" />}
            />
          ) : (
            <Text style={styles.infoText}>Nenhum perito responsável definido.</Text>
          )}

          {team.length > 0 && (
            <List.Subheader>Membros da Equipe</List.Subheader>
          )}

          {team.map(member => (
            <List.Item
              key={member._id}
              title={member.name}
              description={member.role.charAt(0).toUpperCase() + member.role.slice(1)} // Capitaliza a role
              left={props => <List.Icon {...props} icon="account" />}
              // Sem o ícone de 'remover' à direita
            />
          ))}

          {team.length === 0 && responsibleExpert && (
            <Text style={styles.emptyText}>Nenhum membro adicional na equipe.</Text>
          )}

          {team.length === 0 && !responsibleExpert && (
             <Text style={styles.emptyText}>Nenhuma equipe definida para este caso.</Text>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f1f5f9' 
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: { 
    margin: 16, 
    backgroundColor: '#fff' 
  },
  infoText: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    fontStyle: 'italic',
    color: '#64748b'
  },
  emptyText: { 
    textAlign: 'center', 
    marginVertical: 20, 
    color: '#64748b',
    fontStyle: 'italic'
  }
});

export default EquipeConsultaTab;