import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';

export default function AddEvidenceForm({ onSubmit, onCancel }) {
  const [evidenceType, setEvidenceType] = useState('text_description');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [textData, setTextData] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [category, setCategory] = useState('');
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permissão necessária', 'Permissão para acessar a galeria é obrigatória!');
        } else {
          console.log("✅ Permissão concedida para acessar a galeria.");
          setHasPermission(true);
        }
      }
    })();
  }, []);

  useEffect(() => {
    console.log("Tipo de evidência atual:", evidenceType);
  }, [evidenceType]);

  const handlePickImage = () => {
    console.log("📸 Solicitando confirmação para abrir a galeria");

    Alert.alert(
      'Escolher imagem',
      'Deseja realmente escolher uma imagem da galeria?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
          onPress: () => console.log("❌ Seleção de imagem cancelada"),
        },
        {
          text: 'Sim',
          onPress: async () => {
            if (!hasPermission) {
              Alert.alert('Erro', 'Permissão de acesso à galeria não foi concedida.');
              return;
            }

            try {
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
              });

              if (!result.canceled && result.assets && result.assets.length > 0) {
                const uri = result.assets[0].uri;
                console.log("✅ Imagem selecionada:", uri);
                setImageUri(uri);
              } else {
                console.log("⚠️ Imagem não selecionada ou cancelada.");
              }
            } catch (error) {
              console.error("Erro ao selecionar imagem:", error);
            }
          }
        }
      ]
    );
  };

  const handleSubmit = () => {
    if (!title || !evidenceType) {
      alert('Preencha os campos obrigatórios!');
      return;
    }

    const data = {
      evidenceType,
      title,
      description,
      textData: evidenceType === 'text_description' ? textData : '',
      imageUri: evidenceType === 'image' ? imageUri : null,
      category,
    };

    console.log("📤 Evidência enviada:", data);
    onSubmit(data);
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingVertical: 24 }}>
      <View style={styles.card}>
        <Text style={styles.title}>Nova Evidência</Text>

        <Text style={styles.label}>Tipo de Evidência</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={evidenceType}
            onValueChange={setEvidenceType}
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
          style={[styles.input, styles.multiline]}
          multiline
          numberOfLines={3}
          value={description}
          onChangeText={setDescription}
          placeholder="Descrição da evidência"
        />

        {evidenceType === 'text_description' && (
          <>
            <Text style={styles.label}>Dados (Texto)</Text>
            <TextInput
              style={[styles.input, styles.multiline]}
              multiline
              numberOfLines={3}
              value={textData}
              onChangeText={setTextData}
              placeholder="Insira os dados em texto..."
            />
          </>
        )}

        {evidenceType === 'image' && (
          <>
            <Text style={styles.label}>Upload de Imagem</Text>
            <TouchableOpacity style={[styles.uploadButton, styles.blue]} onPress={handlePickImage}>
              <Text style={styles.buttonText}>Escolher Imagem</Text>
            </TouchableOpacity>
            {imageUri && (
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            )}
          </>
        )}

        <Text style={styles.label}>Categoria</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={category}
            onValueChange={setCategory}
            style={styles.picker}
          >
            <Picker.Item label="Selecionar (opcional)" value="" />
            <Picker.Item label="Achados Periciais" value="achados_periciais" />
            <Picker.Item label="Dados Ante-mortem" value="dados_ante_mortem" />
            <Picker.Item label="Dados Post-mortem" value="dados_post_mortem" />
            <Picker.Item label="Outros" value="outros" />
          </Picker>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity style={[styles.button, styles.red]} onPress={onCancel}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.green]} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Adicionar</Text>
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
    padding: 49,
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
  uploadButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  imagePreview: {
    marginTop: 12,
    width: '100%',
    height: 200,
    borderRadius: 8,
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
  blue: {
    backgroundColor: '#3b82f6',
  },
  red: {
    backgroundColor: '#ef4444',
  },
});
