import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import NavBar from '../components/nav';
import Footer from '../components/footer';

const ProfileScreen = () => {
 const userCases = [
  { title: 'Identificação de vítima em incêndio - Boa Vista', status: 'em andamento' },
  { title: 'Acidente com múltiplas vítimas - BR-232', status: 'em andamento' },
  { title: 'Mordida humana em vítima de agressão - Ibura', status: 'em andamento' },
  { title: 'Corpo encontrado no Rio Capibaribe - identificação via arcada dentária', status: 'finalizado' },
];

  return (
    <>
      <NavBar />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Meu Perfil</Text>
        </View>

        {/* Card de Perfil */}
        <View style={styles.card}>
          <View style={styles.photoContainer}>
            <Image
              source={require('../img/perfil.png')}
              style={styles.avatar}
            />
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>Dr Marcos Oliveira</Text>
            <Text style={styles.userDetail}>
              <Text style={styles.label}>Email:</Text> marcos.oliveira@forense.com
            </Text>
            <Text style={styles.userDetail}>
              <Text style={styles.label}>Telefone:</Text> (31) 99988-7788
            </Text>
            <Text style={styles.userDetail}>
              <Text style={styles.label}>Role:</Text> Perito
            </Text>
            <Text style={styles.userDetail}>
              <Text style={styles.label}>CRO:</Text> MG-778899
            </Text>
            <Text style={styles.userDetail}>
              <Text style={styles.label}>Membro desde:</Text> 23/04/2025
            </Text>
          </View>
        </View>

        {/* Card de Casos */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Meus Casos</Text>
          <Text style={styles.userDetail}>
            Você está associado a {userCases.length} caso(s).
          </Text>
          <View style={styles.caseList}>
            {userCases.map((caseItem, index) => (
              <Text key={index} style={styles.caseItem}>
                <Text style={styles.label}>{caseItem.title}</Text> ({caseItem.status})
              </Text>
            ))}
          </View>
        </View>

        {/* Card de Ações do Perfil */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Ações do Perfil</Text>
          <View style={styles.buttonGroup}>
            {/* <TouchableOpacity style={[styles.button, styles.editButton]}>
              <Text style={styles.buttonText}>Editar Perfil</Text>
            </TouchableOpacity> */}
            <TouchableOpacity style={[styles.button, styles.logoutButton]}>
              <Text style={styles.buttonText}>Sair (Logout)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <Footer />
    </>
  );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e40af',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: screenWidth - 48,
    flexDirection: 'column',
    marginBottom: 24,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 144,
    height: 144,
    borderRadius: 72,
    resizeMode: 'cover',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  userInfo: {
    alignItems: 'flex-start',
    width: '100%',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 12,
  },
  userDetail: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 6,
  },
  label: {
    fontWeight: '600',
    color: '#111827',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 12,
  },
  caseList: {
    marginTop: 12,
  },
  caseItem: {
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 6,
  },
  buttonGroup: {
    marginTop: 12,
    width: '100%',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  editButton: {
    backgroundColor: '#f59e0b',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileScreen;
