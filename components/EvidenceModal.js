import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Image } from 'react-native';
import { Modal, Portal, Title, TextInput, Button, Menu, Divider } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

const EvidenceModal = ({ visible, onDismiss, onSubmit, initialData = null }) => {
  // Estados do formulário
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [evidenceType, setEvidenceType] = useState('text_description');
  const [category, setCategory] = useState('');
  const [data, setData] = useState('');
  const [photo, setPhoto] = useState(null); // { uri, base64 }

  const [typeMenuVisible, setTypeMenuVisible] = useState(false);
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);

  // Popula o formulário quando o modal abre em modo de edição
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setEvidenceType(initialData.evidenceType || 'text_description');
      setCategory(initialData.category || '');
      setData(initialData.data || '');
      setPhoto(initialData.evidenceType === 'image' && initialData.data ? { uri: initialData.data, base64: null } : null);
    } else {
      // Reseta o formulário quando abre em modo de adição
      setTitle('');
      setDescription('');
      setEvidenceType('text_description');
      setCategory('');
      setData('');
      setPhoto(null);
    }
  }, [initialData]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType = 'images',
      allowsEditing: true,
      quality: 0.5,
      base64: true,
    });
    if (!result.canceled) {
      setPhoto({ uri: result.assets[0].uri, base64: result.assets[0].base64 });
    }
  };

  const handleSubmit = () => {
    const evidenceData = evidenceType === 'image' ? `data:image/jpeg;base64,${photo?.base64}` : data;
    onSubmit({
      title,
      description,
      evidenceType,
      category,
      data: evidenceData,
    });
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer}>
        <ScrollView>
          <Title>{initialData ? 'Editar Evidência' : 'Adicionar Nova Evidência'}</Title>
          <TextInput label="Título" value={title} onChangeText={setTitle} mode="outlined" style={styles.input} />
          <TextInput label="Descrição" value={description} onChangeText={setDescription} multiline mode="outlined" style={styles.input} />

          <Menu visible={typeMenuVisible} onDismiss={() => setTypeMenuVisible(false)} anchor={<Button mode="outlined" onPress={() => setTypeMenuVisible(true)} style={styles.input}>{evidenceType || 'Selecione o Tipo'}</Button>}>
            <Menu.Item onPress={() => { setEvidenceType('text_description'); setTypeMenuVisible(false); }} title="Descrição de Texto" />
            <Menu.Item onPress={() => { setEvidenceType('image'); setTypeMenuVisible(false); }} title="Imagem" />
            <Menu.Item onPress={() => { setEvidenceType('odontogram'); setTypeMenuVisible(false); }} title="Odontograma" />
          </Menu>

          {evidenceType === 'image' ? (
            <View style={styles.imagePickerContainer}>
              <Button icon="camera" onPress={pickImage}>Selecionar Imagem</Button>
              {photo && <Image source={{ uri: photo.uri }} style={styles.previewImage} />}
            </View>
          ) : (
            <TextInput label="Dados" value={data} onChangeText={setData} multiline mode="outlined" style={styles.input} />
          )}

          <Menu visible={categoryMenuVisible} onDismiss={() => setCategoryMenuVisible(false)} anchor={<Button mode="outlined" onPress={() => setCategoryMenuVisible(true)} style={styles.input}>{category || 'Selecione a Categoria'}</Button>}>
             <Menu.Item onPress={() => { setCategory('achados_periciais'); setCategoryMenuVisible(false); }} title="Achados Periciais" />
             <Menu.Item onPress={() => { setCategory('dados_ante_mortem'); setCategoryMenuVisible(false); }} title="Dados Ante-mortem" />
             <Menu.Item onPress={() => { setCategory('dados_post_mortem'); setCategoryMenuVisible(false); }} title="Dados Post-mortem" />
          </Menu>
          
          <Divider style={styles.input} />
          <Button mode="contained" onPress={handleSubmit}>Salvar</Button>
          <Button onPress={onDismiss} style={{ marginTop: 8 }}>Cancelar</Button>
        </ScrollView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 8, maxHeight: '90%' },
  input: { marginBottom: 15 },
  imagePickerContainer: { alignItems: 'center', marginVertical: 10 },
  previewImage: { width: 150, height: 150, marginTop: 10, borderRadius: 8 }
});

export default EvidenceModal;