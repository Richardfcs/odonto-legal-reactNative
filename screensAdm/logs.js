import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LogItem from '../components/LogItem';

const API_URL = 'https://odonto-legal-backend.onrender.com';
const LOGS_PER_PAGE = 25;

const LogsScreen = () => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchLogs = useCallback(async (isInitialLoad = false) => {
    if (!hasMore && !isInitialLoad) return; // Não busca se já sabemos que não há mais logs
    
    // Define o estado de carregamento apropriado
    if (isInitialLoad) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    const token = await AsyncStorage.getItem('token');
    const currentPage = isInitialLoad ? 1 : page;

    try {
      const url = `${API_URL}/api/auditlog?page=${currentPage}&limit=${LOGS_PER_PAGE}`;
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();

      if (response.ok) {
        // Se for carga inicial, substitui os logs. Se não, anexa os novos.
        setLogs(prevLogs => isInitialLoad ? data.auditLogs : [...prevLogs, ...data.auditLogs]);
        
        // Verifica se há mais páginas para carregar
        if (currentPage >= data.totalPages) {
          setHasMore(false);
        }
        
        // Incrementa a página para a próxima busca
        setPage(currentPage + 1);

      } else {
        throw new Error(data.message || 'Erro ao buscar logs');
      }
    } catch (error) {
      console.error("Erro ao buscar logs:", error);
      Alert.alert("Erro", "Não foi possível carregar os logs de auditoria.");
      setHasMore(false); // Para de tentar carregar em caso de erro
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  }, [page, hasMore]);

  // Carga inicial dos logs
  useEffect(() => {
    fetchLogs(true);
  }, []);

  const handleLoadMore = () => {
    if (!loadingMore) { // Previne múltiplas chamadas enquanto uma já está em andamento
      fetchLogs();
    }
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  };
  
  const refreshList = () => {
    setPage(1);
    setHasMore(true);
    setLogs([]);
    fetchLogs(true);
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={logs}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <LogItem log={item} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5} // Chama onEndReached quando 50% do último item estiver visível
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
            <View style={styles.centered}>
                <Text>Nenhum log encontrado.</Text>
            </View>
        }
        onRefresh={refreshList} // Permite "puxar para atualizar"
        refreshing={loading} // Mostra o indicador de carregamento do refresh
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerLoader: {
    paddingVertical: 20,
  },
});

export default LogsScreen;