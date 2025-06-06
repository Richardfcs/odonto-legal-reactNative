import React, { useState, useCallback } from 'react';
import { ScrollView, View, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, Title, List, Button, ActivityIndicator, Divider, FAB, Portal, Provider as PaperProvider, Dialog, Paragraph, Button as PaperButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const API_URL = 'https://odonto-legal-backend.onrender.com';

// Componente auxiliar para renderizar um item de detalhe, evitando repetição
const DetailItem = ({ label, value, icon }) => {
    if (!value && value !== 0 && typeof value !== 'boolean') return null; // Não renderiza se o valor for nulo/vazio
    const displayValue = typeof value === 'boolean' ? (value ? 'Sim' : 'Não') : String(value);
    return <List.Item title={displayValue} description={label} left={props => <List.Icon {...props} icon={icon} />} titleNumberOfLines={5}/>;
};

const DetalhesVitimaScreen = ({ route }) => {
    const { victimId, caseId } = route.params;
    const navigation = useNavigation();

    const [victimData, setVictimData] = useState(null);
    const [allOdontograms, setAllOdontograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fabOpen, setFabOpen] = useState(false);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [expandedAccordion, setExpandedAccordion] = useState(null);

    useFocusEffect(
        useCallback(() => {
            const loadAllData = async () => {
                setLoading(true);
                const token = await AsyncStorage.getItem('token');
                try {
                    const [victimResponse, odontoResponse] = await Promise.all([
                        fetch(`${API_URL}/api/victim/${victimId}`, { headers: { 'Authorization': `Bearer ${token}` } }),
                        fetch(`${API_URL}/api/odontogram/victim/${victimId}`, { headers: { 'Authorization': `Bearer ${token}` } })
                    ]);

                    const victimDetails = await victimResponse.json();
                    if (!victimResponse.ok) throw new Error(victimDetails.message || 'Erro ao carregar detalhes da vítima');
                    setVictimData(victimDetails);

                    const odontoData = await odontoResponse.json();
                    if (!odontoResponse.ok) throw new Error(odontoData.message || 'Erro ao carregar odontogramas');
                    setAllOdontograms(Array.isArray(odontoData) ? odontoData : odontoData.odontograms || []);

                } catch (error) {
                    Alert.alert("Erro", error.message);
                } finally {
                    setLoading(false);
                }
            };
            loadAllData();
        }, [victimId])
    );
    
    const handleDeleteVictim = async () => {
        setDeleteDialogVisible(false);
        const token = await AsyncStorage.getItem('token');
        try {
            const response = await fetch(`${API_URL}/api/victim/${victimId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Erro ao excluir vítima');
            Alert.alert("Sucesso", "Vítima excluída com sucesso.");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Erro", error.message);
        }
    };
    
    const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : null;

    const postMortemOdontogram = allOdontograms.find(o => o.odontogramType === 'post_mortem');
    const anteMortemOdontograms = allOdontograms.filter(o => o.odontogramType === 'ante_mortem_registro');

    const navigateToOdontogram = (odontogramType, odontogramId = null) => {
        navigation.navigate('AdminOdontograma', { victimId, caseId, odontogramId, type: odontogramType });
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

                    <List.AccordionGroup onAccordionPress={setExpandedAccordion} expandedId={expandedAccordion}>
                        <Card style={styles.card}><List.Accordion title="Identificação Fundamental" id="1">
                            <DetailItem icon="identifier" label="Código da Vítima" value={victimData.victimCode} />
                            <DetailItem icon="account-question-outline" label="Status de Identificação" value={victimData.identificationStatus} />
                            <DetailItem icon="account" label="Nome" value={victimData.name} />
                        </List.Accordion></Card>
                        
                        <Card style={styles.card}><List.Accordion title="Dados Demográficos" id="2">
                            <DetailItem icon="cake-variant-outline" label="Idade no Óbito" value={victimData.ageAtDeath ? `${victimData.ageAtDeath} anos` : null} />
                            <DetailItem icon="human-male-height" label="Faixa Etária Estimada" value={victimData.estimatedAgeRange ? `${victimData.estimatedAgeRange.min} - ${victimData.estimatedAgeRange.max} anos` : null} />
                            <DetailItem icon="gender-transgender" label="Gênero" value={victimData.gender} />
                            <DetailItem icon="earth" label="Etnia/Raça" value={victimData.ethnicityRace} />
                            <DetailItem icon="ruler" label="Estatura (cm)" value={victimData.statureCm ? `${victimData.statureCm} cm` : null} />
                        </List.Accordion></Card>

                        <Card style={styles.card}><List.Accordion title="Dados Odontológicos" id="3">
                            <List.Item
                                title="Odontograma Post-Mortem"
                                description={postMortemOdontogram ? `Registrado em ${formatDate(postMortemOdontogram.examinationDate)}` : 'Não registrado'}
                                left={props => <List.Icon {...props} icon="tooth-outline" />}
                                right={props => <List.Icon {...props} icon="chevron-right" />}
                                onPress={() => navigateToOdontogram('post_mortem', postMortemOdontogram?._id)}
                            />
                            <Divider />
                            <List.Subheader>Registros Ante-Mortem</List.Subheader>
                            {anteMortemOdontograms.length > 0 ? (
                                anteMortemOdontograms.map(am => (
                                    <List.Item
                                        key={am._id}
                                        title={am.dentalRecordSource || `Registro de ${formatDate(am.examinationDate)}`}
                                        description={`ID: ${am._id.slice(-6)}`}
                                        left={props => <List.Icon {...props} icon="file-document-outline" />}
                                        right={props => <List.Icon {...props} icon="chevron-right" />}
                                        onPress={() => navigateToOdontogram('ante_mortem_registro', am._id)}
                                    />
                                ))
                            ) : (
                                <Text style={styles.emptyText}>Nenhum registro ante-mortem adicionado.</Text>
                            )}
                            <PaperButton icon="plus" mode="contained-tonal" style={styles.addButton} onPress={() => navigateToOdontogram('ante_mortem_registro')}>
                                Adicionar Registro Ante-Mortem
                            </PaperButton>
                        </List.Accordion></Card>

                        <Card style={styles.card}><List.Accordion title="Contexto e Dados Forenses" id="4">
                            <DetailItem icon="calendar-clock" label="Data do Óbito" value={formatDate(victimData.dateOfDeath)} />
                            <DetailItem icon="map-marker-radius" label="Tipo de Local (Descoberta)" value={victimData.discoveryLocation?.type} />
                            <DetailItem icon="help-circle-outline" label="Circunstância da Morte" value={victimData.mannerOfDeath} />
                            <DetailItem icon="medical-bag" label="Causa Primária da Morte" value={victimData.causeOfDeathPrimary} />
                            <Divider style={{ marginVertical: 8 }} />
                            <DetailItem icon="test-tube" label="Triagem Toxicológica" value={victimData.toxicologyScreening?.performed} />
                            <DetailItem icon="dna" label="Amostra de DNA Coletada" value={victimData.dnaAnalysis?.sampleCollected} />
                            <DetailItem icon="fingerprint" label="Impressões Digitais Coletadas" value={victimData.fingerprintAnalysis?.collected} />
                        </List.Accordion></Card>

                    </List.AccordionGroup>
                </ScrollView>

                <Portal>
                    <FAB.Group
                        open={fabOpen}
                        icon={fabOpen ? 'close' : 'pencil'}
                        actions={[
                            { icon: 'delete-outline', label: 'Deletar Vítima', onPress: () => setDeleteDialogVisible(true), small: false, color: '#d9534f' },
                            { icon: 'account-edit-outline', label: 'Editar Dados da Vítima', onPress: () => navigation.navigate('AdminEditVictim', { victimId }), small: false },
                        ]}
                        onStateChange={({ open }) => setFabOpen(open)}
                    />
                    <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
                        <Dialog.Title>Confirmar Exclusão</Dialog.Title>
                        <Dialog.Content>
                            <Paragraph>Tem certeza que deseja excluir esta vítima? Todos os dados associados serão perdidos permanentemente.</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => setDeleteDialogVisible(false)}>Cancelar</Button>
                            <Button onPress={handleDeleteVictim} labelStyle={{ color: 'red' }}>Excluir</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </SafeAreaView>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f2f5' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { padding: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#ddd', backgroundColor: 'white' },
    mainTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
    card: { marginHorizontal: 16, marginTop: 16, elevation: 2 },
    emptyText: { paddingHorizontal: 16, paddingBottom: 16, fontStyle: 'italic', color: 'gray' },
    addButton: { margin: 16 }
});

export default DetalhesVitimaScreen;