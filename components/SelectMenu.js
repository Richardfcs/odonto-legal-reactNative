import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Menu, Text } from 'react-native-paper';

const SelectMenu = ({ label, value, options, onSelect, placeholder = "Selecione..." }) => {
    const [visible, setVisible] = useState(false);
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
                        labelStyle={styles.menuButtonLabel} // Usando o novo estilo de label
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
                        onPress={() => { onSelect(opt.value); setVisible(false); }} 
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
        paddingVertical: 4, // Reduz o padding vertical para dar mais espaço
        height: 'auto', // Permite que a altura se ajuste ao conteúdo
        minHeight: 50,
    },
    menuButtonLabel: { 
        textAlign: 'left', 
        color: '#000',
        fontWeight: 'normal',
        flexShrink: 1, // Permite que o texto encolha
        flexWrap: 'wrap', // Permite que o texto quebre em múltiplas linhas
        fontSize: 14,     // Garante um tamanho de fonte consistente
    },
});

export default SelectMenu;