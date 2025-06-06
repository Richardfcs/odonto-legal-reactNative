import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Card, Title, ActivityIndicator } from 'react-native-paper';

const ChartCard = ({ title, children, isLoading }) => {
  const { width } = useWindowDimensions();
  const chartWidth = width - 48; // Largura da tela menos o padding

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>{title}</Title>
        <View style={[styles.chartContainer, { width: chartWidth }]}>
          {isLoading ? (
            <ActivityIndicator size="large" style={styles.loader} />
          ) : (
            children
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  chartContainer: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    flex: 1,
  },
});

export default ChartCard;