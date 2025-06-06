import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Button, Title, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const AddCaseCard = () => {
  const navigation = useNavigation();

  const handleCreateCase = () => {
    navigation.navigate('AdminCreateCase');
  };

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <Title style={styles.cardTitle}>Novo Caso</Title>
        <Avatar.Icon size={64} icon="plus" style={styles.icon} />
      </Card.Content>
      <Card.Actions style={styles.actionsContainer}>
        <Button mode="contained" onPress={handleCreateCase} style={styles.button}>
          Cadastrar
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
    minHeight: 230, // Mesma altura mínima para consistência
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1, // Faz o conteúdo ocupar o espaço disponível
    justifyContent: 'center', // Centraliza o título e o ícone verticalmente
    alignItems: 'center', // Centraliza horizontalmente
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  icon: {
    backgroundColor: '#007bff',
  },
  actionsContainer: {
    justifyContent: 'center', // Centraliza o título e o ícone verticalmente
  },
  button: {
    alignSelf: 'stretch', // Faz o botão ocupar a largura disponível na área de ações
  },
});

export default AddCaseCard;