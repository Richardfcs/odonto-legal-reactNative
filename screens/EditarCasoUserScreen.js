import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button, Title, Provider as PaperProvider, Divider, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import SelectMenu from '../components/SelectMenu';

const API_URL = 'https://odonto-legal-backend.onrender.com';

const EditarCasoUserScreen = ({ route }) => {
    const navigation = useNavigation();
    const { caseId } = route.params;

    const [nameCase, setNameCase] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [status, setStatus] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    
    const [loading, setLoading] = useState(true); // Para buscar dados
    const [saving, setSaving] = useState(false); // Para salvar

    useEffect(() => {
        const fetchCaseData = async () => {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');
            try {
                const res = await fetch(`${API_URL}/api/case/${caseId}`, { headers: { 'Authorization': `Bearer ${token}` } });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Erro ao carregar dados do caso.");
                
                setNameCase(data.nameCase);
                setDescription(data.Description || '');
                setLocation(data.location);
                setStatus(data.status);
                setCategory(data.category);
                if (data.dateCase) setDate(new Date(data.dateCase));

            } catch (error) {
                Alert.alert("Erro", error.message);
                navigation.goBack();
            } finally {
                setLoading(false);
            }
        };
        fetchCaseData();
    }, [caseId]);
    
    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) setDate(selectedDate);
    };

    const handleUpdateCase = async () => {
        setSaving(true);
        const token = await AsyncStorage.getItem('token');
        const payload = { nameCase, Description: description, status, location, category, dateCase: date.toISOString().split('T')[0] };

        try {
            const response = await fetch(`${API_URL}/api/case/${caseId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Erro ao atualizar o caso.');
            
            Alert.alert("Sucesso", "Caso atualizado com sucesso!");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Erro de Atualização", error.message);
        } finally {
            setSaving(false);
        }
    };
    
    const statusOptions = [{label: 'Em Andamento', value: 'em andamento'}, {label: 'Finalizado', value: 'finalizado'}, {label: 'Arquivado', value: 'arquivado'}];
    const categoryOptions = [{label: 'Acidente', value: 'acidente'}, {label: 'Identificação de Vítima', value: 'identificação de vítima'}, {label: 'Exame Criminal', value: 'exame criminal'}, {label: 'Outros', value: 'outros'}];

    if (loading) return <ActivityIndicator style={styles.centered} size="large" />;

    return (
        <PaperProvider>
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View style={styles.content}>
                        <Title style={styles.title}>Editar Caso</Title>
                        <TextInput label="Nome do Caso *" value={nameCase} onChangeText={setNameCase} mode="outlined" style={styles.input} />
                        <TextInput label="Descrição" value={description} onChangeText={setDescription} mode="outlined" multiline style={styles.input} />
                        <TextInput label="Local *" value={location} onChangeText={setLocation} mode="outlined" style={styles.input} />
                        <SelectMenu label="Status *" value={status} onSelect={setStatus} options={statusOptions} placeholder="Selecione um Status"/>
                        <SelectMenu label="Categoria *" value={category} onSelect={setCategory} options={categoryOptions} placeholder="Selecione uma Categoria"/>
                        <Button icon="calendar" mode="outlined" onPress={() => setShowDatePicker(true)} style={styles.input}>
                            Data do Caso: {date.toLocaleDateString('pt-BR')}
                        </Button>
                        {showDatePicker && <DateTimePicker value={date} mode="date" display="default" onChange={onDateChange}/>}
                        <Divider style={styles.divider} />
                        <Button mode="contained" onPress={handleUpdateCase} loading={saving} disabled={saving} style={styles.button} labelStyle={{ color: '#fff' }}>
                            {saving ? "Salvando..." : "Salvar Alterações"}
                        </Button>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f1f5f9' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    content: { padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#1e3a8a', textAlign: 'center', marginBottom: 24 },
    input: { marginBottom: 16 },
    divider: { marginVertical: 16 },
    button: { marginTop: 10, backgroundColor: '#1e40af', paddingVertical: 8 },
});

export default EditarCasoUserScreen;