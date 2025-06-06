import React from 'react';
import { View, StyleSheet } from 'react-native';
import { List, Text, Divider } from 'react-native-paper';

// Declare o componente diretamente como uma constante e envolva com React.memo
const LogItem = React.memo(({ log }) => {

  const formatTimestamp = (isoString) => {
    if (!isoString) return 'Data inválida';
    try {
      const date = new Date(isoString);
      return `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR')}`;
    } catch (e) {
      return 'Data inválida';
    }
  };

  const getIconForAction = (action) => {
    if (action.includes('login')) return 'login';
    if (action.includes('create')) return 'plus-circle-outline';
    if (action.includes('update')) return 'pencil-circle-outline';
    if (action.includes('delete')) return 'minus-circle-outline';
    if (action.includes('view') || action.includes('fetch')) return 'eye-outline';
    return 'alert-circle-outline';
  };

  const primaryText = `${log.userId?.name || 'Usuário Sistema'} realizou ${log.action}`;
  const secondaryText = `Alvo: ${log.targetModel} (${log.targetId?.slice(-6) || 'N/A'}) - ${formatTimestamp(log.timestamp)}`;
  
  return (
    <View>
      <List.Item
        title={primaryText}
        description={secondaryText}
        titleNumberOfLines={2}
        descriptionNumberOfLines={2}
        left={props => <List.Icon {...props} icon={getIconForAction(log.action)} />}
      />
      {log.details && (
        <View style={styles.detailsContainer}>
            <Text style={styles.detailsText}>
                {JSON.stringify(log.details, null, 2)}
            </Text>
        </View>
      )}
      <Divider />
    </View>
  );
});

const styles = StyleSheet.create({
  detailsContainer: {
    backgroundColor: '#f5f5f5',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 8,
    borderRadius: 4,
  },
  detailsText: {
    fontFamily: 'monospace',
    fontSize: 12,
  },
});

export default LogItem;