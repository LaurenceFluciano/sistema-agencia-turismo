CREATE TYPE tipo_status_pessoa AS ENUM (
  'ATIVO', 
  'INATIVO'
);
CREATE TYPE tipo_status_pacote AS ENUM (
  'DISPONIVEL',
  'INDISPONIVEL',
  'ENCERRADO'
);
CREATE TYPE tipo_status_reserva AS ENUM (
  'RASCUNHO', 
  'CONFIRMADA', 
  'CANCELADA', 
  'CONCLUIDA'
);
CREATE TYPE tipo_status_pagamento AS ENUM (
  'PAGO', 
  'PENDENTE', 
  'VENCIDO'
);
CREATE TYPE tipo_status_fornecedor_servico AS ENUM (
  'ATIVO',
  'PAUSADO',
  'ENCERRADA'
);
CREATE TYPE tipo_status_itinerario AS ENUM (
  'RASCUNHO',
  'AGENDADO',
  'CONCLUIDO',
  'CANCELADO'
);
CREATE TYPE tipo_status_servico AS ENUM (
  'ATIVO',
  'INATIVO',
  'MANUTENCAO',
  'INTERDITADO'
);