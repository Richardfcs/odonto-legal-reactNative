import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button, Title, Provider as PaperProvider, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import SelectMenu from '../components/SelectMenu'; // Reutilizando nosso componente

const API_URL = 'https://odonto-legal-backend.onrender.com';

const CriarCasoUserScreen = () => {
  const navigation = useNavigation();

  // Estados do formulário
  const [nameCase, setNameCase] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('em andamento'); // Padrão
  const [category, setCategory] = useState('');
  
  // Estados para Date/Time Picker
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [loading, setLoading] = useState(false);
  
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
        setDate(selectedDate);
    }
  };

  const handleCreateCase = async () => {
    if (!nameCase || !status || !location || !category) {
      Alert.alert("Erro", "Nome, status, local e categoria são obrigatórios.");
      return;
    }
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    
    const payload = {
      nameCase,
      Description: description,
      status,
      location,
      category,
      dateCase: date.toISOString().split('T')[0],
      // O backend pode assumir a hora atual se não for enviada
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
      navigation.goBack(); // Volta para a tela "Meus Casos"
    } catch (error) {
      Alert.alert("Erro de Cadastro", error.message);
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
      {label: 'Em Andamento', value: 'em andamento'},
      {label: 'Finalizado', value: 'finalizado'},
      {label: 'Arquivado', value: 'arquivado'},
  ];
  const categoryOptions = [
      {label: 'Acidente', value: 'acidente'},
      {label: 'Identificação de Vítima', value: 'identificação de vítima'},
      {label: 'Exame Criminal', value: 'exame criminal'},
      {label: 'Outros', value: 'outros'},
  ];

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.content}>
            <Title style={styles.title}>Cadastro de Novo Caso</Title>
            
            <TextInput label="Nome do Caso *" value={nameCase} onChangeText={setNameCase} mode="outlined" style={styles.input} />
            <TextInput label="Descrição" value={description} onChangeText={setDescription} mode="outlined" multiline style={styles.input} />
            <TextInput label="Local *" value={location} onChangeText={setLocation} mode="outlined" style={styles.input} />

            <SelectMenu label="Status *" value={status} onSelect={setStatus} options={statusOptions} placeholder="Selecione um Status"/>
            <SelectMenu label="Categoria *" value={category} onSelect={setCategory} options={categoryOptions} placeholder="Selecione uma Categoria"/>
            
            <Button icon="calendar" mode="outlined" onPress={() => setShowDatePicker(true)} style={styles.input}>
                Data do Caso: {date.toLocaleDateString('pt-BR')}
            </Button>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}

            <Divider style={styles.divider} />
            
            <Button
              mode="contained"
              onPress={handleCreateCase}
              loading={loading}
              disabled={loading}
              style={styles.button}
              labelStyle={{ color: '#fff' }} // Cor do texto do botão
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
  container: { 
    flex: 1, 
    backgroundColor: '#f1f5f9'
  },
  content: { 
    padding: 20 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#1e3a8a', 
    textAlign: 'center', 
    marginBottom: 24 
  },
  input: { 
    marginBottom: 16 
  },
  divider: {
    marginVertical: 16,
  },
  button: { 
    marginTop: 10, 
    backgroundColor: '#1e40af', // Cor primária do estilo
    paddingVertical: 8 
  },
});

export default CriarCasoUserScreen;