import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../styles/theme';

export default function NotasScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notas</Text>
      <Text style={styles.text}>Aqui você poderá visualizar e adicionar suas anotações.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  title: {
    fontSize: 20,
    color: theme.colors.text,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: theme.colors.text,
  },
});
