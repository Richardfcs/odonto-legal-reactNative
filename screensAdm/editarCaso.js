import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button, Title, Menu, Provider as PaperProvider, Divider, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

const API_URL = 'https://odonto-legal-backend.onrender.com';

const EditarCasoScreen = ({ route }) => {
    const navigation = useNavigation();
    const { caseId } = route.params;

    const [formData, setFormData] = useState(null);
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const [statusMenuVisible, setStatusMenuVisible] = useState(false);
    const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchCaseData = async () => {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');
            try {
                const res = await fetch(`${API_URL}/api/case/${caseId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Erro ao carregar dados do caso');

                setFormData(data);
                if (data.dateCase) setDate(new Date(data.dateCase));
                if (data.hourCase) {
                    const [hours, minutes] = data.hourCase.split(':');
                    const newTime = new Date();
                    newTime.setHours(hours, minutes);
                    setTime(newTime);
                }
            } catch (error) {
                Alert.alert("Erro", error.message);
                navigation.goBack();
            } finally {
                setLoading(false);
            }
        };
        fetchCaseData();
    }, [caseId]);

    const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
    const onDateChange = (event, selectedDate) => { setShowDatePicker(false); if (selectedDate) setDate(selectedDate); };
    const onTimeChange = (event, selectedTime) => { setShowTimePicker(false); if (selectedTime) setTime(selectedTime); };

    const handleUpdateCase = async () => {
        setSaving(true);
        const token = await AsyncStorage.getItem('token');
        const payload = {
            ...formData,
            dateCase: date.toISOString().split('T')[0],
            hourCase: time.toTimeString().split(' ')[0].substring(0, 5),
        };

        try {
            const response = await fetch(`${API_URL}/api/case/${caseId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
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

    if (loading || !formData) return <ActivityIndicator style={styles.centered} size="large" />;

    return (
        <PaperProvider>
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View style={styles.content}>
                        <Title style={styles.title}>Editar Caso</Title>

                        <TextInput label="Nome do Caso" value={formData.nameCase} onChangeText={v => handleInputChange('nameCase', v)} mode="outlined" style={styles.input} />
                        <TextInput label="Descrição" value={formData.Description} onChangeText={v => handleInputChange('Description', v)} mode="outlined" multiline style={styles.input} />
                        <TextInput label="Local" value={formData.location} onChangeText={v => handleInputChange('location', v)} mode="outlined" style={styles.input} />

                        <Menu visible={statusMenuVisible} onDismiss={() => setStatusMenuVisible(false)} anchor={<Button mode="outlined" onPress={() => setStatusMenuVisible(true)} style={styles.input}>{formData.status || 'Selecione um Status'}</Button>}>
                            <Menu.Item onPress={() => { handleInputChange('status', 'em andamento'); setStatusMenuVisible(false); }} title="Em Andamento" />
                            <Menu.Item onPress={() => { handleInputChange('status', 'finalizado'); setStatusMenuVisible(false); }} title="Finalizado" />
                            <Menu.Item onPress={() => { handleInputChange('status', 'arquivado'); setStatusMenuVisible(false); }} title="Arquivado" />
                        </Menu>

                        <Menu visible={categoryMenuVisible} onDismiss={() => setCategoryMenuVisible(false)} anchor={<Button mode="outlined" onPress={() => setCategoryMenuVisible(true)} style={styles.input}>{formData.category || 'Selecione uma Categoria'}</Button>}>
                            <Menu.Item onPress={() => { handleInputChange('category', 'acidente'); setCategoryMenuVisible(false); }} title="Acidente" />
                            <Menu.Item onPress={() => { handleInputChange('category', 'identificação de vítima'); setCategoryMenuVisible(false); }} title="Identificação de Vítima" />
                            <Menu.Item onPress={() => { handleInputChange('category', 'exame criminal'); setCategoryMenuVisible(false); }} title="Exame Criminal" />
                            <Menu.Item onPress={() => { handleInputChange('category', 'outros'); setCategoryMenuVisible(false); }} title="Outros" />
                        </Menu>

                        <View style={styles.dateContainer}>
                            <Button icon="calendar" mode="outlined" onPress={() => setShowDatePicker(true)}>Data: {date.toLocaleDateString('pt-BR')}</Button>
                            <Button icon="clock-outline" mode="outlined" onPress={() => setShowTimePicker(true)}>Hora: {time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Button>
                        </View>

                        {showDatePicker && <DateTimePicker value={date} mode="date" display="default" onChange={onDateChange} />}
                        {showTimePicker && <DateTimePicker value={time} mode="time" is24Hour={true} display="default" onChange={onTimeChange} />}

                        <Divider style={styles.input} />
                        <Button mode="contained" onPress={handleUpdateCase} loading={saving} disabled={saving} style={styles.button}>Salvar Alterações</Button>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    content: { padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    input: { marginBottom: 15 },
    button: { marginTop: 10 },
    dateContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
});

export default EditarCasoScreen;