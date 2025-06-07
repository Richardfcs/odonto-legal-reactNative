import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Button, ActivityIndicator, Text, List, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const API_URL = 'https://odonto-legal-backend.onrender.com';

const VitimasUserTab = ({ caseId }) => {
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

  const handleNavigateToAddVictim = () => {
    navigation.navigate('UserCreateVictim', { caseId });
  };
  
  const handleNavigateToVictimDetails = (victimId) => {
    navigation.navigate('UserVictimDetails', { victimId, caseId });
  };
  
  if (loading) return <ActivityIndicator style={styles.centered} />;

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
        ListHeaderComponent={() => (
            <View style={styles.buttonContainer}>
                <Button icon="plus" mode="contained" onPress={handleNavigateToAddVictim}>
                  Adicionar Vítima
                </Button>
            </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma vítima encontrada para este caso.</Text>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  buttonContainer: { 
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  emptyText: { 
    textAlign: 'center', 
    marginTop: 50, 
    color: '#64748b'
  }
});

export default VitimasUserTab;