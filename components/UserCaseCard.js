import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, Title, Text, Button } from 'react-native-paper';

// Componente para exibir uma linha de informação
const InfoRow = ({ label, value }) => (
    <View style={styles.infoRow}>
        <Text style={styles.label}>{label}:</Text>
        <Text style={styles.value}>{value || 'N/A'}</Text>
    </View>
);

const UserCaseCard = ({ caso }) => {
    const navigation = useNavigation();

    const handleViewDetails = () => {
        navigation.navigate('UserCaseDetails', { caseId: caso._id });
    };

    return (
        <Card style={styles.card}>
            <Card.Content>
                <Title style={styles.title}>{caso.nameCase}</Title>
                <View style={styles.descriptionContainer}>
                    <Text style={styles.description} numberOfLines={3}>
                        {caso.Description || 'Sem descrição.'}
                    </Text>
                </View>
                <InfoRow label="Perito Resp." value={caso.responsibleExpert?.name} />
                <InfoRow label="Local" value={caso.location} />
                <InfoRow label="Status" value={caso.status} />
            </Card.Content>
            <Card.Actions>
                <Button mode="contained" onPress={handleViewDetails}>
                    Visualizar Detalhes
                </Button>
            </Card.Actions>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 16,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1e40af', // Azul escuro
        marginBottom: 8,
    },
    descriptionContainer: {
        marginBottom: 12,
        minHeight: 50, // Garante um espaço mínimo para a descrição
    },
    description: {
        color: '#475569',
        fontStyle: 'italic',
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    label: {
        fontWeight: '600',
        color: '#64748b',
        width: 100, // Largura fixa para o label
    },
    value: {
        flex: 1, // O valor ocupa o resto do espaço
        fontWeight: '500',
        color: '#334155',
    },
});

export default UserCaseCard;