import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Card, Title, Button, Avatar } from 'react-native-paper';

const UserAddCaseCard = () => {
    const navigation = useNavigation();
    
    return (
        <Card style={{ /* Estilos similares ao UserCaseCard */ width: '100%', backgroundColor: '#fff', borderRadius: 10, marginBottom: 16, elevation: 5 }}>
            <Card.Content style={{ alignItems: 'center', paddingVertical: 30 }}>
                <Avatar.Icon size={64} icon="plus-circle-outline" style={{ backgroundColor: '#1e40af' }}/>
                <Title style={{ marginTop: 16, color: '#1e40af',  textAlign: 'center'}}>Criar Novo Caso</Title>
                <Card.Actions>
                <Button mode="contained" onPress={() => navigation.navigate('UserCreateCase')}>
                    Cadastrar
                </Button>
            </Card.Actions>
            </Card.Content>
        </Card>
    );
};

export default UserAddCaseCard;