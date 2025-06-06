import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';

import StatCard from './StatCard';
import ChartCard from './ChartCard';

const API_BASE = 'https://odonto-legal-backend.onrender.com/api/dashboard';

const GeralDashboard = () => {
  const { width } = useWindowDimensions();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ cases: 0, victims: 0, users: 0, evidences: 0 });
  const [timelineData, setTimelineData] = useState({ labels: [], datasets: [{ data: [] }] });

  const fetchMainData = useCallback(async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    try {
      const [mainRes, timelineRes] = await Promise.all([
        fetch(`${API_BASE}/main-stats?period=all`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE}/cases-timeline?period=all`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      const mainData = await mainRes.json();
      const timelineRawData = await timelineRes.json();
      
      if (mainData?.totals) {
        setStats(mainData.totals);
      }
      
      if (Array.isArray(timelineRawData) && timelineRawData.length > 0) {
        setTimelineData({
          labels: timelineRawData.map(item => item.date || item._id),
          datasets: [{ data: timelineRawData.map(item => item.count) }],
        });
      } else {
        // Garante que o gráfico não quebre se não houver dados
        setTimelineData({ labels: ["Sem dados"], datasets: [{ data: [0] }] });
      }

    } catch (error) {
      console.error("Erro ao buscar dados gerais:", error);
      // Aqui você poderia setar um estado de erro para exibir uma mensagem
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMainData();
  }, [fetchMainData]);

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  return (
    <View>
      <View style={styles.statsRow}>
        <StatCard label="Casos" value={loading ? '...' : stats.cases} />
        <StatCard label="Vítimas" value={loading ? '...' : stats.victims} />
      </View>
      <View style={styles.statsRow}>
        <StatCard label="Usuários" value={loading ? '...' : stats.users} />
        <StatCard label="Evidências" value={loading ? '...' : stats.evidences} />
      </View>

      <ChartCard title="Casos ao Longo do Tempo" isLoading={loading}>
        <LineChart
          data={timelineData}
          width={width - 50} // Ajuste de largura
          height={280}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </ChartCard>
    </View>
  );
};

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  chart: {
    borderRadius: 16,
  },
});

export default GeralDashboard;