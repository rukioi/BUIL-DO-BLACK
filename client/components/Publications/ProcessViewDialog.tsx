/**
 * COMPONENTE - DIALOG DE VISUALIZAÇÃO DE PROCESSO
 * ==============================================
 *
 * Modal para exibir os detalhes completos de um processo
 */

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Scale,
  User,
  Building2,
  Calendar,
  FileText,
  Clock,
  ExternalLink,
  Printer,
} from "lucide-react";

interface ProcessViewDialogProps {
  process: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProcessViewDialog({
  process,
  open,
  onOpenChange,
}: ProcessViewDialogProps) {
  if (!process) return null;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      "Em Andamento": "bg-[#9333ea] text-white",
      "Aguardando Julgamento": "bg-[#c084fc] text-white",
      Finalizado: "bg-[#22c55e] text-white",
      Suspenso: "bg-[#ef4444] text-white",
    };
    return colors[status] || "bg-[#27272a] text-gray-400 border border-[#27272a]";
  };

  const handlePrint = () => {
    window.print();
  };

  const handleOpenExternal = () => {
    alert(`Abrindo processo ${process.numero} no sistema do tribunal`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center space-x-2">
            <Scale className="h-5 w-5 text-primary" />
            <span>Detalhes do Processo</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-4 min-h-0">
          <div className="space-y-6">
            {/* Cabeçalho com Status */}
            <div className="flex items-center justify-between p-4 bg-[#1a1a1d] border border-[#27272a] rounded-lg">
              <div className="flex items-center space-x-4">
                <Badge
                  className={`${getStatusColor(process.status)} px-3 py-1`}
                >
                  {process.status}
                </Badge>
                <span className="font-mono text-lg font-semibold">
                  {process.numero}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenExternal}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Abrir no Tribunal
                </Button>
              </div>
            </div>

            {/* Informações Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    Informações do Processo
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Scale className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">
                          Número do Processo
                        </p>
                        <p className="font-mono text-sm text-muted-foreground">
                          {process.numero}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Cliente</p>
                        <p className="text-sm text-muted-foreground">
                          {process.cliente}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Vara/Tribunal</p>
                        <p className="text-sm text-muted-foreground">
                          {process.vara}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    Status e Movimentação
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Status Atual</p>
                        <p className="text-sm text-muted-foreground">
                          {process.status}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">
                          Última Movimentação
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {process.ultimaMovimentacao}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">
                          Data da Movimentação
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {process.dataUltimaMovimentacao?.toLocaleDateString(
                            "pt-BR",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Histórico de Movimentações */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Histórico de Movimentações
              </h3>
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">
                          {process.ultimaMovimentacao}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {process.dataUltimaMovimentacao?.toLocaleDateString(
                            "pt-BR",
                          )}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Última movimentação registrada no sistema
                      </p>
                    </div>
                  </div>

                  {/* Movimentações anteriores mockadas */}
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">
                          Petição inicial distribuída
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {new Date(
                            Date.now() - 30 * 24 * 60 * 60 * 1000,
                          ).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Processo iniciado e distribuído
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Informações Adicionais */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted-foreground">
              <div>
                <p className="font-medium">ID do Processo</p>
                <p className="font-mono">{process.id}</p>
              </div>
              <div>
                <p className="font-medium">Advogado Responsável</p>
                <p>{process.advogado}</p>
              </div>
              <div>
                <p className="font-medium">Sistema</p>
                <p>PJe - Processo Judicial Eletrônico</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end flex-shrink-0 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
