import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

export default function CaseCard({
  title,
  name,
  role,
  location,
  status,
  description,
  buttonLabel,
  onPress,
}) {
  const statusColors = {
    finalizado: '#16a34a',       // verde
    'em andamento': '#eab308',   // amarelo
    arquivado: '#6b7280',        // cinza
  };

  const formatStatus = (status) => {
    if (!status) return '';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Responsável:</Text>
        <Text style={styles.value}>{name} ({role})</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Local:</Text>
        <Text style={styles.value}>{location}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Status:</Text>
        <Text style={[styles.value, { color: statusColors[status] || '#000' }]}>
          {formatStatus(status)}
        </Text>
      </View>

      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>{description}</Text>
      </View>

      {onPress && (
        <TouchableOpacity
          style={styles.button}
          onPress={onPress}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>{buttonLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

CaseCard.propTypes = {
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  status: PropTypes.string,
  description: PropTypes.string,
  buttonLabel: PropTypes.string,
  onPress: PropTypes.func,
};

CaseCard.defaultProps = {
  status: '',
  description: '',
  buttonLabel: 'Consultar',
  onPress: null,
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    fontWeight: '600',
    color: '#64748b',
    width: 100,
  },
  value: {
    flex: 1,
    fontWeight: '500',
    color: '#334155',
  },
  descriptionContainer: {
    marginTop: 8,
    marginBottom: 12,
  },
  description: {
    color: '#475569',
    fontStyle: 'italic',
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: '#1e40af',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
