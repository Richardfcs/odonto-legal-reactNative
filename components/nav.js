import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, StyleSheet } from 'react-native';

export default function NavBar() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const languages = [
    { code: 'pt-BR', label: 'Português (BR)', flag: 'https://flagcdn.com/w40/br.png' },
    { code: 'en-US', label: 'English (US)', flag: 'https://flagcdn.com/w40/us.png' }
  ];

  const handleMenuOptionPress = (option) => {
    console.log(`Menu: ${option} clicado`);
    setMenuVisible(false);
    // Aqui você pode adicionar navegação, ex: navigation.navigate(option)
  };

  return (
    <View style={styles.navbar}>
      {/* Logo e Nome */}
      <View style={styles.leftContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.brand}>
          Odonto{'\n'}Forense
        </Text>
      </View>

      {/* Container direito: idioma + hambúrguer */}
      <View style={styles.rightContainer}>
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

        {/* Botão de hambúrguer */}
        <TouchableOpacity
          onPress={() => setMenuVisible(true)}
          style={styles.hamburgerButton}
        >
          <View style={styles.bar} />
          <View style={styles.bar} />
          <View style={styles.bar} />
        </TouchableOpacity>
      </View>

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

      {/* Modal do menu hambúrguer */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuDropdown}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuOptionPress('Início')}
            >
              <Text style={styles.menuText}>Início</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuOptionPress('Banco de Casos')}
            >
              <Text style={styles.menuText}>Banco de Casos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuOptionPress('Meu Perfil')}
            >
              <Text style={styles.menuText}>Meu Perfil</Text>
            </TouchableOpacity>
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
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
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
  hamburgerButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bar: {
    width: 25,
    height: 3,
    backgroundColor: '#fff',
    marginVertical: 2,
    borderRadius: 1.5,
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
  menuDropdown: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  menuText: {
    fontSize: 16,
    color: '#1e293b',
  },
});
