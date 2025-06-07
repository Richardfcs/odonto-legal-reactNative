import React from 'react';
import { View, StyleSheet, Image, Platform } from 'react-native';
import { Card, Title, Paragraph, Button, Checkbox, IconButton, Text } from 'react-native-paper';

const UserEvidenceCard = ({ evidence, onEdit, onDelete, onSelect, isSelected }) => {
  const formatTimestamp = (isoString) => {
    if (!isoString) return 'Data inválida';
    try { return new Date(isoString).toLocaleDateString('pt-BR'); } catch (e) { return 'Data inválida'; }
  };

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <View style={styles.header}>
            <Title style={styles.title}>{evidence.title}</Title>
            <Checkbox.Android status={isSelected ? 'checked' : 'unchecked'} onPress={onSelect} />
        </View>
        <Paragraph style={styles.description}>
            {evidence.description || 'Sem descrição.'}
        </Paragraph>
        
        {evidence.evidenceType === 'image' && evidence.data && (
            <Image source={{ uri: evidence.data }} style={styles.evidenceImage} />
        )}
        {evidence.evidenceType !== 'image' && evidence.data && (
             <View style={styles.dataContainer}>
                <Text style={styles.dataText}>{evidence.data}</Text>
            </View>
        )}

        <View style={styles.details}>
            <Text style={styles.detailText}>Tipo: {evidence.evidenceType}</Text>
            <Text style={styles.detailText}>Categoria: {evidence.category || 'N/A'}</Text>
            <Text style={styles.detailText}>Coletado em: {formatTimestamp(evidence.createdAt)}</Text>
        </View>

      </Card.Content>
      <Card.Actions style={styles.actions}>
        <Button mode="outlined" onPress={onEdit}>Editar</Button>
        <Button mode="outlined" onPress={onDelete} style={styles.deleteButton}>Excluir</Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
    backgroundColor: '#fff'
  },
  content: {
    paddingBottom: 0, // Remove padding inferior para melhor espaçamento com actions
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1, // Permite que o título ocupe espaço
    marginRight: 8,
    color: '#1e40af'
  },
  description: {
      marginBottom: 8,
      color: '#475569'
  },
  evidenceImage: {
      width: '100%',
      height: 200,
      resizeMode: 'contain',
      marginVertical: 8,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: '#eee'
  },
   dataContainer: {
       backgroundColor: '#f8fafc',
       padding: 8,
       borderRadius: 4,
       marginVertical: 8,
   },
   dataText: {
       fontSize: 13,
       color: '#333',
        fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
   },
  details: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  detailText: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 4,
  },
  actions: {
    justifyContent: 'flex-end',
    paddingTop: 0,
  },
   deleteButton: {
       marginLeft: 8, // Espaço entre botões
       borderColor: '#ef4444', // Vermelho
   }
});

export default UserEvidenceCard;