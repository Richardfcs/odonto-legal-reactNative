import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button, Title, List, Provider as PaperProvider, Divider, ActivityIndicator, Text, Checkbox, Menu, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

const API_URL = 'https://odonto-legal-backend.onrender.com';

// Componente SelectMenu para evitar repetição
const SelectMenu = ({ label, value, options, onSelect, placeholder }) => {
    const [visible, setVisible] = useState(false);
    const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder;
    return (
        <View style={styles.inputContainer}>
            <Text style={styles.label}>{label}</Text>
            <Menu
                visible={visible}
                onDismiss={() => setVisible(false)}
                anchor={<Button icon="chevron-down" contentStyle={styles.menuButtonContent} labelStyle={styles.menuButtonLabel} mode="outlined" onPress={() => setVisible(true)}>{selectedLabel}</Button>}
            >
                {options.map(opt => (
                    <Menu.Item key={opt.value} onPress={() => { onSelect(opt.value); setVisible(false); }} title={opt.label} />
                ))}
            </Menu>
        </View>
    );
};

const EditarVitimaScreen = ({ route }) => {
    const navigation = useNavigation();
    const { victimId } = route.params;

    const [formData, setFormData] = useState(null);
    const [dateOfDeath, setDateOfDeath] = useState(new Date());
    const [dateOfDiscovery, setDateOfDiscovery] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [datePickerTarget, setDatePickerTarget] = useState('death');
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [expandedAccordion, setExpandedAccordion] = useState('1');
    
    useEffect(() => {
        const fetchVictimData = async () => {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');
            try {
                const res = await fetch(`${API_URL}/api/victim/${victimId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Erro ao carregar dados da vítima');
                
                setFormData(data || {});
                if (data.dateOfDeath) setDateOfDeath(new Date(data.dateOfDeath));
                if (data.dateOfDiscovery) setDateOfDiscovery(new Date(data.dateOfDiscovery));
            } catch (error) {
                Alert.alert("Erro", error.message);
                navigation.goBack();
            } finally {
                setLoading(false);
            }
        };
        fetchVictimData();
    }, [victimId]);

    const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
    const onDateChange = (event, selectedDate) => { setShowDatePicker(false); if (selectedDate) { if(datePickerTarget === 'death') setDateOfDeath(selectedDate); else setDateOfDiscovery(selectedDate); } };
    const showDatepickerFor = (target) => { setDatePickerTarget(target); setShowDatePicker(true); };

    const handleUpdate = async () => {
        setSaving(true);
        const token = await AsyncStorage.getItem('token');
        const payload = {};
        
        // ... (código de construção e limpeza do payload, sem alterações)
        const stringFields = ['victimCode', 'identificationStatus', 'name', 'gender', 'ethnicityRace', 'bodyMassIndexCategory', 'timeOfDayDiscovery', 'mannerOfDeath', 'causeOfDeathPrimary', 'dentalRecordStatus', 'dentalRecordSource', 'additionalNotes'];
        stringFields.forEach(field => {
            if (formData[field]) payload[field] = formData[field];
        });
        if (formData.ageAtDeath) payload.ageAtDeath = parseInt(formData.ageAtDeath, 10);
        if (formData.statureCm) payload.statureCm = parseFloat(formData.statureCm);
        if (dateOfDeath) payload.dateOfDeath = dateOfDeath.toISOString().split('T')[0];
        if (dateOfDiscovery) payload.dateOfDiscovery = dateOfDiscovery.toISOString().split('T')[0];
        const nestedObjects = {
            estimatedAgeRange: { min: formData.estimatedAgeMin, max: formData.estimatedAgeMax },
            contact: { telephone: formData.contactTelephone, email: formData.contactEmail },
            lastKnownAddress: { street: formData.addressStreet, number: formData.addressNumber, complement: formData.addressComplement, neighborhood: formData.addressNeighborhood, city: formData.addressCity, state: formData.addressState, zipCode: formData.addressZipCode },
            discoveryLocation: { description: formData.discoveryLocationDescription, type: formData.discoveryLocationType, municipality: formData.discoveryLocationMunicipality, state: formData.discoveryLocationState },
            postMortemIntervalEstimate: { minHours: formData.postMortemMinHours, maxHours: formData.postMortemMaxHours, estimationMethod: formData.postMortemEstimationMethod },
            toxicologyScreening: { performed: formData.toxicologyPerformed, resultsSummary: formData.toxicologyResultsSummary },
            dnaAnalysis: { sampleCollected: formData.dnaSampleCollected, profileObtained: formData.dnaProfileObtained, comparisonResult: formData.dnaComparisonResult },
            fingerprintAnalysis: { collected: formData.fingerprintCollected, quality: formData.fingerprintQuality, comparisonResult: formData.fingerprintComparisonResult },
        };
        for (const key in nestedObjects) {
            const cleanedObj = {}; let hasValue = false;
            for (const subKey in nestedObjects[key]) {
                const value = nestedObjects[key][subKey];
                if (value !== null && value !== undefined && value !== '') {
                    if (['min', 'max', 'minHours', 'maxHours'].includes(subKey)) { cleanedObj[subKey] = parseInt(value, 10); } else { cleanedObj[subKey] = value; }
                    hasValue = true;
                }
            }
            if (hasValue) payload[key] = cleanedObj;
        }
        const arrayFields = ['otherDistinctivePhysicalFeatures', 'skeletalFeatures', 'photosUrls'];
        arrayFields.forEach(field => {
            if (formData[field] && typeof formData[field] === 'string') {
                const arr = formData[field].split(',').map(s => s.trim()).filter(Boolean);
                if (arr.length > 0) payload[field] = arr;
            }
        });

        try {
            const response = await fetch(`${API_URL}/api/victim/${victimId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || result.message || "Erro ao atualizar vítima.");
            
            Alert.alert("Sucesso", "Dados da vítima atualizados com sucesso!");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Erro de Atualização", error.message);
        } finally {
            setSaving(false);
        }
    };
    
    if (loading || !formData) return <ActivityIndicator style={styles.centered} size="large" />;
    
    const isNameRequired = formData.identificationStatus === 'identificada' || formData.identificationStatus === 'parcialmente_identificada';
    const isContactVisible = formData.identificationStatus === 'identificada';

    return (
        <PaperProvider>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }} keyboardVerticalOffset={64}>
                <SafeAreaView style={styles.container}>
                    <ScrollView>
                        <View style={styles.content}>
                            <Title style={styles.title}>Editar Vítima</Title>
                            
                            <List.AccordionGroup expandedId={expandedAccordion} onAccordionPress={setExpandedAccordion}>
                                <Card style={styles.card}><List.Accordion title="1. Identificação Fundamental" id="1" titleStyle={styles.accordionTitle}>
                                <View style={styles.accordionContent}>
                                    <TextInput label="Código da Vítima *" value={formData.victimCode || ''} onChangeText={v => handleInputChange('victimCode', v)} mode="outlined" style={styles.input} />
                                    <SelectMenu label="Status de Identificação *" value={formData.identificationStatus} onSelect={v => handleInputChange('identificationStatus', v)} placeholder="Selecione..." options={[{label: 'Não Identificada', value: 'nao_identificada'}, {label: 'Em Processo', value: 'em_processo_de_identificacao'}, {label: 'Parcialmente Identificada', value: 'parcialmente_identificada'}, {label: 'Identificada', value: 'identificada'}]} />
                                    {isNameRequired && (<TextInput label="Nome da Vítima *" value={formData.name || ''} onChangeText={v => handleInputChange('name', v)} mode="outlined" style={styles.input} />)}
                                </View>
                                </List.Accordion></Card>

                                <Card style={styles.card}><List.Accordion title="2. Dados Demográficos" id="2" titleStyle={styles.accordionTitle}><View style={styles.accordionContent}>
                                    <TextInput label="Idade no Óbito" value={String(formData.ageAtDeath || '')} onChangeText={v => handleInputChange('ageAtDeath', v)} keyboardType="numeric" mode="outlined" style={styles.input} />
                                    <Text style={styles.label}>Faixa Etária Estimada</Text>
                                    <View style={styles.row}><TextInput label="Mín." value={String(formData.estimatedAgeMin || '')} onChangeText={v => handleInputChange('estimatedAgeMin', v)} keyboardType="numeric" mode="outlined" style={styles.halfInput} /><TextInput label="Máx." value={String(formData.estimatedAgeMax || '')} onChangeText={v => handleInputChange('estimatedAgeMax', v)} keyboardType="numeric" mode="outlined" style={styles.halfInput} /></View>
                                    <SelectMenu label="Gênero" value={formData.gender} onSelect={v => handleInputChange('gender', v)} placeholder="Selecione..." options={[{label: 'Desconhecido', value: 'desconhecido'}, {label: 'Masculino', value: 'masculino'}, {label: 'Feminino', value: 'feminino'}, {label: 'Intersexo', value: 'intersexo'}, {label: 'Indeterminado', value: 'indeterminado'}]} />
                                    <SelectMenu label="Etnia/Raça" value={formData.ethnicityRace} onSelect={v => handleInputChange('ethnicityRace', v)} placeholder="Selecione..." options={[{label: 'Desconhecida', value: 'desconhecida'}, {label: 'Branca', value: 'branca'}, {label: 'Preta', value: 'preta'}, {label: 'Parda', value: 'parda'}, {label: 'Amarela', value: 'amarela'}, {label: 'Indígena', value: 'indigena'}, {label: 'Não Declarada', value: 'nao_declarada'}]} />
                                    <TextInput label="Estatura (cm)" value={String(formData.statureCm || '')} onChangeText={v => handleInputChange('statureCm', v)} keyboardType="numeric" mode="outlined" style={styles.input} />
                                    <SelectMenu label="Categoria IMC" value={formData.bodyMassIndexCategory} onSelect={v => handleInputChange('bodyMassIndexCategory', v)} placeholder="Selecione..." options={[{label: 'Desconhecido', value: 'desconhecido'}, {label: 'Baixo Peso', value: 'baixo_peso'}, {label: 'Eutrófico', value: 'eutrofico'}, {label: 'Sobrepeso', value: 'sobrepeso'}, {label: 'Obesidade Grau I', value: 'obesidade_grau_I'}, {label: 'Obesidade Grau II', value: 'obesidade_grau_II'}, {label: 'Obesidade Grau III', value: 'obesidade_grau_III'}]} />
                                </View></List.Accordion></Card>
                                
                                {isContactVisible && (<Card style={styles.card}><List.Accordion title="3. Contato e Endereço" id="3" titleStyle={styles.accordionTitle}><View style={styles.accordionContent}>
                                    <TextInput label="Telefone Contato" value={formData.contactTelephone || ''} onChangeText={v => handleInputChange('contactTelephone', v)} keyboardType="phone-pad" mode="outlined" style={styles.input} />
                                    <TextInput label="Email Contato" value={formData.contactEmail || ''} onChangeText={v => handleInputChange('contactEmail', v)} keyboardType="email-address" mode="outlined" style={styles.input} />
                                    <Divider style={styles.divider} /><Text style={styles.subHeader}>Endereço</Text>
                                    <TextInput label="Logradouro" value={formData.addressStreet || ''} onChangeText={v => handleInputChange('addressStreet', v)} mode="outlined" style={styles.input} /><View style={styles.row}><TextInput label="Número" value={formData.addressNumber || ''} onChangeText={v => handleInputChange('addressNumber', v)} mode="outlined" style={styles.halfInput} /><TextInput label="Bairro" value={formData.addressNeighborhood || ''} onChangeText={v => handleInputChange('addressNeighborhood', v)} mode="outlined" style={styles.halfInput} /></View>
                                    <TextInput label="Complemento" value={formData.addressComplement || ''} onChangeText={v => handleInputChange('addressComplement', v)} mode="outlined" style={styles.input} />
                                    <View style={styles.row}><TextInput label="Cidade" value={formData.addressCity || ''} onChangeText={v => handleInputChange('addressCity', v)} mode="outlined" style={{flex: 2, marginRight: 8}} /><TextInput label="UF" value={formData.addressState || ''} onChangeText={v => handleInputChange('addressState', v)} maxLength={2} mode="outlined" style={{flex: 1}} /></View>
                                    <TextInput label="CEP" value={formData.addressZipCode || ''} onChangeText={v => handleInputChange('addressZipCode', v)} keyboardType="numeric" mode="outlined" style={styles.input} />
                                </View></List.Accordion></Card>)}
                                
                                <Card style={styles.card}><List.Accordion title="4. Contexto da Descoberta e Morte" id="4" titleStyle={styles.accordionTitle}><View style={styles.accordionContent}>
                                    <Text style={styles.label}>Datas</Text>
                                    <Button icon="calendar" mode="outlined" onPress={() => showDatepickerFor('death')} style={styles.input}>Data do Óbito: {dateOfDeath.toLocaleDateString('pt-BR')}</Button>
                                    <Button icon="calendar" mode="outlined" onPress={() => showDatepickerFor('discovery')} style={styles.input}>Data da Descoberta: {dateOfDiscovery.toLocaleDateString('pt-BR')}</Button>
                                    {showDatePicker && <DateTimePicker value={datePickerTarget === 'death' ? dateOfDeath : dateOfDiscovery} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={onDateChange} />}
                                    <SelectMenu label="Período do Dia (Descoberta)" value={formData.timeOfDayDiscovery} onSelect={v => handleInputChange('timeOfDayDiscovery', v)} placeholder="Selecione..." options={[{label: 'Desconhecido', value: 'desconhecido'}, {label: 'Manhã (6h-12h)', value: 'manha (6h-12h)'}, {label: 'Tarde (12h-18h)', value: 'tarde (12h-18h)'}, {label: 'Noite (18h-0h)', value: 'noite (18h-0h)'}, {label: 'Madrugada (0h-6h)', value: 'madrugada (0h-6h)'}]} />
                                    <SelectMenu label="Tipo de Local (Descoberta)" value={formData.discoveryLocationType} onSelect={v => handleInputChange('discoveryLocationType', v)} placeholder="Selecione..." options={[{label: 'Desconhecido', value: 'desconhecido'}, {label: 'Residência', value: 'residencia'}, {label: 'Via Pública', value: 'via_publica'}, {label: 'Área Rural', value: 'area_rural'}]} />
                                    <TextInput label="Descrição do Local" value={formData.discoveryLocationDescription || ''} onChangeText={v => handleInputChange('discoveryLocationDescription', v)} mode="outlined" style={styles.input} />
                                    <View style={styles.row}><TextInput label="Município" value={formData.discoveryLocationMunicipality || ''} onChangeText={v => handleInputChange('discoveryLocationMunicipality', v)} mode="outlined" style={styles.halfInput} /><TextInput label="UF" value={formData.discoveryLocationState || ''} onChangeText={v => handleInputChange('discoveryLocationState', v)} maxLength={2} mode="outlined" style={styles.halfInput} /></View>
                                    <SelectMenu label="Circunstância da Morte" value={formData.mannerOfDeath} onSelect={v => handleInputChange('mannerOfDeath', v)} placeholder="Selecione..." options={[{label: 'Pendente', value: 'pendente_de_investigacao'}, {label: 'Homicídio', value: 'homicidio'}, {label: 'Suicídio', value: 'suicidio'}, {label: 'Acidente', value: 'acidente'}, {label: 'Natural', value: 'natural'}]} />
                                    <SelectMenu label="Causa Primária da Morte" value={formData.causeOfDeathPrimary} onSelect={v => handleInputChange('causeOfDeathPrimary', v)} placeholder="Selecione..." options={[{label: 'Indeterminada', value: 'indeterminada_medicamente'}, {label: 'Trauma Contuso', value: 'trauma_contuso'}, {label: 'Arma de Fogo', value: 'ferimento_arma_fogo'}]} />
                                </View></List.Accordion></Card>

                                <Card style={styles.card}><List.Accordion title="5. Dados Odontolegais" id="5" titleStyle={styles.accordionTitle}><View style={styles.accordionContent}>
                                    <SelectMenu label="Status Registro Dental" value={formData.dentalRecordStatus} onSelect={v => handleInputChange('dentalRecordStatus', v)} placeholder="Selecione..." options={[{label: 'Desconhecido', value: 'desconhecido'}, {label: 'Disponível e Utilizado', value: 'disponivel_e_utilizado'}]} />
                                    <TextInput label="Fonte do Registro Dental" value={formData.dentalRecordSource || ''} onChangeText={v => handleInputChange('dentalRecordSource', v)} mode="outlined" style={styles.input} />
                                    <TextInput label="Características Físicas (separar por vírgula)" value={formData.otherDistinctivePhysicalFeatures?.join(', ') || ''} onChangeText={v => handleInputChange('otherDistinctivePhysicalFeatures', v)} multiline mode="outlined" style={styles.input} />
                                    <TextInput label="Características Esqueléticas (separar por vírgula)" value={formData.skeletalFeatures?.join(', ') || ''} onChangeText={v => handleInputChange('skeletalFeatures', v)} multiline mode="outlined" style={styles.input} />
                                </View></List.Accordion></Card>

                                <Card style={styles.card}><List.Accordion title="6. Dados Forenses Adicionais" id="6" titleStyle={styles.accordionTitle}><View style={styles.accordionContent}>
                                    <Text style={styles.subHeader}>Intervalo Post-Mortem Estimado</Text>
                                    <View style={styles.row}><TextInput label="Mín. Horas" value={String(formData.postMortemMinHours || '')} onChangeText={v => handleInputChange('postMortemMinHours', v)} keyboardType="numeric" mode="outlined" style={styles.halfInput} /><TextInput label="Máx. Horas" value={String(formData.postMortemMaxHours || '')} onChangeText={v => handleInputChange('postMortemMaxHours', v)} keyboardType="numeric" mode="outlined" style={styles.halfInput} /></View>
                                    <TextInput label="Método de Estimação IPM" value={formData.postMortemEstimationMethod || ''} onChangeText={v => handleInputChange('postMortemEstimationMethod', v)} mode="outlined" style={styles.input} />
                                    <Divider style={styles.divider} /><Text style={styles.subHeader}>Análises</Text>
                                    <View style={styles.checkboxRow}><Checkbox.Android status={formData.toxicologyPerformed ? 'checked' : 'unchecked'} onPress={() => handleInputChange('toxicologyPerformed', !formData.toxicologyPerformed)} /><Text>Triagem Toxicológica Realizada?</Text></View>
                                    {formData.toxicologyPerformed && <TextInput label="Sumário dos Resultados" value={formData.toxicologyResultsSummary || ''} onChangeText={v => handleInputChange('toxicologyResultsSummary', v)} mode="outlined" style={styles.input} />}
                                    <View style={styles.checkboxRow}><Checkbox.Android status={formData.dnaSampleCollected ? 'checked' : 'unchecked'} onPress={() => handleInputChange('dnaSampleCollected', !formData.dnaSampleCollected)} /><Text>Amostra de DNA Coletada?</Text></View>
                                    {formData.dnaSampleCollected && <View style={styles.checkboxRow}><Checkbox.Android status={formData.dnaProfileObtained ? 'checked' : 'unchecked'} onPress={() => handleInputChange('dnaProfileObtained', !formData.dnaProfileObtained)} /><Text>Perfil de DNA Obtido?</Text></View>}
                                    {formData.dnaProfileObtained && <TextInput label="Resultado Comparação DNA" value={formData.dnaComparisonResult || ''} onChangeText={v => handleInputChange('dnaComparisonResult', v)} mode="outlined" style={styles.input} />}
                                    <View style={styles.checkboxRow}><Checkbox.Android status={formData.fingerprintCollected ? 'checked' : 'unchecked'} onPress={() => handleInputChange('fingerprintCollected', !formData.fingerprintCollected)} /><Text>Impressões Digitais Coletadas?</Text></View>
                                    {formData.fingerprintCollected && <><SelectMenu label="Qualidade" value={formData.fingerprintQuality} onSelect={v => handleInputChange('fingerprintQuality', v)} placeholder="Selecione..." options={[{label: 'Boa', value: 'boa'}, {label: 'Regular', value: 'regular'}, {label: 'Ruim', value: 'ruim'}]} /><TextInput label="Resultado Comparação Digitais" value={formData.fingerprintComparisonResult || ''} onChangeText={v => handleInputChange('fingerprintComparisonResult', v)} mode="outlined" style={styles.input} /></>}
                                </View></List.Accordion></Card>

                                <Card style={styles.card}><List.Accordion title="7. Metadados" id="7" titleStyle={styles.accordionTitle}><View style={styles.accordionContent}>
                                    <TextInput label="URLs de Fotos (separar por vírgula)" value={formData.photosUrls?.join(', ') || ''} onChangeText={v => handleInputChange('photosUrls', v)} multiline mode="outlined" style={styles.input} />
                                    <TextInput label="Notas Adicionais" value={formData.additionalNotes || ''} onChangeText={v => handleInputChange('additionalNotes', v)} multiline mode="outlined" style={styles.input} />
                                </View></List.Accordion></Card>
                            </List.AccordionGroup>
                            
                            <Divider style={styles.divider} />
                            <Button mode="contained" onPress={handleUpdate} loading={saving} disabled={saving} style={styles.button}>
                                Salvar Alterações
                            </Button>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  content: { padding: 8 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginVertical: 16, color: '#1e3a8a' },
  card: { marginBottom: 12, backgroundColor: '#fff' },
  accordionTitle: { fontSize: 16, fontWeight: '700' },
  accordionContent: { paddingHorizontal: 8, paddingBottom: 16 },
  input: { marginTop: 12, backgroundColor: 'white' },
  inputContainer: { marginTop: 12 },
  label: { fontSize: 14, color: '#333', marginBottom: 8, fontWeight: '500' },
  subHeader: { marginTop: 16, marginBottom: 8, fontSize: 14, fontWeight: 'bold', color: '#333' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  halfInput: { flex: 1, marginHorizontal: 4 },
  menuButtonContent: { justifyContent: 'flex-start', paddingVertical: 8 },
  menuButtonLabel: { textAlign: 'left', color: '#000' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  divider: { marginVertical: 16 },
  button: { marginTop: 8, paddingVertical: 6, borderRadius: 8 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default EditarVitimaScreen;