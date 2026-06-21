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
import { Alert } from "../ui/alert";
import { DatePicker } from "../ui/date-picker";


export function ReservationForm({
        onSubmit, 
        error, 
        success, 

        onOpenItems,

        reservasItems,
        onUpdateItems,

        
        clienteSelecionado,
        setClienteSelecionado,

        dataFim,
        dataInicio,

        setDataFim,
        setDataInicio,

        setOrcamento,
        orcamento
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

    const handleRemoverItem = (id) => {
        const novosItens = reservasItems.filter(i => i.id_fornecedor_servico !== id);
        onUpdateItems(novosItens);
    }

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
                    <Input 
                        name="orcamento" 
                        value={orcamento} 
                        placeholder={"Orçamento"} 
                        onChange={(e) => setOrcamento(e.target.value)}
                    />
                </Field>

                <Field>
                    <Label htmlFor="inicio_viagem">Inicio Viagem:</Label>
                    <DatePicker 
                        date={dataInicio}
                        setDate={setDataInicio}
                    />
                </Field>


                <Field>
                    <Label htmlFor="fim_viagem">Fim Viagem:</Label>
                    <DatePicker 
                        date={dataFim}
                        setDate={setDataFim}
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
                                ( reservasItems.map((reservaItem) => {
                                    console.log(reservaItem)

                                    return(<Card 
                                        key={reservaItem.id_fornecedor_servico} 
                                        className={`group cursor-pointer transition-all duration-200`}
                                    >
                                        <CardHeader className="flex flex-row justify-between items-center px-4 border-b border-border bg-muted/20">
                                            <CardTitle className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                                                {reservaItem.nomeoferta}
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

                                        </CardContent>
                                        <CardFooter className="mt-auto">
                                            <Button 
                                                variant="destructive" 
                                                className="ml-auto text-xs px-4"
                                                onClick={() => {handleRemoverItem(reservaItem.id_fornecedor_servico)}}
                                            >
                                                Remover
                                            </Button>
                                        </CardFooter>
                                    </Card>)
                                })
                            )}
                            
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