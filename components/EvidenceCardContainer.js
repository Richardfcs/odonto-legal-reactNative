import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Checkbox } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function EvidenceCardContainer() {
  const [checkedFirst, setCheckedFirst] = useState(false);
  const [checkedSecond, setCheckedSecond] = useState(false);
  const [checkedThird, setCheckedThird] = useState(false);
  const [checkedFourth, setCheckedFourth] = useState(false);

  const onEditPress = (id) => alert(`Editar evidência ${id}`);
  const onDeletePress = (id) => alert(`Excluir evidência ${id}`);

  return (
    <View style={styles.container}>
      <View style={styles.outerCard}>
        <Text style={styles.outerCardTitle}>Evidências Relacionadas</Text>

        {/* Primeiro card */}
        <View style={styles.innerCard}>
          <View style={styles.topRightButtons}>
            <TouchableOpacity
              onPress={() => onEditPress('682d189082195005bfdfb672')}
              style={styles.iconButton}
              accessibilityLabel="Editar Evidência"
            >
              <MaterialCommunityIcons name="pencil" size={20} color="#2563eb" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onDeletePress('682d189082195005bfdfb672')}
              style={styles.iconButton}
              accessibilityLabel="Excluir Evidência"
            >
              <MaterialCommunityIcons name="trash-can" size={20} color="#dc2626" />
            </TouchableOpacity>
            <Checkbox
              status={checkedFirst ? 'checked' : 'unchecked'}
              onPress={() => setCheckedFirst(!checkedFirst)}
              color="#2563eb"
              style={{ marginLeft: 8 }}
            />
          </View>

          <View style={styles.content}>
            <Text style={styles.heading}>Radiografia Periapical</Text>
            <Text><Text style={styles.label}>Tipo: </Text>image</Text>
            <Text><Text style={styles.label}>Descrição: </Text>Imagem da região anterior superior</Text>
            <Text><Text style={styles.label}>Categoria: </Text>dados_ante_mortem</Text>
            <Text><Text style={styles.label}>Coletado por: </Text>Dr. Ana Silva</Text>

            <View style={styles.imageContainer}>
              <Image
                source={require('../img/pioneers.png')} // Substituir por imagem de radiografia periapical real
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          </View>
        </View>

        <View style={{ height: 16 }} />

        {/* Segundo card */}
        <View style={styles.innerCard}>
          <View style={styles.topRightButtons}>
            <TouchableOpacity
              onPress={() => onEditPress('682cda9695aefabb01f959e4')}
              style={styles.iconButton}
              accessibilityLabel="Editar Evidência"
            >
              <MaterialCommunityIcons name="pencil" size={20} color="#2563eb" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onDeletePress('682cda9695aefabb01f959e4')}
              style={styles.iconButton}
              accessibilityLabel="Excluir Evidência"
            >
              <MaterialCommunityIcons name="trash-can" size={20} color="#dc2626" />
            </TouchableOpacity>
            <Checkbox
              status={checkedSecond ? 'checked' : 'unchecked'}
              onPress={() => setCheckedSecond(!checkedSecond)}
              color="#2563eb"
              style={{ marginLeft: 8 }}
            />
          </View>

          <View style={styles.content}>
            <Text style={styles.heading}>Descrição da Fratura</Text>
            <Text><Text style={styles.label}>Tipo: </Text>text_description</Text>
            <Text><Text style={styles.label}>Descrição: </Text>Fratura observada no incisivo central superior esquerdo</Text>
            <Text><Text style={styles.label}>Categoria: </Text>dados_post_mortem</Text>
            <Text><Text style={styles.label}>Coletado por: </Text>Bruno Silva</Text>

            <View style={styles.preContainer}>
              <Text style={styles.preText}>Fragmento dental com fratura transversal e bordas irregulares.</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 16 }} />

        {/* Terceiro card */}
        <View style={styles.innerCard}>
          <View style={styles.topRightButtons}>
            <TouchableOpacity
              onPress={() => onEditPress('680110ff2fb9ddac47433efd')}
              style={styles.iconButton}
              accessibilityLabel="Editar Evidência"
            >
              <MaterialCommunityIcons name="pencil" size={20} color="#2563eb" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onDeletePress('680110ff2fb9ddac47433efd')}
              style={styles.iconButton}
              accessibilityLabel="Excluir Evidência"
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
            <Text style={styles.heading}>Prótese Parcial</Text>
            <Text><Text style={styles.label}>Tipo: </Text>image</Text>
            <Text><Text style={styles.label}>Descrição: </Text>Prótese removível superior com grampos metálicos</Text>
            <Text><Text style={styles.label}>Categoria: </Text>dados_post_mortem</Text>
            <Text><Text style={styles.label}>Coletado por: </Text>Dr. Ana Silva</Text>

            <View style={styles.imageContainer}>
              <Image
                source={require('../img/pioneers.png')} // Substituir por imagem da prótese dentária usada no caso
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          </View>
        </View>

        <View style={{ height: 16 }} />

        {/* Quarto card */}
        <View style={styles.innerCard}>
          <View style={styles.topRightButtons}>
            <TouchableOpacity
              onPress={() => onEditPress('67fc5f3688e4e879e5a581b6')}
              style={styles.iconButton}
              accessibilityLabel="Editar Evidência"
            >
              <MaterialCommunityIcons name="pencil" size={20} color="#2563eb" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onDeletePress('67fc5f3688e4e879e5a581b6')}
              style={styles.iconButton}
              accessibilityLabel="Excluir Evidência"
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
            <Text style={styles.heading}>Cadáver desfigurado</Text>
            <Text><Text style={styles.label}>Tipo: </Text>text_description</Text>
            <Text><Text style={styles.label}>Descrição: </Text>Paciente encontrado próximo ao rio, sem documentos</Text>
            <Text><Text style={styles.label}>Categoria: </Text>dados_post_mortem</Text>
            <Text><Text style={styles.label}>Coletado por: </Text>Dr. Ana Silva</Text>

            <View style={styles.preContainer}>
              <Text style={styles.preText}>
                Indivíduo do sexo masculino, cerca de 30 anos, sinais de decomposição avançada, sem identificação visual possível.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f3f4f6',
  },
  outerCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 26,           // diminuiu de 20 para 16
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
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    
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
    width: 200,          // diminuiu de 280 para 240
    height: 100,         // diminuiu de 180 para 160
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    resizeMode: 'cover',
  },
});
