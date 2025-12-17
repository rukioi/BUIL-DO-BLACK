import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Scale, Eye, EyeOff, Mail, Lock, User, Key, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  confirmPassword: z.string(),
  key: z.string().min(10, 'Chave de registro é obrigatória'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;
type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function Login() {
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      key: '',
    },
  });

  const forgotPasswordForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      console.log('🔐 Attempting login with:', data.email);
      await login(data.email, data.password);
      
      console.log('✅ Login successful, redirecting...');
      setSuccessMessage('Login realizado com sucesso! Redirecionando...');
      
      // Usar navigate em vez de window.location.href para evitar reload completo
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 500);
    } catch (error: any) {
      console.error('❌ Login error:', error);
      
      // Improved error handling for expired plan
      const errorMessage = error?.message || error?.response?.data?.error || 'Email ou senha incorretos';
      const errorType = error?.response?.data?.errorType || error?.response?.data?.error;

      if (errorType === 'Plano expirado' || errorMessage.includes('Plano expirado')) {
        setErrorMessage('🔒 Plano expirado! Sua conta não está mais ativa. Entre em contato com o administrador para renovar.');
      } else if (errorMessage.includes('Renove Sua Conta')) {
        setErrorMessage('🔒 Renove Sua Conta ou Entre em contato com o Administrador do Sistema');
      } else {
        setErrorMessage(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          key: data.key,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage(
          `Conta criada com sucesso! Você foi registrado como conta ${result.user.accountType}. Faça login para continuar.`
        );
        setActiveTab('login');
        registerForm.reset();
      } else {
        setErrorMessage(result.error || 'Erro ao criar conta');
      }
    } catch (error) {
      console.error('Register error:', error);
      setErrorMessage('Erro ao conectar com servidor. Verifique sua conexão.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSuccessMessage('Email de recuperação enviado! Verifique sua caixa de entrada.');

      // Clear form
      forgotPasswordForm.reset();
    } catch (error) {
      setErrorMessage('Erro ao enviar email de recuperação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Scale className="h-12 w-12 text-blue-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">HABEA DESK</h1>
              <p className="text-gray-600">Sistema para Escritórios de Advocacia</p>
            </div>
          </div>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Bem-vindo</CardTitle>
            <CardDescription className="text-center">
              Entre com sua conta ou crie uma nova para começar
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="w-full">Entrar</TabsTrigger>
                <TabsTrigger value="register" className="w-full">Registrar</TabsTrigger>
              </TabsList>

              {/* Mensagens de Sucesso/Erro */}
              {successMessage && (
                <Alert className="mt-4 border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">
                    {successMessage}
                  </AlertDescription>
                </Alert>
              )}

              {errorMessage && (
                <Alert variant="destructive" className={errorMessage.includes('Renove Sua Conta') || errorMessage.includes('Plano expirado') ? 'border-orange-500 bg-orange-50' : ''}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className={errorMessage.includes('Renove Sua Conta') || errorMessage.includes('Plano expirado') ? 'text-orange-800 font-medium' : ''}>
                    {errorMessage}
                  </AlertDescription>
                </Alert>
              )}

              {/* Login Tab */}
              <TabsContent value="login" className="space-y-4 mt-6">
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-sm font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="eu@email.com"
                        className="pl-11 pr-3 w-full"
                        {...loginForm.register('email')}
                      />
                    </div>
                    {loginForm.formState.errors.email && (
                      <p className="text-sm text-red-600 mt-1">{loginForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-sm font-medium">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="sua senha"
                        className="pl-11 pr-11 w-full"
                        {...loginForm.register('password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:opacity-70 transition-opacity focus:outline-none"
                        tabIndex={0}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {loginForm.formState.errors.password && (
                      <p className="text-sm text-red-600 mt-1">{loginForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('forgot-password')}
                      className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
                    >
                      Esqueceu sua senha?
                    </button>
                  </div>

                  <Button type="submit" className="w-full mt-4" disabled={isLoading}>
                    {isLoading ? 'Entrando...' : 'Entrar'}
                  </Button>

                  {/* Demo credentials */}
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium mb-1">Credenciais de demonstração:</p>
                    <p className="text-xs text-blue-700">Email: admin@escritorio.com</p>
                    <p className="text-xs text-blue-700">Senha: 123456</p>
                  </div>
                </form>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register" className="space-y-4 mt-6">
                <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name" className="text-sm font-medium">Nome Completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      <Input
                        id="register-name"
                        placeholder="Seu nome completo"
                        className="pl-11 pr-3 w-full"
                        {...registerForm.register('name')}
                      />
                    </div>
                    {registerForm.formState.errors.name && (
                      <p className="text-sm text-red-600 mt-1">{registerForm.formState.errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-sm font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="seu@email.com"
                        className="pl-11 pr-3 w-full"
                        {...registerForm.register('email')}
                      />
                    </div>
                    {registerForm.formState.errors.email && (
                      <p className="text-sm text-red-600 mt-1">{registerForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registration-key" className="text-sm font-medium">Chave de Registro</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      <Input
                        id="registration-key"
                        placeholder="Insira sua chave de registro"
                        className="pl-11 pr-3 w-full"
                        {...registerForm.register('key')}
                      />
                    </div>
                    {registerForm.formState.errors.key && (
                      <p className="text-sm text-red-600 mt-1">{registerForm.formState.errors.key.message}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Entre em contato com o administrador para obter sua chave de registro
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-sm font-medium">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      <Input
                        id="register-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mínimo 8 caracteres"
                        className="pl-11 pr-11 w-full"
                        {...registerForm.register('password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:opacity-70 transition-opacity focus:outline-none"
                        tabIndex={0}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {registerForm.formState.errors.password && (
                      <p className="text-sm text-red-600 mt-1">{registerForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-sm font-medium">Confirmar Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirme sua senha"
                        className="pl-11 pr-11 w-full"
                        {...registerForm.register('confirmPassword')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:opacity-70 transition-opacity focus:outline-none"
                        tabIndex={0}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {registerForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-600 mt-1">{registerForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full mt-4" disabled={isLoading}>
                    {isLoading ? 'Criando conta...' : 'Criar conta'}
                  </Button>
                </form>
              </TabsContent>

              {/* Forgot Password */}
              {activeTab === 'forgot-password' && (
                <div className="space-y-4 mt-6">
                  <div className="text-center">
                    <h3 className="text-lg font-medium">Recuperar Senha</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Digite seu email para receber instruções de recuperação
                    </p>
                  </div>

                  <form onSubmit={forgotPasswordForm.handleSubmit(handleForgotPassword)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="forgot-email" className="text-sm font-medium">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        <Input
                          id="forgot-email"
                          type="email"
                          placeholder="seu@email.com"
                          className="pl-11 pr-3 w-full"
                          {...forgotPasswordForm.register('email')}
                        />
                      </div>
                      {forgotPasswordForm.formState.errors.email && (
                        <p className="text-sm text-red-600 mt-1">{forgotPasswordForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Enviando...' : 'Enviar email de recuperação'}
                    </Button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setActiveTab('login')}
                        className="text-sm text-blue-600 hover:text-blue-500"
                      >
                        Voltar ao login
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>© 2024 HABEA DESK. Sistema profissional para escritórios de advocacia.</p>
          <div className="mt-2 space-x-4">
            <Link to="/privacy" className="hover:text-gray-800">Privacidade</Link>
            <Link to="/terms" className="hover:text-gray-800">Termos de Uso</Link>
            <Link to="/support" className="hover:text-gray-800">Suporte</Link>
          </div>
        </div>
      </div>
    </div>
  );
}