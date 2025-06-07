import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Title, Paragraph, ActivityIndicator, Divider, Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

// Você precisa corrigir o nome do seu navegador no import
import CasoConsultaTabNavigator from '../../navigators/CasoConsultaTabNavigator'; 

const API_URL = 'https://odonto-legal-backend.onrender.com';

const DetalhesCasoConsultaScreen = ({ route }) => {
  const { caseId } = route.params;

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
        const loadData = async () => {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');
            try {
                const res = await fetch(`${API_URL}/api/case/${caseId}`, { headers: { 'Authorization': `Bearer ${token}` } });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Erro ao carregar o caso');
                setCaseData(data);
            } catch (error) {
                Alert.alert("Erro", error.message);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [caseId])
  );

  if (loading) return <ActivityIndicator size="large" style={styles.centered} />;
  if (!caseData) return <View style={styles.centered}><Title>Caso não encontrado</Title></View>;
  
  return (
    <PaperProvider>
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
            <Card style={styles.headerCard}>
                <Card.Content>
                    <Title>{caseData.nameCase}</Title>
                    <Paragraph>{caseData.Description}</Paragraph>
                    <Divider style={styles.divider} />
                    <View style={styles.detailsRow}>
                        <Paragraph><Title style={styles.detailTitle}>Status:</Title> {caseData.status} </Paragraph>
                        <Paragraph><Title style={styles.detailTitle}>Local:</Title> {caseData.location} </Paragraph>
                    </View>
                </Card.Content>
            </Card>

            {/* Renderiza o navegador de abas de consulta */}
            <CasoConsultaTabNavigator caseId={caseId} />
        </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerCard: { margin: 8, elevation: 2, backgroundColor: '#fff' },
  divider: { marginVertical: 8 },
  detailsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  detailTitle: { fontSize: 16, color: '#1e40af', fontWeight: 'bold' }
});

export default DetalhesCasoConsultaScreen;