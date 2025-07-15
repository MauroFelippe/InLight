import { NavigationProp, useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../routes/types';
import { get } from '../services/api';
import { theme } from '../styles/theme';

const formatDate = (value: string) => {
  if (!value) return '-';
  
  const serialNumber = Number(value);
  if (isNaN(serialNumber)) return '-';
  
  // Excel conta dias desde 1900-01-01 (com bug do ano 1900)
  const excelEpoch = new Date('1900-01-01');
  // Subtrai 2 dias por causa do bug do Excel (conta 1900 como bissexto)
  const date = new Date(excelEpoch.getTime() + (serialNumber - 2) * 24 * 60 * 60 * 1000);
  
  return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('pt-BR');
};

interface PagamentoFuturo {
  id: number;
  titulo: string;
  tipo: string;
  mesReferencia: string;
  lembreteV: string;
  vencimento: string;
  lembreteD: string;
  divulgacao: string;
  tipoItem: string;
  caminho: string;
}

export default function PagamentosScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const isFocused = useIsFocused();
  const [pagamentos, setPagamentos] = useState<PagamentoFuturo[]>([]);

  const fetchPagamentos = async () => {
    try {
      const response = await get('/pagamento-futuro');
      setPagamentos(response.data);
    } catch (error: any) {
      console.error('Erro ao buscar pagamentos:', error.message || error);
      Alert.alert('Erro ao buscar pagamentos');
    }
  };

  useEffect(() => {
    if (isFocused) fetchPagamentos();
  }, [isFocused]);

  const renderItem = ({ item }: { item: PagamentoFuturo }) => (
    <View style={styles.card}>
     <Text style={styles.titulo}>{item.titulo}</Text>
     <Text style={styles.subtitulo}>{item.tipo} • {formatDate(item.mesReferencia)}</Text>
     <Text style={styles.info}>📅 Vencimento: {formatDate(item.vencimento)}</Text>
     <Text style={styles.info}>📢 Divulgação: {formatDate(item.divulgacao)}</Text>
      <Text style={styles.info}>🔔 Lembrete V: {formatDate(item.lembreteV)}</Text>
      <Text style={styles.info}>🔔 Lembrete D: {formatDate(item.lembreteD)}</Text>
    </View>
  );


  return (
    <View style={styles.container}>
      <FlatList
        data={pagamentos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      {user?.role === 'admin' && (
        <TouchableOpacity
          style={styles.botaoImportar}
          onPress={() => navigation.navigate('ImportarPagamento')}
        >
          <Text style={styles.textoBotaoImportar}>📥 Importar Excel</Text>
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
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  subtitulo: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  info: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  botaoImportar: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#009A93',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 4,
  },
  textoBotaoImportar: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
