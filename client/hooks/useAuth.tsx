import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { apiService } from '../services/apiService';

interface User {
  id: string;
  email: string;
  name: string;
  accountType: 'SIMPLES' | 'COMPOSTA' | 'GERENCIAL';
  tenantId: string;
  tenantName: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, key: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.log('❌ No access token found');
        setIsLoading(false);
        return;
      }

      // Set token in apiService
      apiService.setToken(token);

      console.log('🔍 Checking auth status with token...', token.substring(0, 20) + '...');
      const response = await apiService.getProfile();
      console.log('✅ Auth check successful:', response.user);
      setUser(response.user);
    } catch (error: any) {
      console.error('❌ Auth check failed:', error);
      console.error('Error details:', {
        message: error?.message,
        status: error?.response?.status,
        type: typeof error
      });

      // Verificar se é realmente um erro de autenticação
      const errorMessage = error?.message || '';
      const isAuthError = errorMessage.includes('401') || 
                         errorMessage.includes('403') ||
                         errorMessage.includes('Authentication') ||
                         errorMessage.includes('Invalid token') ||
                         errorMessage.includes('Access token required') ||
                         error?.response?.status === 401 ||
                         error?.response?.status === 403;
      
      // Se não for erro de autenticação, manter o usuário logado
      if (!isAuthError) {
        console.log('⚠️ Erro não relacionado à autenticação, mantendo sessão');
        // Tentar obter o usuário do token decodificado se possível
        const token = localStorage.getItem('access_token');
        if (token) {
          try {
            // Decodificar token sem verificar (apenas para obter dados do usuário)
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.userId === 'demo-user-id') {
              setUser({
                id: payload.userId,
                email: payload.email,
                name: payload.name || 'Dr. Administrador Demo',
                accountType: payload.accountType || 'GERENCIAL',
                tenantId: payload.tenantId || 'demo-tenant-id',
                tenantName: 'Demo Tenant',
              });
              setIsLoading(false);
              return;
            }
          } catch (decodeError) {
            console.error('Erro ao decodificar token:', decodeError);
          }
        }
        setIsLoading(false);
        return;
      }

      // Try to refresh token first (only if it's an auth error)
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (refreshToken && isAuthError) {
        try {
          console.log('🔄 Attempting token refresh...');
          const refreshResponse = await apiService.refreshToken(refreshToken);
          if (refreshResponse && refreshResponse.user) {
            console.log('✅ Token refresh successful');
            setUser(refreshResponse.user);
            setIsLoading(false);
            return;
          }
        } catch (refreshError) {
          console.error('❌ Token refresh failed:', refreshError);
        }
      }

      // Clear tokens only if it's really an auth error and refresh failed
      console.log('🧹 Clearing tokens due to authentication failure');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      apiService.clearToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 useAuth.login called with:', email);
      const response = await apiService.login(email, password);
      console.log('✅ Login response received:', response);
      setUser(response.user);
      console.log('✅ User set in context:', response.user);
    } catch (err: any) {
      console.error('❌ Login error in useAuth:', err);
      const errorData = err.response?.data;
      let errorMessage = err.response?.data?.error || err.message || 'Login failed';

      // Verificar se é erro de tenant inativo
      if (errorData?.code === 'TENANT_INACTIVE' || errorMessage.includes('Renove Sua Conta')) {
        errorMessage = 'Renove Sua Conta ou Entre em contato com o Administrador do Sistema';
      }

      // Re-throw para que o componente possa tratar
      throw new Error(errorMessage);
    }
  };

  const register = async (email: string, password: string, name: string, key: string) => {
    const response = await apiService.register(email, password, name, key);
    setUser(response.user);
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      apiService.clearToken();
      setUser(null);
    }
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}