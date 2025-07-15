import type { PagamentoFuturoInterface } from '../interface/PagamentoFuturoInterface';
import { get } from './api';

const PagamentoFuturoService = {
  getAll: async (): Promise<PagamentoFuturoInterface[]> => {
    const response = await get('/pagamento-futuro');
    return response.data;
  },
};

export default PagamentoFuturoService;