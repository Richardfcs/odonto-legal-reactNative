import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';

export default function NavBar() {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const languages = [
    { code: 'pt-BR', label: 'Português (BR)', flag: 'https://flagcdn.com/w40/br.png' },
    { code: 'en-US', label: 'English (US)', flag: 'https://flagcdn.com/w40/us.png' }
  ];

  return (
    <View style={styles.navbar}>
      {/* Logo e Nome */}
      <View style={styles.leftContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.brand}>
          Odonto
          <Text style={{ fontWeight: 'normal' }}>{'\n'}Forense</Text>
        </Text>
      </View>

      {/* Botão de idioma */}
      <TouchableOpacity
        onPress={() => setDropdownVisible(true)}
        style={styles.languageButton}
      >
        <Image
          source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Brazil.svg' }}
          style={styles.flag}
        />
        <Text style={styles.languageText}>Português (BR)</Text>
      </TouchableOpacity>

      {/* Dropdown de idiomas */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={dropdownVisible}
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setDropdownVisible(false)}>
          <View style={styles.dropdown}>
            {languages.map((lang) => (
              <TouchableOpacity key={lang.code} style={styles.dropdownItem}>
                <Image source={{ uri: lang.flag }} style={styles.dropdownFlag} />
                <Text style={styles.dropdownText}>{lang.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  brand: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flag: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
  },
  languageText: {
    color: '#fff',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  dropdown: {
    backgroundColor: '#fff',
    padding: 10,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  dropdownFlag: {
    width: 20,
    height: 20,
    marginRight: 10,
    borderRadius: 10,
  },
  dropdownText: {
    fontSize: 16,
    color: '#1e293b',
  },
});
