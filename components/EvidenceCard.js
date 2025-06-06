import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Card, Title, Paragraph, IconButton, Checkbox } from 'react-native-paper';

// Usamos React.memo para otimizar a performance da FlatList
const EvidenceCard = React.memo(({ evidence, onEdit, onDelete, onSelect, isSelected }) => {

  const renderDataContent = () => {
    if (evidence.evidenceType === 'image' && evidence.data?.startsWith('data:image')) {
      return <Image source={{ uri: evidence.data }} style={styles.evidenceImage} resizeMode="contain" />;
    }
    // Para odontograma ou texto, usamos um <Paragraph> dentro de uma View estilizada
    return (
      <View style={styles.dataContainer}>
        <Paragraph style={styles.dataText}>{evidence.data || 'Sem dados.'}</Paragraph>
      </View>
    );
  };

  return (
    <Card style={styles.card}>
      <Card.Title
        title={evidence.title}
        subtitle={`Tipo: ${evidence.evidenceType} | Categoria: ${evidence.category || 'N/A'}`}
        titleNumberOfLines={2}
        right={() => (
          <View style={styles.actionsHeader}>
            <Checkbox.Android status={isSelected ? 'checked' : 'unchecked'} onPress={() => onSelect(evidence._id)} />
            <IconButton icon="pencil" size={20} onPress={() => onEdit(evidence)} />
            <IconButton icon="delete" size={20} onPress={() => onDelete(evidence._id)} />
          </View>
        )}
      />
      <Card.Content>
        <Paragraph>{evidence.description}</Paragraph>
        {renderDataContent()}
        <Paragraph style={styles.collectorText}>Coletado por: {evidence.collectedBy?.name || 'Não informado'}</Paragraph>
      </Card.Content>
    </Card>
  );
});

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  actionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  evidenceImage: {
    height: 200,
    marginTop: 10,
    borderRadius: 8,
  },
  dataContainer: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    marginTop: 10,
    borderRadius: 4,
  },
  dataText: {
    fontFamily: 'monospace',
  },
  collectorText: {
    fontSize: 12,
    color: 'gray',
    marginTop: 10,
    textAlign: 'right',
  },
});

export default EvidenceCard;