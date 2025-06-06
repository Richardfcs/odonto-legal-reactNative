import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Button, Title, Paragraph, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const CaseCard = ({ caseData }) => {
  const navigation = useNavigation();

  const handleViewDetails = () => {
    navigation.navigate('AdminCaseDetails', { caseId: caseData._id });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'finalizado':
        return '#4CAF50'; // Verde
      case 'em andamento':
        return '#FFC107'; // Amarelo
      case 'arquivado':
        return '#9E9E9E'; // Cinza
      default:
        return '#2196F3'; // Azul padrão
    }
  };

  return (
    <Card style={styles.card}>
      {/* O conteúdo principal agora é flexível para ocupar o espaço */}
      <Card.Content style={styles.content}>
        <Title style={styles.cardTitle} numberOfLines={2}>{caseData.nameCase}</Title>
        <Paragraph style={styles.expertName} numberOfLines={1}>
          {caseData.responsibleExpert?.name || 'Perito não atribuído'}
        </Paragraph>
        <Text style={styles.infoText} numberOfLines={1}>Local: {caseData.location}</Text>
      </Card.Content>

      {/* A área de ações agora contém o status e o botão, fixos na parte inferior */}
      <Card.Actions style={styles.actionsContainer}>
        <Text 
          style={[styles.statusText, { backgroundColor: getStatusColor(caseData.status) }]}
        >
          {caseData.status}
        </Text>
        <Button mode="contained" onPress={handleViewDetails}>
          Visualizar
        </Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    flex: 1,
    minWidth: 160,
    minHeight: 230, // Garante altura mínima padrão para todos os cards
    flexDirection: 'column', // Organiza o conteúdo verticalmente
    justifyContent: 'space-between', // Empurra o conteúdo para cima e as ações para baixo
  },
  content: {
    // Não precisa de estilo específico, pois o 'space-between' do card já o posiciona
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  expertName: {
    fontSize: 14,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: 'column', // Empilha o status e o botão verticalmente
    alignItems: 'center', // Centraliza o status e o botão
    paddingBottom: 16,
    paddingTop: 8,
  },
  statusText: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    overflow: 'hidden',
    marginBottom: 12, // Espaço entre o status e o botão
  },
});

export default CaseCard;