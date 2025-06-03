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
    title: 'Desaparecimento de Richard Gomes',
    name: 'Dr. Marcos Oliveira',
    role: 'perito odontolegista',
    location: 'Recife - PE',
    status: 'em andamento',
    category: 'identificação de vítima',
    description: 'Corpo parcialmente esqueletizado encontrado em área de manguezal. Em análise para identificação via arcada dentária.',
  },
  {
    id: '67f40704733e68da8641cfff',
    title: 'Identificação de Hadassa Lima',
    name: 'Dra. Larissa Mendonça',
    role: 'perita odontolegista',
    location: 'Jaboatão dos Guararapes - PE',
    status: 'arquivado',
    category: 'identificação de vítima',
    description: 'Corpo reconhecido por meio de prontuário odontológico fornecido por clínica local. Caso encerrado.',
  },
  {
    id: '67f4077b733e68da8641d001',
    title: 'Violência doméstica contra Carla M.',
    name: 'Dra. Fernanda Xavier',
    role: 'perita odontolegista',
    location: 'Porto Digital - Recife',
    status: 'arquivado',
    category: 'lesão corporal',
    description: 'Exame de lesão em região bucal e fratura dentária associada à agressão física. Encaminhado à delegacia especializada.',
  },
  {
    id: '67fc192fa728293f32016906',
    title: 'Acidente Rodoviário BR-101',
    name: 'Dr. Pedro Tavares',
    role: 'perito odontolegista',
    location: 'BR-101, Km 45 - PE',
    status: 'em andamento',
    category: 'identificação de vítima',
    description: 'Colisão múltipla resultou em vítima carbonizada. Processo de comparação odontológica em andamento.',
  },
  {
    id: '67fc5d5c42152097b540ba9b',
    title: 'Afogamento no Rio Capibaribe',
    name: 'Dra. Ana Silva',
    role: 'admin',
    location: 'Recife - PE',
    status: 'finalizado',
    category: 'acidente',
    description: 'Vítima identificada após análise odontológica e cruzamento com banco de desaparecidos.',
  },
  {
    id: '68040ab5ccc86414eddb3168',
    title: 'Simulação de Caso - IA Forense',
    name: 'Dr. Rafael Teixeira',
    role: 'perito odontolegista',
    location: 'Recife - PE',
    status: 'finalizado',
    category: 'treinamento',
    description: 'Caso fictício para treinamento de sistema de IA forense aplicado à odontologia legal.',
  },
  {
    id: '680926d3d4a4f82054024f70',
    title: 'Incêndio Residencial - Rua A',
    name: 'Dr. Marcos Oliveira',
    role: 'perito odontolegista',
    location: 'IML Central - Sala 3',
    status: 'em andamento',
    category: 'identificação de vítima',
    description: 'Vítima carbonizada identificada apenas por arcada dentária. Em processo de comparação com registros clínicos.',
  },
  {
    id: '6809270cd4a4f82054024f76',
    title: 'Colisão BR-101 - Km 50',
    name: 'Dr. Marcos Oliveira',
    role: 'perito odontolegista',
    location: 'IML Regional Sul - PE',
    status: 'em andamento',
    category: 'acidente',
    description: 'Colisão frontal entre dois veículos. Uma das vítimas apresenta traumas severos no crânio e face.',
  },
  {
    id: '68092759d4a4f82054024f7x',
    title: 'Análise de mordida - objeto de crime',
    name: 'Dr. Marcos Oliveira',
    role: 'perito odontolegista',
    location: 'Consultório OdontoLegal - Sala A',
    status: 'em andamento',
    category: 'análise de mordida',
    description: 'Exame comparativo entre marca de mordida em alimento e moldagem dentária de suspeito.',
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
            placeholder="Buscar por título, status, categoria..."
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
