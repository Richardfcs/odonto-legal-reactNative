import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { ActivityIndicator, Text, List, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const API_URL = 'https://odonto-legal-backend.onrender.com';

const VitimasConsultaTab = ({ caseId }) => {
  const navigation = useNavigation();
  const [victims, setVictims] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchVictims = async () => {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        try {
          const res = await fetch(`${API_URL}/api/case/${caseId}/victims`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || 'Erro ao buscar vítimas');
          
          const victimsArray = Array.isArray(data) ? data : data.victims;
          setVictims(victimsArray || []);
        } catch (error) {
          Alert.alert("Erro", error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchVictims();
    }, [caseId])
  );
  
  const handleNavigateToVictimDetails = (victimId) => {
    // Navega para uma nova rota de detalhes específica para consulta
    navigation.navigate('ConsultaVictimDetails', { victimId, caseId });
  };
  
  if (loading) return <ActivityIndicator style={styles.centered} size="large" />;

  return (
    <View style={styles.container}>
      <FlatList
        data={victims}
        keyExtractor={item => item._id}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({ item }) => (
          <List.Item
            title={item.name || item.victimCode || 'Vítima Desconhecida'}
            description={`Status: ${item.identificationStatus || 'N/A'}`}
            left={props => <List.Icon {...props} icon="account-outline" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => handleNavigateToVictimDetails(item._id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma vítima encontrada para este caso.</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
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
  emptyContainer: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center'
  },
  emptyText: { 
    textAlign: 'center', 
    fontSize: 16,
    color: '#64748b' 
  }
});

export default VitimasConsultaTab;