"use client"
import React, { useState, useEffect } from 'react';

import { Card } from '@/components/ui/card';
import PaymentDialog from '@/components/financeiro/PaymentDialog';
import { getResumoMes, getPagamentos } from '@/services/financeiro/financeiro.repository';

export default function FinanceiroPage() {
  const [resumo, setResumo] = useState({ receitaMes: 0, gastosMes: 0, lucroMes: 0 });
  const [pagamentos, setPagamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [status, setStatus] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('');
  const [idReserva, setIdReserva] = useState('');

  async function loadFinanceiroData() {
    try {
      const dadosResumo = await getResumoMes();
      const dadosPagamentos = await getPagamentos(dataInicio, dataFim, status, formaPagamento, idReserva);

      setResumo(dadosResumo);
      setPagamentos(dadosPagamentos);
    } catch (error) {
      console.error("Erro ao carregar dados do banco:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFinanceiroData();
  }, [dataInicio, dataFim, status, formaPagamento, idReserva]);

  if (loading) {
    return <div className="p-10 text-center text-gray-500 font-medium bg-black text-white min-h-screen">Carregando dados financeiros...</div>;
  }

  return (
    <div className="p-8 bg-black text-white min-h-screen space-y-10">
      
      <div className="flex justify-between items-center border-b border-gray-800 pb-4">
        <h1 className="text-3xl font-light tracking-wide">Financeiro</h1>
        <PaymentDialog onPaymentAdded={loadFinanceiroData} />
      </div>

      <section>
        <h2 className="text-xl font-medium mb-6 text-gray-200">KPIs de Lucratividade</h2>
        
        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          <Card className="p-8 bg-transparent border border-gray-700 rounded-3xl flex flex-col items-center justify-center space-y-4">
            <h3 className="text-sm font-medium text-gray-400">Margem Operacional</h3>
            <div className="text-4xl font-bold text-blue-500 tracking-tight">
              R$ {Number(resumo.lucroMes).toFixed(2)}
            </div>
          </Card>

          <Card className="p-8 bg-transparent border border-gray-700 rounded-3xl flex flex-col items-center justify-center space-y-4">
            <h3 className="text-sm font-medium text-gray-400">Custos Fornecedores</h3>
            <div className="text-4xl font-bold text-red-500 tracking-tight">
              R$ {Number(resumo.gastosMes).toFixed(2)}
            </div>
          </Card>
        </div>

        <div className="flex justify-center mt-6">
          <Card className="p-8 bg-transparent border border-gray-700 rounded-3xl w-full max-w-[420px] flex flex-col items-center justify-center space-y-4">
            <h3 className="text-sm font-medium text-gray-400">Receita Total</h3>
            <div className="text-4xl font-bold text-green-500 tracking-tight">
              R$ {Number(resumo.receitaMes).toFixed(2)}
            </div>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-medium mb-4 text-gray-200">Tabela de movimentações</h2>
        
        <div className="flex flex-wrap items-end gap-4 bg-[#0a0a0a] p-5 rounded-xl border border-gray-800 mb-6 w-full max-w-6xl">
          
          <div className="flex flex-col gap-1.5 w-32">
            <label className="text-xs text-gray-400 font-medium">Nº Reserva</label>
            <input 
              type="number" 
              placeholder="Ex: 1"
              value={idReserva} 
              onChange={(e) => setIdReserva(e.target.value)}
              className="bg-black border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400 font-medium">De (Data Início)</label>
            <input 
              type="date" 
              value={dataInicio} 
              onChange={(e) => setDataInicio(e.target.value)}
              className="bg-black border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
              style={{ colorScheme: 'dark' }}
            />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400 font-medium">Até (Data Fim)</label>
            <input 
              type="date" 
              value={dataFim} 
              onChange={(e) => setDataFim(e.target.value)}
              className="bg-black border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
              style={{ colorScheme: 'dark' }}
            />
          </div>

          <div className="flex flex-col gap-1.5 w-40">
            <label className="text-xs text-gray-400 font-medium">Status</label>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
              className="bg-black border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="">Todos</option>
              <option value="PAGO">PAGO</option>
              <option value="PENDENTE">PENDENTE</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 w-44">
            <label className="text-xs text-gray-400 font-medium">Forma de Pagamento</label>
            <select 
              value={formaPagamento} 
              onChange={(e) => setFormaPagamento(e.target.value)}
              className="bg-black border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="">Todas</option>
              <option value="PIX">PIX</option>
              <option value="CARTAO">Cartão</option>
              <option value="BOLETO">Boleto</option>
              <option value="DINHEIRO">Dinheiro</option>
            </select>
          </div>

          {(dataInicio || dataFim || status || formaPagamento || idReserva) && (
            <button 
              onClick={() => { setDataInicio(''); setDataFim(''); setStatus(''); setFormaPagamento(''); setIdReserva(''); }}
              className="text-xs text-red-400 hover:text-red-300 transition-colors pb-2.5 underline"
            >
              Limpar Filtros
            </button>
          )}
        </div>

        <div className="rounded-2xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="bg-[#0a0a0a] text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="py-4 px-6 font-medium tracking-wide">Data</th>
                  <th className="py-4 px-6 font-medium tracking-wide">Cliente</th>
                  <th className="py-4 px-6 font-medium tracking-wide">Serviço</th>
                  <th className="py-4 px-6 font-medium tracking-wide">Forma</th>
                  <th className="py-4 px-6 font-medium tracking-wide">Status</th>
                  <th className="py-4 px-6 font-medium tracking-wide text-right">Entrada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 bg-black">
                {pagamentos.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-gray-500">
                      Nenhuma movimentação encontrada com os filtros selecionados.
                    </td>
                  </tr>
                ) : (
                  pagamentos.map((pag) => (
                    <tr key={pag.id} className="hover:bg-gray-900/50 transition-colors">
                      <td className="py-4 px-6">{pag.data_formatada}</td>
                      <td className="py-4 px-6 font-medium text-white">{pag.nome_cliente}</td>
                      <td className="py-4 px-6 text-gray-400">{pag.nome_servico}</td>
                      <td className="py-4 px-6 text-xs text-gray-400 font-mono">{pag.forma_pagamento}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          pag.status === 'PAGO' 
                            ? 'bg-green-950/30 text-green-400 border-green-900/50' 
                            : 'bg-yellow-950/30 text-yellow-400 border-yellow-900/50'
                        }`}>
                          {pag.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-medium tracking-wide text-green-500">
                        R$ {Number(pag.valor).toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
}