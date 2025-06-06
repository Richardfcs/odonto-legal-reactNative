import React, { useState, useCallback } from 'react';
import { ScrollView, View, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, Title, List, Button, ActivityIndicator, Divider, Dialog, Paragraph, FAB, Portal, Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const API_URL = 'https://odonto-legal-backend.onrender.com';

// Componente auxiliar para renderizar um item de detalhe, evitando repetição
const DetailItem = ({ label, value, icon }) => {
    if (!value) return null; // Não renderiza se o valor for nulo ou vazio
    return <List.Item title={value} description={label} left={props => <List.Icon {...props} icon={icon} />} titleNumberOfLines={5} />;
};

const DetalhesVitimaScreen = ({ route }) => {
    const { victimId, caseId } = route.params;
    const navigation = useNavigation();

    const [victimData, setVictimData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fabOpen, setFabOpen] = useState(false);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const loadVictimDetails = async () => {
                setLoading(true);
                const token = await AsyncStorage.getItem('token');
                try {
                    const response = await fetch(`${API_URL}/api/victim/${victimId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await response.json();
                    if (!response.ok) throw new Error(data.message || 'Erro ao carregar detalhes da vítima');
                    setVictimData(data);
                } catch (error) {
                    Alert.alert("Erro", error.message);
                } finally {
                    setLoading(false);
                }
            };
            loadVictimDetails();
        }, [victimId])
    );

    // Função para navegar para o odontograma
    const handleManageOdontogram = () => {
        const odontogramId = victimData?.odontogram?._id;
        navigation.navigate('AdminOdontograma', {
            victimId: victimId,
            caseId: caseId,
            odontogramId: odontogramId,
            type: 'post_mortem'
        });
    };

    // FUNÇÃO PARA LIDAR COM A EXCLUSÃO
    const handleDeleteVictim = async () => {
        setDeleteDialogVisible(false); // Fecha o diálogo
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

                        {/* Seção de Odontogramas */}
                        <Card style={styles.card}><List.Accordion title="Dados Odontológicos" id="3">
                            <List.Item
                                title="Odontograma Post-Mortem"
                                description={victimData.odontogram ? `Registrado em ${formatDate(victimData.odontogram.examinationDate)}` : 'Não registrado'}
                                left={props => <List.Icon {...props} icon="tooth-outline" />}
                                onPress={() => { /* Navegar para odontograma PM */ }}
                            />
                            {/* Aqui podemos mapear e listar os odontogramas AM */}
                        </List.Accordion></Card>

                        {/* Mais seções podem ser adicionadas aqui seguindo o mesmo padrão... */}

                    </List.AccordionGroup>
                </ScrollView>

                <Portal>
                    <FAB.Group
                        open={fabOpen}
                        icon={fabOpen ? 'close' : 'pencil'}
                        actions={[
                            // AÇÃO DE DELETAR AGORA ABRE O DIÁLOGO
                            { icon: 'delete-outline', label: 'Deletar Vítima', onPress: () => setDeleteDialogVisible(true), small: false },
                            {
                                icon: 'file-chart-outline',
                                label: 'Gerenciar Odontograma',
                                onPress: handleManageOdontogram, // Conectado aqui
                                small: false
                            },
                            // AÇÃO DE EDITAR AGORA NAVEGA PARA A TELA DE EDIÇÃO
                            { icon: 'account-edit-outline', label: 'Editar Vítima', onPress: () => navigation.navigate('AdminEditVictim', { victimId }), small: false },
                        ]}
                        onStateChange={({ open }) => setFabOpen(open)}
                    />

                    {/* DIÁLOGO DE CONFIRMAÇÃO PARA EXCLUSÃO */}
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
    header: { padding: 20, alignItems: 'center' },
    mainTitle: { fontSize: 24, fontWeight: 'bold' },
    card: { marginHorizontal: 16, marginBottom: 12 },
});

export default DetalhesVitimaScreen;