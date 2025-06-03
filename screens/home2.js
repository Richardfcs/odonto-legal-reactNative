import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import * as Animatable from 'react-native-animatable';

export default function App() {
  const handleStart = () => {
    // Aqui você pode navegar para a próxima tela
    console.log('Começar pressionado');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animatable.Image
        animation="fadeInDown"
        duration={1000}
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Animatable.Text animation="fadeInUp" delay={300} style={styles.title}>
        OdontoForense
      </Animatable.Text>

      <Animatable.Text animation="fadeInUp" delay={500} style={styles.subtitle}>
        Análise e Registro Odontológico Forense
      </Animatable.Text>

      <Animatable.View animation="fadeInUp" delay={800}>
        <TouchableOpacity style={styles.button} onPress={handleStart}>
          <Text style={styles.buttonText}>Começar</Text>
        </TouchableOpacity>
      </Animatable.View>

      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // azul muito escuro
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#cbd5e1',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
