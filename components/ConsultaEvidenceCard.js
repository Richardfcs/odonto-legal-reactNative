import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Card, Title, Paragraph, Text } from 'react-native-paper';

const ConsultaEvidenceCard = ({ evidence }) => {
  const formatTimestamp = (isoString) => {
    if (!isoString) return 'Data inválida';
    try { return new Date(isoString).toLocaleDateString('pt-BR'); } catch (e) { return 'Data inválida'; }
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>{evidence.title}</Title>
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
            <Text style={styles.detailText}><Text style={styles.detailLabel}>Tipo:</Text> {evidence.evidenceType}</Text>
            <Text style={styles.detailText}><Text style={styles.detailLabel}>Categoria:</Text> {evidence.category || 'N/A'}</Text>
            <Text style={styles.detailText}><Text style={styles.detailLabel}>Coletado por:</Text> {evidence.collectedBy?.name || 'N/A'}</Text>
            <Text style={styles.detailText}><Text style={styles.detailLabel}>Data:</Text> {formatTimestamp(evidence.createdAt)}</Text>
        </View>
      </Card.Content>
      {/* SEM Card.Actions, pois é somente leitura */}
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 8,
  },
  description: {
      marginBottom: 8,
      color: '#475569',
      fontStyle: 'italic'
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
       maxHeight: 100, // Previne que textos muito longos ocupem a tela toda
   },
   dataText: {
       fontSize: 13,
       color: '#333',
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
  detailLabel: {
      fontWeight: 'bold',
      color: '#334155'
  }
});

export default ConsultaEvidenceCard;