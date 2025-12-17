import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { MoreHorizontal, Eye, Edit, Trash2, Phone, Mail } from 'lucide-react';
import { Client } from '@/types/crm';

interface ClientsTableProps {
  clients: Client[];
  selectedClients: string[];
  onSelectClient: (clientId: string) => void;
  onSelectAll: (checked: boolean) => void;
  onEditClient: (client: Client) => void;
  onDeleteClient: (clientId: string) => void;
  onViewClient: (client: Client) => void;
}

export function ClientsTable({
  clients,
  selectedClients,
  onSelectClient,
  onSelectAll,
  onEditClient,
  onDeleteClient,
  onViewClient,
}: ClientsTableProps) {
  const formatCurrency = (value: number, currency: string) => {
    const formatters = {
      BRL: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }),
      USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
      EUR: new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }),
    };
    return formatters[currency as keyof typeof formatters]?.format(value) || `${currency} ${value}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white border-0';
      case 'inactive':
        return 'bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white border-0';
      case 'pending':
        return 'bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white border-0';
      default:
        return 'bg-[#27272a] text-gray-200 border border-[#3f3f46]';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'inactive':
        return 'Inativo';
      case 'pending':
        return 'Pendente';
      default:
        return status;
    }
  };

  return (
    <div className="rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedClients.length === clients.length && clients.length > 0}
                onCheckedChange={onSelectAll}
                aria-label="Selecionar todos"
              />
            </TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Localização</TableHead>
            <TableHead>Orçamento</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="w-12">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                Nenhum cliente encontrado
              </TableCell>
            </TableRow>
          ) : (
            clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedClients.includes(client.id)}
                    onCheckedChange={() => onSelectClient(client.id)}
                    aria-label={`Selecionar ${client.name}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={client.image} alt={client.name} />
                      <AvatarFallback>
                        {client.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{client.name}</div>
                      {client.organization && (
                        <div className="text-sm text-muted-foreground">{client.organization}</div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <Mail className="h-3 w-3 mr-1 text-muted-foreground" />
                      {client.email}
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                      {client.mobile}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{client.city}, {client.state}</div>
                    <div className="text-muted-foreground">{client.country}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    {formatCurrency(client.budget, client.currency)}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(client.status)}>
                    {getStatusLabel(client.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {client.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {client.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{client.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Abrir menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewClient(client)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEditClient(client)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDeleteClient(client.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
