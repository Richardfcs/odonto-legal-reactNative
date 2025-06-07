import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, View, StyleSheet, Alert } from 'react-native';
import { ActivityIndicator, Text, Searchbar, Menu, Button, Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import UserCaseCard from '../components/UserCaseCard';
import ConsultaCaseCard from '../components/ConsultaCaseCard';

const API_URL = 'https://odonto-legal-backend.onrender.com';

const BancoDeCasosScreen = () => {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const [filterMenuVisible, setFilterMenuVisible] = useState(false);
    const [activeFilter, setActiveFilter] = useState({ label: 'Filtro: Todos', query: '' });

    const fetchCases = useCallback(async (query = '', filterQuery = '') => {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');

        let url = `${API_URL}/api/case`;

        if (query) {
            url += `/fname?nameCase=${encodeURIComponent(query)}`;
        } else if (filterQuery) {
            url += filterQuery;
        }

        try {
            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (!res.ok) {
                if (res.status === 404) setCases([]);
                else throw new Error(data.message || "Erro ao buscar casos.");
            } else {
                setCases(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            Alert.alert("Erro", error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Carrega todos os casos na primeira vez que a tela é focada
    useFocusEffect(
        useCallback(() => {
            fetchCases();
        }, [])
    );

    const handleSearchSubmit = () => {
        setActiveFilter({ label: 'Filtro: Todos', query: '' }); // Reseta o filtro ao buscar
        fetchCases(searchQuery, '');
    };

    const handleSelectFilter = (filter) => {
        setSearchQuery(''); // Limpa a busca ao aplicar filtro
        setActiveFilter(filter);
        setFilterMenuVisible(false);
        fetchCases('', filter.query);
    };

    const filterOptions = [
        { label: 'Todos', query: '' },
        { label: 'Mais Recentes', query: '/fdata?order=newest' },
        { label: 'Mais Antigos', query: '/fdata?order=oldest' },
        { label: 'Status: Em Andamento', query: '/fstatus?status=em andamento' },
        { label: 'Status: Finalizado', query: '/fstatus?status=finalizado' },
    ];

    if (loading) {
        return <ActivityIndicator style={styles.centered} size="large" />;
    }

    return (
        <PaperProvider>
            <View style={styles.container}>
                <View style={styles.controlsContainer}>
                    <Searchbar
                        placeholder="Buscar por nome do caso..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onIconPress={handleSearchSubmit}
                        onSubmitEditing={handleSearchSubmit}
                        style={{ flex: 1 }}
                    />
                    <Menu
                        visible={filterMenuVisible}
                        onDismiss={() => setFilterMenuVisible(false)}
                        anchor={
                            <Button icon="filter-variant" onPress={() => setFilterMenuVisible(true)}>
                                Filtros
                            </Button>
                        }
                    >
                        {filterOptions.map(opt => (
                            <Menu.Item key={opt.query} onPress={() => handleSelectFilter(opt)} title={opt.label} />
                        ))}
                    </Menu>
                </View>

                <FlatList
                    data={cases}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => <ConsultaCaseCard caso={item} />}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Nenhum caso encontrado com os critérios selecionados.</Text>
                        </View>
                    }
                    contentContainerStyle={styles.listContent}
                    onRefresh={() => fetchCases(searchQuery, activeFilter.query)} // Permite "puxar para atualizar"
                    refreshing={loading}
                />
            </View>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f5f9', // Cor de fundo de referência
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    controlsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 8, // Padding vertical consistente
        backgroundColor: '#fff',
        // Removido borderBottom, pois o header do navegador já pode ter uma sombra/borda
    },
    searchbar: {
        flex: 1,
        marginRight: 8, // Espaço entre a busca e o botão de filtro
    },
    listContent: {
        paddingHorizontal: 16,
        paddingTop: 8, // Reduzido o padding superior
        paddingBottom: 16, // Espaço na parte inferior para não colar na barra de abas
    },
    emptyContainer: {
        flex: 1,
        paddingTop: 100, // Empurra a mensagem para baixo
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#64748b',
    },
});

export default BancoDeCasosScreen;