import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Text, Button, Card, Title, List, ActivityIndicator, Divider, Menu, Modal, Portal, TextInput, Provider as PaperProvider, Dialog, Paragraph } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const API_URL = 'https://odonto-legal-backend.onrender.com';

const GerenciarPermissoesScreen = ({ route, navigation }) => {
  const { funcionarioId } = route.params;

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Estados para funcionalidades de edição
  const [roleMenuVisible, setRoleMenuVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', telephone: '', cro: '' });
  const [newPhoto, setNewPhoto] = useState(null); // { uri, base64 }

  const loadUserData = useCallback(async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/api/user/${funcionarioId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro ao carregar usuário');
      
      setUserData(data);
      setSelectedRole(data.role);
      setFormData({ name: data.name, email: data.email, telephone: data.telephone, cro: data.cro || '' });
    } catch (error) {
      Alert.alert("Erro", error.message);
    } finally {
      setLoading(false);
    }
  }, [funcionarioId]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);
  
  // --- Funções de Ação ---

  const handleUpdateRole = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
        const response = await fetch(`${API_URL}/api/user/${funcionarioId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
            body: JSON.stringify({ role: selectedRole })
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Erro ao atualizar cargo.');
        Alert.alert("Sucesso", "Cargo atualizado com sucesso!");
        loadUserData();
    } catch (error) {
        Alert.alert("Erro", error.message);
    }
  };
  
  const handleDeleteUser = async () => {
    setDeleteDialogVisible(false); // Fecha o diálogo primeiro
    const token = await AsyncStorage.getItem('token');
    try {
        const response = await fetch(`${API_URL}/api/user/${funcionarioId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Erro ao excluir.');
        Alert.alert("Sucesso", "Usuário excluído com sucesso.");
        navigation.goBack();
    } catch (error) {
        Alert.alert("Erro", error.message);
    }
  };

  const handleUpdateProfile = async () => {
    const token = await AsyncStorage.getItem('token');
    const updates = { ...formData };
    if (newPhoto?.base64) {
        updates.photo = newPhoto.base64;
    }
    try {
        const response = await fetch(`${API_URL}/api/user/${funcionarioId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
            body: JSON.stringify(updates)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Erro ao salvar alterações.');
        Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
        setEditModalVisible(false);
        setNewPhoto(null);
        loadUserData();
    } catch (error) {
        Alert.alert("Erro", error.message);
    }
  };

  const pickImage = async () => {
    // Usando a sintaxe atualizada para mediaTypes
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType = 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });
    if (!result.canceled) {
      setNewPhoto({ uri: result.assets[0].uri, base64: result.assets[0].base64 });
    }
  };

  // --- Renderização ---
  
  if (loading) return <ActivityIndicator size="large" style={styles.centered} />;
  if (!userData) return <View style={styles.centered}><Text>Usuário não encontrado.</Text></View>;
  
  const photoUri = userData.photo ? `data:image/png;base64,${userData.photo}` : null;
  const roleText = { admin: 'Administrador', perito: 'Perito', assistente: 'Assistente' };

  return (
    <PaperProvider>
        <SafeAreaView style={{flex: 1}}>
        <ScrollView style={styles.container}>
            {/* Informações do Usuário */}
            <Card style={styles.card}>
                <Card.Content style={styles.header}>
                    <Avatar.Image size={100} source={photoUri ? { uri: photoUri } : require('../assets/default_icon.png')} />
                    <Title style={styles.userName}>{userData.name}</Title>
                    <Text>{userData.email}</Text>
                    <Text style={styles.roleText}>{roleText[userData.role]}</Text>
                </Card.Content>
            </Card>

            {/* Carrossel de Casos */}
            <Card style={styles.card}>
                <Card.Content>
                    <Title>Casos Associados ({userData.cases?.length || 0})</Title>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {userData.cases && userData.cases.length > 0 ? userData.cases.map(c => (
                            <Card key={c._id} style={styles.caseCard}>
                                <Card.Content>
                                    <Text style={styles.caseTitle}>{c.nameCase}</Text>
                                    <Text>{c.status}</Text>
                                </Card.Content>
                            </Card>
                        )) : <Text style={styles.noDataText}>Nenhum caso associado.</Text>}
                    </ScrollView>
                </Card.Content>
            </Card>

            {/* Ações de Gerenciamento */}
            <Card style={styles.card}>
                <Card.Title title="Ações de Gerenciamento" />
                <Card.Content>
                    <Menu
                        visible={roleMenuVisible}
                        onDismiss={() => setRoleMenuVisible(false)}
                        anchor={<Button mode="outlined" onPress={() => setRoleMenuVisible(true)}>Mudar Cargo: {roleText[selectedRole]}</Button>}
                    >
                        <Menu.Item onPress={() => { setSelectedRole('assistente'); setRoleMenuVisible(false); }} title="Assistente" />
                        <Menu.Item onPress={() => { setSelectedRole('perito'); setRoleMenuVisible(false); }} title="Perito" />
                        <Menu.Item onPress={() => { setSelectedRole('admin'); setRoleMenuVisible(false); }} title="Administrador" />
                    </Menu>
                    <Button mode="contained" onPress={handleUpdateRole} style={styles.button} disabled={selectedRole === userData.role}>
                        Confirmar Novo Cargo
                    </Button>
                    <Divider style={styles.divider}/>
                    <Button mode="contained" onPress={() => setEditModalVisible(true)} style={styles.button}>Editar Perfil</Button>
                    <Divider style={styles.divider}/>
                    <Button mode="contained" onPress={() => setDeleteDialogVisible(true)} style={styles.deleteButton}>Excluir Usuário</Button>
                </Card.Content>
            </Card>
        </ScrollView>

        {/* Modal de Edição */}
        <Portal>
            <Modal visible={editModalVisible} onDismiss={() => setEditModalVisible(false)} contentContainerStyle={styles.modalContainer}>
                <ScrollView>
                    <Title>Editar Perfil</Title>
                    <Avatar.Image size={80} source={newPhoto ? { uri: newPhoto.uri } : (photoUri ? {uri: photoUri} : require('../assets/default_icon.png'))} style={{alignSelf: 'center', marginVertical: 10}} />
                    <Button onPress={pickImage}>Mudar Foto</Button>
                    <TextInput label="Nome" value={formData.name} onChangeText={t => setFormData({...formData, name: t})} mode="outlined" style={styles.input} />
                    <TextInput label="Email" value={formData.email} onChangeText={t => setFormData({...formData, email: t})} mode="outlined" style={styles.input} />
                    <TextInput label="Telefone" value={formData.telephone} onChangeText={t => setFormData({...formData, telephone: t})} mode="outlined" style={styles.input} keyboardType="phone-pad" />
                    <TextInput label="CRO" value={formData.cro} onChangeText={t => setFormData({...formData, cro: t})} mode="outlined" style={styles.input} />
                    <Button mode="contained" onPress={handleUpdateProfile} style={styles.button}>Salvar Alterações</Button>
                    <Button onPress={() => setEditModalVisible(false)} style={styles.button}>Cancelar</Button>
                </ScrollView>
            </Modal>
        </Portal>
        
        {/* Diálogo de Exclusão */}
        <Portal>
            <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
                <Dialog.Title>Confirmar Exclusão</Dialog.Title>
                <Dialog.Content>
                    <Paragraph>Tem certeza que deseja excluir permanentemente o usuário "{userData?.name}"? Esta ação não pode ser desfeita.</Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setDeleteDialogVisible(false)}>Cancelar</Button>
                    <Button onPress={handleDeleteUser} labelStyle={{ color: 'red' }}>Excluir</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>

        </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
    container: { 
      flex: 1,
      backgroundColor: '#f5f5f5'
    },
    centered: { 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center' 
    },
    card: { 
      marginHorizontal: 16,
      marginTop: 16,
    },
    header: { 
      alignItems: 'center',
      paddingBottom: 8,
    },
    userName: { 
      fontSize: 22, 
      fontWeight: 'bold', 
      marginTop: 12,
      textAlign: 'center'
    },
    roleText: { 
      fontSize: 16, 
      color: 'gray',
      marginTop: 4,
    },
    caseCard: { 
      marginRight: 10, 
      width: 220,
      backgroundColor: '#f0f0f0'
    },
    caseTitle: { 
      fontWeight: 'bold' 
    },
    noDataText: { 
      fontStyle: 'italic', 
      color: 'gray', 
      padding: 10 
    },
    button: { 
      marginTop: 10 
    },
    divider: { 
      marginVertical: 10 
    },
    deleteButton: { 
      backgroundColor: '#d9534f' 
    },
    modalContainer: { 
      backgroundColor: 'white', 
      padding: 20, 
      margin: 20, 
      borderRadius: 8, 
      maxHeight: '85%' 
    },
    input: { 
      marginBottom: 10 
    }
});

export default GerenciarPermissoesScreen;