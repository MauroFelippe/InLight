import Slider from '@react-native-community/slider';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../routes/types';
import { get, patch } from '../services/api';
import { theme } from '../styles/theme';

type DetalheMetaRouteProp = RouteProp<RootStackParamList, 'DetalheMeta'>;

interface Usuario {
  matricula: number;
  nome: string;
  role: string;
}

interface MetaDetalhada {
  id: number;
  titulo: string;
  descricao: string;
  progresso: number;
  criador: Usuario;
  participantes: Usuario[];
}

export default function DetalheMetaScreen() {
  const navigation = useNavigation();
  const route = useRoute<DetalheMetaRouteProp>();
  const { metaId } = route.params;
  const { user } = useAuth();

  const [meta, setMeta] = useState<MetaDetalhada | null>(null);
  const [progressoTemp, setProgressoTemp] = useState(0);

  const fetchMeta = async () => {
    try {
      const response = await get(`/meta/${metaId}`);
      setMeta(response.data);
      setProgressoTemp(response.data.progresso);
    } catch (error: any) {
      console.error('Erro ao carregar meta:', error.message);
      Alert.alert('Erro ao carregar detalhes da meta');
    }
  };

  useEffect(() => {
    fetchMeta();
  }, []);

  const atualizarProgresso = async () => {
    try {
      await patch(`/meta/${metaId}`, { progresso: progressoTemp });
      Alert.alert('Progresso atualizado com sucesso!');
      fetchMeta();
    } catch (error: any) {
      console.error('Erro ao atualizar progresso:', error.message);
      Alert.alert('Erro ao atualizar progresso');
    }
  };

  if (!meta) return null;

  const podeEditarProgresso =
    Number(user?.matricula) === meta.criador.matricula || user?.role === 'admin';

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>{meta.titulo}</Text>
      <Text style={styles.descricao}>{meta.descricao}</Text>

      <Text style={styles.subtitulo}>Criador:</Text>
      <Text>{meta.criador.nome}</Text>

      <Text style={styles.subtitulo}>Atribuído a:</Text>
      {meta.participantes.map((p) => (
        <Text key={p.matricula}>• {p.nome}</Text>
      ))}

      <Text style={styles.subtitulo}>Progresso Atual:</Text>
      <View style={styles.barraProgresso}>
        <View style={[styles.barraInterna, { width: `${meta.progresso}%` }]} />
      </View>
      <Text>{meta.progresso}% completo</Text>

      {podeEditarProgresso && (
        <>
          <Text style={styles.subtitulo}>Editar Progresso:</Text>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={progressoTemp}
            onValueChange={setProgressoTemp}
            minimumTrackTintColor="#009A93"
            maximumTrackTintColor="#ccc"
          />
          <Text>{progressoTemp}%</Text>

          <View style={styles.botoes}>
            <Button title="Salvar Progresso" onPress={atualizarProgresso} color="#009A93" />
          </View>
        </>
      )}

      <View style={styles.botoes}>
        <Button title="Voltar" onPress={() => navigation.goBack()} color="#009A93"/>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: theme.colors.primary },
  descricao: { marginTop: 8, fontSize: 16 },
  subtitulo: { marginTop: 16, fontWeight: 'bold', fontSize: 16 },
  barraProgresso: {
    height: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
    marginTop: 8,
    marginBottom: 4,
  },
  barraInterna: {
    height: 10,
    backgroundColor: '#009A93',
    borderRadius: 5,
  },
  botoes: {
    marginTop: 20,
  },
});
