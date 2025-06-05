import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  Pressable,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';

export default function EditCaseForm({ initialData = {}, onSubmit, onCancel }) {
  const [name, setName] = useState(initialData.name || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [status, setStatus] = useState(initialData.status || 'em andamento');
  const [location, setLocation] = useState(initialData.location || '');

  // Para data e hora vamos usar Date objetos
  const [date, setDate] = useState(initialData.date ? new Date(initialData.date) : new Date());
  const [hour, setHour] = useState(initialData.hour ? new Date(`1970-01-01T${initialData.hour}:00`) : new Date());

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [category, setCategory] = useState(initialData.category || 'acidente');

  // Formata data para YYYY-MM-DD
  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Formata hora para HH:MM
  const formatTime = (date) => {
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  };

  const handleSave = () => {
    if (!name || !description || !location || !status || !category) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }

    const caseData = {
      name,
      description,
      status,
      location,
      date: formatDate(date),
      hour: formatTime(hour),
      category,
    };
    console.log('📤 Salvando edição do caso:', caseData);
    onSubmit(caseData);
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingVertical: 24 }}>
      <View style={styles.card}>
        <Text style={styles.title}>Editar Caso</Text>

        <Text style={styles.label}>Nome do Caso</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Nome do caso"
        />

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          placeholder="Descrição do caso"
        />

        <Text style={styles.label}>Status</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={status} onValueChange={setStatus} style={styles.picker}>
            <Picker.Item label="Em Andamento" value="em andamento" />
            <Picker.Item label="Finalizado" value="finalizado" />
            <Picker.Item label="Arquivado" value="arquivado" />
          </Picker>
        </View>

        <Text style={styles.label}>Localização</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="Local do caso"
        />

        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>
              <MaterialIcons name="calendar-today" size={18} color="#1e3a8a" /> Data
            </Text>
            <Pressable style={styles.input} onPress={() => setShowDatePicker(true)}>
              <Text>{formatDate(date)}</Text>
            </Pressable>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(Platform.OS === 'ios');
                  if (selectedDate) setDate(selectedDate);
                }}
              />
            )}
          </View>

          <View style={styles.column}>
            <Text style={styles.label}>
              <MaterialIcons name="access-time" size={18} color="#1e3a8a" /> Hora
            </Text>
            <Pressable style={styles.input} onPress={() => setShowTimePicker(true)}>
              <Text>{formatTime(hour)}</Text>
            </Pressable>
            {showTimePicker && (
              <DateTimePicker
                value={hour}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedTime) => {
                  setShowTimePicker(Platform.OS === 'ios');
                  if (selectedTime) setHour(selectedTime);
                }}
              />
            )}
          </View>
        </View>

        <Text style={styles.label}>Categoria</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={category} onValueChange={setCategory} style={styles.picker}>
            <Picker.Item label="Acidente" value="acidente" />
            <Picker.Item label="Identificação de Vítima" value="identificação de vítima" />
            <Picker.Item label="Exame Criminal" value="exame criminal" />
            <Picker.Item label="Outros" value="outros" />
          </Picker>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity style={[styles.button, styles.red]} onPress={onCancel}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.green]} onPress={handleSave}>
            <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 40,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    width: '100%',
    alignSelf: 'center',
    marginVertical: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    color: '#1e3a8a',
    marginBottom: 4,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#f9fafb',
    width: '100%',
  },
  multiline: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  column: {
    flex: 1,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24,
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 100,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  green: {
    backgroundColor: '#22c55e',
  },
  red: {
    backgroundColor: '#ef4444',
  },
});
