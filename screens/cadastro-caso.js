import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  ScrollView,
  Platform,
  Pressable,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';

export default function NewCaseScreen() {
  const [nameCase, setNameCase] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [location, setLocation] = useState('');
  const [dateCase, setDateCase] = useState(new Date());
  const [hourCase, setHourCase] = useState(new Date());
  const [category, setCategory] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR');
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSubmit = () => {
    console.log({
      nameCase,
      description,
      status,
      location,
      dateCase: formatDate(dateCase),
      hourCase: formatTime(hourCase),
      category,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Cadastro de Caso</Text>

        {/* Nome do Caso */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome do Caso</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o nome do caso"
            value={nameCase}
            onChangeText={setNameCase}
          />
        </View>

        {/* Descrição */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            multiline
            placeholder="Digite a descrição do caso"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Status */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Status</Text>
          <Picker
            selectedValue={status}
            onValueChange={(itemValue) => setStatus(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Selecione um status" value="" />
            <Picker.Item label="Em Andamento" value="em andamento" />
            <Picker.Item label="Finalizado" value="finalizado" />
            <Picker.Item label="Arquivado" value="arquivado" />
          </Picker>
        </View>

        {/* Local */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Local</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o local do caso"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        {/* Data e Hora */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.half]}>
            <Text style={styles.label}>
              <MaterialIcons name="calendar-today" size={16} color="#1e40af" /> Data do Caso
            </Text>
            <Pressable onPress={() => setShowDatePicker(true)} style={styles.input}>
              <Text>{formatDate(dateCase)}</Text>
            </Pressable>
            {showDatePicker && (
              <DateTimePicker
                value={dateCase}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setDateCase(selectedDate);
                }}
              />
            )}
          </View>

          <View style={[styles.inputGroup, styles.half]}>
            <Text style={styles.label}>
              <MaterialIcons name="access-time" size={16} color="#1e40af" /> Hora do Caso
            </Text>
            <Pressable onPress={() => setShowTimePicker(true)} style={styles.input}>
              <Text>{formatTime(hourCase)}</Text>
            </Pressable>
            {showTimePicker && (
              <DateTimePicker
                value={hourCase}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedTime) => {
                  setShowTimePicker(false);
                  if (selectedTime) setHourCase(selectedTime);
                }}
              />
            )}
          </View>
        </View>

        {/* Categoria */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Categoria</Text>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Selecione uma categoria" value="" />
            <Picker.Item label="Acidente" value="acidente" />
            <Picker.Item label="Identificação de Vítima" value="identificação de vítima" />
            <Picker.Item label="Exame Criminal" value="exame criminal" />
            <Picker.Item label="Outros" value="outros" />
          </Picker>
        </View>

        {/* Botão */}
        <View style={styles.buttonContainer}>
          <Button
            title="Cadastrar Caso"
            onPress={handleSubmit}
            color={Platform.OS === 'ios' ? '#1e40af' : undefined}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f1f5f9',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontWeight: '500',
    color: '#1e40af',
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  half: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: 16,
  },
});
