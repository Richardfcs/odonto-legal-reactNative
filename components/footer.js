// src/components/Footer.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.text}>© 2025 OdontoForense. Todos os direitos reservados.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#cccccc', // cinza claro para direitos autorais
    textAlign: 'center',
    fontSize: 14,
  },
});
