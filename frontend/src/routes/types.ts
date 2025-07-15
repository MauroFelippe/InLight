export type RootStackParamList = {
  Login: undefined;
  AdminMenu: undefined;
  UserMenu: undefined;
  RegisterUser: undefined;
  Pagamentos: undefined;
  Notas: undefined;
  Metas: undefined;
  Tarefas: { metaId: number };
  CriarMeta: undefined;
  DetalheMeta: { metaId: number };
  ImportarPagamento: undefined;
};
