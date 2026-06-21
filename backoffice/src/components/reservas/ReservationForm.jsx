'use client'
import { useEffect, useState } from "react";
import ClientCombobox from "../pessoas/ClientComboBox";
import { Field, FieldGroup } from "../ui/field";
import { searchClientsByName } from "@/services/pessoas/person.repository";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Pencil, Plus } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { DialogFooter } from "../ui/dialog";
import { Alert } from "../ui/alert";


export function ReservationForm({
        initialData, 
        onSubmit, 
        error, 
        success, 
        onOpenItems, 
        onUpdateItems, 
        reservasItems,
        clienteSelecionado,
        setClienteSelecionado
    }) {

    const [termoBusca, setTermoBusca] = useState("");
    const [listaClientes, setListaClientes] = useState([]);



    const handleSelectCliente = (cliente) => {
        setClienteSelecionado(cliente);
    };

    useEffect(() => {

        const handler = setTimeout(async () => {
            if (termoBusca.length > 2) {
                const results = await searchClientsByName(termoBusca);
                setListaClientes(results);
            } else {
                setListaClientes([]);
            }
        }, 300);

        return () => clearTimeout(handler);
    }, [termoBusca])


    const handleItemChange = (id, field, value) => {
        const newItems = reservasItems.map(item => 
            item.id_fornecedor_servico === id 
                ? { ...item, [field]: value } 
                : item
        );
        onUpdateItems(newItems); 
    };

    return (
        <form onSubmit={onSubmit}>

            <div className="px-8 pt-4 space-y-2">
                {error && <Alert variant="destructive">{error}</Alert>}
                {success && <Alert className="border-green-500 text-green-600">{success}</Alert>}
            </div>

            <FieldGroup className="px-8 py-4 gap-8 grid md:grid-cols-2">
                <Field>
                    <Label htmlFor="cliente">Cliente:</Label>
                    <ClientCombobox 
                        clientes={listaClientes}
                        value={clienteSelecionado}
                        onChange={handleSelectCliente}
                        onSearch={setTermoBusca}
                    />
                </Field>

                <Field>
                    <Label htmlFor="orcamento">Orçamento:</Label>
                    <Input name="orcamento" value={initialData?.orcamento} placeholder={"Orçamento"} />
                </Field>

                <Field>
                    <Label htmlFor="inicio_viagem">Inicio Viagem:</Label>
                    <Input 
                        name="inicio_viagem" 
                        value={initialData?.data_inicio_viagem_utc} 
                        type="date" 
                    />
                </Field>


                <Field>
                    <Label htmlFor="fim_viagem">Fim Viagem:</Label>
                    <Input 
                        name="fim_viagem" 
                        value={initialData?.data_fim_viagem_utc} 
                        type="date" 
                    />
                </Field>
            </FieldGroup>

            <div className="space-y-6 w-full">
                    
                    <section className="border-t pt-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Itens da Reserva</h3>
                            <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm" 
                                className="text-sm" 
                                onClick={onOpenItems}
                            >
                                <Pencil className="mr-2 h-4 w-4" /> Editar Itens
                            </Button>
                        </div>
                        <div className="min-h-[100px] px-6 py-8 gap-6 border-2 border-dashed rounded-lg grid grid-cols-3 text-muted-foreground">
                            {reservasItems.length === 0 ? (<p className="text-sm italic">Nenhum item adicionado...</p>) :
                                ( reservasItems.map((reservaItem) => (
                                    <Card 
                                        key={reservaItem.id_fornecedor_servico} 
                                        className={`group cursor-pointer transition-all duration-200`}
                                    >
                                        <CardHeader className="flex flex-row justify-between items-center px-4 border-b border-border bg-muted/20">
                                            <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                                                {reservaItem.nomeOferta}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-1">
                                            <p className="text-sm font-semibold text-foreground">{reservaItem.nome_comercial}</p>
                                            
                                            <p className="text-xs text-muted-foreground">
                                                Municipio: {reservaItem.cidade}
                                            </p>

                                            <p className="text-xs text-muted-foreground">
                                                Estado: {reservaItem.estado}
                                            </p>
                                            
                                            <p className="text-[10px] text-muted-foreground/50 pt-1">
                                                ID: #{reservaItem.id_fornecedor_servico}
                                            </p>

                                            <hr />

                                            <div className="flex flex-col gap-4 mt-8">
                                               <Input
                                                    type="number"
                                                    placeholder="Custo fornecedor"
                                                    className="h-8"
                                                    value={reservaItem.custo_fornecedor || ""}
                                                    onChange={(e) => handleItemChange(reservaItem.id_fornecedor_servico, 'custo_fornecedor', e.target.value)}
                                                />

                                                <Input
                                                    type="number"
                                                    placeholder="Preço venda"
                                                    className="h-8"
                                                    value={reservaItem.preco_venda || ""}
                                                    onChange={(e) => handleItemChange(reservaItem.id_fornecedor_servico, 'preco_venda', e.target.value)}
                                                />
                                            </div>
                                        </CardContent>
                                        <CardFooter className="mt-auto">
                                            <Button variant="destructive" className="ml-auto text-xs px-4">
                                                Remover
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))
                            )}
                            
                        </div>
                    </section>

                    <section className="border-t pt-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Passageiros</h3>
                            <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                            >
                                <Plus className="mr-2 h-4 w-4" /> Adicionar
                            </Button>
                        </div>
                        <div className="min-h-[100px] border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
                            <p className="text-sm italic">Nenhum passageiro adicionado...</p>
                        </div>
                    </section>

                    <section className="border-t pt-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Pacote</h3>
                            <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                            >
                                <Plus className="mr-2 h-4 w-4" /> Adicionar
                            </Button>
                        </div>
                        <div className="min-h-[100px] border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
                            <p className="text-sm italic">Nenhum pacote selecionado...</p>
                        </div>
                    </section>

                </div>

                <div className="flex items-center justify-end pt-8">
                    <Button variant="outline">
                        Salvar
                    </Button>
                </div>
        </form>

    )
}