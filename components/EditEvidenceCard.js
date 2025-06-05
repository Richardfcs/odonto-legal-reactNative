import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker'; // ✅ Importação corrigida

export default function EditEvidenceCard({ evidence, onCancel, onSave }) {
  const [type, setType] = useState(evidence?.type || 'text_description');
  const [title, setTitle] = useState(evidence?.title || '');
  const [description, setDescription] = useState(evidence?.description || '');
  const [dataText, setDataText] = useState(evidence?.dataText || '');
  const [category, setCategory] = useState(evidence?.category || '');
  const [imageUri, setImageUri] = useState(evidence?.imageUri || null);

  const isImageType = type === 'image' || type === 'odontogram';

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permissão para acessar a galeria foi negada!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    const updatedEvidence = {
      id: evidence.id,
      type,
      title,
      description,
      dataText,
      category,
      imageUri,
    };
    onSave(updatedEvidence);
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Editar Evidência</Text>

      <Text style={styles.label}>Tipo de Evidência</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={type}
          onValueChange={(itemValue) => setType(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Descrição de Texto" value="text_description" />
          <Picker.Item label="Imagem" value="image" />
          <Picker.Item label="Odontograma" value="odontogram" />
          <Picker.Item label="Outro" value="other" />
        </Picker>
      </View>

      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Título da evidência"
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Descrição detalhada"
        multiline
        numberOfLines={3}
      />

      {isImageType ? (
        <>
          <Text style={styles.label}>Nova Imagem (Upload)</Text>
          <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
            <Text style={styles.imagePickerButtonText}>Selecionar Imagem</Text>
          </TouchableOpacity>

          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          ) : (
            <Text style={styles.noImageText}>Nenhuma imagem selecionada</Text>
          )}

          <Text style={styles.noteText}>
            Envie um novo arquivo para substituir a imagem atual.
          </Text>
        </>
      ) : (
        <>
          <Text style={styles.label}>Dados (Texto)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={dataText}
            onChangeText={setDataText}
            placeholder="Dados em texto da evidência"
            multiline
            numberOfLines={3}
          />
        </>
      )}

      <Text style={styles.label}>Categoria</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Selecionar (opcional)" value="" />
          <Picker.Item label="Achados Periciais" value="achados_periciais" />
          <Picker.Item label="Dados Ante-mortem" value="dados_ante_mortem" />
          <Picker.Item label="Dados Post-mortem" value="dados_post_mortem" />
          <Picker.Item label="Outros" value="outros" />
        </Picker>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Salvar Alterações</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    margin: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    color: '#1e40af',
    fontWeight: '600',
    marginBottom: 6,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    marginBottom: 16,
    overflow: 'hidden',
  },
  picker: {
    height: 44,
    color: '#111827',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  imagePickerButton: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 12,
  },
  imagePickerButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  imagePreview: {
    width: 200,
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
    alignSelf: 'center',
  },
  noImageText: {
    color: '#6b7280',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 8,
  },
  noteText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    backgroundColor: '#9ca3af',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  saveButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
