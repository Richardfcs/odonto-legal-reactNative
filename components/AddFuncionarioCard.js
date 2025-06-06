import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Button, Title, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const AddFuncionarioCard = () => {
  const navigation = useNavigation();

  const handleCreate = () => {
    navigation.navigate('AdminCreateFuncionario');
  };

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <Avatar.Icon size={80} icon="account-plus" style={styles.avatar} />
        <Title style={styles.name}>Novo Funcionário</Title>
      </Card.Content>
      <Card.Actions style={styles.actions}>
        <Button mode="contained" onPress={handleCreate} style={styles.button}>
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
    minHeight: 290, // Mesma altura mínima
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatar: {
    marginBottom: 12,
    backgroundColor: '#007bff',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  actions: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  button: {
    flex: 1,
  },
});

export default AddFuncionarioCard;