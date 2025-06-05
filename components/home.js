import React from 'react';
import { View, ScrollView, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import NavBar from '../components/nav';
import CaseCard from '../components/card';
import Footer from '../components/footer';


export default function HomeScreen() {
  const cases = [
    {
    id: '1',
    title: 'Corpo encontrado no Rio Capibaribe - identificação via arcada dentária',
    name: 'Dra. Ana Silva',
    role: 'admin',
    location: 'IML Recife - Seção de Odontologia Legal',
    status: 'finalizado',
    description: 'Identificação realizada com base em registros odontológicos da vítima.',
    link: 'detalhes-do-caso.js',
  },
  {
    id: '2',
    title: 'Identificação de vítima em incêndio - Boa Vista',
    name: 'Dr. Marcos Oliveira',
    role: 'perito',
    location: 'IML Central - Sala 3',
    status: 'em andamento',
    description: 'Vítima carbonizada encontrada em residência; análise dentária em curso.',
    link: 'detalhes-incendio.js',
  },
  {
    id: '3',
    title: 'Mordida humana em vítima de agressão - Ibura',
    name: 'Dr. Marcos Oliveira',
    role: 'perito',
    location: 'Consultório OdontoLegal - Sala A',
    status: 'em andamento',
    description: 'Exame das marcas de mordida para identificação de agressor.',
    link: 'detalhes-mordida.js',
  },
  ];

  return (
    <View style={styles.container}>
      <NavBar />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Título acima dos cards */}
        <Text style={styles.headerTitle}>Listagem de Casos</Text>

        {cases.map((item) => (
          <CaseCard
            key={item.id}
            title={item.title}
            name={item.name}
            role={item.role}
            location={item.location}
            status={item.status}
            description={item.description}
            link={item.link}
          />
        ))}

        {/* Quarto card "Novo Caso" */}
        <View style={styles.newCaseCard}>
          <Text style={styles.newCaseTitle}>Novo Caso</Text>
          <Image
            source={require('../img/addicon.png')} // ajuste caminho da imagem
            style={styles.newCaseImage}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.newCaseButton}
            onPress={() => {
              // Navegação para página de cadastro
            }}
          >
            <Text style={styles.newCaseButtonText}>Cadastrar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
       <Footer /> 
    </View>
   
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  content: {
    padding: 16,
    alignItems: 'center',
    gap: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  // Estilo para o título do header
  headerTitle: {
    width: '100%',
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e40af', // azul escuro
    marginBottom: 24,
    textAlign: 'center',
  },

  newCaseCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    minHeight: 280,
    width: 320,
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 16,
  },
  newCaseTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 8,
    textAlign: 'center',
  },
  newCaseImage: {
    width: 96,
    height: 96,
    marginBottom: 12,
  },
  newCaseButton: {
    backgroundColor: '#1e40af',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  newCaseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

//essa é a home oficial, ainda falta ligar as telas