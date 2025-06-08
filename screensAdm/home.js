import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { Searchbar, Menu, Button, Provider as PaperProvider, Appbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import CaseCard from '../components/CaseCard';
import AddCaseCard from '../components/AddCaseCard';

const API_URL = 'https://odonto-legal-backend.onrender.com';

const AdminHomeScreen = () => {
  const navigation = useNavigation();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState({ label: 'Filtro', value: null });

  // Adiciona o botão de Perfil no Header da tela
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Appbar.Action
          icon="account-circle"
          color="white"
          onPress={() => navigation.navigate('AdminProfile')}
        />
      ),
    });
  }, [navigation]);

  const fetchCases = useCallback(async (query = '') => {
    //... (o resto da função fetchCases continua exatamente igual)
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert("Sessão expirada", "Por favor, faça login novamente.");
      navigation.replace('Login');
      return;
    }
    let url = `${API_URL}/api/case`;
    if (query) { url += query; }
    try {
      const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await response.json();
      if (response.ok) {
        setCases(Array.isArray(data) ? data : []);
      } else {
        if (response.status === 404) { setCases([]); } 
        else { throw new Error(data.message || 'Erro ao buscar casos'); }
      }
    } catch (error) {
      console.error("Erro ao buscar casos:", error);
      Alert.alert("Erro", "Não foi possível carregar os casos.");
      if (String(error).includes('401') || String(error).includes('403')) {
        navigation.replace('Login');
      }
    } finally { setLoading(false); }
  }, [navigation]);

  useFocusEffect(useCallback(() => { fetchCases(); }, [fetchCases]));

  const handleSearch = () => {
    //... (a função handleSearch continua exatamente igual)
    if (searchQuery.trim()) {
      fetchCases(`/fname?nameCase=${encodeURIComponent(searchQuery)}`);
      setActiveFilter({ label: `Busca: ${searchQuery}`, value: null });
    } else {
      fetchCases();
      setActiveFilter({ label: 'Filtro', value: null });
    }
  };

  const handleSelectFilter = (filter) => {
    //... (a função handleSelectFilter continua exatamente igual)
    fetchCases(filter.query);
    setActiveFilter({ label: filter.label, value: filter.value });
    setFilterMenuVisible(false);
  };
  
  const filterOptions = [
    //... (o array filterOptions continua exatamente igual)
    { label: 'Todos', value: 'all', query: '' },
    { label: 'Mais Recentes', value: 'newest', query: '/fdata?order=newest' },
    { label: 'Mais Antigos', value: 'oldest', query: '/fdata?order=oldest' },
    { label: 'Status: Concluído', value: 'finalizado', query: '/fstatus?status=finalizado' },
    { label: 'Status: Em Análise', value: 'em andamento', query: '/fstatus?status=em andamento' },
    { label: 'Categoria: Acidente', value: 'acidente', query: '/fcat?category=acidente' },
    { label: 'Categoria: Identificação', value: 'identificação de vítima', query: '/fcat?category=identificação de vítima' },
  ];
  
  const renderContent = () => {
    //... (a função renderContent continua exatamente igual)
    if (loading) { return <ActivityIndicator size="large" style={styles.loader} />; }
    const dataWithAddCard = [{ _id: 'add_new_case_placeholder' }, ...cases];
    return (
      <FlatList
        data={dataWithAddCard}
        keyExtractor={(item) => item._id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => {
          if (item._id === 'add_new_case_placeholder') { return <AddCaseCard />; }
          return <CaseCard caseData={item} />;
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <AddCaseCard />
          </View>
        }
      />
    );
  };

  return (
    <PaperProvider>
      {/* SafeAreaView agora engloba tudo, e o Appbar.Header foi removido */}
      <SafeAreaView style={styles.container}>
        <View style={styles.controlsContainer}>
          <Searchbar
            placeholder="Pesquisar por nome"
            onChangeText={setSearchQuery}
            value={searchQuery}
            onIconPress={handleSearch}
            onSubmitEditing={handleSearch}
            style={styles.searchbar}
          />
          <Menu
            visible={filterMenuVisible}
            onDismiss={() => setFilterMenuVisible(false)}
            anchor={
              <Button icon="filter-variant" mode="outlined" onPress={() => setFilterMenuVisible(true)}>
                {activeFilter.label}
              </Button>
            }>
            {filterOptions.map(opt => (
              <Menu.Item key={opt.value} onPress={() => handleSelectFilter(opt)} title={opt.label} />
            ))}
          </Menu>
        </View>

        {renderContent()}
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  //... (os estilos continuam os mesmos)
  container: {
    flex: 1,
    backgroundColor: '#f4f7fa',
  },
  controlsContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchbar: {
    marginBottom: 16,
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
  },
});

export default AdminHomeScreen;