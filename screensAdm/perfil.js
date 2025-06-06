import React, { useState, useCallback } from 'react';
import { ScrollView, View, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Text, Button, Card, Title, List, ActivityIndicator, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const API_URL = 'https://odonto-legal-backend.onrender.com';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // useFocusEffect agora segue o padrão correto recomendado pelo React Navigation
  useFocusEffect(
    useCallback(() => {
      // A função async é definida aqui dentro
      const loadUserProfile = async () => {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          navigation.replace('Login');
          return;
        }

        try {
          const response = await fetch(`${API_URL}/api/user/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await response.json();

          if (response.ok) {
            setUserData(data);
          } else {
            if (response.status === 401 || response.status === 403) {
              Alert.alert("Sessão Expirada", "Por favor, faça o login novamente.");
              await handleLogout(); // handleLogout precisa ser acessível aqui
            } else {
              throw new Error(data.message || 'Erro ao carregar perfil');
            }
          }
        } catch (error) {
          console.error("Erro ao carregar perfil:", error);
          Alert.alert("Erro", error.message);
        } finally {
          setLoading(false);
        }
      };

      // E chamada imediatamente
      loadUserProfile();

      // O useCallback não tem dependências aqui, pois handleLogout e navigation são estáveis
    }, [])
  );

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['token', 'role']);
    navigation.replace('Login');
  };

  const navigateToCaseDetails = (caseId) => {
      // Supondo que você tenha uma rota para detalhes do caso
      // navigation.navigate('AdminCaseDetails', { caseId });
      Alert.alert("Navegação", `Navegar para detalhes do caso com ID: ${caseId}`);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.centered}>
        <Text>Não foi possível carregar os dados do perfil.</Text>
      </View>
    );
  }

  const getRoleText = (role) => {
    if (role === 'admin') return 'Administrador';
    if (role === 'perito') return 'Perito';
    return 'Assistente';
  };

  const photoUri = userData.photo ? `data:image/png;base64,${userData.photo}` : null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          <View style={styles.header}>
            <Avatar.Image
              size={120}
              source={photoUri ? { uri: photoUri } : require('../assets/default_icon.png')}
            />
            <Title style={styles.userName}>{userData.name}</Title>
            <Text style={styles.userEmail}>{userData.email}</Text>
          </View>
          
          <Card style={styles.card}>
            <Card.Content>
              <List.Section>
                <List.Subheader>Informações Pessoais</List.Subheader>
                <List.Item
                  title="Telefone"
                  description={userData.telephone || 'Não informado'}
                  left={props => <List.Icon {...props} icon="phone" />}
                />
                <List.Item
                  title="CRO"
                  description={userData.cro || 'Não informado'}
                  left={props => <List.Icon {...props} icon="card-account-details-outline" />}
                />
                <List.Item
                  title="Cargo"
                  description={getRoleText(userData.role)}
                  left={props => <List.Icon {...props} icon="account-tie" />}
                />
                <List.Item
                  title="Membro Desde"
                  description={new Date(userData.createdAt).toLocaleDateString('pt-BR')}
                  left={props => <List.Icon {...props} icon="calendar-check" />}
                />
              </List.Section>
            </Card.Content>
          </Card>
          
          <Card style={styles.card}>
            <Card.Content>
                <List.Section>
                    <List.Subheader>Meus Casos ({userData.cases?.length || 0})</List.Subheader>
                    {userData.cases && userData.cases.length > 0 ? (
                        userData.cases.map(caso => (
                            <List.Item
                                key={caso._id}
                                title={caso.nameCase || 'Caso sem nome'}
                                description={`Status: ${caso.status || 'desconhecido'}`}
                                left={props => <List.Icon {...props} icon="folder-text" />}
                                onPress={() => navigateToCaseDetails(caso._id)}
                            />
                        ))
                    ) : (
                        <Text style={styles.noCasesText}>Nenhum caso associado.</Text>
                    )}
                </List.Section>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
                <Title>Ações</Title>
                <Button
                    icon="logout"
                    mode="contained"
                    onPress={handleLogout}
                    style={styles.logoutButton}
                >
                    Sair (Logout)
                </Button>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  userName: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
  },
  card: {
    marginBottom: 16,
  },
  noCasesText: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    fontSize: 16,
    fontStyle: 'italic',
    color: '#666'
  },
  logoutButton: {
      marginTop: 8,
      backgroundColor: '#d9534f',
  }
});

export default ProfileScreen;