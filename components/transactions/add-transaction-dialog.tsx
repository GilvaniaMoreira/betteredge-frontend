"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, DollarSign } from "lucide-react";
import { TransactionType, TransactionCreate } from "@/types/transaction";
import { Client } from "@/types/client";
import { clientsService } from "@/services/clients";
import { transactionsService } from "@/services/transactions";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from 'react-hot-toast';

interface AddTransactionDialogProps {
  open: boolean;
  onClose: () => void;
  transaction?: any;
  onTransactionAdded?: () => void;
}

export function AddTransactionDialog({ open, onClose, transaction, onTransactionAdded }: AddTransactionDialogProps) {
  const [formData, setFormData] = useState<TransactionCreate>({
    client_id: 0,
    type: TransactionType.DEPOSIT,
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    note: ""
  });

  // Update form data when transaction prop changes (for editing)
  useEffect(() => {
    if (transaction) {
      setFormData({
        client_id: transaction.client_id,
        type: transaction.type,
        amount: transaction.amount,
        date: transaction.date ? transaction.date.split('T')[0] : new Date().toISOString().split('T')[0],
        note: transaction.note || ""
      });
    } else {
      // Reset form for new transaction
      setFormData({
        client_id: 0,
        type: TransactionType.DEPOSIT,
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        note: ""
      });
    }
  }, [transaction]);

  const queryClient = useQueryClient();

  // Fetch clients
  const { data: clientsData } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientsService.getClients({ page: 1, size: 1000 }),
  });

  const clients = clientsData?.items || [];

  // Create or update transaction mutation
  const saveTransactionMutation = useMutation({
    mutationFn: (data: TransactionCreate) => {
      if (transaction) {
        return transactionsService.updateTransaction(transaction.id, data);
      } else {
        return transactionsService.createTransaction(data);
      }
    },
    onSuccess: () => {
      const message = transaction ? "Transação atualizada com sucesso!" : "Transação criada com sucesso!";
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['captation-report'] });
      onClose();
      onTransactionAdded?.();
    },
    onError: (error: any) => {
      const message = transaction ? "Erro ao atualizar transação" : "Erro ao criar transação";
      toast.error(error.response?.data?.detail || message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.client_id === 0) {
      toast.error("Selecione um cliente");
      return;
    }

    if (formData.amount <= 0) {
      toast.error("O valor deve ser maior que zero");
      return;
    }

    saveTransactionMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof TransactionCreate, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{transaction ? 'Editar Transação' : 'Nova Transação'}</DialogTitle>
          <DialogDescription>
            {transaction ? 'Atualize os dados da transação.' : 'Registre uma entrada ou saída de dinheiro para um cliente.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="client">Cliente</Label>
              <Select
                value={formData.client_id.toString()}
                onValueChange={(value) => handleInputChange('client_id', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {client.name} ({client.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">Tipo</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TransactionType.DEPOSIT}>Depósito (Entrada)</SelectItem>
                  <SelectItem value={TransactionType.WITHDRAWAL}>Saque (Saída)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="amount">Valor</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="pl-10"
                  value={formData.amount || ''}
                  onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="note">Observações (opcional)</Label>
              <Textarea
                id="note"
                placeholder="Adicione observações sobre esta movimentação..."
                value={formData.note || ''}
                onChange={(e) => handleInputChange('note', e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={saveTransactionMutation.isPending}
            >
              {saveTransactionMutation.isPending ? 
                (transaction ? "Atualizando..." : "Criando...") : 
                (transaction ? "Atualizar Transação" : "Criar Transação")
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
