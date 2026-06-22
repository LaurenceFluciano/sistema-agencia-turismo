"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/toast";
import { listOffers } from "@/services/ofertas/offers.repository";

export default function DialogPacote({ pacoteParaEditar = null, open: openProp = undefined, onOpenChange = undefined }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [nome, setNome] = useState("");
  const [itensSelecionados, setItensSelecionados] = useState([]);
  const [ofertas, setOfertas] = useState([]);
  const [loadingOfertas, setLoadingOfertas] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const open = openProp ?? internalOpen;
  const setOpenState = onOpenChange ?? setInternalOpen;

  useEffect(() => {
    async function loadOffers() {
      try {
        setLoadingOfertas(true);
        const data = await listOffers();
        console.log('Dados da API:', data);
        let ofertasArray = [];

        if (Array.isArray(data)) {
          ofertasArray = data;
        } else if (data && typeof data === "object") {
          ofertasArray = data.data ?? data.ofertas ?? data.items ?? [];
          if (!Array.isArray(ofertasArray)) {
            ofertasArray = [];
          }
        }

        setOfertas(ofertasArray);
      } catch (error) {
        console.error("Erro ao carregar ofertas:", error);
        toast.add({ title: "Erro", description: "Não foi possível carregar as ofertas.", type: "error" });
      } finally {
        setLoadingOfertas(false);
      }
    }

    if (open) {
      loadOffers();
    }
  }, [open, toast]);

  useEffect(() => {
    if (open && pacoteParaEditar) {
      setNome(pacoteParaEditar.nome || "");
      setItensSelecionados(pacoteParaEditar.itensSelecionados ?? pacoteParaEditar.itens ?? []);
      setStep(1);
    }
  }, [open, pacoteParaEditar]);

  function handleOpenChange(isOpen) {
    setOpenState(isOpen);
    if (!isOpen) {
      setStep(1);
      setNome("");
      setItensSelecionados([]);
    }
  }

  function toggleOferta(oferta) {
    const exists = itensSelecionados.some((i) => i.id_fornecedor_servico === oferta.id_fornecedor_servico);
    if (exists) {
      setItensSelecionados((prev) => prev.filter((i) => i.id_fornecedor_servico !== oferta.id_fornecedor_servico));
    } else {
      setItensSelecionados((prev) => [...prev, oferta]);
    }
  }

  function removeItem(id) {
    setItensSelecionados((prev) => prev.filter((i) => i.id_fornecedor_servico !== id));
  }

  function handleSave() {
    (async () => {
      try {
        const isEditing = Boolean(pacoteParaEditar?.id);
        const payload = isEditing
          ? {
              nome,
              itensSelecionados,
            }
          : {
              nome,
              itens: itensSelecionados.map((i) => i.id_fornecedor_servico),
            };

        const res = await fetch(
          isEditing ? `/api/pacotes/${pacoteParaEditar.id}` : "/api/pacotes",
          {
            method: isEditing ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        const data = await res.json();

        if (res.ok && data.success) {
          router.refresh();
          setOpenState(false);
          setStep(1);
          setNome("");
          setItensSelecionados([]);
          toast.add({
            title: isEditing ? "Pacote atualizado" : "Pacote criado",
            description: isEditing ? "Pacote atualizado com sucesso." : "Pacote criado com sucesso.",
            type: "success",
          });
        } else {
          console.error("Erro ao salvar pacote:", data.error || "unknown");
          toast.add({ title: "Erro", description: data.error || "Erro desconhecido", type: "error" });
        }
      } catch (error) {
        console.error("Erro ao chamar API de pacotes:", error);
        toast.add({ title: "Erro", description: String(error), type: "error" });
      }
    })();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>+ Adicionar</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle>{pacoteParaEditar ? "Editar Pacote" : "Criar Pacote"}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <label className="block text-sm font-medium">Nome do Pacote</label>
              <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome do pacote" />

              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Itens do Pacote</h3>
                <Button variant="ghost" size="sm" onClick={() => setStep(2)}>
                  <Pencil className="mr-2 h-4 w-4" /> Editar Itens
                </Button>
              </div>

              <div className="space-y-2">
                {itensSelecionados.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">Nenhum item selecionado</p>
                )}

                {itensSelecionados.map((item) => (
                  <div key={item.id_fornecedor_servico} className="flex items-center justify-between gap-4 p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="font-semibold">{item.nome_comercial}</span>
                        <Badge className="mt-1">{item.tipo_servico}</Badge>
                        <span className="text-xs text-muted-foreground">ID: {item.id_fornecedor_servico}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeItem(item.id_fornecedor_servico)} aria-label="Remover item">
                      <Trash className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button variant="default" onClick={handleSave} className="bg-foreground text-background">
                Salvar
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 2 && (
          <>
            <DialogHeader>
              <DialogTitle>Selecione as Ofertas do pacote</DialogTitle>
            </DialogHeader>

            <div className="py-2">
              <ScrollArea className="h-[300px] w-full">
                <div className="space-y-2 p-2">
                  {loadingOfertas ? (
                  <p className="text-sm text-muted-foreground italic">Carregando ofertas...</p>
                ) : (
                  ofertas.map((oferta) => {
                    const isChecked = itensSelecionados.some((i) => i.id_fornecedor_servico === oferta.id_fornecedor_servico);
                    return (
                      <div key={oferta.id_fornecedor_servico} className="flex items-center justify-between gap-4 p-3 border rounded-md">
                        <div className="flex flex-col">
                          <span className="font-semibold">{oferta.nome_comercial}</span>
                          <Badge className="mt-1">{oferta.tipo_servico}</Badge>
                          <span className="text-xs text-muted-foreground">ID: {oferta.id_fornecedor_servico}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Checkbox checked={isChecked} onCheckedChange={() => toggleOferta(oferta)} />
                        </div>
                      </div>
                    );
                  })
                )}
                </div>
              </ScrollArea>
            </div>

            <DialogFooter className="flex justify-between w-full gap-2">
              <Button type="button" variant="outline" onClick={() => setStep(1)}>
                Voltar
              </Button>
              <Button variant="default" onClick={() => setStep(1)}>
                Adicionar Selecionados
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
