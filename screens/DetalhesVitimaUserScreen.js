import React, { useState, useCallback } from 'react';
import { ScrollView, View, StyleSheet, Alert, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, Title, List, ActivityIndicator, Divider, FAB, Portal, Provider as PaperProvider, Dialog, Paragraph, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const API_URL = 'https://odonto-legal-backend.onrender.com';

// Componente auxiliar para não repetir código
const DetailItem = ({ label, value, icon }) => {
    if (!value && value !== 0 && typeof value !== 'boolean') return null;
    const displayValue = typeof value === 'boolean' ? (value ? 'Sim' : 'Não') : String(value);
    return <List.Item title={displayValue} description={label} left={props => <List.Icon {...props} icon={icon} />} titleNumberOfLines={5} />;
};

const DetalhesVitimaUserScreen = ({ route }) => {
    const { victimId, caseId } = route.params;
    const navigation = useNavigation();

    const [victimData, setVictimData] = useState(null);
    const [allOdontograms, setAllOdontograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fabOpen, setFabOpen] = useState(false);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

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

    const handleDeleteVictim = async () => {
        setDeleteDialogVisible(false);
        const token = await AsyncStorage.getItem('token');
        try {
            const response = await fetch(`${API_URL}/api/victim/${victimId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Erro ao excluir');
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
        navigation.navigate('UserOdontograma', { // Navega para a rota de usuário
            victimId,
            caseId,
            odontogramId,
            type: odontogramType
        });
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

                        <Card style={styles.card}><List.Accordion title="Dados Demográficos" id="2" titleStyle={styles.accordionTitle}>
                            <DetailItem icon="cake-variant-outline" label="Idade no Óbito" value={victimData.ageAtDeath ? `${victimData.ageAtDeath} anos` : null} />
                            <DetailItem icon="human-male-height" label="Faixa Etária Estimada" value={victimData.estimatedAgeRange ? `${victimData.estimatedAgeRange.min} - ${victimData.estimatedAgeRange.max} anos` : null} />
                            <DetailItem icon="gender-transgender" label="Gênero" value={victimData.gender} />
                            <DetailItem icon="earth" label="Etnia/Raça" value={victimData.ethnicityRace} />
                            <DetailItem icon="ruler" label="Estatura (cm)" value={victimData.statureCm ? `${victimData.statureCm} cm` : null} />
                        </List.Accordion></Card>

                        <Card style={styles.card}><List.Accordion title="Dados Odontológicos" id="3" titleStyle={styles.accordionTitle}>
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
                                        left={props => <List.Icon {...props} icon="file-document-outline" />}
                                        right={props => <List.Icon {...props} icon="chevron-right" />}
                                        onPress={() => navigateToOdontogram('ante_mortem_registro', am._id)}
                                    />
                                ))
                            ) : (
                                <Text style={styles.emptyText}>Nenhum registro ante-mortem.</Text>
                            )}
                            <Button
                                icon="plus"
                                mode="contained-tonal"
                                style={styles.addButton}
                                onPress={() => navigateToOdontogram('ante_mortem_registro')}
                            >
                                Adicionar Registro AM
                            </Button>
                        </List.Accordion></Card>
                    </List.AccordionGroup>
                </ScrollView>

                <Portal>
                    <FAB.Group
                        open={fabOpen}
                        icon={fabOpen ? 'close' : 'pencil'}
                        actions={[
                            { icon: 'delete', label: 'Deletar Vítima', onPress: () => setDeleteDialogVisible(true), small: false },

                            // AÇÃO ATUALIZADA
                            {
                                icon: 'account-edit',
                                label: 'Editar Dados',
                                onPress: () => navigation.navigate('UserEditVictim', { victimId }), // Navega para a nova tela
                                small: false
                            },
                        ]}
                        onStateChange={({ open }) => setFabOpen(open)}
                    />
                    <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
                        <Dialog.Title>Confirmar Exclusão</Dialog.Title>
                        <Dialog.Content><Paragraph>Tem certeza que deseja excluir esta vítima?</Paragraph></Dialog.Content>
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
    container: { flex: 1, backgroundColor: '#f1f5f9' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { padding: 20, alignItems: 'center', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
    mainTitle: { fontSize: 24, fontWeight: '700', color: '#1e3a8a' },
    card: { marginHorizontal: 16, marginVertical: 8, elevation: 1 },
    accordionTitle: { color: '#1e40af', fontWeight: 'bold' },
    emptyText: { paddingHorizontal: 16, paddingBottom: 16, fontStyle: 'italic', color: '#64748b' },
    addButton: { margin: 16 }
});

export default DetalhesVitimaUserScreen;