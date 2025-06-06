import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button, Avatar, Title, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

const API_URL = 'https://odonto-legal-backend.onrender.com';

const CadastrarFuncionarioScreen = () => {
  const navigation = useNavigation();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [cro, setCro] = useState('');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState(null); // { uri, base64 }
  
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType = 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      setPhoto({ uri: result.assets[0].uri, base64: result.assets[0].base64 });
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Erro", "Nome, email e senha são campos obrigatórios.");
      return;
    }

    setLoading(true);
    const token = await AsyncStorage.getItem('token');

    const userData = {
      name,
      email,
      telephone,
      cro,
      password,
      photo: photo?.base64 || '', // Envia a string base64 ou uma string vazia
    };

    try {
      const response = await fetch(`${API_URL}/api/user/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Sucesso", result.message || "Funcionário cadastrado com sucesso!");
        navigation.goBack(); // Volta para a tela de gerenciar funcionários
      } else {
        throw new Error(result.error || "Erro ao cadastrar funcionário.");
      }
    } catch (error) {
      console.error("Erro no cadastro:", error);
      Alert.alert("Erro de Cadastro", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          <Title style={styles.title}>Cadastrar Novo Funcionário</Title>

          <View style={styles.avatarContainer}>
            <Avatar.Image
              size={100}
              source={photo ? { uri: photo.uri } : require('../assets/default_icon.png')}
            />
            <Button mode="text" onPress={pickImage} style={styles.button}>
              Selecionar Foto
            </Button>
          </View>

          <TextInput
            label="Nome Completo"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            label="Telefone"
            value={telephone}
            onChangeText={setTelephone}
            mode="outlined"
            style={styles.input}
            keyboardType="phone-pad"
          />
          <TextInput
            label="CPF ou CRO"
            value={cro}
            onChangeText={setCro}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Senha"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={styles.input}
            secureTextEntry
          />

          <Button
            mode="contained"
            onPress={handleRegister}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            {loading ? "Cadastrando..." : "Cadastrar Funcionário"}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
});

export default CadastrarFuncionarioScreen;