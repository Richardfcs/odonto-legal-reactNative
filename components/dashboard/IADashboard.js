import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, StyleSheet, useWindowDimensions } from 'react-native';
import { Card, Title, TextInput, Button, List, Divider, Text, ActivityIndicator } from 'react-native-paper';
import { BarChart } from 'react-native-chart-kit';
import ChartCard from './ChartCard';
import SelectMenu from '../SelectMenu'; // Importa o nosso componente reutilizável

const API_BASE_URL_IA = "https://backend-graficos.onrender.com/api";

// ===== OPÇÕES PARA OS SELETORES =====
const genderOptions = [
    { label: 'Masculino', value: 'masculino' },
    { label: 'Feminino', value: 'feminino' },
    { label: 'Intersexo', value: 'intersexo' },
    { label: 'Indeterminado', value: 'indeterminado' },
    { label: 'Desconhecido', value: 'desconhecido' },
];

const ethnicityOptions = [
    { label: 'Branca', value: 'branca' },
    { label: 'Parda', value: 'parda' },
    { label: 'Preta', value: 'preta' },
    { label: 'Amarela', value: 'amarela' },
    { label: 'Indígena', value: 'indigena' },
    { label: 'Não Declarada', value: 'nao_declarada' },
    { label: 'Desconhecida', value: 'desconhecida' },
];

const causeOfDeathOptions = [
    { label: 'Ferimento por Arma de Fogo', value: 'ferimento_arma_fogo' },
    { label: 'Ferimento por Arma Branca', value: 'ferimento_arma_branca' },
    { label: 'Asfixia', value: 'asfixia' },
    { label: 'Trauma Contuso', value: 'trauma_contuso' },
    { label: 'Intoxicação', value: 'intoxicacao' },
    { label: 'Queimadura', value: 'queimadura' },
    { label: 'Afogamento', value: 'afogamento' },
    { label: 'Causa Natural', value: 'causa_natural_especifica' },
    { label: 'Indeterminada Medicamente', value: 'indeterminada_medicamente' },
    { label: 'Outra', value: 'outra' },// Adicione mais opções se necessário
];
// =====================================


