import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import NavBar from '../components/nav';
import CaseCard from '../components/caseCard';

const filterOptions = [
  { label: 'Mais recentes', value: 'newest' },
  { label: 'Mais antigos', value: 'oldest' },
  { label: 'Status: Concluídos', value: 'finalizado' },
  { label: 'Status: Em análise', value: 'em andamento' },
  { label: 'Status: Finalizado', value: 'arquivado' },
  { label: 'Categoria: Acidente', value: 'acidente' },
  { label: 'Categoria: Identificação de Vítima', value: 'identificação de vítima' },
  { label: 'Categoria: Exame Criminal', value: 'exame criminal' },
  { label: 'Categoria: Outros', value: 'outros' },
];

export default function BancoDeCasosScreen() {
  const [searchText, setSearchText] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);

  const cases = [
    {
      id: '67e6b97f79573d6f9e7fcf99',
      title: 'O sumiço de richard',
      name: 'Expert não definido',
      role: 'Função não definida',
      location: 'recife',
      status: 'em andamento',
      category: 'não definido',
      description: 'richard largou',
    },
    {
      id: '67f40704733e68da8641cfff',
      title: 'O dente de Hadassa',
      name: 'Expert não definido',
      role: 'Função não definida',
      location: 'jaboatão',
      status: 'arquivado',
      category: 'não definido',
      description: 'O siso',
    },
    {
      id: '67f4077b733e68da8641d001',
      title: 'o maldito [ ]',
      name: 'Expert não definido',
      role: 'Função não definida',
      location: 'porto digital',
      status: 'arquivado',
      category: 'não definido',
      description: 'motivo de trancamento',
    },
    {
      id: '67fc192fa728293f32016906',
      title: 'Caso Acidente Rodoviário BR-101',
      name: 'Expert não definido',
      role: 'Função não definida',
      location: 'BR-101, Km 45, Pernambuco',
      status: 'em andamento',
      category: 'identificação de vítima',
      description: 'Identificação de vítima fatal em acident...',
    },
    {
      id: '67fc5d5c42152097b540ba9b',
      title: 'Caso misterioso no rio do Recife',
      name: 'Dr. Ana Silva',
      role: 'admin',
      location: 'Recife',
      status: 'finalizado',
      category: 'acidente',
      description: 'atualizando dados',
    },
    {
      id: '68040ab5ccc86414eddb3168',
      title: 'Teste de caso com a Ia',
      name: 'Richard teste',
      role: 'perito',
      location: 'Recife',
      status: 'finalizado',
      category: 'teste',
      description: 'asdasdasdasdasdasd',
    },
    {
      id: '680926d3d4a4f82054024f70',
      title: 'IDV-Incendio-RuaA-01',
      name: 'Dr Marcos Oliveira',
      role: 'perito',
      location: 'IML Central - Sala 3',
      status: 'em andamento',
      category: 'identificação de vítima',
      description: 'Vítima carbonizada encontrada em residên...',
    },
    {
      id: '6809270cd4a4f82054024f76',
      title: 'AcidTrans-BR101-Km50-01',
      name: 'Dr Marcos Oliveira',
      role: 'perito',
      location: 'IML Regional Sul',
      status: 'em andamento',
      category: 'acidente',
      description: 'Colisão frontal entre dois veículos na B...',
    },
    {
      id: '68092759d4a4f82054024f7x',
      title: 'Outros-Mordida-Objeto-01',
      name: 'Dr Marcos Oliveira',
      role: 'perito',
      location: 'Consultório OdontoLegal - Sala A',
      status: 'em andamento',
      category: 'outros',
      description: 'Análise de possível marca de mordida hum...',
    },
  ];

  function filterCases() {
    return cases.filter((item) => {
      const search = searchText.toLowerCase();
      const matchSearch =
        item.title.toLowerCase().includes(search) ||
        item.status.toLowerCase().includes(search) ||
        item.category.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search);

      if (!matchSearch) return false;

      if (!selectedFilter) return true;

      if (
        ['finalizado', 'em andamento', 'arquivado'].includes(selectedFilter) &&
        item.status !== selectedFilter
      ) {
        return false;
      }

      if (
        ['acidente', 'identificação de vítima', 'exame criminal', 'outros'].includes(selectedFilter) &&
        item.category !== selectedFilter
      ) {
        return false;
      }

      return true;
    });
  }

  function sortCases(filtered) {
    if (selectedFilter === 'newest') {
      return filtered.slice().sort((a, b) => Number(b.id) - Number(a.id));
    }
    if (selectedFilter === 'oldest') {
      return filtered.slice().sort((a, b) => Number(a.id) - Number(b.id));
    }
    return filtered;
  }

  const filteredCases = sortCases(filterCases());

  function onSelectFilter(value) {
    setSelectedFilter(value);
    setFilterVisible(false);
  }

  function handleConsultCase(caseTitle) {
    Alert.alert('Consultar Caso', `Você clicou em Consultar: ${caseTitle}`);
  }

  return (
    <View style={styles.container}>
      <NavBar />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.headerTitle}>Banco de Casos</Text>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Buscar por título, status, categoria ou descrição..."
            placeholderTextColor="#6b7280"
            value={searchText}
            onChangeText={setSearchText}
            returnKeyType="search"
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => {
              console.log('Pesquisar:', searchText);
            }}
          >
            <Text style={styles.searchButtonText}>🔍</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterVisible(!filterVisible)}
        >
          <Text style={styles.filterButtonText}>
            Filtrar {selectedFilter ? `: ${selectedFilter}` : ''}
          </Text>
        </TouchableOpacity>

        {filterVisible && (
          <View style={styles.dropdown}>
            {filterOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.dropdownItem}
                onPress={() => onSelectFilter(option.value)}
              >
                <Text style={styles.dropdownText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.dropdownItem, { backgroundColor: '#eee' }]}
              onPress={() => onSelectFilter(null)}
            >
              <Text style={[styles.dropdownText, { color: '#999' }]}>Limpar filtro</Text>
            </TouchableOpacity>
          </View>
        )}

        {filteredCases.length === 0 ? (
          <Text style={styles.noResultsText}>Nenhum caso encontrado.</Text>
        ) : (
          filteredCases.map((item) => (
            <CaseCard
              key={item.id}
              title={item.title}
              name={item.name}
              role={item.role}
              location={item.location}
              status={item.status}
              description={item.description}
              buttonLabel="Consultar"
              onPress={() => handleConsultCase(item.title)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  content: {
    padding: 16,
    alignItems: 'center',
    gap: 16,
    flexDirection: 'column',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
  },
  headerTitle: {
    width: '100%',
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 16,
    textAlign: 'center',
  },
  searchContainer: { width: '100%', flexDirection: 'row', marginBottom: 12 },
  searchBar: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  searchButton: {
    backgroundColor: '#1e40af',
    marginLeft: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 8,
  },
  searchButtonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  filterButton: {
    backgroundColor: '#1e40af',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 12,
  },
  filterButtonText: { color: '#fff', fontSize: 16, fontWeight: '500' },
  dropdown: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownText: {
    fontSize: 16,
    color: '#1e40af',
  },
  noResultsText: {
    marginTop: 24,
    fontSize: 16,
    color: '#6b7280',
  },
});

//está pronta e funcionando as funções