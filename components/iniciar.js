import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')} // Coloque sua logo em assets/logo.png
        style={styles.logo}
        resizeMode="contain"
      />0
      <Text style={styles.title}>OdontoForense</Text>
      <Text style={styles.subtitle}>Análise e Registro Odontológico Forense</Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Começar</Text>
      </TouchableOpacity>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E293B', // azul escuro
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
    logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
   title: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#cbd5e1',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});