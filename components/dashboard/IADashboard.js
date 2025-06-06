import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, StyleSheet, useWindowDimensions } from 'react-native';
import { Card, Title, TextInput, Button, List, Divider, Text, ActivityIndicator } from 'react-native-paper';
import { BarChart } from 'react-native-chart-kit';
import ChartCard from './ChartCard';

const API_BASE_URL_IA = "https://backend-graficos.onrender.com/api";

const IADashboard = () => {
    const { width: screenWidth } = useWindowDimensions();
    
    // ... (todos os outros 'useState' continuam os mesmos) ...
    const [loadingFeatures, setLoadingFeatures] = useState(true);
    const [featuresData, setFeaturesData] = useState(null);
    const [formState, setFormState] = useState({
        'Gênero': '', 'Etnia/Raça': '', 'Causa Primária Morte': '', 'Idade Registrada': '',
        'Estatura (cm)': '', 'Latitude': '', 'Longitude': '', 'Idade Estimada (Min)': '', 'Idade Estimada (Max)': ''
    });
    const [loadingPrediction, setLoadingPrediction] = useState(false);
    const [predictionResult, setPredictionResult] = useState(null);

    // ... (a lógica de fetch, handleInput e handlePredict continua a mesma) ...
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

    // ** LÓGICA DO AJUSTE **
    // Configurações para fazer o gráfico caber na tela
    const chartConfig = {
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
        barPercentage: 0.4, // Tornamos as barras mais finas para caberem mais
        decimalPlaces: 3,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        propsForLabels: {
            fontSize: 9, // Diminuímos o tamanho da fonte dos rótulos
        },
    };
    
    const formFields = [
        { name: 'Gênero', keyboard: 'default' },
        { name: 'Etnia/Raça', keyboard: 'default' },
        { name: 'Causa Primária Morte', keyboard: 'default' },
        { name: 'Idade Registrada', keyboard: 'numeric' },
        { name: 'Estatura (cm)', keyboard: 'numeric' },
        { name: 'Latitude', keyboard: 'numeric' },
        { name: 'Longitude', keyboard: 'numeric' },
        { name: 'Idade Estimada (Min)', keyboard: 'numeric' },
        { name: 'Idade Estimada (Max)', keyboard: 'numeric' },
    ];

    return (
        <ScrollView>
            <ChartCard title="Importância das Features (Top 11)" isLoading={loadingFeatures}>
                {featuresData && (
                    // ** O AJUSTE ESTÁ AQUI: SEM SCROLLVIEW **
                    <BarChart
                        data={featuresData}
                        width={screenWidth + 35} // Força a largura do gráfico a ser a da tela (menos padding)
                        height={400}
                        chartConfig={chartConfig} // Usa a nova configuração com barras finas e fontes pequenas
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
                    {formFields.map(field => (
                        <TextInput
                            key={field.name}
                            label={field.name}
                            value={formState[field.name]}
                            onChangeText={(text) => handleInputChange(field.name, text)}
                            style={styles.input}
                            mode="outlined"
                            dense
                            keyboardType={field.keyboard}
                        />
                    ))}
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
        marginVertical: 80,
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