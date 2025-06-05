import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Platform } from 'react-native';
import { Checkbox } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EditEvidenceCard from './EditEvidenceCard'; // 🔁 Importe corretamente

export default function EvidenceCardContainer() {
  const [evidences, setEvidences] = useState([
    {
      _id: '682d189082195005bfdfb672',
      title: 'Radiografia Periapical',
      type: 'image',
      description: 'Imagem da região anterior superior',
      category: 'dados_ante_mortem',
      collectedBy: 'Dr. Ana Silva',
      checked: false,
    },
    {
      _id: '682cda9695aefabb01f959e4',
      title: 'Descrição da Fratura',
      type: 'text_description',
      description: 'Fratura observada no incisivo central superior esquerdo',
      category: 'dados_post_mortem',
      collectedBy: 'Bruno Silva',
      checked: false,
    },
    {
      _id: '680110ff2fb9ddac47433efd',
      title: 'Prótese Parcial',
      type: 'image',
      description: 'Prótese removível superior com grampos metálicos',
      category: 'dados_post_mortem',
      collectedBy: 'Dr. Ana Silva',
      checked: false,
    },
    {
      _id: '67fc5f3688e4e879e5a581b6',
      title: 'Cadáver desfigurado',
      type: 'text_description',
      description: 'Paciente encontrado próximo ao rio, sem documentos',
      category: 'dados_post_mortem',
      collectedBy: 'Dr. Ana Silva',
      checked: false,
    },
  ]);

  const [editingEvidence, setEditingEvidence] = useState(null);

  const onDeletePress = (id) => {
    setEvidences((prev) => prev.filter((e) => e._id !== id));
  };

  const toggleCheckbox = (id) => {
    setEvidences((prev) =>
      prev.map((e) =>
        e._id === id ? { ...e, checked: !e.checked } : e
      )
    );
  };

  const handleSave = (updated) => {
    setEvidences((prev) =>
      prev.map((e) =>
        e._id === updated._id
          ? { ...e, ...updated }
          : e
      )
    );
    setEditingEvidence(null); // Fecha o editor
  };

  const renderCard = (evidence) => (
    <View key={evidence._id} style={styles.innerCard}>
      <View style={styles.topRightButtons}>
        <TouchableOpacity
          onPress={() => setEditingEvidence(evidence)}
          style={styles.iconButton}
        >
          <MaterialCommunityIcons name="pencil" size={20} color="#2563eb" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDeletePress(evidence._id)}
          style={styles.iconButton}
        >
          <MaterialCommunityIcons name="trash-can" size={20} color="#dc2626" />
        </TouchableOpacity>
        <Checkbox
          status={evidence.checked ? 'checked' : 'unchecked'}
          onPress={() => toggleCheckbox(evidence._id)}
          color="#2563eb"
          style={{ marginLeft: 8 }}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.heading}>{evidence.title}</Text>
        <Text><Text style={styles.label}>Tipo: </Text>{evidence.type}</Text>
        <Text><Text style={styles.label}>Descrição: </Text>{evidence.description}</Text>
        <Text><Text style={styles.label}>Categoria: </Text>{evidence.category}</Text>
        <Text><Text style={styles.label}>Coletado por: </Text>{evidence.collectedBy}</Text>

        {evidence.type === 'image' && (
          <View style={styles.imageContainer}>
            <Image
              source={
                evidence.imageUri
                  ? { uri: evidence.imageUri }
                  : require('../img/pioneers.png')
              }
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        )}

        {evidence.type === 'text_description' && (
          <View style={styles.preContainer}>
            <Text style={styles.preText}>
              {evidence.dataText || 'Sem dados adicionais.'}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.outerCard}>
        <Text style={styles.outerCardTitle}>Evidências Relacionadas</Text>
        {evidences.map(renderCard)}
      </View>

      {editingEvidence && (
        <EditEvidenceCard
          evidence={editingEvidence}
          onCancel={() => setEditingEvidence(null)}
          onSave={handleSave}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f3f4f6',
  },
  outerCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 26,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 20,
  },
  outerCardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: 16,
  },
  innerCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 16,
  },
  topRightButtons: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 6,
    marginHorizontal: 4,
  },
  content: {
    paddingTop: 32,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 8,
  },
  label: {
    fontWeight: '700',
  },
  preContainer: {
    backgroundColor: '#e5e7eb',
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  preText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  imageContainer: {
    marginTop: 12,
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 12,
    width: 200,
    height: 100,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    resizeMode: 'cover',
  },
});
