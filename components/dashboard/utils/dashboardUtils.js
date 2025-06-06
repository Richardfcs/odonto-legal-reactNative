import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'https://odonto-legal-backend.onrender.com/api/dashboard';

// Função genérica de exportação
export const handleExport = async (type, filters = {}) => {
  const token = await AsyncStorage.getItem('token');
  const params = new URLSearchParams();

  // Adiciona os filtros aos parâmetros da URL
  for (const key in filters) {
    if (filters[key] && filters[key] !== 'all') {
      params.append(key, filters[key]);
    }
  }

  const url = `${API_BASE}/export/${type}?${params.toString()}`;
  
  // Nome do arquivo local
  const filename = `${type}_export_${Date.now()}.csv`;
  const fileUri = FileSystem.documentDirectory + filename;

  try {
    
    // Baixa o arquivo da URL da API para o armazenamento local do app
    const { uri } = await FileSystem.downloadAsync(url, fileUri, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });


    // Verifica se o compartilhamento está disponível no dispositivo
    if (!(await Sharing.isAvailableAsync())) {
      alert(`O compartilhamento não está disponível neste dispositivo.`);
      return;
    }
    
    // Abre o menu de compartilhamento nativo
    await Sharing.shareAsync(uri, {
      mimeType: 'text/csv',
      dialogTitle: `Compartilhar relatório de ${type}`,
      UTI: 'public.comma-separated-values-text' // UTI para iOS
    });

  } catch (error) {
    console.error("Erro na exportação:", error);
    Alert.alert("Erro de Exportação", "Não foi possível gerar o relatório. Verifique sua conexão e tente novamente.");
  }
};
