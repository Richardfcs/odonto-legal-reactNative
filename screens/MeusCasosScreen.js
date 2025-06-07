import React, { useState, useCallback } from 'react';
import { FlatList, View, StyleSheet, Alert } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import UserCaseCard from '../components/UserCaseCard';
import UserAddCaseCard from '../components/UserAddCaseCard';

const API_URL = 'https://odonto-legal-backend.onrender.com';

const MeusCasosScreen = () => {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null);

    // CORREÇÃO: Aplicando o padrão correto ao useFocusEffect
    useFocusEffect(
        useCallback(() => {
            // A função async é definida aqui dentro
            const fetchData = async () => {
                setLoading(true);
                const token = await AsyncStorage.getItem('token');
                const role = await AsyncStorage.getItem('role');
                setUserRole(role);

                try {
                    const res = await fetch(`${API_URL}/api/user/mycases`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.message || "Erro ao buscar seus casos.");
                    setCases(data);
                } catch (error) {
                    Alert.alert("Erro", error.message);
                } finally {
                    setLoading(false);
                }
            };

            // E então é chamada
            fetchData();
        }, []) // A dependência vazia [] garante que ela rode a cada vez que a tela foca
    );

    const renderHeader = () => {
        // Mostra o botão de adicionar apenas se não estiver carregando e o usuário for perito
        if (!loading && userRole === 'perito') {
            return <UserAddCaseCard />;
        }
        return null;
    };
    
    if (loading) {
        return <ActivityIndicator style={styles.centered} size="large" />;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={cases}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <UserCaseCard caso={item} />}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Nenhum caso associado a você foi encontrado.</Text>
                        {/* Renderiza o botão de adicionar também na lista vazia, se for perito */}
                        {userRole === 'perito' && <UserAddCaseCard />}
                    </View>
                }
                contentContainerStyle={styles.listContent}
            />
        </View>
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
    listContent: {
        paddingHorizontal: 16,
        paddingTop: 16, // Um pouco mais de espaço no topo aqui, já que não há busca
        paddingBottom: 16,
        flexGrow: 1, 
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#64748b',
        marginBottom: 20,
    },
});

export default MeusCasosScreen;