'use client'
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { listReservationItemsByReservationId, updateReservationItemPrices } from "@/services/reservas/reservation.repository";
import { Alert } from "../ui/alert";
import { useRouter } from "next/navigation";

export default function ReservationItemDialog({ reservaId, open, onOpenChange }) {
    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const router = useRouter()

    useEffect(() => {
        setError(null)
        setSuccess(null)
        setItems([])

        if (open && reservaId) {
            listReservationItemsByReservationId(reservaId, true).then(setItems);
        }
    }, [open, reservaId]);

    const handlePriceChange = (id, field, value) => {
        setItems(items.map(i => 
            i.id_fornecedor_servico === id ? { ...i, [field]: value } : i
        ));
    };

    const handleSave = async () => {
        setError(null)
        setSuccess(null)

        const result = await updateReservationItemPrices(items, reservaId);

        if (result.success) {
            setSuccess(result.message)
            router.refresh()
        } else {
            setError(result.message)
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {items.length > 0 && <DialogContent className="max-w-4xl min-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Editar Preços dos Itens</DialogTitle>
                </DialogHeader>


                <div className="grid grid-cols-3 gap-4 py-4 w-min-2xl">
                    {items.map((reservaItem) => (
                        <Card key={reservaItem.id_fornecedor_servico} className="flex flex-col w-full">
                            <CardHeader className="py-3 bg-muted/20 border-b">
                                <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                                    {reservaItem.nomeoferta}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 pt-4">
                                <p className="text-sm font-semibold">{reservaItem.nome_comercial}</p>
                                
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold text-muted-foreground">Custo Fornecedor</label>
                                    <Input 
                                        type="number" 
                                        className="h-8"
                                        value={reservaItem.custo_fornecedor || ""} 
                                        onChange={(e) => handlePriceChange(reservaItem.id_fornecedor_servico, 'custo_fornecedor', e.target.value)}
                                    />
                                    
                                    <label className="text-[10px] uppercase font-bold text-muted-foreground">Preço Venda</label>
                                    <Input 
                                        type="number" 
                                        className="h-8"
                                        value={reservaItem.preco_venda || ""} 
                                        onChange={(e) => handlePriceChange(reservaItem.id_fornecedor_servico, 'preco_venda', e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>


                <div className="px-8 pt-4 space-y-2">
                    {error && <Alert variant="destructive">{error}</Alert>}
                    {success && <Alert className="border-green-500 text-green-600">{success}</Alert>}
                </div>

                <div className="flex justify-end pt-4 border-t">
                    <Button onClick={handleSave}>Salvar Alterações</Button>
                </div>
            </DialogContent>}

            {items.length <= 0 && 
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Essa reserva não tem items.</DialogTitle>
                    </DialogHeader>
                </DialogContent>}
        </Dialog>
    );
}