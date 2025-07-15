import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../routes/types';
import { get } from '../services/api';
import { theme } from '../styles/theme';
import { getRemainingTime } from '../utils/countdown';

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'AdminMenu'>;

export default function AdminMenuScreen() {
  const navigation = useNavigation<NavigationProps>();
  const [tempo, setTempo] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [proximoVencimento, setProximoVencimento] = useState<string | null>(null);

  useEffect(() => {
    const carregarVencimentos = async () => {
      try {
        const response = await get('/pagamento-futuro');
        const pagamentos = Array.isArray(response) ? response : response?.data || [];

        const hoje = new Date();
        const futuros = pagamentos
          .filter((p: any) => p.vencimento)
          .map((p: any) => {
            const serial = Number(p.vencimento);
            const excelEpoch = new Date('1900-01-01');
            return new Date(excelEpoch.getTime() + (serial - 2) * 86400000);
          })
          .filter((d: Date) => d >= hoje)
          .sort((a: Date, b: Date) => a.getTime() - b.getTime());

        if (futuros.length > 0) {
          setProximoVencimento(futuros[0].toISOString());
          setTempo(getRemainingTime(futuros[0].toISOString()));
        } else {
          setProximoVencimento(null);
        }
      } catch (err) {
        console.error(err);
        Alert.alert('Erro ao carregar vencimentos');
      }
    };

    carregarVencimentos();

    const interval = setInterval(() => {
      if (proximoVencimento) {
        setTempo(getRemainingTime(proximoVencimento));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [proximoVencimento]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Próximo Vencimento em:</Text>

      {proximoVencimento ? (
        <View style={styles.countdownContainer}>
          <View style={styles.timeBox}>
            <Text style={styles.timeNumber}>{tempo.days}</Text>
            <Text style={styles.timeLabel}>dias</Text>
          </View>
          <View style={styles.timeBox}>
            <Text style={styles.timeNumber}>{tempo.hours}</Text>
            <Text style={styles.timeLabel}>horas</Text>
          </View>
          <View style={styles.timeBox}>
            <Text style={styles.timeNumber}>{tempo.minutes}</Text>
            <Text style={styles.timeLabel}>min</Text>
          </View>
          <View style={styles.timeBox}>
            <Text style={styles.timeNumber}>{tempo.seconds}</Text>
            <Text style={styles.timeLabel}>seg</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.noVencimento}>Nenhum vencimento futuro</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Pagamentos')}>
        <Text style={styles.buttonText}>Lista de Pagamentos Futuros</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Notas')}>
        <Text style={styles.buttonText}>Notas</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Metas')}>
        <Text style={styles.buttonText}>Metas</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.buttonSecondary]}
        onPress={() => navigation.navigate('RegisterUser')}
      >
        <Text style={styles.buttonText}>Cadastrar Usuário</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    color: theme.colors.text,
  },
  countdownContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    flexWrap: 'wrap',
    gap: 8,
  },
  timeBox: {
    alignItems: 'center',
    marginHorizontal: 6,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    elevation: 3,
    minWidth: 70,
  },
  timeNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  timeLabel: {
    fontSize: 12,
    color: '#555',
  },
  noVencimento: {
    fontSize: 16,
    color: '#888',
    marginVertical: 20,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 15,
    marginVertical: 8,
    width: '100%',
    borderRadius: 8,
  },
  buttonSecondary: {
    backgroundColor: theme.colors.secondary || '#666',
  },
  buttonText: {
    color: theme.colors.white,
    textAlign: 'center',
    fontSize: 16,
  },
});
