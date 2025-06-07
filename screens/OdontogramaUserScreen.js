import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Alert, Platform } from 'react-native';
import { TextInput, Button, Title, List, Provider as PaperProvider, Divider, ActivityIndicator, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import ToothEditModal from '../components/ToothEditModal'; // O caminho pode ser ../
import SelectMenu from '../components/SelectMenu';       // O caminho pode ser ../

const API_URL = 'https://odonto-legal-backend.onrender.com';
const fdiPermanentTeeth = [ "18", "17", "16", "15", "14", "13", "12", "11", "21", "22", "23", "24", "25", "26", "27", "28", "48", "47", "46", "45", "44", "43", "42", "41", "31", "32", "33", "34", "35", "36", "37", "38" ];

const OdontogramaUserScreen = ({ route }) => {
    const navigation = useNavigation();
    const { victimId, caseId, odontogramId, type } = route.params;

    const [isEditMode, setIsEditMode] = useState(!!odontogramId);
    const [loading, setLoading] = useState(isEditMode);
    const [saving, setSaving] = useState(false);
    
    // Estados do formulário
    const [odontogramType, setOdontogramType] = useState(type || 'post_mortem');
    const [examinationDate, setExaminationDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [generalObservations, setGeneralObservations] = useState('');
    const [summary, setSummary] = useState('');
    const [teethData, setTeethData] = useState({});
    
    const [isToothModalVisible, setIsToothModalVisible] = useState(false);
    const [selectedTooth, setSelectedTooth] = useState(null);

    useEffect(() => {
        const initializeForm = async () => {
            if (isEditMode) {
                setLoading(true);
                const token = await AsyncStorage.getItem('token');
                try {
                    const res = await fetch(`${API_URL}/api/odontogram/${odontogramId}`, { headers: { 'Authorization': `Bearer ${token}` } });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.message || 'Erro ao carregar odontograma');
                    
                    setOdontogramType(data.odontogramType);
                    setExaminationDate(new Date(data.examinationDate));
                    setGeneralObservations(data.generalObservations || '');
                    setSummary(data.summaryForIdentification || '');

                    const teethObject = {};
                    fdiPermanentTeeth.forEach(fdi => {
                        const tooth = data.teeth.find(t => t.fdiNumber === fdi);
                        teethObject[fdi] = tooth || { fdiNumber: fdi, status: 'nao_examinado', observations: '' };
                    });
                    setTeethData(teethObject);

                } catch (error) {
                    Alert.alert("Erro", "Não foi possível carregar os dados do odontograma. " + error.message);
                    navigation.goBack();
                } finally { setLoading(false); }
            } else {
                const initialTeeth = {};
                fdiPermanentTeeth.forEach(fdi => {
                    initialTeeth[fdi] = { fdiNumber: fdi, status: 'nao_examinado', observations: '' };
                });
                setTeethData(initialTeeth);
            }
        };
        initializeForm();
    }, [isEditMode, odontogramId]);

    const handleOpenToothModal = (fdi) => {
        setSelectedTooth(teethData[fdi]);
        setIsToothModalVisible(true);
    };

    const handleSaveTooth = (updatedTooth) => {
        setTeethData(prev => ({ ...prev, [updatedTooth.fdiNumber]: updatedTooth }));
    };
    
    const handleSaveOdontograma = async () => {
        setSaving(true);
        const token = await AsyncStorage.getItem('token');
        const payload = {
            victim: victimId,
            case: caseId,
            odontogramType,
            examinationDate: examinationDate.toISOString().split('T')[0],
            generalObservations: generalObservations.trim() || undefined,
            summaryForIdentification: summary.trim() || undefined,
            teeth: Object.values(teethData),
        };
        
        const url = isEditMode ? `${API_URL}/api/odontogram/${odontogramId}` : `${API_URL}/api/odontogram`;
        const method = isEditMode ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || result.message || 'Erro ao salvar odontograma.');

            Alert.alert("Sucesso", `Odontograma ${isEditMode ? 'atualizado' : 'criado'} com sucesso!`);
            navigation.goBack();
        } catch (error) {
            Alert.alert("Erro", error.message);
        } finally {
            setSaving(false);
        }
    };
    
    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) { setExaminationDate(selectedDate); }
    };

    if (loading) return <ActivityIndicator size="large" style={styles.centered} />;
    
    return (
        <PaperProvider>
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.content}>
                        <Title style={styles.title}>{isEditMode ? 'Editar Odontograma' : 'Novo Odontograma'}</Title>
                        
                        <List.AccordionGroup>
                            <List.Accordion title="Informações Gerais" id="1" expanded>
                                <View style={styles.accordionContent}>
                                    <SelectMenu label="Tipo de Odontograma" value={odontogramType} options={[{label: 'Post-Mortem', value: 'post_mortem'}, {label: 'Ante-Mortem', value: 'ante_mortem_registro'}]} onSelect={setOdontogramType} placeholder="Selecione..."/>
                                    <Button icon="calendar" mode="outlined" style={{marginTop: 10}} onPress={() => setShowDatePicker(true)}>
                                        Data do Exame: {examinationDate.toLocaleDateString('pt-BR')}
                                    </Button>
                                    {showDatePicker && <DateTimePicker value={examinationDate} mode="date" display="default" onChange={onDateChange}/>}
                                </View>
                            </List.Accordion>

                            <List.Accordion title="Registro Dentário" id="2" expanded>
                                <Text style={styles.infoText}>Toque em um dente para registrar suas informações.</Text>
                                <View style={styles.teethGrid}>
                                    {fdiPermanentTeeth.map(fdi => {
                                        const hasData = teethData[fdi]?.status && teethData[fdi]?.status !== 'nao_examinado';
                                        return <Button key={fdi} mode={hasData ? "contained" : "outlined"} style={styles.toothButton} labelStyle={{marginHorizontal:0}} onPress={() => handleOpenToothModal(fdi)}>{fdi}</Button>;
                                    })}
                                </View>
                            </List.Accordion>
                            
                            <List.Accordion title="Observações e Sumário" id="3" expanded>
                                 <View style={styles.accordionContent}>
                                    <TextInput label="Observações Gerais" value={generalObservations} onChangeText={setGeneralObservations} multiline mode="outlined" />
                                    <TextInput label="Sumário para Identificação" value={summary} onChangeText={setSummary} multiline mode="outlined" style={{marginTop: 10}} />
                                </View>
                            </List.Accordion>
                        </List.AccordionGroup>

                        <Button mode="contained" onPress={handleSaveOdontograma} style={styles.saveButton} loading={saving} disabled={saving}>
                            {isEditMode ? "Salvar Alterações" : "Salvar Odontograma"}
                        </Button>
                    </View>
                </ScrollView>
                
                <ToothEditModal visible={isToothModalVisible} onDismiss={() => setIsToothModalVisible(false)} toothData={selectedTooth} onSave={handleSaveTooth} />
            </View>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f1f5f9' },
    content: { padding: 8 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { textAlign: 'center', marginVertical: 16, fontSize: 22, fontWeight: '700', color: '#1e3a8a' },
    infoText: { textAlign: 'center', marginVertical: 10, color: '#64748b' },
    accordionContent: { padding: 8 },
    teethGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 10 },
    toothButton: { margin: 2, minWidth: 65 },
    saveButton: { margin: 16, paddingVertical: 6, backgroundColor: '#1e40af' },
});

export default OdontogramaUserScreen;