import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Checkbox } from 'react-native-paper';

export default function EvidenceCardContainer() {
  const [checkedThird, setCheckedThird] = useState(false);
  const [checkedFourth, setCheckedFourth] = useState(false);

  const onEditPress = (id) => alert(`Editar evidência ${id}`);
  const onDeletePress = (id) => alert(`Excluir evidência ${id}`);

  const renderImageCard = (titulo, descricao, categoria) => (
    <View style={[styles.innerCard, styles.innerCardNoButtons]} key={titulo}>
      <Text style={styles.heading}>{titulo}</Text>
      <Text><Text style={styles.label}>Tipo: </Text>image</Text>
      <Text><Text style={styles.label}>Descrição: </Text>{descricao}</Text>
      <Text><Text style={styles.label}>Categoria: </Text>{categoria}</Text>
      <Text><Text style={styles.label}>Coletado por: </Text>Dr. Ana Carvalho</Text>

      <View style={styles.imageContainer}>
        <Image
          source={require('../img/baixados.png')}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.outerCard}>
        <Text style={styles.outerCardTitle}>Evidências Relacionadas</Text>

        {/* Card 1 - Descrição textual */}
        <View style={[styles.innerCard, styles.innerCardNoButtons]}>
          <Text style={styles.heading}>Relatório de Análise Odontológica</Text>
          <Text><Text style={styles.label}>Tipo: </Text>text_description</Text>
          <Text><Text style={styles.label}>Descrição: </Text>Relato detalhado das estruturas dentárias encontradas no local.</Text>
          <Text><Text style={styles.label}>Categoria: </Text>dados_ante_mortem</Text>
          <Text><Text style={styles.label}>Coletado por: </Text>Dr. Ana Carvalho</Text>
          <View style={styles.preContainer}>
            <Text style={styles.preText}>Dentição permanente com ausência do dente 18. Presença de restauração em amálgama nos dentes 16 e 26.</Text>
          </View>
        </View>

        <View style={{ height: 16 }} />

        {/* Cards com imagem */}
        {renderImageCard('Arcada dentária parcial', 'Imagem da arcada superior parcialmente preservada.', 'achados_periciais')}
        <View style={{ height: 16 }} />
        {renderImageCard('Radiografia periapical', 'Radiografia mostrando fratura na raiz do dente 11.', 'achados_periciais')}
        <View style={{ height: 16 }} />
        {renderImageCard('Fragmento de mandíbula', 'Parte da mandíbula com três dentes íntegros.', 'achados_periciais')}
        <View style={{ height: 16 }} />
        {renderImageCard('Placa de bruxismo', 'Dispositivo encontrado próximo ao corpo, possivelmente utilizado para bruxismo.', 'achados_periciais')}
        <View style={{ height: 16 }} />

        {/* Card 3 - com botões */}
        <View style={styles.innerCard}>
          <View style={styles.topRightButtons}>
            <TouchableOpacity
              onPress={() => onEditPress('680110ff2fb9ddac47433efd')}
              style={styles.iconButton}
            >
              <MaterialCommunityIcons name="pencil" size={20} color="#2563eb" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onDeletePress('680110ff2fb9ddac47433efd')}
              style={styles.iconButton}
            >
              <MaterialCommunityIcons name="trash-can" size={20} color="#dc2626" />
            </TouchableOpacity>
            <Checkbox
              status={checkedThird ? 'checked' : 'unchecked'}
              onPress={() => setCheckedThird(!checkedThird)}
              color="#2563eb"
              style={{ marginLeft: 8 }}
            />
          </View>

          <View style={styles.content}>
            <Text style={styles.heading}>Mordida na epiderme</Text>
            <Text><Text style={styles.label}>Tipo: </Text>image</Text>
            <Text><Text style={styles.label}>Descrição: </Text>Marcas de mordida registradas na região cervical da vítima.</Text>
            <Text><Text style={styles.label}>Categoria: </Text>dados_post_mortem</Text>
            <Text><Text style={styles.label}>Coletado por: </Text>Dr. Ana Carvalho</Text>

            <View style={styles.imageContainer}>
              <Image
                source={require('../img/pioneers.png')}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          </View>
        </View>

        <View style={{ height: 16 }} />

        {/* Card 4 - com botões */}
        <View style={styles.innerCard}>
          <View style={styles.topRightButtons}>
            <TouchableOpacity
              onPress={() => onEditPress('67fc5f3688e4e879e5a581b6')}
              style={styles.iconButton}
            >
              <MaterialCommunityIcons name="pencil" size={20} color="#2563eb" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onDeletePress('67fc5f3688e4e879e5a581b6')}
              style={styles.iconButton}
            >
              <MaterialCommunityIcons name="trash-can" size={20} color="#dc2626" />
            </TouchableOpacity>
            <Checkbox
              status={checkedFourth ? 'checked' : 'unchecked'}
              onPress={() => setCheckedFourth(!checkedFourth)}
              color="#2563eb"
              style={{ marginLeft: 8 }}
            />
          </View>

          <View style={styles.content}>
            <Text style={styles.heading}>Registro pós-morte</Text>
            <Text><Text style={styles.label}>Tipo: </Text>text_description</Text>
            <Text><Text style={styles.label}>Descrição: </Text>Descrição detalhada das condições orais após o óbito.</Text>
            <Text><Text style={styles.label}>Categoria: </Text>dados_post_mortem</Text>
            <Text><Text style={styles.label}>Coletado por: </Text>Dr. Ana Carvalho</Text>

            <View style={styles.preContainer}>
              <Text style={styles.preText}>
                Dentes com coloração escurecida e reabsorção radicular. Não foram identificadas restaurações metálicas.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  outerCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 30,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  outerCardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: 16,
  },
  innerCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    position: 'relative',
  },
  innerCardNoButtons: {
    paddingTop: 12,
  },
  topRightButtons: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 6,
    marginHorizontal: 4,
  },
  content: {
    paddingTop: 32,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 8,
  },
  label: {
    fontWeight: '700',
  },
  preContainer: {
    backgroundColor: '#e5e7eb',
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  preText: {
    fontFamily: 'monospace',
  },
  imageContainer: {
    marginTop: 12,
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 12,
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
});
