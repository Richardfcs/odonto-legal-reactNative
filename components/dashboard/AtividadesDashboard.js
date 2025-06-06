import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, List, ActivityIndicator, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'https://odonto-legal-backend.onrender.com/api/dashboard';

// Um componente reutilizável para cada coluna de atividade
const ActivityColumn = ({ title, items, loading }) => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.columnTitle}>{title}</Title>
        {loading ? (
          <ActivityIndicator animating={true} style={{ marginTop: 20 }} />
        ) : (
          <List.Section>
            {items && items.length > 0 ? (
              items.map((item, index) => (
                <View key={item._id || index}>
                  <List.Item
                    title={item.title}
                    description={`Criado em: ${item.date}`}
                    titleNumberOfLines={2}
                    left={() => <List.Icon icon={item.icon || "file-document-outline"} />}
                  />
                  {index < items.length - 1 && <Divider />}
                </View>
              ))
            ) : (
              <List.Item title="Nenhuma atividade recente" />
            )}
          </List.Section>
        )}
      </Card.Content>
    </Card>
  );
};


const AtividadesDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState({
    cases: [],
    evidences: [],
    reports: [],
    victims: [],
  });

  const fetchActivityData = useCallback(async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    
    try {
      const res = await fetch(`${API_BASE}/recent-activity?limit=5`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (res.ok) {
        // Processa os dados para um formato unificado que o ActivityColumn possa usar
        const formatData = (items, titleField, icon) => {
          return items.map(item => ({
            _id: item._id,
            title: item[titleField] || `ID: ${item._id.slice(-6)}`,
            date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A',
            icon: icon
          }));
        };
        
        setActivities({
          cases: formatData(data.cases || [], 'nameCase', 'folder-text-outline'),
          evidences: formatData(data.evidences || [], 'title', 'camera-outline'),
          reports: formatData(data.reports || [], 'reportNumber', 'file-chart-outline'),
          victims: formatData(data.victims || [], 'victimCode', 'account-outline'),
        });

      } else {
        throw new Error(data.message || 'Erro ao buscar atividades');
      }
    } catch (error) {
      console.error("Erro em AtividadesDashboard:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivityData();
  }, [fetchActivityData]);

  return (
    <View>
      <ActivityColumn title="Casos Recentes" items={activities.cases} loading={loading} />
      <ActivityColumn title="Vítimas Recentes" items={activities.victims} loading={loading} />
      <ActivityColumn title="Evidências Recentes" items={activities.evidences} loading={loading} />
      <ActivityColumn title="Laudos Recentes" items={activities.reports} loading={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
  },
  columnTitle: {
    fontSize: 18,
    marginBottom: 8,
    marginLeft: 16, // Alinha com o texto da lista
    marginTop: 8,
  },
});

export default AtividadesDashboard;