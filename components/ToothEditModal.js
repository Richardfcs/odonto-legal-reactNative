import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Portal, Title, Button, TextInput } from 'react-native-paper';
import SelectMenu from './SelectMenu';

const ToothEditModal = ({ visible, onDismiss, toothData, onSave }) => {
    const [status, setStatus] = useState('');
    const [observations, setObservations] = useState('');

    useEffect(() => {
        if (toothData) {
            setStatus(toothData.status || 'nao_examinado');
            setObservations(toothData.observations || '');
        }
    }, [toothData]);

    const handleSave = () => {
        onSave({ fdiNumber: toothData.fdiNumber, status, observations });
        onDismiss();
    };

    const statusOptions = [
        {label: 'Não Examinado', value: 'nao_examinado'},
        {label: 'Presente Hígido', value: 'presente_higido'},
        {label: 'Presente Cariado', value: 'presente_cariado'},
        {label: 'Presente Restaurado', value: 'presente_restaurado'},
        {label: 'Trat. Endodôntico', value: 'presente_trat_endodontico'},
        {label: 'Prótese Fixa', value: 'presente_com_protese_fixa'},
        {label: 'Ausente (Extraído)', value: 'ausente_extraido'},
        {label: 'Ausente (Não Erupcionado)', value: 'ausente_nao_erupcionado'},
        {label: 'Implante', value: 'implante'},
        {label: 'Outro', value: 'outro'},
    ];

    if (!toothData) return null;

    return (
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer}>
                <Title>Registro do Dente {toothData.fdiNumber}</Title>
                <SelectMenu label="Status do Dente" value={status} options={statusOptions} onSelect={setStatus} placeholder="Selecione o status..."/>
                <TextInput label="Observações Específicas" value={observations} onChangeText={setObservations} mode="outlined" multiline style={{ marginTop: 16 }}/>
                <View style={styles.buttonContainer}>
                    <Button onPress={onDismiss}>Cancelar</Button>
                    <Button mode="contained" onPress={handleSave}>Salvar Dente</Button>
                </View>
            </Modal>
        </Portal>
    );
};
const styles = StyleSheet.create({
    modalContainer: { backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 8 },
    buttonContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 }
});
export default ToothEditModal;