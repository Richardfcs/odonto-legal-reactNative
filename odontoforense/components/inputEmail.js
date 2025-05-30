// components/EmailInput.js
import React from 'react';
import { TextInput } from 'react-native-paper';
import { StyleSheet } from 'react-native';

//INPUT PADRÃO PARA EMAILS
const EmailInput = ({ value, onChangeText, label = 'Email', style, ...props }) => {
    return (
      <TextInput
        label={label}
        mode="outlined"
        value={value}
        onChangeText={onChangeText}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        style={[styles.input, style]}
        {...props}
      />
    );
  };
  
  // ESTILO DE INPUT DE EMAILS
  const styles = StyleSheet.create({
    input: {
      marginVertical: 8,
    },
  });
  
  // EXPORT DE INPUT PADRÃO DE EMAILS
  export default EmailInput;