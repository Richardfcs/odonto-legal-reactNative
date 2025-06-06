import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Button, ActivityIndicator, Text, List, Searchbar, Card, Title, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'https://odonto-legal-backend.onrender.com';

const EquipeTab = ({ caseId }) => {
  const [team, setTeam] = useState([]);
  const [responsibleExpert, setResponsibleExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canManage, setCanManage] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const checkPermissions = useCallback(async (caseData) => {
    // ... (sem mudanças nesta função)
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      setCanManage(false);
      return;
    }
    const decodedToken = jwtDecode(token);
    const isAdmin = decodedToken.role === 'admin';
    const isResponsible = caseData.responsibleExpert?._id === decodedToken.id;
    setCanManage(isAdmin || isResponsible);
  }, []);

  useFocusEffect(
    useCallback(() => {
      // ... (sem mudanças no fetchTeamData)
      const fetchTeamData = async () => {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        try {
          const res = await fetch(`${API_URL}/api/case/${caseId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || 'Erro ao buscar dados da equipe');

          setTeam(data.team || []);
          setResponsibleExpert(data.responsibleExpert || null);
          await checkPermissions(data);
        } catch (error) {
          Alert.alert("Erro", error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchTeamData();
    }, [caseId, checkPermissions])
  );

  const handleSearchUsers = async () => {
    if (searchQuery.length < 3) {
      Alert.alert("Busca", "Digite pelo menos 3 caracteres para buscar.");
      return;
    }
    setIsSearching(true);
    setSearchResults([]); // Limpa resultados antigos
    const token = await AsyncStorage.getItem('token');
    try {
        const res = await fetch(`${API_URL}/api/user/search?name=${encodeURIComponent(searchQuery)}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if(!res.ok) throw new Error(data.message || "Erro na busca");
        
        const currentMemberIds = team.map(m => m._id).concat(responsibleExpert?._id);
        
        // MELHORIA: Filtra para incluir apenas peritos e assistentes que não estão na equipe
        const eligibleUsers = data.filter(user => 
            (user.role === 'perito' || user.role === 'assistente') &&
            !currentMemberIds.includes(user._id)
        );
        
        setSearchResults(eligibleUsers);
        if (eligibleUsers.length === 0) {
            Alert.alert("Busca", "Nenhum usuário elegível encontrado com este termo.");
        }
    } catch (error) {
        Alert.alert("Erro de Busca", error.message);
    } finally {
        setIsSearching(false);
    }
  };

  const handleAddMember = (user) => {
    // MELHORIA: Adiciona um diálogo de confirmação antes de adicionar
    Alert.alert(
        "Adicionar Membro",
        `Tem certeza que deseja adicionar "${user.name}" à equipe?`,
        [
            { text: "Cancelar", style: "cancel" },
            { text: "Adicionar", onPress: async () => {
                const token = await AsyncStorage.getItem('token');
                try {
                    const res = await fetch(`${API_URL}/api/case/${caseId}/team/${user._id}`, {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const result = await res.json();
                    if(!res.ok) throw new Error(result.message || "Erro ao adicionar membro");
                    
                    Alert.alert("Sucesso", "Membro adicionado à equipe.");
                    setTeam(result.case.team);
                    setSearchResults([]);
                    setSearchQuery('');
                } catch (error) {
                    Alert.alert("Erro", error.message);
                }
            }}
        ]
    );
  };
  
  const handleRemoveMember = async (userId) => {
    // ... (sem mudanças nesta função)
    Alert.alert("Confirmar Remoção", "Tem certeza que deseja remover este membro da equipe?", [
        { text: "Cancelar" },
        { text: "Remover", style: 'destructive', onPress: async () => {
            const token = await AsyncStorage.getItem('token');
            try {
                const res = await fetch(`${API_URL}/api/case/${caseId}/team/${userId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const result = await res.json();
                if(!res.ok) throw new Error(result.message || "Erro ao remover membro");
                
                Alert.alert("Sucesso", "Membro removido da equipe.");
                setTeam(result.case.team);
            } catch (error) {
                Alert.alert("Erro", error.message);
            }
        }}
    ]);
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Equipe Atual</Title>
          {responsibleExpert && (
            <List.Item
              title={responsibleExpert.name}
              description="Perito Responsável"
              left={props => <List.Icon {...props} icon="account-star" />}
            />
          )}
          {team.map(member => (
            <List.Item
              key={member._id}
              title={member.name}
              description={member.role}
              left={props => <List.Icon {...props} icon="account" />}
              right={() => canManage && <IconButton icon="delete" onPress={() => handleRemoveMember(member._id)} />}
            />
          ))}
          {team.length === 0 && !responsibleExpert && <Text style={styles.emptyText}>Nenhum membro na equipe.</Text>}
        </Card.Content>
      </Card>

      {canManage && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Adicionar Membro</Title>
            <Searchbar
              placeholder="Buscar perito ou assistente..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onIconPress={handleSearchUsers}
              onSubmitEditing={handleSearchUsers}
              loading={isSearching}
            />
            {isSearching ? <ActivityIndicator style={{ marginVertical: 10 }}/> : (
                searchResults.map(user => (
                  <List.Item
                    key={user._id}
                    title={user.name}
                    description={user.role}
                    left={props => <List.Icon {...props} icon="account-plus" />}
                    onPress={() => handleAddMember(user)} // Passa o objeto do usuário inteiro
                  />
                ))
            )}
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: { margin: 16 },
  emptyText: { textAlign: 'center', marginVertical: 20, color: 'gray' }
});

export default EquipeTab;