"use client";

import { useState } from "react";
import DialogPacote from "./DialogPacote";
import { CardPacote } from "./CardPacote";

export default function PacoteManager({ pacotes }) {
  const [open, setOpen] = useState(false);
  const [pacoteParaEditar, setPacoteParaEditar] = useState(null);

  function openEditor(pacote) {
    setPacoteParaEditar(pacote);
    setOpen(true);
  }

  function handleOpenChange(value) {
    setOpen(value);
    if (!value) {
      setPacoteParaEditar(null);
    }
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          Clique em "Editar" para alterar um pacote existente.
        </div>
        <DialogPacote
          open={open}
          onOpenChange={handleOpenChange}
          pacoteParaEditar={pacoteParaEditar}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 auto-rows-[minmax(0,1fr)] items-stretch">
        {pacotes.map((pacote) => (
          <CardPacote
            key={pacote.id}
            id={pacote.id}
            nome={pacote.nome}
            status={pacote.status}
            quantidadeReservada={pacote.quantidade_reservada ?? pacote.quantidadeReservada}
            pacote={pacote}
            onEdit={openEditor}
          />
        ))}
      </div>
    </>
  );
}
