'use client'
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { listPackages, updateReservationPackage } from "@/services/pacotes/packages.repository";
import { useRouter } from "next/navigation";

export default function PackageDialog({ reserva, open, onOpenChange }) {
    const [packages, setPackages] = useState([]);
    const router = useRouter()
    const [selectedPkgId, setSelectedPkgId] = useState(reserva.id_pacote);

    useEffect(() => {
        if (open) {
            setSelectedPkgId(reserva.id_pacote);
            listPackages().then(setPackages);
        }
    }, [open, reserva.id_pacote]);

    const handleSave = async () => {
        const result = await updateReservationPackage(reserva.id, selectedPkgId);
        if (result.success) onOpenChange(false);
        router.refresh()
    };


    const isNoChange = selectedPkgId === reserva.id_pacote;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Gerenciamento de Pacotes</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Pacote atual ativo</h4>
                    {reserva.id_pacote ? (
                        <Card className="bg-emerald-500/5 border-emerald-500/20">
                            <CardContent className="py-4 font-semibold text-emerald-700">
                                {reserva.nome_pacote || `Pacote ID: ${reserva.id_pacote}`}
                            </CardContent>
                        </Card>
                    ) : (
                        <p className="text-sm italic text-muted-foreground">Nenhum pacote selecionado.</p>
                    )}
                </div>

                <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase text-muted-foreground">Pacotes disponíveis</h4>
                    <div className="grid grid-cols-2 gap-4">
                        {packages.map((pkg) => {
                            const isSelected = selectedPkgId === pkg.id_pacote;
                            return (
                                <Card 
                                    key={pkg.id_pacote} 
                                    className={`cursor-pointer transition-all ${isSelected ? 'border-primary ring-1 ring-primary' : 'hover:border-primary'}`} 
                                    onClick={() => setSelectedPkgId(pkg.id_pacote)}
                                >
                                    <CardHeader className="py-3 border-b">
                                        <CardTitle className="text-sm">{pkg.nome_pacote}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-4 text-xs text-muted-foreground">
                                        {pkg.descricao || "Sem descrição disponível"}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                <DialogFooter className="pt-4">
                    <Button 
                        onClick={handleSave} 
                        disabled={isNoChange}
                    >
                        Salvar alterações
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}