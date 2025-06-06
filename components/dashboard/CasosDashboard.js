import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { SegmentedButtons, Menu, Button, Provider as PaperProvider } from 'react-native-paper';
import { PieChart, BarChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleExport } from './utils/dashboardUtils';

import StatCard from './StatCard';
import ChartCard from './ChartCard';

const API_BASE = 'https://odonto-legal-backend.onrender.com/api/dashboard';

const CasosDashboard = () => {
  const { width } = useWindowDimensions();
  const [loading, setLoading] = useState(true);
  const [totalCases, setTotalCases] = useState(0);
  const [chartData, setChartData] = useState(null);

  const [viewType, setViewType] = useState('status'); // 'status' ou 'category'
  const [timeFilter, setTimeFilter] = useState({ value: 'all', label: 'Todo Período' });
  const [menuVisible, setMenuVisible] = useState(false);

  const [exporting, setExporting] = useState(false);

  const onExport = async () => {
    setExporting(true);
    // Passa os filtros atuais da aba para a função de exportação
    await handleExport('cases', { period: timeFilter.value });
    setExporting(false);
  };

  const fetchCaseData = useCallback(async () => {
    setLoading(true);
    setChartData(null); // Limpa dados antigos antes de nova busca
    const token = await AsyncStorage.getItem('token');

    const params = new URLSearchParams({
      type: viewType,
    });
    if (timeFilter.value !== 'all') {
      params.append('period', timeFilter.value);
    }

    try {
      const res = await fetch(`${API_BASE}/case-stats?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (res.ok) {
        setTotalCases(data.total || 0);
        if (data.stats && data.stats.length > 0) {
          // Cores para o gráfico de pizza
          const pieColors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];
          // Transforma os dados para o formato que a biblioteca de gráfico espera
          const processedData = data.stats.map((item, index) => ({
            name: item.name,
            count: item.count,
            color: pieColors[index % pieColors.length],
            legendFontColor: '#7F7F7F',
            legendFontSize: 14,
          }));
          setChartData(processedData);
        }
      } else {
        throw new Error(data.message || 'Erro ao buscar dados de casos');
      }
    } catch (error) {
      console.error("Erro em CasosDashboard:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }, [viewType, timeFilter]);

  useEffect(() => {
    fetchCaseData();
  }, [fetchCaseData]);

  const timeFilterOptions = [
    { label: 'Todo Período', value: 'all' },
    { label: 'Últ. Semana', value: 'last-week' },
    { label: 'Últ. Mês', value: 'last-month' },
    { label: 'Últ. Ano', value: 'last-year' },
  ];

  const handleSelectFilter = (option) => {
    setTimeFilter(option);
    setMenuVisible(false);
  };

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`, // Usa a cor verde primária
    barPercentage: 0.8,
  };

  return (
    <PaperProvider>
      <View>
        <StatCard label="Total de Casos (no período)" value={loading ? '...' : totalCases} />

        <View style={styles.filtersContainer}>
          <SegmentedButtons
            value={viewType}
            onValueChange={setViewType}
            buttons={[
              { value: 'status', label: 'Status' },
              { value: 'category', label: 'Categorias' },
            ]}
            style={styles.segmentedButtons}
          />
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button icon="calendar-month" mode="outlined" onPress={() => setMenuVisible(true)}>
                {timeFilter.label}
              </Button>
            }
          >
            {timeFilterOptions.map(opt => (
              <Menu.Item key={opt.value} onPress={() => handleSelectFilter(opt)} title={opt.label} />
            ))}
          </Menu>
        </View>

        <ChartCard title={`Casos por ${viewType === 'status' ? 'Status' : 'Categoria'}`} isLoading={loading}>
          {chartData && viewType === 'status' && (
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
          {chartData && viewType === 'category' && (
            <BarChart
              data={{
                labels: chartData.map(item => item.name),
                datasets: [{ data: chartData.map(item => item.count) }]
              }}
              width={width - 60}
              height={280}
              chartConfig={chartConfig}
              yAxisLabel=""
              yAxisSuffix=""
              verticalLabelRotation={25}
              fromZero={true}
              style={styles.chartStyle}
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
          Exportar Relatório de Casos (CSV)
        </Button>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    marginVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  chartStyle: {
    borderRadius: 16,
  },
});

export default CasosDashboard;