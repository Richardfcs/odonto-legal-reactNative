import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Menu, Text } from 'react-native-paper';

const SelectMenu = ({ label, value, options, onSelect, placeholder = "Selecione..." }) => {
    const [visible, setVisible] = useState(false);

    // Encontra o label da opção selecionada para exibir no botão
    const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder;

    return (
        <View style={styles.inputContainer}>
            {label && <Text style={styles.label}>{label}</Text>}
            <Menu
                visible={visible}
                onDismiss={() => setVisible(false)}
                anchor={
                    <Button 
                        icon="chevron-down" 
                        contentStyle={styles.menuButtonContent} 
                        labelStyle={styles.menuButtonLabel} 
                        mode="outlined" 
                        onPress={() => setVisible(true)}
                    >
                        {selectedLabel}
                    </Button>
                }
            >
                {options.map(opt => (
                    <Menu.Item 
                        key={opt.value} 
                        onPress={() => { 
                            onSelect(opt.value); 
                            setVisible(false); 
                        }} 
                        title={opt.label} 
                    />
                ))}
            </Menu>
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: { 
        marginTop: 12 
    },
    label: { 
        fontSize: 14, 
        color: '#333', 
        marginBottom: 8, 
        fontWeight: '500' 
    },
    menuButtonContent: { 
        justifyContent: 'flex-start',
        paddingVertical: 8,
        height: 50, // Altura consistente com TextInput outlined
    },
    menuButtonLabel: { 
        textAlign: 'left', 
        color: '#000',
        fontWeight: 'normal',
        flex: 1, // Garante que o texto ocupe o espaço disponível
    },
});

export default SelectMenu; // Exportação padrão