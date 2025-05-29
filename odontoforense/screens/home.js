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
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});