import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, View, StyleSheet, Alert } from 'react-native';
import { ActivityIndicator, Text, Searchbar, Menu, Button, Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
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
            <SafeAreaView style={styles.container}>
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
            </SafeAreaView>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f5f9',
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
        paddingVertical: 8,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        paddingHorizontal: 20,
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#64748b',
    },
});

export default BancoDeCasosScreen;