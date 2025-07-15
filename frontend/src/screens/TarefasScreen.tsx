import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { theme } from '../styles/theme';

interface Tarefa {
  id: number;
  titulo: string;
  concluida: boolean;
}

interface RouteParams {
  metaId: number;
}

export default function TarefasScreen() {
  const route = useRoute();
  const { metaId } = route.params as RouteParams;
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:3000/tarefa/meta/${metaId}`)
      .then(response => {
        setTarefas(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar tarefas:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [metaId]);

  const renderItem = ({ item }: { item: Tarefa }) => (
    <View style={styles.tarefaCard}>
      <Text style={styles.titulo}>{item.titulo}</Text>
      <Text style={{ color: item.concluida ? 'green' : 'gray' }}>
        {item.concluida ? 'Concluída' : 'Pendente'}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tarefas da Meta #{metaId}</Text>
      <FlatList
        data={tarefas}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.background,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: theme.colors.primary,
  },
  tarefaCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
});
