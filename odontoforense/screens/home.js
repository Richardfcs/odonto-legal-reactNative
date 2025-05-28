// TELA [IMCOMPLETA]
import { ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

// DEFINIR FUNÇÃO
export default function HomeScreen() {
  const [casos, setCasos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const API_URL = 'https://odonto-legal-backend.onrender.com';

// LÓGICA AINDA INCOMPLETA
    useEffect(() => {
    const fetchCasos = async () => {
      try {
        const response = await fetch(`${API_URL}/api/casos`);
        const data = await response.json();
        setCasos(data);
      } catch (err) {
        console.error('Erro ao buscar casos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCasos();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

// RETURN SEM FUNCIONAR
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {casos.map((caso) => (
        <CaseCard
          key={caso._id}
          titulo={caso.titulo}
          descricao={caso.descricao}
          status={caso.status}
          data={caso.dataCriacao}
          onPress={() => navigation.navigate('CasoDetalhes', { id: caso._id })}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});