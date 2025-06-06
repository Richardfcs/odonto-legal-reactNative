import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { Searchbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import FuncionarioCard from '../components/FuncionarioCard';
import AddFuncionarioCard from '../components/AddFuncionarioCard';

const API_URL = 'https://odonto-legal-backend.onrender.com';

const GerenciarFuncionariosScreen = () => {
  const navigation = useNavigation();
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Função centralizada para buscar funcionários
  const fetchFuncionarios = async (query = '') => {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    
    // Define a URL baseada na existência de uma query de busca
    let url = query
      ? `${API_URL}/api/user/search?name=${encodeURIComponent(query)}`
      : `${API_URL}/api/user`;

    try {
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();

      if (response.ok) {
        setFuncionarios(Array.isArray(data) ? data : []);
      } else {
        if (response.status === 404) {
          setFuncionarios([]);
          if (query) Alert.alert('Não encontrado', `Nenhum funcionário encontrado com o nome "${query}".`);
        } else {
          throw new Error(data.message || 'Erro ao buscar funcionários');
        }
      }
    } catch (error) {
      console.error("Erro ao buscar funcionários:", error);
      Alert.alert("Erro", "Não foi possível carregar os funcionários.");
    } finally {
      setLoading(false);
    }
  };

  // Carrega a lista inicial de funcionários apenas uma vez, quando o componente é montado
  useEffect(() => {
    fetchFuncionarios();
  }, []);

  // Função para lidar com a submissão da busca
  const handleSearchSubmit = () => {
    fetchFuncionarios(searchQuery);
  };

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" style={styles.loader} />;
    }
    
    const dataWithAddCard = [...funcionarios, { _id: 'add_new_placeholder' }];

    return (
      <FlatList
        data={dataWithAddCard}
        keyExtractor={(item) => item._id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => {
          if (item._id === 'add_new_placeholder') {
            return <AddFuncionarioCard />;
          }
          return <FuncionarioCard funcionario={item} />;
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <AddFuncionarioCard />
          </View>
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Pesquisar por nome..."
          onChangeText={setSearchQuery} // Apenas atualiza o estado, não busca
          value={searchQuery}
          onIconPress={handleSearchSubmit}     // Busca ao clicar no ícone da lupa
          onSubmitEditing={handleSearchSubmit} // Busca ao pressionar 'Enter' no teclado
        />
      </View>
      {renderContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7fa',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 8,
  },
  emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 50,
  }
});

export default GerenciarFuncionariosScreen;