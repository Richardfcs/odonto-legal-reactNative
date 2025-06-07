import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, Title, Text, Button } from 'react-native-paper';

// Reutilizando o InfoRow que já definimos antes
const InfoRow = ({ label, value }) => (
    <View style={styles.infoRow}>
        <Text style={styles.label}>{label}:</Text>
        <Text style={styles.value}>{value || 'N/A'}</Text>
    </View>
);

const ConsultaCaseCard = ({ caso }) => {
    const navigation = useNavigation();

    const handleConsult = () => {
        // Navega para a rota de consulta
        navigation.navigate('ConsultaCaseDetails', { caseId: caso._id });
    };

    return (
        <Card style={styles.card}>
            <Card.Content>
                <Title style={styles.title}>{caso.nameCase}</Title>
                <InfoRow label="Perito Resp." value={caso.responsibleExpert?.name} />
                <InfoRow label="Local" value={caso.location} />
                <InfoRow label="Status" value={caso.status} />
            </Card.Content>
            <Card.Actions>
                <Button mode="contained" onPress={handleConsult}>
                    Consultar
                </Button>
            </Card.Actions>
        </Card>
    );
};

// Usando os mesmos estilos do UserCaseCard para manter a consistência
const styles = StyleSheet.create({
    card: { width: '100%', backgroundColor: '#fff', borderRadius: 10, marginBottom: 16, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 6 },
    title: { fontSize: 20, fontWeight: '700', color: '#1e40af', marginBottom: 8 },
    infoRow: { flexDirection: 'row', marginBottom: 4 },
    label: { fontWeight: '600', color: '#64748b', width: 100 },
    value: { flex: 1, fontWeight: '500', color: '#334155' },
});

export default ConsultaCaseCard;