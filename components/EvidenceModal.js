import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Alert, Image } from 'react-native';
import { Modal, Portal, Title, Button, TextInput, Switch, Text, Provider as PaperProvider, Divider, SegmentedButtons } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

const EvidenceModal = ({ visible, onDismiss, onSubmit, initialData }) => {
    const isEditing = !!initialData;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [evidenceType, setEvidenceType] = useState('text_description');
    const [textData, setTextData] = useState('');
    const [imageData, setImageData] = useState(null); // { uri, base64 }
    
    const [attachLocation, setAttachLocation] = useState(true);
    const [locationLoading, setLocationLoading] = useState(false);
    
    useEffect(() => {
        if (visible) {
            if (isEditing) {
                setTitle(initialData.title || '');
                setDescription(initialData.description || '');
                setEvidenceType(initialData.evidenceType || 'text_description');
                if (initialData.evidenceType === 'image' && initialData.data) {
                    setImageData({ uri: initialData.data, base64: null });
                    setTextData('');
                } else {
                    setTextData(initialData.data || '');
                    setImageData(null);
                }
                setAttachLocation(!initialData.location);
            } else {
                setTitle('');
                setDescription('');
                setEvidenceType('text_description');
                setTextData('');
                setImageData(null);
                setAttachLocation(true);
            }
        }
    }, [visible, initialData, isEditing]);

    const handlePickImage = async (useCamera = false) => {
        const permission = useCamera 
            ? await ImagePicker.requestCameraPermissionsAsync()
            : await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (!permission.granted) {
            Alert.alert("Permissão Negada", `É necessário permitir o acesso à ${useCamera ? 'câmera' : 'galeria'} para continuar.`);
            return;
        }

        const action = useCamera ? ImagePicker.launchCameraAsync : ImagePicker.launchImageLibraryAsync;
        
        let result = await action({
            mediaTypes: ImagePicker.MediaType = 'images',
            allowsEditing: true, aspect: [4, 3], quality: 0.5, base64: true,
        });

        if (!result.canceled) {
            setImageData({ uri: result.assets[0].uri, base64: result.assets[0].base64 });
        }
    };
    
    const requestLocationAndSubmit = async () => {
        if (title.trim() === '') {
            Alert.alert("Campo Obrigatório", "O título da evidência é obrigatório.");
            return;
        }

        setLocationLoading(true);
        let locationPayload = null;
        if (attachLocation) {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão Negada', 'A evidência será salva sem georreferência.');
            } else {
                try {
                    let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
                    locationPayload = {
                        type: 'Point',
                        coordinates: [location.coords.longitude, location.coords.latitude]
                    };
                } catch (error) {
                    Alert.alert("Erro de Localização", "Não foi possível obter a localização. Verifique se o GPS está ativado e tente novamente.");
                    setLocationLoading(false);
                    return;
                }
            }
        }
        
        const formData = {
            title, description, evidenceType,
            data: evidenceType === 'image' ? (imageData?.base64 ? `data:image/jpeg;base64,${imageData.base64}` : undefined) : textData,
            location: locationPayload
        };

        if (isEditing && evidenceType === 'image' && !formData.data) {
            delete formData.data;
        }
        
        setLocationLoading(false);
        onSubmit(formData);
    };

    return (
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer}>
                <ScrollView>
                    <Title style={styles.title}>{isEditing ? 'Editar Evidência' : 'Adicionar Evidência'}</Title>
                    
                    <TextInput label="Título *" value={title} onChangeText={setTitle} mode="outlined" style={styles.input}/>
                    <TextInput label="Descrição" value={description} onChangeText={setDescription} mode="outlined" multiline style={styles.input}/>
                    
                    <Text style={styles.label}>Tipo de Evidência</Text>
                    <SegmentedButtons
                        value={evidenceType}
                        onValueChange={setEvidenceType}
                        buttons={[
                            { value: 'text_description', label: 'Texto' },
                            { value: 'image', label: 'Imagem' },
                            { value: 'other', label: 'Outro' },
                        ]}
                        style={styles.input}
                    />

                    {evidenceType === 'image' ? (
                        <View style={styles.imageSection}>
                            {imageData?.uri && <Image source={{ uri: imageData.uri }} style={styles.previewImage} />}
                            <Button icon="camera" mode="contained-tonal" style={styles.button} onPress={() => handlePickImage(true)}>Tirar Foto</Button>
                            <Button icon="image-album" mode="contained-tonal" style={styles.button} onPress={() => handlePickImage(false)}>Escolher da Galeria</Button>
                        </View>
                    ) : (
                        <TextInput label="Dados / Conteúdo" value={textData} onChangeText={setTextData} mode="outlined" multiline style={styles.input}/>
                    )}
                    
                    <View style={styles.switchContainer}>
                        <Text style={{flex: 1}}>Anexar Localização Atual</Text>
                        <Switch value={attachLocation} onValueChange={setAttachLocation} disabled={isEditing && !!initialData?.location}/>
                    </View>
                    
                    <Divider style={styles.divider}/>

                    <Button mode="contained" onPress={requestLocationAndSubmit} loading={locationLoading} disabled={locationLoading}>
                        Salvar Evidência
                    </Button>
                    <Button style={styles.button} onPress={onDismiss}>
                        Cancelar
                    </Button>
                </ScrollView>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    modalContainer: { backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 8, maxHeight: '90%' },
    title: { marginBottom: 20, textAlign: 'center' },
    label: { fontSize: 14, color: '#333', marginBottom: 8, fontWeight: '500', marginLeft: 4, marginTop: 12 },
    input: { marginBottom: 16 },
    button: { marginTop: 8 },
    imageSection: { alignItems: 'center', marginVertical: 16 },
    previewImage: { width: 200, height: 150, marginBottom: 16, resizeMode: 'contain', borderWidth: 1, borderColor: '#ddd' },
    switchContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 16, padding: 8, backgroundColor: '#f5f5f5', borderRadius: 4 },
    divider: { marginVertical: 16 }
});

export default EvidenceModal;