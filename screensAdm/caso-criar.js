import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button, Title, Menu, Provider as PaperProvider, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

const API_URL = 'https://odonto-legal-backend.onrender.com';

const CriarCasoScreen = () => {
  const navigation = useNavigation();

  // Estados do formulário
  const [nameCase, setNameCase] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  
  // Estados para Menus (Dropdowns)
  const [status, setStatus] = useState('');
  const [statusMenuVisible, setStatusMenuVisible] = useState(false);
  const [category, setCategory] = useState('');
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);

  // Estados para Date/Time Picker
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [loading, setLoading] = useState(false);
  
  // Funções para os seletores de data e hora
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };
  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(Platform.OS === 'ios');
    setTime(currentTime);
  };

  const handleCreateCase = async () => {
    if (!nameCase || !status || !location || !category) {
      Alert.alert("Erro", "Nome, status, local e categoria são obrigatórios.");
      return;
    }
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    
    // Formata data e hora para yyyy-MM-dd e HH:mm
    const formattedDate = date.toISOString().split('T')[0];
    const formattedTime = time.toTimeString().split(' ')[0].substring(0, 5);

    const payload = {
      nameCase,
      Description: description,
      status,
      location,
      category,
      dateCase: formattedDate,
      hourCase: formattedTime,
    };

    try {
      const response = await fetch(`${API_URL}/api/case`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Erro ao criar o caso.');
      
      Alert.alert("Sucesso", "Caso criado com sucesso!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro de Cadastro", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.content}>
            <Title style={styles.title}>Cadastro de Novo Caso</Title>
            
            <TextInput label="Nome do Caso" value={nameCase} onChangeText={setNameCase} mode="outlined" style={styles.input} />
            <TextInput label="Descrição" value={description} onChangeText={setDescription} mode="outlined" multiline style={styles.input} />
            <TextInput label="Local" value={location} onChangeText={setLocation} mode="outlined" style={styles.input} />

            {/* Menu para Status */}
            <Menu
              visible={statusMenuVisible}
              onDismiss={() => setStatusMenuVisible(false)}
              anchor={<Button mode="outlined" onPress={() => setStatusMenuVisible(true)} style={styles.input}>{status || 'Selecione um Status'}</Button>}
            >
              <Menu.Item onPress={() => { setStatus('em andamento'); setStatusMenuVisible(false); }} title="Em Andamento" />
              <Menu.Item onPress={() => { setStatus('finalizado'); setStatusMenuVisible(false); }} title="Finalizado" />
              <Menu.Item onPress={() => { setStatus('arquivado'); setStatusMenuVisible(false); }} title="Arquivado" />
            </Menu>

            {/* Menu para Categoria */}
            <Menu
              visible={categoryMenuVisible}
              onDismiss={() => setCategoryMenuVisible(false)}
              anchor={<Button mode="outlined" onPress={() => setCategoryMenuVisible(true)} style={styles.input}>{category || 'Selecione uma Categoria'}</Button>}
            >
              <Menu.Item onPress={() => { setCategory('acidente'); setCategoryMenuVisible(false); }} title="Acidente" />
              <Menu.Item onPress={() => { setCategory('identificação de vítima'); setCategoryMenuVisible(false); }} title="Identificação de Vítima" />
              <Menu.Item onPress={() => { setCategory('exame criminal'); setCategoryMenuVisible(false); }} title="Exame Criminal" />
              <Menu.Item onPress={() => { setCategory('outros'); setCategoryMenuVisible(false); }} title="Outros" />
            </Menu>

            {/* Seletores de Data e Hora */}
            <View style={styles.dateContainer}>
              <Button icon="calendar" mode="outlined" onPress={() => setShowDatePicker(true)}>Data: {date.toLocaleDateString('pt-BR')}</Button>
              <Button icon="clock-outline" mode="outlined" onPress={() => setShowTimePicker(true)}>Hora: {time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Button>
            </View>

            {showDatePicker && (
              <DateTimePicker
                testID="datePicker"
                value={date}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}
            {showTimePicker && (
              <DateTimePicker
                testID="timePicker"
                value={time}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={onTimeChange}
              />
            )}

            <Divider style={styles.input} />
            
            <Button
              mode="contained"
              onPress={handleCreateCase}
              loading={loading}
              disabled={loading}
              style={styles.button}
            >
              {loading ? "Cadastrando..." : "Cadastrar Caso"}
            </Button>
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

export default CriarCasoScreen;