const IADashboard = () => {
    const { width: screenWidth } = useWindowDimensions();

    const [loadingFeatures, setLoadingFeatures] = useState(true);
    const [featuresData, setFeaturesData] = useState(null);
    const [formState, setFormState] = useState({
        'Gênero': '', 'Etnia/Raça': '', 'Causa Primária Morte': '', 'Idade Registrada': '',
        'Estatura (cm)': '', 'Latitude': '', 'Longitude': '', 'Idade Estimada (Min)': '', 'Idade Estimada (Max)': ''
    });
    const [loadingPrediction, setLoadingPrediction] = useState(false);
    const [predictionResult, setPredictionResult] = useState(null);

    const fetchFeatureImportance = useCallback(async () => {
        setLoadingFeatures(true);
        try {
            const res = await fetch(`${API_BASE_URL_IA}/modelo/info`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Erro ao buscar importâncias');

            const importances = data.features_importances;
            const topN = 15;
            const entries = Object.entries(importances).sort(([, a], [, b]) => b - a);

            setFeaturesData({
                labels: entries.slice(0, topN).map(([key]) => key.length > 12 ? key.substring(0, 12) + '...' : key),
                datasets: [{ data: entries.slice(0, topN).map(([, value]) => value) }]
            });
        } catch (error) {
            console.error("Erro ao carregar importâncias (IA):", error);
            alert("Não foi possível carregar o gráfico de importâncias.");
        } finally {
            setLoadingFeatures(false);
        }
    }, []);

    useEffect(() => {
        fetchFeatureImportance();
    }, [fetchFeatureImportance]);

    const handleInputChange = (name, value) => {
        setFormState(prevState => ({ ...prevState, [name]: value }));
    };

    const handlePredict = async () => {
        setLoadingPrediction(true);
        setPredictionResult(null);
        const payload = {};
        for (const key in formState) {
            const value = formState[key];
            if (['Idade Registrada', 'Estatura (cm)', 'Idade Estimada (Min)', 'Idade Estimada (Max)'].includes(key) && value) {
                payload[key] = parseFloat(value);
            } else {
                payload[key] = value;
            }
        }
        try {
            const response = await fetch(`${API_BASE_URL_IA}/predizer_status_identificacao`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erro na predição');
            setPredictionResult(data);
        } catch (error) {
            console.error("Erro na predição IA:", error);
            setPredictionResult({ error: error.message });
        } finally {
            setLoadingPrediction(false);
        }
    };

    const chartConfig = {
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
        barPercentage: 0.4,
        decimalPlaces: 3,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        propsForLabels: { fontSize: 9 },
    };

    // Lista de campos do formulário para renderização dinâmica
    const formFields = [
        // Campos que agora são Seletores
        { name: 'Gênero', type: 'select', options: genderOptions },
        { name: 'Etnia/Raça', type: 'select', options: ethnicityOptions },
        { name: 'Causa Primária Morte', type: 'select', options: causeOfDeathOptions },
        // Campos que continuam como TextInput
        { name: 'Idade Registrada', type: 'input', keyboard: 'numeric' },
        { name: 'Estatura (cm)', type: 'input', keyboard: 'numeric' },
        { name: 'Latitude', type: 'input', keyboard: 'numeric' },
        { name: 'Longitude', type: 'input', keyboard: 'numeric' },
        { name: 'Idade Estimada (Min)', type: 'input', keyboard: 'numeric' },
        { name: 'Idade Estimada (Max)', type: 'input', keyboard: 'numeric' },
    ];

    return (
        <ScrollView>
            <ChartCard title="Importância das Features (Top 11)" isLoading={loadingFeatures}>
                {featuresData && (
                    <BarChart
                        data={featuresData}
                        width={screenWidth - 16} // Ajuste para o padding do ChartCard
                        height={400}
                        chartConfig={chartConfig}
                        verticalLabelRotation={90}
                        fromZero={true}
                        yAxisLabel=""
                        yAxisSuffix=""
                        style={styles.chartStyle}
                    />
                )}
            </ChartCard>

            <Card style={styles.card}>
                <Card.Content>
                    <Title>Predizer Status de Identificação</Title>

                    {/* Renderização dinâmica do formulário */}
                    {formFields.map(field => {
                        if (field.type === 'select') {
                            return (
                                <SelectMenu
                                    key={field.name}
                                    label={field.name}
                                    value={formState[field.name]}
                                    options={field.options}
                                    onSelect={(value) => handleInputChange(field.name, value)}
                                    placeholder={`Selecione ${field.name}...`}
                                />
                            );
                        }
                        return (
                            <TextInput
                                key={field.name}
                                label={field.name}
                                value={String(formState[field.name])} // Converte para string para evitar erro com números
                                onChangeText={(text) => handleInputChange(field.name, text)}
                                style={styles.input}
                                mode="outlined"
                                dense
                                keyboardType={field.keyboard}
                            />
                        );
                    })}

                    <Button
                        mode="contained"
                        onPress={handlePredict}
                        loading={loadingPrediction}
                        disabled={loadingPrediction}
                        style={styles.button}
                    >
                        {loadingPrediction ? 'Predizendo...' : 'Predizer'}
                    </Button>

                    {predictionResult && (
                        <View style={styles.resultContainer}>
                            <Divider style={styles.divider} />
                            <Title style={styles.resultTitle}>Resultado da Predição</Title>
                            {predictionResult.error ? (
                                <Text style={styles.errorText}>{predictionResult.error}</Text>
                            ) : (
                                <>
                                    <List.Item title="Status Predito" description={predictionResult.status_identificacao_predito} left={props => <List.Icon {...props} icon="brain" />} />
                                    <Divider />
                                    <List.Subheader>Probabilidades</List.Subheader>
                                    {Object.entries(predictionResult.probabilidades).map(([key, value]) => (
                                        <List.Item key={key} title={key} description={`${(value * 100).toFixed(2)}%`} left={props => <List.Icon {...props} icon="chart-pie" />} />
                                    ))}
                                </>
                            )}
                        </View>
                    )}
                </Card.Content>
            </Card>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    card: {
        margin: 16,
    },
    input: {
        marginTop: 12,
    },
    button: {
        marginTop: 20,
    },
    chartStyle: {
        marginVertical: 8,
        borderRadius: 16,
    },
    divider: {
        marginVertical: 16,
    },
    resultContainer: {
        marginTop: 16,
    },
    resultTitle: {
        textAlign: 'center',
        marginBottom: 8,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        padding: 16
    }
});

export default IADashboard;