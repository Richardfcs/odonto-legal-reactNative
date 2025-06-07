import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Button, ActivityIndicator, Text, Card, Title } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';

import UserEvidenceCard from '../../components/UserEvidenceCard'; // Novo card para evidências
import UserEvidenceModal from '../../components/UserEvidenceModal'; // Novo modal para evidências
import { exportDataAsCsv } from '../utils/exportUtils';

const API_URL = 'https://odonto-legal-backend.onrender.com';

const EvidenciasUserTab = ({ caseId }) => {
    const [evidences, setEvidences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingEvidence, setEditingEvidence] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const [exporting, setExporting] = useState(false)

    const [evidencesWithLocation, setEvidencesWithLocation] = useState([]);

    const handleExportEvidences = async () => {
        if (selectedIds.length === 0) {
            Alert.alert("Nenhuma Seleção", "Selecione pelo menos uma evidência para exportar.");
            return;
        }
        setExporting(true);
        try {
            // Filtra as evidências completas com base nos IDs selecionados
            const evidencesToExport = evidences.filter(e => selectedIds.includes(e._id));

            // Simplifica os dados para a exportação
            const simplifiedData = evidencesToExport.map(e => ({
                id: e._id,
                titulo: e.title,
                tipo: e.evidenceType,
                descricao: e.description,
                categoria: e.category,
                dados: (e.evidenceType !== 'image') ? e.data : 'Ver imagem original',
                coletado_por: e.collectedBy?.name,
                data_coleta: new Date(e.createdAt).toLocaleString('pt-BR'),
                latitude: e.location?.coordinates[1],
                longitude: e.location?.coordinates[0],
            }));

            await exportDataAsCsv(simplifiedData, `Relatorio_Evidencias_Caso_${caseId}`);
        } catch (error) {
            Alert.alert("Erro de Exportação", "Não foi possível gerar o relatório.");
        } finally {
            setExporting(false);
        }
    };

    const fetchEvidences = useCallback(async () => {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/api/evidence/${caseId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Erro ao buscar evidências');

            const allEvidences = data.evidences || [];
            setEvidences(allEvidences);

            const geoEvidences = allEvidences.filter(e =>
                e.location && e.location.coordinates && e.location.coordinates.length === 2
            );
            setEvidencesWithLocation(geoEvidences);

        } catch (error) {
            Alert.alert("Erro", error.message);
        } finally {
            setLoading(false);
        }
    }, [caseId]);

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchEvidences();
        }, [fetchEvidences])
    );

    const handleOpenModal = (evidence = null) => {
        setEditingEvidence(evidence);
        setIsModalVisible(true);
    };

    const handleSubmit = async (formData) => {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        const isEditing = !!editingEvidence;
        const url = isEditing ? `${API_URL}/api/evidence/${editingEvidence._id}` : `${API_URL}/api/evidence/${caseId}`;
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(formData)
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || 'Erro ao salvar evidência');

            Alert.alert("Sucesso", `Evidência ${isEditing ? 'atualizada' : 'adicionada'} com sucesso.`);
            setIsModalVisible(false);
            setEditingEvidence(null);
            await fetchEvidences();
        } catch (error) {
            Alert.alert("Erro", error.message);
            setLoading(false);
        }
    };

    const handleDelete = (evidenceId) => {
        Alert.alert("Confirmar Exclusão", "Tem certeza que deseja excluir esta evidência?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Excluir", style: 'destructive', onPress: async () => {
                    setLoading(true);
                    const token = await AsyncStorage.getItem('token');
                    try {
                        const res = await fetch(`${API_URL}/api/evidence/${evidenceId}`, {
                            method: 'DELETE',
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        const result = await res.json();
                        if (!res.ok) throw new Error(result.message || 'Erro ao excluir');
                        Alert.alert("Sucesso", "Evidência excluída.");
                        await fetchEvidences();
                    } catch (error) {
                        Alert.alert("Erro", error.message);
                        setLoading(false);
                    }
                }
            },
        ]);
    };

    const handleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const renderMap = () => {
        if (evidencesWithLocation.length === 0) {
            return null;
        }
        const initialRegion = {
            latitude: evidencesWithLocation[0].location.coordinates[1],
            longitude: evidencesWithLocation[0].location.coordinates[0],
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
        };
        return (
            <Card style={styles.mapCard}>
                <Card.Content>
                    <Title>Mapa de Evidências</Title>
                    <MapView style={styles.map} initialRegion={initialRegion}>
                        {evidencesWithLocation.map(evidence => (
                            <Marker
                                key={evidence._id}
                                coordinate={{
                                    latitude: evidence.location.coordinates[1],
                                    longitude: evidence.location.coordinates[0],
                                }}
                                title={evidence.title}
                                description={evidence.description}
                            />
                        ))}
                    </MapView>
                </Card.Content>
            </Card>
        );
    };

    if (loading) return <ActivityIndicator style={styles.centered} />;

    return (
        <View style={styles.container}>
            <FlatList
                data={evidences}
                keyExtractor={item => item._id}
                ListHeaderComponent={
                    <>
                        {renderMap()}
                        <View>
                            <View style={styles.buttonContainer}>
                                <Button icon="plus" mode="contained" onPress={() => handleOpenModal(null)}>Adicionar Evidência</Button>
                                <Button
                                    icon="file-document-outline"
                                    mode="outlined"
                                    disabled={selectedIds.length === 0 || exporting}
                                    loading={exporting}
                                    onPress={handleExportEvidences}
                                >
                                    Exportar ({selectedIds.length})
                                </Button>
                            </View>
                        </View>
                    </>
                }
                renderItem={({ item }) => (
                    <UserEvidenceCard // Usando o novo componente de card
                        evidence={item}
                        onEdit={() => handleOpenModal(item)}
                        onDelete={() => handleDelete(item._id)}
                        onSelect={() => handleSelect(item._id)}
                        isSelected={selectedIds.includes(item._id)}
                    />
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma evidência encontrada.</Text>}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
            <UserEvidenceModal // Usando o novo componente de modal
                visible={isModalVisible}
                onDismiss={() => {
                    setIsModalVisible(false);
                    setEditingEvidence(null);
                }}
                onSubmit={handleSubmit}
                initialData={editingEvidence}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f5f9' // Nova cor de fundo
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    mapCard: {
        marginHorizontal: 16,
        marginTop: 16,
        elevation: 2,
        backgroundColor: '#fff'
    },
    map: {
        width: '100%',
        height: 250,
        borderRadius: 8
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 16
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: '#64748b' // Nova cor de texto
    }
});

export default EvidenciasUserTab;