import React, { useState, useEffect, useCallback } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-paper';
import { handleExport } from './utils/dashboardUtils';

import StatCard from './StatCard';
import ChartCard from './ChartCard';

const API_BASE = 'https://odonto-legal-backend.onrender.com/api/dashboard';

const UsuariosDashboard = () => {
  const { width } = useWindowDimensions();
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [chartData, setChartData] = useState(null);

  const [exporting, setExporting] = useState(false);

  const onExport = async () => {
    setExporting(true);
    // Sem filtros por enquanto, mas a estrutura está pronta
    await handleExport('users', {});
    setExporting(false);
  };

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    setChartData(null);
    const token = await AsyncStorage.getItem('token');

    try {
      const res = await fetch(`${API_BASE}/users-stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (res.ok) {
        setTotalUsers(data.total || 0);
        if (data.roles && data.roles.length > 0) {
          const pieColors = ['#10B981', '#3B82F6', '#F59E0B'];
          const processedData = data.roles.map((item, index) => ({
            name: item.role.charAt(0).toUpperCase() + item.role.slice(1), // Capitaliza o nome
            count: item.count,
            color: pieColors[index % pieColors.length],
            legendFontColor: '#7F7F7F',
            legendFontSize: 14,
          }));
          setChartData(processedData);
        }
      } else {
        throw new Error(data.message || 'Erro ao buscar dados de usuários');
      }
    } catch (error) {
      console.error("Erro em UsuariosDashboard:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const chartConfig = {
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  return (
    <View>
      <StatCard label="Total de Usuários" value={loading ? '...' : totalUsers} />
      <ChartCard title="Usuários por Função" isLoading={loading}>
        {chartData && (
          <PieChart
            data={chartData}
            width={width - 50}
            height={220}
            chartConfig={chartConfig}
            accessor="count"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        )}
      </ChartCard>
      <Button
        icon="download"
        mode="contained"
        onPress={onExport}
        loading={exporting}
        disabled={exporting}
        style={{ margin: 16 }}
      >
        Exportar Relatório de Usuários (CSV)
      </Button>
    </View>
  );
};

export default UsuariosDashboard;