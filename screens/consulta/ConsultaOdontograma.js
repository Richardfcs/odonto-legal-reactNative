import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Alert } from 'react-native';
import { Title, List, ActivityIndicator, Divider, Provider as PaperProvider, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://odonto-legal-backend.onrender.com';

const fdiPermanentTeeth = [ "18", "17", "16", "15", "14", "13", "12", "11", "21", "22", "23", "24", "25", "26", "27", "28", "48", "47", "46", "45", "44", "43", "42", "41", "31", "32", "33", "34", "35", "36", "37", "38" ];

const ConsultaOdontogramaScreen = ({ route }) => {
    const { odontogramId } = route.params;
    const [odontogramData, setOdontogramData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOdontogram = async () => {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');
            try {
                const res = await fetch(`${API_URL}/api/odontogram/${odontogramId}`, { headers: { 'Authorization': `Bearer ${token}` } });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Erro ao carregar odontograma');
                setOdontogramData(data);
            } catch (error) {
                Alert.alert("Erro", error.message);
            } finally {
                setLoading(false);
            }
        };
        if (odontogramId) {
            loadOdontogram();
        } else {
            Alert.alert("Erro", "ID do Odontograma não fornecido.");
            setLoading(false);
        }
    }, [odontogramId]);

    const renderToothDetail = (fdi) => {
        const tooth = odontogramData?.teeth?.find(t => t.fdiNumber === fdi);
        if (!tooth || tooth.status === 'nao_examinado') return null; // Não mostra dentes não examinados

        return (
            <List.Item
                key={fdi}
                title={`Dente ${fdi}: ${tooth.status}`}
                description={tooth.observations || 'Sem observações.'}
                left={props => <List.Icon {...props} icon="tooth" />}
            />
        );
    };

    if (loading) return <ActivityIndicator size="large" style={styles.centered} />;
    if (!odontogramData) return <View style={styles.centered}><Title>Odontograma não encontrado.</Title></View>;
    
    return (
        <PaperProvider>
            <View style={styles.container}>
                <ScrollView>
                    <Title style={styles.title}>Consulta de Odontograma</Title>
                    <List.Section title="Informações Gerais">
                        <List.Item title={odontogramData.odontogramType} description="Tipo" left={props => <List.Icon {...props} icon="file-document-outline" />} />
                        <List.Item title={new Date(odontogramData.examinationDate).toLocaleDateString('pt-BR')} description="Data do Exame" left={props => <List.Icon {...props} icon="calendar" />} />
                    </List.Section>
                    <Divider />
                    <List.Section title="Registro Dentário">
                        {fdiPermanentTeeth.map(fdi => renderToothDetail(fdi))}
                    </List.Section>
                    <Divider />
                    <List.Section title="Observações e Sumário">
                         <List.Item title={odontogramData.generalObservations || "N/A"} description="Observações Gerais" left={props => <List.Icon {...props} icon="comment-text-outline" />} titleNumberOfLines={10} />
                         <List.Item title={odontogramData.summaryForIdentification || "N/A"} description="Sumário para Identificação" left={props => <List.Icon {...props} icon="text-box-search-outline" />} titleNumberOfLines={10} />
                    </List.Section>
                </ScrollView>
            </View>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f1f5f9' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { padding: 20, textAlign: 'center', fontSize: 22, fontWeight: 'bold' }
});

export default ConsultaOdontogramaScreen;