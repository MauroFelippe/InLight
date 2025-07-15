import { NavigationProp, useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../routes/types';
import { get } from '../services/api';
import { theme } from '../styles/theme';

interface Tarefa {
  id: number;
  descricao: string;
  concluida: boolean;
}

interface Meta {
  id: number;
  titulo: string;
  descricao: string;
  progresso: number;
  tarefas: Tarefa[];
}

export default function MetasScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const isFocused = useIsFocused();
  const [metas, setMetas] = useState<Meta[]>([]);

  const fetchMetas = async () => {
    try {
      const response = await get('/meta');
      setMetas(response.data);
    } catch (error: any) {
      console.error('Erro ao buscar metas:', error.message || error);
      Alert.alert('Erro ao buscar metas');
    }
  };

  useEffect(() => {
    if (user?.matricula && isFocused) {
      fetchMetas();
    }
  }, [user?.matricula, isFocused]);

  const renderItem = ({ item }: { item: Meta }) => (
    <TouchableOpacity
      style={styles.metaCard}
      onPress={() => navigation.navigate('DetalheMeta', { metaId: item.id })}
    >
      <Text style={styles.metaTitulo}>{item.titulo}</Text>
      <Text>{item.descricao}</Text>

      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${item.progresso}%` }]} />
      </View>
      <Text style={styles.progressoTexto}>{item.progresso}% completo</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={metas}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {user?.role === 'admin' && (
        <TouchableOpacity
          style={styles.botaoNovaMeta}
          onPress={() => navigation.navigate('CriarMeta')}
        >
          <Text style={styles.botaoTexto}>+ Criar Nova Meta</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 16,
  },
  metaCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  metaTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginTop: 8,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#009A93',
    borderRadius: 5,
  },
  progressoTexto: {
    fontSize: 12,
    color: theme.colors.text,
    marginTop: 4,
  },
  botaoNovaMeta: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#009A93',
    padding: 14,
    borderRadius: 30,
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
