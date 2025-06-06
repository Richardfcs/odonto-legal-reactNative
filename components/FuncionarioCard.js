import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Button, Title, Paragraph, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const FuncionarioCard = ({ funcionario }) => {
  const navigation = useNavigation();

  const handleManage = () => {
    navigation.navigate('AdminManagePermissions', { funcionarioId: funcionario._id });
  };

  const getRoleText = (role) => {
    if (role === 'admin') return 'Administrador';
    if (role === 'perito') return 'Perito';
    return 'Assistente';
  };

  const photoUri = funcionario.photo 
    ? `data:image/png;base64,${funcionario.photo}` 
    : null;

  return (
    <Card style={styles.card}>
      {/* Conteúdo principal ocupa o espaço disponível */}
      <Card.Content style={styles.content}>
        <Avatar.Image 
          size={80} 
          source={photoUri ? { uri: photoUri } : require('../assets/default_icon.png')}
          style={styles.avatar}
        />
        <Title style={styles.name} numberOfLines={2}>{funcionario.name || 'Nome não informado'}</Title>
        <Paragraph style={styles.email} numberOfLines={1}>{funcionario.email || 'Email não informado'}</Paragraph>
        <Paragraph style={styles.role}>{getRoleText(funcionario.role)}</Paragraph>
      </Card.Content>
      {/* Botão de ação fica fixo na parte inferior */}
      <Card.Actions style={styles.actions}>
        <Button mode="contained" onPress={handleManage} style={styles.button}>
          Gerenciar
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
    minHeight: 290, // Altura mínima consistente
    justifyContent: 'space-between', // Chave para empurrar ações para baixo
  },
  content: {
    alignItems: 'center',
    paddingTop: 16,
  },
  avatar: {
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  email: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  role: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  actions: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  button: {
    flex: 1, // Faz o botão esticar
  }
});

export default FuncionarioCard;