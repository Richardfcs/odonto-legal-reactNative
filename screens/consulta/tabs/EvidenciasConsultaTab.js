import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { ActivityIndicator, Text, Card, Title } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';

import ConsultaEvidenceCard from '../../../components/ConsultaEvidenceCard'; // Importe o novo card

const API_URL = 'https://odonto-legal-backend.onrender.com';

const EvidenciasConsultaTab = ({ caseId }) => {
  const [evidences, setEvidences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [evidencesWithLocation, setEvidencesWithLocation] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchEvidences = async () => {
        setLoading(true);
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
          setLoading(false);
        }
      };
      fetchEvidences();
    }, [caseId])
  );

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
        ListHeaderComponent={renderMap} // O mapa ainda é útil para consulta
        renderItem={({ item }) => (
          <ConsultaEvidenceCard evidence={item} />
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma evidência encontrada para este caso.</Text>}
        contentContainerStyle={styles.listContent}
      />
    </View>
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
  mapCard: { 
    marginHorizontal: 16, 
    marginTop: 16,
    elevation: 2,
    backgroundColor: '#fff'
  },
  map: { 
    width: '100%', 
    height: 250, 
    borderRadius: 8 
  },
  listContent: {
      paddingBottom: 20
  },
  emptyText: { 
    textAlign: 'center', 
    marginTop: 50, 
    color: '#64748b' 
  }
});

export default EvidenciasConsultaTab;