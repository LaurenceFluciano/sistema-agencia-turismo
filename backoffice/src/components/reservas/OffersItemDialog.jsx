'use client'

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { DialogFooter } from "../ui/dialog";
import { listOffers } from "@/services/ofertas/offers.repository";

/**
 * @typedef {Object} Oferta
 * @property {number} id_fornecedor_servico
 * @property {string} nome_comercial
 * @property {string} municipio_cidade
 * @property {string} nome_estado
 * @property {string} tipo_servico
 * @property {string} status_fornecedor
 */

/**
 * @typedef {Object} ReservaItem
 * @property {number} id_fornecedor_servico
 * @property {string} nomeOferta
 * @property {string} cidade
 * @property {string} estado
 * @property {number} [custo_fornecedor]
 * @property {number} [preco_venda]
 */

export default function OffersItemDialog({ setReservaItems , onBack}) {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [selectedOffers, setSelectedOffers] = useState([]);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const data = await listOffers();
                setOffers(data || []);
            } catch (error) {
                console.error("Erro ao carregar ofertas:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const handleToggleSelect = (oferta) => {
        setSelectedOffers((prev) => {
            const exists = prev.some(
                (item) => item.id_fornecedor_servico === oferta.id_fornecedor_servico
            );

            if (exists) {
                return prev.filter(
                    (item) => item.id_fornecedor_servico !== oferta.id_fornecedor_servico
                );
            }

            return [...prev, oferta];
        });
    };

    const handleConfirmSelection = () => {
        setReservaItems((prevItems) => {
            const map = new Map(prevItems.map(item => [item.id_fornecedor_servico, item]));
            
            selectedOffers.forEach(oferta => {
                if (!map.has(oferta.id_fornecedor_servico)) {
                    map.set(oferta.id_fornecedor_servico, {
                        id_fornecedor_servico: oferta.id_fornecedor_servico,
                        nomeOferta: oferta.nome_comercial,
                        cidade: oferta.municipio_cidade,
                        estado: oferta.nome_estado,
                        quantidade: 1,
                        gerado_pelo_pacote: false
                    });
                }
            });

            return Array.from(map.values());
        });

        if (onBack) onBack();
    };
    
    

    return (
        <div className="flex flex-col h-full w-min-2xl">

            <h2 className="text-lg font-semibold px-8 mb-8">Selecione as Ofertas</h2>



            <div className="grid grid-cols-2 gap-4 flex-1 overflow-y-auto pr-2 px-8">
                {loading ? (
                    <p className="text-sm text-muted-foreground col-span-2 text-center py-4">Carregando...</p>
                ) : 
                    offers.map((oferta) => {
                    
                        const isSelected = selectedOffers.some((item) => item.id_fornecedor_servico === oferta.id_fornecedor_servico);

                        return (
                            <Card 
                                key={oferta.id_fornecedor_servico} 
                                onClick={() => handleToggleSelect(oferta)}
                                className={`group border cursor-pointer transition-all duration-200 ${
                                    isSelected 
                                        ? "border-primary bg-primary/5 ring-1 ring-primary" 
                                        : "border-border bg-card hover:border-primary"
                                }`}
                            >
                                <CardHeader className="flex flex-row justify-between items-center py-3 px-4 border-b border-border bg-muted/20">
                                    <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                                        {oferta.tipo_servico}
                                    </CardTitle>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                        oferta.status_fornecedor === 'ATIVO' 
                                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                                            : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                    }`}>
                                        {oferta.status_fornecedor}
                                    </span>
                                </CardHeader>
                                <CardContent className="p-4 space-y-1">
                                    <p className="text-sm font-semibold text-foreground">{oferta.nome_comercial}</p>
                                    
                                    <p className="text-xs text-muted-foreground/80 font-medium">
                                        Serviço: {oferta.nome_oficial_servico}
                                    </p>
                                    
                                    <p className="text-xs text-muted-foreground">
                                        Local: {oferta.municipio_cidade} — {oferta.sigla_estado}
                                    </p>
                                    
                                    <p className="text-[10px] text-muted-foreground/50 pt-1">
                                        ID: #{oferta.id_fornecedor_servico}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })
                }
                
                
            </div>
            
            <DialogFooter className="pt-6 mt-6 border-t border-zinc-800 px-8">
                <Button 
                    onClick={handleConfirmSelection} 
                    disabled={selectedOffers.length === 0}
                    className="w-full sm:w-auto ml-auto"
                >
                    Adicionar Selecionados
                </Button>
            </DialogFooter>
        </div>
    )
}