import React, { useState, useEffect, useCallback } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';

import StatCard from './StatCard';
import ChartCard from './ChartCard';

const API_BASE = 'https://odonto-legal-backend.onrender.com/api/dashboard';

const LocaisDashboard = () => {
  const { width } = useWindowDimensions();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ uniqueCount: 0, topLocation: { name: '-' } });
  const [chartData, setChartData] = useState(null);

  const fetchLocationData = useCallback(async () => {
    setLoading(true);
    setChartData(null);
    const token = await AsyncStorage.getItem('token');
    
    try {
      const res = await fetch(`${API_BASE}/location-stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (res.ok) {
        setStats({
          uniqueCount: data.uniqueCount || 0,
          topLocation: data.topLocation || { name: '-' },
        });

        if (data.locations && data.locations.length > 0) {
          setChartData({
            labels: data.locations.map(item => item._id || item.name),
            datasets: [{ data: data.locations.map(item => item.count) }]
          });
        }
      } else {
        throw new Error(data.message || 'Erro ao buscar dados de locais');
      }
    } catch (error) {
      console.error("Erro em LocaisDashboard:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocationData();
  }, [fetchLocationData]);

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
    barPercentage: 0.8,
  };

  return (
    <View>
      <StatCard label="Locais Únicos" value={loading ? '...' : stats.uniqueCount} />
      <StatCard label="Local Mais Frequente" value={loading ? '...' : stats.topLocation.name} />
      <ChartCard title="Top 10 Locais por Casos" isLoading={loading}>
        {chartData && (
          <BarChart
            data={chartData}
            width={width - 50}
            height={280}
            chartConfig={chartConfig}
            yAxisLabel=""
            yAxisSuffix=""
            verticalLabelRotation={30}
            fromZero={true}
          />
        )}
      </ChartCard>
    </View>
  );
};

export default LocaisDashboard;