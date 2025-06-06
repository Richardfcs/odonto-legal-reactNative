import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Menu, Button, Provider as PaperProvider } from 'react-native-paper';
import { PieChart, BarChart, LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleExport } from './utils/dashboardUtils';

import StatCard from './StatCard';
import ChartCard from './ChartCard';

const API_BASE = 'https://odonto-legal-backend.onrender.com/api/dashboard';

// A configuração que define cada visualização, traduzida do seu JS web.
const victimGroupByOptions = [
    { type: 'identificationStatus', label: 'Identificação', chartType: 'pie', endpoint: 'victim-demographics-stats' },
    { type: 'gender', label: 'Gênero', chartType: 'pie', endpoint: 'victim-demographics-stats' },
    { type: 'ethnicityRace', label: 'Etnia/Raça', chartType: 'bar', endpoint: 'victim-demographics-stats' },
    { type: 'ageDistribution', label: 'Faixa Etária', chartType: 'bar', endpoint: 'victim-age-stats' },
    { type: 'mannerOfDeath', label: 'Circunstância da Morte', chartType: 'bar', endpoint: 'victim-demographics-stats' },
    { type: 'victimsTimeline', label: 'Timeline de Vítimas', chartType: 'line', endpoint: 'victims-timeline' }
];

const timeFilterOptions = [
    { label: 'Todo Período', value: 'all' },
    { label: 'Últ. Semana', value: 'last-week' },
    { label: 'Últ. Mês', value: 'last-month' },
    { label: 'Últ. Ano', value: 'last-year' },
];

const VitimasDashboard = () => {
    const { width } = useWindowDimensions();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0 });
    const [chartData, setChartData] = useState(null);

    const [activeView, setActiveView] = useState(victimGroupByOptions[0]);
    const [timeFilter, setTimeFilter] = useState(timeFilterOptions[0]);

    const [viewMenuVisible, setViewMenuVisible] = useState(false);
    const [timeMenuVisible, setTimeMenuVisible] = useState(false);

    const [exporting, setExporting] = useState(false);

    const onExport = async () => {
        setExporting(true);
        // Os filtros para vítimas são mais complexos, mas por enquanto usamos o período
        await handleExport('victims', { period: timeFilter.value, groupBy: activeView.type });
        setExporting(false);
    };

    const fetchVictimData = useCallback(async () => {
        setLoading(true);
        setChartData(null);
        const token = await AsyncStorage.getItem('token');

        const { endpoint, type } = activeView;
        const params = new URLSearchParams();

        if (endpoint === 'victim-demographics-stats') {
            params.append('groupBy', type);
        }
        if (timeFilter.value !== 'all') {
            params.append('period', timeFilter.value);
        }

        try {
            const res = await fetch(`${API_BASE}/${endpoint}?${params}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Erro ao buscar dados de vítimas');

            // O endpoint de timeline retorna um array diretamente, os outros um objeto { stats, total }
            if (activeView.type === 'victimsTimeline') {
                const total = data.reduce((sum, item) => sum + item.count, 0);
                setStats({ total });
                setChartData(data);
            } else {
                setStats({ total: data.total || 0 });
                setChartData(data.stats || []);
            }
        } catch (error) {
            console.error(`Erro em VitimasDashboard (${activeView.label}):`, error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }, [activeView, timeFilter]);

    useEffect(() => {
        fetchVictimData();
    }, [fetchVictimData]);

    const handleSelectView = (option) => {
        setActiveView(option);
        setViewMenuVisible(false);
    };

    const handleSelectTime = (option) => {
        setTimeFilter(option);
        setTimeMenuVisible(false);
    };

    const chartConfig = {
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, // Azul
        barPercentage: 0.7
    };

    const renderChart = () => {
        if (!chartData || chartData.length === 0) return null;

        const commonProps = {
            width: width - 50,
            height: 280,
            chartConfig: chartConfig,
        };

        if (activeView.chartType === 'pie') {
            const pieColors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];
            const processedData = chartData.map((item, index) => ({
                name: item.name,
                count: item.count,
                color: pieColors[index % pieColors.length],
                legendFontColor: '#7F7F7F',
                legendFontSize: 14,
            }));
            return <PieChart {...commonProps} height={220} data={processedData} accessor="count" backgroundColor="transparent" paddingLeft="15" absolute />;
        }
        if (activeView.chartType === 'bar') {
            return <BarChart {...commonProps} data={{ labels: chartData.map(item => item.name), datasets: [{ data: chartData.map(item => item.count) }] }} fromZero={true} verticalLabelRotation={25} />;
        }
        if (activeView.chartType === 'line') {
            return <LineChart {...commonProps} data={{ labels: chartData.map(item => item._id || item.date), datasets: [{ data: chartData.map(item => item.count) }] }} bezier />;
        }
        return null;
    };

    return (
        <PaperProvider>
            <View>
                <StatCard label="Total de Vítimas (no período)" value={loading ? '...' : stats.total} />

                <View style={styles.filtersContainer}>
                    <Menu
                        visible={viewMenuVisible}
                        onDismiss={() => setViewMenuVisible(false)}
                        anchor={
                            <Button icon="chart-donut" mode="outlined" onPress={() => setViewMenuVisible(true)}>
                                {activeView.label}
                            </Button>
                        }
                    >
                        {victimGroupByOptions.map(opt => (
                            <Menu.Item key={opt.type} onPress={() => handleSelectView(opt)} title={opt.label} />
                        ))}
                    </Menu>
                    <Menu
                        visible={timeMenuVisible}
                        onDismiss={() => setTimeMenuVisible(false)}
                        anchor={
                            <Button icon="calendar-month" mode="outlined" onPress={() => setTimeMenuVisible(true)}>
                                {timeFilter.label}
                            </Button>
                        }
                    >
                        {timeFilterOptions.map(opt => (
                            <Menu.Item key={opt.value} onPress={() => handleSelectTime(opt)} title={opt.label} />
                        ))}
                    </Menu>
                </View>

                <ChartCard title={`Distribuição por ${activeView.label}`} isLoading={loading}>
                    {renderChart()}
                </ChartCard>

                <Button
                    icon="download"
                    mode="contained"
                    onPress={onExport}
                    loading={exporting}
                    disabled={exporting}
                    style={{ margin: 16 }}
                >
                    Exportar Relatório de Vítimas (CSV)
                </Button>
            </View>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    filtersContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 16,
    },
});

export default VitimasDashboard;