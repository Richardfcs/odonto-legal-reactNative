import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Portal, Title, Button, TextInput } from 'react-native-paper';

const ReportContentModal = ({ visible, onDismiss, onSubmit }) => {
    const [content, setContent] = useState('');

    const handleSubmit = () => {
        if (!content.trim()) {
            // Poderia mostrar um alerta, mas por simplicidade, apenas não submete
            return;
        }
        onSubmit(content);
        setContent(''); // Limpa o campo após submeter
        onDismiss();
    };

    return (
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer}>
                <Title>Conteúdo do Laudo</Title>
                <TextInput
                    label="Digite o conteúdo do laudo aqui..."
                    value={content}
                    onChangeText={setContent}
                    multiline
                    numberOfLines={6}
                    mode="outlined"
                    style={styles.input}
                />
                <View style={styles.buttonContainer}>
                    <Button onPress={onDismiss}>Cancelar</Button>
                    <Button mode="contained" onPress={handleSubmit}>Gerar Laudo</Button>
                </View>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    modalContainer: { backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 8 },
    input: { marginTop: 16 },
    buttonContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 }
});

export default ReportContentModal;