// utils/exportUtils.js

import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

// Função para converter um array de objetos JSON para uma string CSV
const jsonToCsv = (jsonData) => {
    if (!jsonData || jsonData.length === 0) {
        return '';
    }
    // Pega os cabeçalhos da primeira linha do JSON
    const headers = Object.keys(jsonData[0]);
    const csvRows = [];
    
    // Adiciona a linha de cabeçalho
    csvRows.push(headers.join(','));

    // Adiciona as linhas de dados
    for (const row of jsonData) {
        const values = headers.map(header => {
            const escaped = ('' + row[header]).replace(/"/g, '""'); // Escapa aspas duplas
            return `"${escaped}"`; // Envolve todos os valores em aspas
        });
        csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
};

// Função principal que exporta os dados
export const exportDataAsCsv = async (data, fileName) => {
    if (!data || data.length === 0) {
        alert("Não há dados para exportar.");
        return;
    }

    try {
        const csvString = jsonToCsv(data);
        const fileUri = FileSystem.documentDirectory + `${fileName.replace(/ /g, '_')}.csv`;

        await FileSystem.writeAsStringAsync(fileUri, csvString, {
            encoding: FileSystem.EncodingType.UTF8
        });

        console.log(`Arquivo CSV salvo em: ${fileUri}`);

        // Verifica se o compartilhamento está disponível
        if (!(await Sharing.isAvailableAsync())) {
            alert('O compartilhamento não está disponível neste dispositivo.');
            return;
        }

        // Abre o menu de compartilhamento
        await Sharing.shareAsync(fileUri, {
            mimeType: 'text/csv',
            dialogTitle: 'Compartilhar relatório CSV',
        });

    } catch (error) {
        console.error("Erro ao exportar CSV:", error);
        alert("Ocorreu um erro ao gerar o arquivo de exportação.");
    }
};