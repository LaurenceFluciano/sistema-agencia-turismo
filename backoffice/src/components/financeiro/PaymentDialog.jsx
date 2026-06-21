"use client"
import React, { useState } from 'react';
import { createPagamento } from '@/services/financeiro/financeiro.repository';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function PaymentDialog({ onPaymentAdded }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    id_reserva: '',
    valor: '',
    data_pagamento: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.id_reserva || !formData.valor || !formData.data_pagamento) {
      setError('Por favor, preencha todos os campos.');
      setLoading(false);
      return;
    }
    const result = await createPagamento({
      id_reserva: parseInt(formData.id_reserva),
      valor: parseFloat(formData.valor),
      data_pagamento: formData.data_pagamento
    });

    setLoading(false);

    if (result.success) {
      setOpen(false); 
      setFormData({ id_reserva: '', valor: '', data_pagamento: new Date().toISOString().split('T')[0] }); // Limpa o form
      if (onPaymentAdded) onPaymentAdded(); 
    } else {
      setError(result.error || 'Erro ao registrar pagamento.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Adicionar Pagamento</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Registrar Novo Pagamento</DialogTitle>
          <DialogDescription>
            Insira os dados da transação. O banco validará o status da reserva automaticamente.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {error && (
            <div className="p-3 text-sm font-medium text-red-600 bg-red-50 rounded-md border border-red-200">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="id_reserva">ID da Reserva</Label>
            <Input
              id="id_reserva"
              type="number"
              placeholder="Ex: 12"
              value={formData.id_reserva}
              onChange={(e) => setFormData({ ...formData, id_reserva: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="valor">Valor (R$)</Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              placeholder="Ex: 1500.00"
              value={formData.valor}
              onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="data_pagamento">Data do Pagamento</Label>
            <Input
              id="data_pagamento"
              type="date"
              value={formData.data_pagamento}
              onChange={(e) => setFormData({ ...formData, data_pagamento: e.target.value })}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Confirmar Pagamento'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}