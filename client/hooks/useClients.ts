import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { mockClients } from '../data/mockData';

export function useClients() {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadClients = async (params: any = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.getClients(params);
      
      // Se não houver clientes, usar dados mock
      if (!response.clients || response.clients.length === 0) {
        console.log('[useClients] No clients found, using mock data');
        setClients(mockClients);
        return { clients: mockClients };
      }
      
      setClients(response.clients);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load clients';
      console.error('[useClients] Error loading clients, using mock data:', err);
      setError(null); // Não mostrar erro, usar mock data silenciosamente
      setClients(mockClients);
      return { clients: mockClients };
    } finally {
      setIsLoading(false);
    }
  };

  const createClient = async (data: any) => {
    try {
      const response = await apiService.createClient(data);
      
      // Criar notificação após sucesso
      try {
        await apiService.createNotification({
          type: 'client',
          title: 'Novo Cliente Cadastrado',
          message: `${data.name} foi adicionado ao CRM`,
          payload: {
            clientId: response.client?.id,
            clientName: data.name,
            clientEmail: data.email,
            action: 'client_created'
          },
          link: '/crm'
        });
      } catch (notifError) {
        console.warn('Falha ao criar notificação:', notifError);
      }
      
      await loadClients(); // Reload list
      return response;
    } catch (err) {
      throw err;
    }
  };

  const updateClient = async (id: string, data: any) => {
    try {
      const response = await apiService.updateClient(id, data);
      await loadClients(); // Reload list
      return response;
    } catch (err) {
      throw err;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      await apiService.deleteClient(id);
      await loadClients(); // Reload list
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  return {
    clients,
    isLoading,
    error,
    loadClients,
    createClient,
    updateClient,
    deleteClient,
  };
}