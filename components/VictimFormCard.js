import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const VictimRegistration = () => {
  const [identificationStatus, setIdentificationStatus] = useState("nao_identificada");
  const [gender, setGender] = useState("desconhecido");
  const [ethnicityRace, setEthnicityRace] = useState("desconhecida");
  const [bodyMassIndexCategory, setBodyMassIndexCategory] = useState("desconhecido");
  const [mannerOfDeath, setMannerOfDeath] = useState("pendente_de_investigacao");
  const [causeOfDeathPrimary, setCauseOfDeathPrimary] = useState("indeterminada_medicamente");
  const [dentalRecordStatus, setDentalRecordStatus] = useState("desconhecido");
  const [toxicologyPerformed, setToxicologyPerformed] = useState("false");
  const [dnaSampleCollected, setDnaSampleCollected] = useState("false");
  const [dnaProfileObtained, setDnaProfileObtained] = useState("false");
  const [fingerprintCollected, setFingerprintCollected] = useState("false");
  const [fingerprintQuality, setFingerprintQuality] = useState("");
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Vítima</Text>
      <ScrollView>
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Identificação Fundamental</Text>
          <Text style={styles.label}>Código da Vítima <Text style={styles.required}>*</Text></Text>
          <TextInput style={styles.input} placeholder="Ex: V001-CASOXYZ" required />

          <Text style={styles.label}>Status de Identificação <Text style={styles.required}>*</Text></Text>
          <Picker
            selectedValue={identificationStatus}
            onValueChange={(itemValue) => setIdentificationStatus(itemValue)}
            style={styles.input}
          >
            <Picker.Item label="Não Identificada" value="nao_identificada" />
            <Picker.Item label="Em Processo de Identificação" value="em_processo_de_identificacao" />
            <Picker.Item label="Parcialmente Identificada" value="parcialmente_identificada" />
            <Picker.Item label="Identificada" value="identificada" />
          </Picker>

          <Text style={styles.sectionTitle}>Dados Demográficos</Text>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Idade no Óbito (Anos)</Text>
              <TextInput style={styles.input} placeholder="Ex: 30" keyboardType="numeric" />
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Faixa Etária Estimada</Text>
              <View style={styles.row}>
                <TextInput style={styles.input} placeholder="Mín." keyboardType="numeric" />
                <TextInput style={styles.input} placeholder="Máx." keyboardType="numeric" />
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Gênero (Sexo Biológico/Reg.)</Text>
              <Picker
                selectedValue={gender}
                onValueChange={(itemValue) => setGender(itemValue)}
                style={styles.input}
              >
                <Picker.Item label="Desconhecido" value="desconhecido" />
                <Picker.Item label="Masculino" value="masculino" />
                <Picker.Item label="Feminino" value="feminino" />
                <Picker.Item label="Intersexo" value="intersexo" />
                <Picker.Item label="Indeterminado" value="indeterminado" />
              </Picker>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Etnia/Raça</Text>
              <Picker
                selectedValue={ethnicityRace}
                onValueChange={(itemValue) => setEthnicityRace(itemValue)}
                style={styles.input}
              >
                <Picker.Item label="Desconhecida" value="desconhecida" />
                <Picker.Item label="Branca" value="branca" />
                <Picker.Item label="Preta" value="preta" />
                <Picker.Item label="Parda" value="parda" />
                <Picker.Item label="Amarela" value="amarela" />
                <Picker.Item label="Indígena" value="indigena" />
                <Picker.Item label="Não Declarada" value="nao_declarada" />
              </Picker>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Estatura (cm)</Text>
              <TextInput style={styles.input} placeholder="Ex: 170" keyboardType="numeric" />
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Categoria IMC</Text>
              <Picker
                selectedValue={bodyMassIndexCategory}
                onValueChange={(itemValue) => setBodyMassIndexCategory(itemValue)}
                style={styles.input}
              >
                <Picker.Item label="Desconhecido" value="desconhecido" />
                <Picker.Item label="Baixo Peso" value="baixo_peso" />
                <Picker.Item label="Eutrófico" value="eutrofico" />
                <Picker.Item label="Sobrepeso" value="sobrepeso" />
                <Picker.Item label="Obesidade Grau I" value="obesidade_grau_I" />
                <Picker.Item label="Obesidade Grau II" value="obesidade_grau_II" />
                <Picker.Item label="Obesidade Grau III" value="obesidade_grau_III" />
                <Picker.Item label="Indeterminado" value="indeterminado" />
              </Picker>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Contexto da Descoberta e Morte</Text>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Data do Óbito (Estimada/Confirmada)</Text>
              <TextInput style={styles.input} placeholder="dd/mm/aaaa" />
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Hora do Óbito (Estimada/Confirmada)</Text>
              <TextInput style={styles.input} placeholder="--:--" />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Data da Descoberta</Text>
              <TextInput style={styles.input} placeholder="dd/mm/aaaa" />
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Período do Dia (Descoberta)</Text>
              <Picker
                selectedValue={undefined}
                onValueChange={(itemValue) => {}}
                style={styles.input}
              >
                <Picker.Item label="Desconhecido" value="desconhecido" />
                <Picker.Item label="Madrugada (0h-6h)" value="madrugada" />
                <Picker.Item label="Manhã (6h-12h)" value="manha" />
                <Picker.Item label="Tarde (12h-18h)" value="tarde" />
                <Picker.Item label="Noite (18h-0h)" value="noite" />
              </Picker>
            </View>
          </View>

          <Text style={styles.label}>Local da Descoberta</Text>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Tipo de Local</Text>
              <Picker
                selectedValue={undefined}
                onValueChange={(itemValue) => {}}
                style={styles.input}
              >
                <Picker.Item label="Desconhecido" value="desconhecido" />
                <Picker.Item label="Residência" value="residencia" />
                <Picker.Item label="Via Pública" value="via_publica" />
                <Picker.Item label="Área Comercial" value="area_comercial" />
                <Picker.Item label="Área Industrial" value="area_industrial" />
                <Picker.Item label="Área Rural" value="area_rural" />
                <Picker.Item label="Mata/Floresta" value="mata_floresta" />
                <Picker.Item label="Corpo d'Água" value="corpo_dagua" />
                <Picker.Item label="Veículo" value="veiculo" />
                <Picker.Item label="Outro" value="outro" />
              </Picker>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Descrição Detalhada do Local</Text>
              <TextInput style={styles.input} placeholder="Ex: Margem da BR-101, km 50, próximo à árvore X" />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Município</Text>
              <TextInput style={styles.input} />
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Estado (UF)</Text>
              <TextInput style={styles.input} placeholder="Ex: SP" maxLength={2} />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Circunstância da Morte</Text>
              <Picker
                selectedValue={mannerOfDeath}
                onValueChange={(itemValue) => setMannerOfDeath(itemValue)}
                style={styles.input}
              >
                <Picker.Item label="Pendente de Investigação" value="pendente_de_investigacao" />
                <Picker.Item label="Homicídio" value="homicidio" />
                <Picker.Item label="Suicídio" value="suicidio" />
                <Picker.Item label="Acidente" value="acidente" />
                <Picker.Item label="Natural" value="natural" />
                <Picker.Item label="Indeterminada Legalmente" value="indeterminada_legalmente" />
              </Picker>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Causa Primária da Morte</Text>
              <Picker
                selectedValue={causeOfDeathPrimary}
                onValueChange={(itemValue) => setCauseOfDeathPrimary(itemValue)}
                style={styles.input}
              >
                <Picker.Item label="Indeterminada Medicamente" value="indeterminada_medicamente" />
                <Picker.Item label="Trauma Contuso" value="trauma_contuso" />
                <Picker.Item label="Ferimento por Arma Branca" value="ferimento_arma_branca" />
                <Picker.Item label="Ferimento por Arma de Fogo" value="ferimento_arma_fogo" />
                <Picker.Item label="Asfixia" value="asfixia" />
                <Picker.Item label="Intoxicação" value="intoxicacao" />
                <Picker.Item label="Queimadura" value="queimadura" />
                <Picker.Item label="Afogamento" value="afogamento" />
                <Picker.Item label="Causa Natural Específica" value="causa_natural_especifica" />
              </Picker>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Dados Odontolegais e Identificação Física</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Status do Registro Dental Ante-Mortem</Text>
            <Picker
              selectedValue={dentalRecordStatus}
              onValueChange={(itemValue) => setDentalRecordStatus(itemValue)}
              style={styles.input}
            >
              <Picker.Item label="Desconhecido" value="desconhecido" />
              <Picker.Item label="Disponível e Utilizado" value="disponivel_e_utilizado" />
              <Picker.Item label="Disponível mas Inconclusivo" value="disponivel_mas_inconclusivo" />
              <Picker.Item label="Disponível não Utilizado" value="disponivel_nao_utilizado" />
              <Picker.Item label="Não Disponível" value="nao_disponivel" />
              <Picker.Item label="Busca em Andamento" value="busca_em_andamento" />
            </Picker>
          </View>

          <Text style={styles.label}>Fonte do Registro Dental (se aplicável)</Text>
          <TextInput style={styles.input} />

          <Text style={styles.label}>Características Físicas Distintivas (separar por vírgula)</Text>
          <TextInput style={styles.input} />

          <Text style={styles.label}>Características Esqueléticas Notáveis (separar por vírgula)</Text>
          <TextInput style={styles.input} />

          <Text style={styles.sectionTitle}>Dados Forenses Adicionais</Text>
          <Text style={styles.label}>Intervalo Post-Mortem (IPM) Estimado</Text>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Mín. Horas</Text>
              <TextInput style={styles.input} keyboardType="numeric" />
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Máx. Horas</Text>
              <TextInput style={styles.input} keyboardType="numeric" />
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Método de Estimação IPM</Text>
              <TextInput style={styles.input} />
            </View>
          </View>

          <Text style={styles.label}>Triagem Toxicológica Realizada?</Text>
          <Picker
            selectedValue={toxicologyPerformed}
            onValueChange={(itemValue) => setToxicologyPerformed(itemValue)}
            style={styles.input}
          >
            <Picker.Item label="Não" value="false" />
            <Picker.Item label="Sim" value="true" />
          </Picker>

          <Text style={styles.label}>Sumário dos Resultados</Text>
          <TextInput style={styles.input} placeholder="Ex: Positivo para Etanol" />

          <Text style={styles.label}>Amostra Coletada?</Text>
          <Picker
            selectedValue={dnaSampleCollected}
            onValueChange={(itemValue) => setDnaSampleCollected(itemValue)}
            style={styles.input}
          >
            <Picker.Item label="Não" value="false" />
            <Picker.Item label="Sim" value="true" />
          </Picker>

          <Text style={styles.label}>Perfil Obtido?</Text>
          <Picker
            selectedValue={dnaProfileObtained}
            onValueChange={(itemValue) => setDnaProfileObtained(itemValue)}
            style={styles.input}
          >
            <Picker.Item label="Não" value="false" />
            <Picker.Item label="Sim" value="true" />
          </Picker>

          <Text style={styles.label}>Resultado Comparação</Text>
          <TextInput style={styles.input} />

          <Text style={styles.label}>Coletadas?</Text>
          <Picker
            selectedValue={fingerprintCollected}
            onValueChange={(itemValue) => setFingerprintCollected(itemValue)}
            style={styles.input}
          >
            <Picker.Item label="Não" value="false" />
            <Picker.Item label="Sim" value="true" />
          </Picker>

          <Text style={styles.label}>Qualidade</Text>
          <Picker
            selectedValue={fingerprintQuality}
            onValueChange={(itemValue) => setFingerprintQuality(itemValue)}
            style={styles.input}
          >
            <Picker.Item label="N/A" value="na" />
            <Picker.Item label="Boa" value="boa" />
            <Picker.Item label="Regular" value="regular" />
            <Picker.Item label="Ruim" value="ruim" />
            <Picker.Item label="Inviável" value="inviavel" />
          </Picker>

          <Text style={styles.label}>Resultado Comparação</Text>
          <TextInput style={styles.input} />

          <Text style={styles.label}>URLs de Fotos (separar por vírgula)</Text>
          <TextInput style={styles.input} placeholder="http://exemplo.com/foto1.jpg, http://exemplo.com/foto2.jpg" />

          <Text style={styles.label}>Notas Adicionais</Text>
          <TextInput style={styles.input} placeholder="Observações relevantes sobre a vítima..." />

          <View style={styles.buttonContainer}>
            <Button title="Cadastrar Vítima" onPress={() => {}} color="#3B82F6" />
            <Button title="Cancelar" onPress={() => {}} color="#EF4444" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A8A',
    textAlign: 'center',
    marginBottom: 24,
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E3A8A',
    marginVertical: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1D4ED8',
    marginVertical: 4,
  },
  required: {
    color: '#EF4444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  column: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default VictimRegistration;  