import * as DocumentPicker from 'expo-document-picker';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { theme } from '../styles/theme';

export default function ImportarPagamentoScreen() {
  const { user } = useAuth();
  const [file, setFile] = useState<any>(null);

  const escolherArquivo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets?.length) {
        const fileInfo = result.assets[0];
        setFile(fileInfo);
      }
    } catch (error) {
      console.error('Erro ao escolher arquivo:', error);
      Alert.alert('Erro ao escolher arquivo');
    }
  };

  const enviarArquivo = async () => {
    if (!file) {
      Alert.alert('Selecione um arquivo primeiro');
      return;
    }

    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      name: file.name,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    } as any);

    try {
      const response = await fetch('http://192.168.1.9:3000/pagamento-futuro/importar-excel', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Erro na importação');
      }

      const result = await response.json();
      Alert.alert('Sucesso', result.message);
      setFile(null);
    } catch (error: any) {
      console.error('Erro no envio:', error);
      Alert.alert('Erro no envio:', error.message || 'Erro desconhecido');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Apenas administradores podem importar arquivos.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Importar Pagamentos Futuros (.xlsx)</Text>

      <Button title="Escolher Arquivo" onPress={escolherArquivo} color="#009A93"/>
      {file && <Text style={styles.filename}>{file.name}</Text>}

      <View style={styles.spacer} />
      <Button title="Enviar Arquivo" onPress={enviarArquivo} disabled={!file} color="#009A93" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    marginBottom: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  filename: {
    marginTop: 12,
    fontSize: 14,
    color: theme.colors.text,
  },
  spacer: {
    height: 24,
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    color: theme.colors.text,
  },
});
