import React, { useState, useCallback } from 'react';
import { ScrollView, View, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, Title, List, ActivityIndicator, Divider, Provider as PaperProvider, Button as PaperButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const API_URL = 'https://odonto-legal-backend.onrender.com';

const DetailItem = ({ label, value, icon }) => {
    if (!value && value !== 0 && typeof value !== 'boolean') return null;
    const displayValue = typeof value === 'boolean' ? (value ? 'Sim' : 'Não') : String(value);
    return <List.Item title={displayValue} description={label} left={props => <List.Icon {...props} icon={icon} />} titleNumberOfLines={5}/>;
};

const ConsultaVictimDetailsScreen = ({ route }) => {
    const { victimId, caseId } = route.params;
    const navigation = useNavigation();

    const [victimData, setVictimData] = useState(null);
    const [allOdontograms, setAllOdontograms] = useState([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            const loadAllData = async () => {
                setLoading(true);
                const token = await AsyncStorage.getItem('token');
                try {
                    const [victimRes, odontoRes] = await Promise.all([
                        fetch(`${API_URL}/api/victim/${victimId}`, { headers: { 'Authorization': `Bearer ${token}` } }),
                        fetch(`${API_URL}/api/odontogram/victim/${victimId}`, { headers: { 'Authorization': `Bearer ${token}` } })
                    ]);
                    const victimDetails = await victimRes.json();
                    if (!victimRes.ok) throw new Error(victimDetails.message || 'Erro ao carregar vítima');
                    setVictimData(victimDetails);
                    const odontoData = await odontoRes.json();
                    if (odontoRes.ok) setAllOdontograms(Array.isArray(odontoData) ? odontoData : []);
                } catch (error) {
                    Alert.alert("Erro", error.message);
                } finally {
                    setLoading(false);
                }
            };
            loadAllData();
        }, [victimId])
    );
    
    const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : null;

    const postMortemOdontogram = allOdontograms.find(o => o.odontogramType === 'post_mortem');
    const anteMortemOdontograms = allOdontograms.filter(o => o.odontogramType === 'ante_mortem_registro');

    const navigateToOdontogram = (odontogramId) => {
        // Navega para a versão de consulta do odontograma
        navigation.navigate('ConsultaOdontograma', { victimId, caseId, odontogramId });
    };

    if (loading) return <ActivityIndicator size="large" style={styles.centered} />;
    if (!victimData) return <View style={styles.centered}><Title>Vítima não encontrada.</Title></View>;
    
    return (
        <PaperProvider>
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View style={styles.header}>
                        <Title style={styles.mainTitle}>{victimData.name || victimData.victimCode}</Title>
                        <Text>Caso: {victimData.case?.nameCase || caseId}</Text>
                    </View>

                    <List.AccordionGroup>
                        <Card style={styles.card}><List.Accordion title="Identificação" id="1" titleStyle={styles.accordionTitle}>
                            <DetailItem icon="identifier" label="Código da Vítima" value={victimData.victimCode} />
                            <DetailItem icon="account-question-outline" label="Status" value={victimData.identificationStatus} />
                            <DetailItem icon="account" label="Nome" value={victimData.name} />
                        </List.Accordion></Card>

                        {/* Adicione outras seções de detalhes aqui, como Dados Demográficos, etc. */}

                        <Card style={styles.card}><List.Accordion title="Dados Odontológicos" id="odontology" expanded>
                            <List.Item
                                title="Odontograma Post-Mortem"
                                description={postMortemOdontogram ? `Visualizar registro de ${formatDate(postMortemOdontogram.examinationDate)}` : 'Não registrado'}
                                left={props => <List.Icon {...props} icon="tooth-outline" />}
                                right={props => postMortemOdontogram ? <List.Icon {...props} icon="chevron-right" /> : null}
                                onPress={postMortemOdontogram ? () => navigateToOdontogram(postMortemOdontogram._id) : null}
                            />
                            <Divider />
                            <List.Subheader>Registros Ante-Mortem</List.Subheader>
                            {anteMortemOdontograms.length > 0 ? (
                                anteMortemOdontograms.map(am => (
                                    <List.Item
                                        key={am._id}
                                        title={am.dentalRecordSource || `Registro de ${formatDate(am.examinationDate)}`}
                                        left={props => <List.Icon {...props} icon="file-document-outline" />}
                                        right={props => <List.Icon {...props} icon="chevron-right" />}
                                        onPress={() => navigateToOdontogram(am._id)}
                                    />
                                ))
                            ) : (
                                <Text style={styles.emptyText}>Nenhum registro ante-mortem.</Text>
                            )}
                        </List.Accordion></Card>
                    </List.AccordionGroup>
                </ScrollView>
            </SafeAreaView>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f1f5f9' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { padding: 20, alignItems: 'center', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
    mainTitle: { fontSize: 24, fontWeight: '700', color: '#1e3a8a' },
    card: { marginHorizontal: 16, marginVertical: 8, elevation: 1 },
    accordionTitle: { color: '#1e40af', fontWeight: 'bold' },
    emptyText: { paddingHorizontal: 16, paddingBottom: 16, fontStyle: 'italic', color: '#64748b' },
});

export default ConsultaVictimDetailsScreen;