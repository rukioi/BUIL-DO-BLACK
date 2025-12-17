/**
 * LAYOUT PRINCIPAL DO SISTEMA - DashboardLayout (Tema Dark Elegant com Roxo)
 * ============================================================================
 * Estilo dark profissional e elegante com paleta roxa.
 * 
 * Paleta:
 * - Fundo: preto profundo (#0f0f11, #1a1a1d)
 * - Acentos: roxo elegante (#9333ea, #a855f7)
 * - Texto: cinza claro e branco
 */

import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  CheckSquare,
  FileText,
  TrendingUp,
  Settings,
  Search,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Newspaper,
  User,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserProfileDialog } from "./UserProfileDialog";
import { NotificationsPanel } from "./NotificationsPanel";
import { useDialogBodyFix } from "@/hooks/use-dialog-body-fix";
import { useAuth } from "@/hooks/useAuth";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard, allowedAccountTypes: ['SIMPLES', 'COMPOSTA', 'GERENCIAL'] },
  { name: "CRM", href: "/crm", icon: Users, allowedAccountTypes: ['SIMPLES', 'COMPOSTA', 'GERENCIAL'] },
  { name: "Projetos", href: "/projetos", icon: FolderKanban, allowedAccountTypes: ['SIMPLES', 'COMPOSTA', 'GERENCIAL'] },
  { name: "Tarefas", href: "/tarefas", icon: CheckSquare, allowedAccountTypes: ['SIMPLES', 'COMPOSTA', 'GERENCIAL'] },
  { name: "Cobrança", href: "/cobranca", icon: FileText, allowedAccountTypes: ['SIMPLES', 'COMPOSTA', 'GERENCIAL'] },
  { name: "Gestão de Recebíveis", href: "/recebiveis", icon: CreditCard, allowedAccountTypes: ['SIMPLES', 'COMPOSTA', 'GERENCIAL'] },
  { name: "Fluxo de Caixa", href: "/fluxo-caixa", icon: TrendingUp, allowedAccountTypes: ['COMPOSTA', 'GERENCIAL'] },
  { name: "Painel de Publicações", href: "/publicacoes", icon: Newspaper, allowedAccountTypes: ['SIMPLES', 'COMPOSTA', 'GERENCIAL'] },
  { name: "Configurações", href: "/configuracoes", icon: Settings, allowedAccountTypes: ['GERENCIAL'] },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useDialogBodyFix();

  const filteredNavigation = navigation.filter((item) => {
    if (!item.allowedAccountTypes) return true;
    if (!user?.accountType) return true;
    return item.allowedAccountTypes.includes(user.accountType as any);
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      if (searchTerm.toLowerCase().includes("cliente")) navigate("/crm");
      else if (searchTerm.toLowerCase().includes("projeto")) navigate("/projetos");
      else if (searchTerm.toLowerCase().includes("cobrança") || searchTerm.toLowerCase().includes("fatura"))
        navigate("/cobranca");
      else navigate("/");
    }
  };

  const handleLogout = () => (window as any).logout();
  const handleViewProfile = () => setShowProfileDialog(true);
  const handleSettings = () => navigate("/configuracoes");

  return (
    <div className="flex h-screen bg-[#0f0f11] text-gray-100">
      {/* Sidebar */}
      <div
        className={cn(
          "transition-all duration-300 bg-[#1a1a1d] border-r border-[#27272a] shadow-lg",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-center border-b border-[#27272a] px-0 h-14 overflow-hidden">
          {!sidebarCollapsed ? (
            <img 
              src="/logo_oficial.png" 
              alt="Logo" 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="text-[#9333ea] font-bold text-lg">OPT</div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {filteredNavigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-[#9333ea] text-white shadow-md shadow-[#9333ea]/30"
                    : "text-gray-400 hover:bg-[#27272a] hover:text-gray-100",
                  sidebarCollapsed && "justify-center"
                )}
                title={sidebarCollapsed ? item.name : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Button */}
        <div className="p-4 border-t border-[#27272a]">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center text-gray-300 hover:bg-[#27272a]"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Recolher
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-[#1a1a1d] border-b border-[#27272a] px-6 py-4 shadow-md">
          <div className="flex items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                  <Input
                    placeholder="Buscar clientes, projetos, faturas..."
                    className="pl-11 pr-3 bg-[#27272a] border border-[#3f3f46] text-gray-200 placeholder:text-gray-500 focus:border-[#9333ea]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </form>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <NotificationsPanel />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-[#27272a]">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" alt="Usuário" />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-[#1a1a1d] text-gray-100 border border-[#27272a]" align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">Dr. Advogado</p>
                      <p className="w-[200px] truncate text-sm text-gray-400">
                        advogado@escritorio.com.br
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-[#27272a]" />
                  <DropdownMenuItem onClick={handleViewProfile} className="hover:bg-[#27272a]">
                    <User className="mr-2 h-4 w-4 text-[#9333ea]" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSettings} className="hover:bg-[#27272a]">
                    <Settings className="mr-2 h-4 w-4 text-[#9333ea]" />
                    <span>Configurações</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#27272a]" />
                  <DropdownMenuItem onClick={handleLogout} className="hover:bg-[#27272a]">
                    <LogOut className="mr-2 h-4 w-4 text-red-500" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Conteúdo principal */}
        <main className="flex-1 overflow-auto bg-[#0f0f11] p-6">
          {children}
        </main>
      </div>

      {/* Modal de perfil */}
      <UserProfileDialog open={showProfileDialog} onOpenChange={setShowProfileDialog} />
    </div>
  );
}
