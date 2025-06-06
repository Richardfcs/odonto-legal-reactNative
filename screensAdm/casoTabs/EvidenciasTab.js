import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Button, ActivityIndicator, Text, Card, Title } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';

import EvidenceCard from '../../components/EvidenceCard';
import EvidenceModal from '../../components/EvidenceModal';

const API_URL = 'https://odonto-legal-backend.onrender.com';

const EvidenciasTab = ({ caseId }) => {
  const [evidences, setEvidences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEvidence, setEditingEvidence] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [evidencesWithLocation, setEvidencesWithLocation] = useState([]);

  const fetchEvidences = useCallback(async () => {
    // Não precisa de `setLoading(true)` aqui pois o `useFocusEffect` lida com isso
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/evidence/${caseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erro ao buscar evidências');
      
      const allEvidences = data.evidences || [];
      setEvidences(allEvidences);

      const geoEvidences = allEvidences.filter(e => 
        e.location && e.location.coordinates && e.location.coordinates.length === 2
      );
      setEvidencesWithLocation(geoEvidences);

    } catch (error) {
      Alert.alert("Erro", error.message);
    } finally {
      setLoading(false); // Garante que o loading termine mesmo em caso de erro
    }
  }, [caseId]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchEvidences();
    }, [fetchEvidences])
  );

  const handleOpenModal = (evidence = null) => {
    setEditingEvidence(evidence);
    setIsModalVisible(true);
  };

  const handleSubmit = async (formData) => {
    setLoading(true); // Mostra um indicador de loading geral
    const token = await AsyncStorage.getItem('token');
    const isEditing = !!editingEvidence;
    const url = isEditing ? `${API_URL}/api/evidence/${editingEvidence._id}` : `${API_URL}/api/evidence/${caseId}`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(formData)
        });
        const result = await res.json();
        if(!res.ok) throw new Error(result.message || 'Erro ao salvar evidência');
        
        Alert.alert("Sucesso", `Evidência ${isEditing ? 'atualizada' : 'adicionada'} com sucesso.`);
        setIsModalVisible(false);
        setEditingEvidence(null);
        await fetchEvidences(); // Recarrega os dados
    } catch (error) {
        Alert.alert("Erro", error.message);
        setLoading(false); // Garante que o loading pare em caso de erro
    }
  };

  const handleDelete = (evidenceId) => {
    Alert.alert("Confirmar Exclusão", "Tem certeza que deseja excluir esta evidência?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: 'destructive', onPress: async () => {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/api/evidence/${evidenceId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            const result = await res.json();
            if(!res.ok) throw new Error(result.message || 'Erro ao excluir');
            Alert.alert("Sucesso", "Evidência excluída.");
            await fetchEvidences(); // Recarrega a lista
        } catch (error) {
            Alert.alert("Erro", error.message);
            setLoading(false);
        }
      }},
    ]);
  };

  const handleSelect = (id) => {
    setSelectedIds(prev => 
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const renderMap = () => {
    if (evidencesWithLocation.length === 0) {
        return null;
    }
    const initialRegion = {
        latitude: evidencesWithLocation[0].location.coordinates[1],
        longitude: evidencesWithLocation[0].location.coordinates[0],
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
    };
    return (
        <Card style={styles.mapCard}>
            <Card.Content>
                <Title>Mapa de Evidências</Title>
                <MapView style={styles.map} initialRegion={initialRegion}>
                    {evidencesWithLocation.map(evidence => (
                        <Marker
                            key={evidence._id}
                            coordinate={{
                                latitude: evidence.location.coordinates[1],
                                longitude: evidence.location.coordinates[0],
                            }}
                            title={evidence.title}
                            description={evidence.description}
                        />
                    ))}
                </MapView>
            </Card.Content>
        </Card>
    );
  };

  if (loading) return <ActivityIndicator style={styles.centered} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={evidences}
        keyExtractor={item => item._id}
        ListHeaderComponent={
          <>
            {renderMap()}
            <View style={styles.buttonContainer}>
              <Button icon="plus" mode="contained" onPress={() => handleOpenModal(null)}>Adicionar Evidência</Button>
              <Button 
                icon="file-document-outline" 
                mode="outlined" 
                disabled={selectedIds.length === 0} 
                onPress={() => Alert.alert("Gerar Laudo", `Funcionalidade a ser implementada para os IDs: ${selectedIds.join(', ')}`)}
              >
                Laudo ({selectedIds.length})
              </Button>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <EvidenceCard 
            evidence={item} 
            onEdit={() => handleOpenModal(item)} 
            onDelete={() => handleDelete(item._id)}
            onSelect={() => handleSelect(item._id)}
            isSelected={selectedIds.includes(item._id)}
          />
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma evidência encontrada.</Text>}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <EvidenceModal 
        visible={isModalVisible} 
        onDismiss={() => {
            setIsModalVisible(false);
            setEditingEvidence(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingEvidence}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  centered: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  mapCard: { 
    marginHorizontal: 16, 
    marginTop: 16,
    elevation: 2
  },
  map: { 
    width: '100%', 
    height: 250, 
    borderRadius: 8 
  },
  buttonContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    padding: 16 
  },
  emptyText: { 
    textAlign: 'center', 
    marginTop: 50, 
    color: 'gray' 
  }
});

export default EvidenciasTab;