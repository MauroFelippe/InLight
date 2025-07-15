import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, Button, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from './types';

import AdminMenuScreen from '../screens/AdminMenuScreen';
import CriarMetaScreen from '../screens/CriarMetaScreen';
import DetalheMetaScreen from '../screens/DetalheMetaScreen';
import ImportarPagamentoScreen from '../screens/ImportarPagamentoScreen';
import LoginScreen from '../screens/LoginScreen';
import MetasScreen from '../screens/MetasScreen';
import NotasScreen from '../screens/NotasScreen';
import PagamentosScreen from '../screens/PagamentosScreen';
import RegisterUserScreen from '../screens/RegisterUserScreen';
import TarefasScreen from '../screens/TarefasScreen';
import UserMenuScreen from '../screens/UserMenuScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Routes() {
  const { user, isLoading, signOut } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          user.role === 'admin' ? (
            <>
              <Stack.Screen
                name="AdminMenu"
                component={AdminMenuScreen}
                options={{
                  title: 'Menu do Administrador',
                  headerRight: () => (
                    <Button title="Sair" onPress={signOut} color="#ff4444" />
                  ),
                }}
              />
              <Stack.Screen name="RegisterUser" component={RegisterUserScreen} options={{ title: 'Cadastrar Usuário' }} />
              <Stack.Screen name="Pagamentos" component={PagamentosScreen} options={{ title: 'Pagamentos Futuros' }} />
              <Stack.Screen name="Notas" component={NotasScreen} options={{ title: 'Notas' }} />
              <Stack.Screen name="Metas" component={MetasScreen} options={{ title: 'Metas' }} />
              <Stack.Screen name="DetalheMeta" component={DetalheMetaScreen} options={{ title: 'Detalhes da Meta' }} />
              <Stack.Screen name="Tarefas" component={TarefasScreen} options={{ title: 'Tarefas' }} />
              <Stack.Screen name="CriarMeta" component={CriarMetaScreen} options={{ title: 'Criar Nova Meta' }} />
              <Stack.Screen name="ImportarPagamento" component={ImportarPagamentoScreen} />
            </>
          ) : (
            <>
              <Stack.Screen
                name="UserMenu"
                component={UserMenuScreen}
                options={{
                  title: 'Menu do Usuário',
                  headerRight: () => (
                    <Button title="Sair" onPress={signOut} color="#ff4444" />
                  ),
                }}
              />
              <Stack.Screen name="Pagamentos" component={PagamentosScreen} options={{ title: 'Pagamentos Futuros' }} />
              <Stack.Screen name="Notas" component={NotasScreen} options={{ title: 'Notas' }} />
              <Stack.Screen name="Metas" component={MetasScreen} options={{ title: 'Metas' }} />
              <Stack.Screen name="DetalheMeta" component={DetalheMetaScreen} options={{ title: 'Detalhes da Meta' }} />
              <Stack.Screen name="Tarefas" component={TarefasScreen} options={{ title: 'Tarefas' }} />
              <Stack.Screen name="CriarMeta" component={CriarMetaScreen} options={{ title: 'Criar Nova Meta' }} />
            </>
          )
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
