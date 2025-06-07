import React, { useState, useCallback, useLayoutEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator, Menu, Appbar, Divider, Provider as PaperProvider, Dialog, Portal, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { jwtDecode } from 'jwt-decode';
import "core-js/stable/atob"; // Necessário para jwt-decode funcionar em alguns ambientes

import CasoUserTabNavigator from '../navigators/CasoUserTabNavigator'; // Importa o novo navegador de abas
import { exportDataAsCsv } from './utils/exportUtils';

const API_URL = 'https://odonto-legal-backend.onrender.com';

const DetalhesCasoUserScreen = ({ route, navigation }) => {
    const { caseId } = route.params;

    const [caseData, setCaseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [menuVisible, setMenuVisible] = useState(false);
    const [isResponsible, setIsResponsible] = useState(false); // Estado para controlar se o usuário é o responsável
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [exportingCase, setExportingCase] = useState(false);

    const handleExportCase = async () => {
        if (!caseData) return;

        setExportingCase(true);
        setMenuVisible(false); // Fecha o menu
        
        try {
            // Prepara os dados do caso para exportação
            const caseDetails = {
                id_caso: caseData._id,
                nome_caso: caseData.nameCase,
                status: caseData.status,
                local: caseData.location,
                categoria: caseData.category,
                data_caso: new Date(caseData.dateCase).toLocaleDateString('pt-BR'),
                perito_responsavel: caseData.responsibleExpert?.name,
                descricao: caseData.Description,
            };

            // Para exportar em um único arquivo, podemos criar um array com um único objeto
            await exportDataAsCsv([caseDetails], `Relatorio_Caso_${caseData.nameCase}`);

        } catch (error) {
            Alert.alert("Erro de Exportação", "Não foi possível gerar o relatório do caso.");
        } finally {
            setExportingCase(false);
        }
    };

    const checkPermissions = useCallback(async (responsibleExpertId) => {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        try {
            const decodedToken = jwtDecode(token);
            if (decodedToken.id === responsibleExpertId) {
                setIsResponsible(true);
            } else {
                setIsResponsible(false);
            }
        } catch (e) {
            console.error("Erro ao decodificar token:", e);
            setIsResponsible(false);
        }
    }, []);

    const handleDeleteCase = async () => {
        setDeleteDialogVisible(false);
        const token = await AsyncStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/api/case/${caseId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || 'Erro ao excluir caso');
            Alert.alert("Sucesso", "Caso excluído com sucesso!");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Erro", error.message);
        }
    };


    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                setLoading(true);
                const token = await AsyncStorage.getItem('token');
                try {
                    const res = await fetch(`${API_URL}/api/case/${caseId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.message || 'Erro ao carregar o caso');
                    setCaseData(data);
                    await checkPermissions(data.responsibleExpert?._id);
                } catch (error) {
                    Alert.alert("Erro", error.message);
                } finally {
                    setLoading(false);
                }
            };
            loadData();
        }, [caseId, checkPermissions])
    );

    // Adiciona o menu de opções no header da tela SOMENTE se o usuário for o responsável
    useLayoutEffect(() => {
        if (isResponsible) {
            navigation.setOptions({
                headerRight: () => (
                    exportingCase ? <ActivityIndicator style={{ marginRight: 16 }} /> :
                    <Menu
                        visible={menuVisible}
                        onDismiss={() => setMenuVisible(false)}
                        anchor={<Appbar.Action icon="dots-vertical" onPress={() => setMenuVisible(true)} />}
                    >
                        <Menu.Item
                            onPress={() => {
                                navigation.navigate('UserEditCase', { caseId });
                                setMenuVisible(false);
                            }}
                            title="Editar Caso"
                        />
                        <Menu.Item
                            onPress={() => {
                                setDeleteDialogVisible(true);
                                setMenuVisible(false);
                            }}
                            title="Excluir Caso"
                        />
                        <Menu.Item onPress={handleExportCase} title="Exportar Relatório do Caso" />
                    </Menu>
                ),
            });
        } else {
            // Garante que o menu não seja exibido para outros membros da equipe
            navigation.setOptions({ headerRight: null });
        }
    }, [navigation, menuVisible, isResponsible, exportingCase]);

    if (loading) return <ActivityIndicator size="large" style={styles.centered} />;
    if (!caseData) return <View style={styles.centered}><Title>Caso não encontrado</Title></View>;

    return (
        <PaperProvider>
            <View style={styles.container} edges={['bottom', 'left', 'right']}>
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

                <CasoUserTabNavigator caseId={caseId} />

                <Portal>
                    <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
                        <Dialog.Title>Confirmar Exclusão</Dialog.Title>
                        <Dialog.Content>
                            <Paragraph>Tem certeza que deseja excluir este caso e todos os seus dados associados? A ação é irreversível.</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => setDeleteDialogVisible(false)}>Cancelar</Button>
                            <Button onPress={handleDeleteCase} labelStyle={{ color: 'red' }}>Excluir</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </View>
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

export default DetalhesCasoUserScreen;