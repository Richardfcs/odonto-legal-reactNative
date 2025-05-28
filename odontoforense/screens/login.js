// TELA PRONTA
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-paper';


{/* IMPORT DE INPUTS DE SENHA E EMAIL VINDOS DE "components/input..." (CAUÃ) */}
import EmailInput from '../components/inputEmail';
import PasswordInput from '../components/inputPassword';


// TELA DE LOGIN - FUNÇÕES
export default function LoginScreen() {
  const [email, setEmail] = useState(''); {/* INPUT DE EMAIL (CAUÃ) */}
  const [password, setPassword] = useState(""); {/* INPUT DE SENHA (CAUÃ) */}
  const [loading, setLoading] = useState(false); {/* BOTÃO DE CONFIRMAR LOGIN + LOADING (CAUÃ) */}
  const navigation = useNavigation();
  const API_URL = 'https://odonto-legal-backend.onrender.com';


// ERRO
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Erro', 'Por favor, preencha ambos os campos');
      return;
    }
    
// VERIFICAÇÃO DE CARGO
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        await AsyncStorage.multiSet([
          ['token', result.token],
          ['role', result.role],
        ]);

        Alert.alert('Sucesso', result.msg || 'Login bem-sucedido!');
        
        switch(result.role) {
          case 'admin':
            navigation.navigate('AdminHome');
            break;
          case 'perito':
          case 'assistente':
            navigation.navigate('Home');
            break;
          default:
            Alert.alert('Aviso', 'Perfil não reconhecido, redirecionando...');
            navigation.navigate('Home');
        }
      } else {
        if (response.status === 401 || response.status === 403) {
          await AsyncStorage.multiRemove(['token', 'role']);
          Alert.alert('Erro', 'Sessão expirada ou não autorizada');
          navigation.navigate('Welcome');
          return;
        }
        Alert.alert('Erro', result.msg || `Erro no login (Status: ${response.status})`);
      }
    } catch (error) {
      console.error('Erro no login:', error);
      Alert.alert('Erro', 'Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };


// FRONTEND (BOTÕES E VIEWS DA TELA)
  return (
<View style={styles.container}>
    <View style={styles.content}>
      <EmailInput value={email} onChangeText={setEmail} /> {/* INPUT DE EMAIL (CAUÃ) */}
      <PasswordInput value={password} onChangeText={setPassword} /> {/* INPUT DE SENHA (CAUÃ) */}
      <Button
        mode="contained"
        onPress={handleLogin}
        disabled={loading}
        style={styles.button}
        buttonColor="#2563eb"
        labelStyle={styles.buttonLabel}>
        {loading ? (<ActivityIndicator color="#fff" />) : ('Entrar')} {/* BOTÃO DE CONFIRMAR O LOGIN (CAUÃ) */}
      </Button>
    </View>
  <StatusBar style="auto" />
</View>
  );
}


// ESTILOS DA TELA DE LOGIN (CAUÃ)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center', // Centraliza verticalmente
    alignItems: 'center',     // Centraliza horizontalmente
  },
  content: {
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    width: 267,
    paddingVertical: 5,
    borderRadius: 10
  },
  buttonLabel: {
    fontSize: 16,
    height: 24,
  },
});
