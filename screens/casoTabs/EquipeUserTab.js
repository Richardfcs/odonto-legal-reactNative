import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Button, ActivityIndicator, Text, List, Searchbar, Card, Title, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { jwtDecode } from 'jwt-decode';
import "core-js/stable/atob";

const API_URL = 'https://odonto-legal-backend.onrender.com';

const EquipeUserTab = ({ caseId }) => {
  const [team, setTeam] = useState([]);
  const [responsibleExpert, setResponsibleExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canManage, setCanManage] = useState(false); // Perito Responsável ou Admin

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const checkPermissions = useCallback(async (caseData) => {
    const token = await AsyncStorage.getItem('token');
    if (!token) { setCanManage(false); return; }
    try {
      const decodedToken = jwtDecode(token);
      // Apenas o perito responsável deste caso pode gerenciar a equipe AQUI NESTA TELA
      const isResponsible = caseData.responsibleExpert?._id === decodedToken.id;
      setCanManage(isResponsible);
    } catch (e) { console.error("Erro ao decodificar token:", e); setCanManage(false); }
  }, []);


  useFocusEffect(
    useCallback(() => {
      const fetchTeamData = async () => {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        try {
          const res = await fetch(`${API_URL}/api/case/${caseId}`, { headers: { Authorization: `Bearer ${token}` } });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || 'Erro ao buscar dados da equipe');

          setTeam(data.team || []);
          setResponsibleExpert(data.responsibleExpert || null);
          await checkPermissions(data); // Verifica permissões com os dados recém-buscados
        } catch (error) {
          Alert.alert("Erro", error.message);
        } finally { setLoading(false); }
      };
      fetchTeamData();
    }, [caseId, checkPermissions])
  );

  const handleSearchUsers = async () => {
    if (searchQuery.length < 3) { Alert.alert("Busca", "Digite pelo menos 3 caracteres para buscar."); return; }
    setIsSearching(true); setSearchResults([]);
    const token = await AsyncStorage.getItem('token');
    try {
        const res = await fetch(`${API_URL}/api/user/search?name=${encodeURIComponent(searchQuery)}`, { headers: { 'Authorization': `Bearer ${token}` } });
        const data = await res.json();
        if(!res.ok) throw new Error(data.message || "Erro na busca");
        const currentMemberIds = team.map(m => m._id).concat(responsibleExpert?._id);
        const eligibleUsers = data.filter(user => 
            (user.role === 'perito' || user.role === 'assistente') &&
            !currentMemberIds.includes(user._id)
        );
        setSearchResults(eligibleUsers);
        if (eligibleUsers.length === 0) { Alert.alert("Busca", "Nenhum usuário elegível encontrado."); }
    } catch (error) { Alert.alert("Erro de Busca", error.message); } finally { setIsSearching(false); }
  };

  const handleAddMember = (user) => {
    Alert.alert("Adicionar Membro", `Adicionar "${user.name}" à equipe?`, [
        { text: "Cancelar", style: "cancel" },
        { text: "Adicionar", onPress: async () => {
            setLoading(true); // Opcional: mostrar loading geral ao adicionar
            const token = await AsyncStorage.getItem('token');
            try {
                const res = await fetch(`${API_URL}/api/case/${caseId}/team/${user._id}`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
                const result = await res.json();
                if(!res.ok) throw new Error(result.message || "Erro ao adicionar membro");
                Alert.alert("Sucesso", "Membro adicionado à equipe.");
                setTeam(result.case.team);
                setSearchResults([]); setSearchQuery('');
            } catch (error) { Alert.alert("Erro", error.message); } finally { setLoading(false); }
        }}
    ]);
  };
  
  const handleRemoveMember = (userId) => {
    Alert.alert("Confirmar Remoção", "Remover este membro da equipe?", [
        { text: "Cancelar" },
        { text: "Remover", style: 'destructive', onPress: async () => {
            setLoading(true); // Opcional: mostrar loading geral ao remover
            const token = await AsyncStorage.getItem('token');
            try {
                const res = await fetch(`${API_URL}/api/case/${caseId}/team/${userId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
                const result = await res.json();
                if(!res.ok) throw new Error(result.message || "Erro ao remover membro");
                Alert.alert("Sucesso", "Membro removido da equipe.");
                setTeam(result.case.team);
            } catch (error) { Alert.alert("Erro", error.message); } finally { setLoading(false); }
        }}
    ]);
  };

  if (loading) return <ActivityIndicator style={styles.centered} size="large" />;

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Equipe Atual</Title>
          {responsibleExpert && (
            <List.Item
              title={responsibleExpert.name}
              description={`Perito Responsável (${responsibleExpert.role})`}
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

      {canManage && ( // Só mostra a seção de adição se o usuário puder gerenciar
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
              style={styles.searchbar}
            />
            {isSearching ? <ActivityIndicator style={{ marginVertical: 10 }}/> : (
                searchResults.map(user => (
                  <List.Item
                    key={user._id}
                    title={user.name}
                    description={user.role}
                    left={props => <List.Icon {...props} icon="account-plus" />}
                    onPress={() => handleAddMember(user)}
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
  container: { flex: 1, backgroundColor: '#f1f5f9' }, // Nova cor de fundo
  card: { margin: 16, backgroundColor: '#fff' }, // Fundo branco para card
  emptyText: { textAlign: 'center', marginVertical: 20, color: '#64748b' }, // Nova cor de texto
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchbar: { marginBottom: 10 },
});

export default EquipeUserTab;