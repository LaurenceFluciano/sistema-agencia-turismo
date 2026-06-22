'use client'
import { createItinerario, getItinerarioById, updateItinerario } from "@/services/itinerarios/itinerarios.repository";
import { Button } from "../ui/button";
import { Field, FieldGroup } from "../ui/field";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";


export default function ItinerarioEditorForm({reservaId}) {
    const [id, setId] = useState('')

    const [enableInputs, setEnableInputs] = useState(false)

    const [data, setData] = useState({
        id_oferta: '',
        id_municipio: '',
        data_inicio: '',
        data_fim: '',
        voucher: '',
        roteiro: '',
        tipo_evento: '',
        ordem_passo: '',
        status: 'RASCUNHO'
    })

    const router = useRouter()

    async function handleSubmit(e) {
        e.preventDefault();

    
        const cleanData = (obj) => {
            const cleared = {};
            for (const key in obj) {
                cleared[key] = (obj[key] === "" || obj[key] === null || obj[key] === undefined) 
                    ? null 
                    : obj[key];
            }
            return cleared;
        };

        const payload = cleanData({ 
            ...data, 
            ordem_passo: data.ordem_passo ? parseInt(data.ordem_passo) : null 
        });

        const result = await updateItinerario(id, reservaId, payload);

        if (result.success) {
            alert(result.message)
            router.refresh()
            setId('')
            setData({
                id_oferta: '',
                id_municipio: '',
                data_inicio: '',
                data_fim: '',
                voucher: '',
                roteiro: '',
                tipo_evento: '',
                ordem_passo: '',
                status: 'RASCUNHO'
            })
            setEnableInputs(false)
        } else {
            alert("Ocorreu um erro ao adicionar: " + result.message)
        }
    }


    function formatarParaInput(dataBanco) {
        if (!dataBanco) return '';

        const strData = dataBanco instanceof Date 
            ? dataBanco.toISOString() 
            : String(dataBanco);

        return strData.slice(0, 16); 
    }

    useEffect(() => {
        setEnableInputs(false)
        async function updateData(){
            if (!id) return;
            const result = await getItinerarioById(reservaId, id);
            
            if (result) {
                setData({
                    id_oferta: result.id_fornecedor_servico || '',
                    id_municipio: result.id_municipio || '',
                    data_inicio: formatarParaInput(result.data_hora_inicio_utc || '') ,
                    data_fim: formatarParaInput(result.data_hora_fim_utc || '') ,
                    voucher: result.voucher_codigo || '',
                    roteiro: result.descricao_evento || '',
                    tipo_evento: result.tipo_evento || '',
                    ordem_passo: result.ordem_passo || '',
                    status: result.status || 'RASCUNHO'
                });
                console.log(data)
                setEnableInputs(true)
            }
        }

        updateData();
    }, [id, reservaId]);

    return (
        <form onSubmit={handleSubmit}>
            <Field className="py-8">
                <Label htmlFor="id_oferta">id_itinerario</Label>
                <Input 
                    name="id"
                    placeholder="id"
                    required
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    
                />
            </Field>
            { enableInputs && <FieldGroup>
                <Field>
                    <Label htmlFor="id_oferta">id_oferta</Label>
                    <Input 
                        name="id_oferta"
                        placeholder="id_oferta"
                        value={data.id_oferta}
                        onChange={(e) => {setData((prev) => ({...prev, id_oferta: e.target.value}))}}
                        required
                    />
                </Field>


                <Field>
                    <Label htmlFor="id_municipio">id_municipio</Label>
                    <Input 
                        name="id_municipio"
                        placeholder="id_municipio"
                        value={data.id_municipio}
                        onChange={(e) => {setData((prev) => ({...prev, id_municipio: e.target.value}))}}
                        required
                    />
                </Field>


                <Field>
                    <Label htmlFor="data_hora_inicio">data_hora_inicio</Label>
                    <Input 
                        type="datetime-local"
                        name="data_hora_inicio"
                        value={data.data_inicio}
                        onChange={(e) => {setData((prev) => ({...prev, data_inicio: e.target.value}))}}
                        placeholder="data_hora_inicio"
                    />
                </Field>


                <Field>
                    <Label htmlFor="data_hora_fim">data_hora_fim</Label>
                    <Input 
                        type="datetime-local"
                        name="data_hora_fim"
                        value={data.data_fim}
                        onChange={(e) => {setData((prev) => ({...prev, data_fim: e.target.value}))}}
                        placeholder="data_hora_fim"
                    />
                </Field>


                <Field>
                    <Label htmlFor="voucher_codigo">voucher_codigo</Label>
                    <Input 
                        name="voucher_codigo"
                        value={data.voucher}
                        onChange={(e) => {setData((prev) => ({...prev, voucher: e.target.value}))}}
                        placeholder="voucher_codigo"
                    />
                </Field>

                <Field>
                    <Label htmlFor="tipo_evento">tipo_evento</Label>
                    <Textarea 
                        name="tipo_evento"
                        value={data.tipo_evento}
                        onChange={(e) => {setData((prev) => ({...prev, tipo_evento: e.target.value}))}}
                        placeholder="tipo_evento"
                    />
                </Field>


                <Field>
                    <Label htmlFor="roteiro">roteiro</Label>
                    <Textarea 
                        name="roteiro"
                        value={data.roteiro}
                        onChange={(e) => {setData((prev) => ({...prev, roteiro: e.target.value}))}}
                        placeholder="roteiro"
                    />
                </Field>

                <Field>
                    <Label htmlFor="ordem_passo">passo</Label>
                    <Input 
                        type="numeric"
                        name="ordem_passo"
                        value={data.ordem_passo}
                        onChange={(e) => {setData((prev) => ({...prev, ordem_passo: e.target.value}))}}
                        placeholder="passo"
                    />
                </Field>

                <Select 
                    value={data.status} 
                    onValueChange={(status) => setData((prev) => ({ ...prev, status: status }))}
                >
                    <SelectTrigger id="status">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent
                        position={true ? "item-aligned" : "popper"}
                    >
                        <SelectGroup>
                            <SelectItem value="RASCUNHO">RASCUNHO</SelectItem>
                            <SelectItem value="AGENDADO">AGENDADO</SelectItem>
                            <SelectItem value="EM_ANDAMENTO">EM_ANDAMENTO</SelectItem>
                            <SelectItem value="CONCLUIDO">CONCLUIDO</SelectItem>
                            <SelectItem value="SUSPENSO">SUSPENSO</SelectItem>
                            <SelectItem value="CANCELADO">CANCELADO</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>


                <Button>Alterar</Button>
            </FieldGroup> }
        </form>
    )
}