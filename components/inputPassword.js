// components/PasswordInput.js

// INPUT PADRÃO DE SENHAS
import React, { useState } from 'react';
import { TextInput } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const PasswordInput = ({ value, onChangeText, label = 'Senha', style, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextInput
      label={label}
      mode="outlined"
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={!showPassword}
      style={[styles.input, style]}
      right={
        <TextInput.Icon
          icon={showPassword ? 'eye-off' : 'eye'}
          onPress={() => setShowPassword(!showPassword)}
        />
      }
      {...props}
    />
  );
};

// ESTILO DE SENHAS
const styles = StyleSheet.create({
  input: {
    marginVertical: 8,
  },
});

// EXPORT DE INPUT PADRÃO DE SENHAS
export default PasswordInput;



