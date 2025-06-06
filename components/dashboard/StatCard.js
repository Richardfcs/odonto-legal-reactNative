import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';

const StatCard = ({ label, value, style }) => {
  return (
    <Card style={[styles.card, style]}>
      <Card.Content>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 4,
    minWidth: 140,
  },
  label: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
  },
  value: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default StatCard;