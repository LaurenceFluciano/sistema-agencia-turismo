'use client'
import { createItinerario } from "@/services/itinerarios/itinerarios.repository";
import { Button } from "../ui/button";
import { Field, FieldGroup } from "../ui/field";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useRouter } from "next/navigation";


export default function ItinerarioRegisterForm({reservaId}) {

    const router = useRouter()

    const orNull = (value) => (value === "" || value === null || value === undefined ? null : value);

    async function handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);

        const data = {
            id_reserva: reservaId,
            id_oferta: orNull(formData.get("id_oferta")),
            id_municipio: orNull(formData.get("id_municipio")),
            data_inicio: orNull(formData.get("data_hora_inicio")),
            data_fim: orNull(formData.get("data_hora_fim")),
            voucher: orNull(formData.get("voucher_codigo")),
            roteiro: orNull(formData.get("roteiro")),
            tipo_evento: orNull(formData.get("tipo_evento")),
            ordem_passo: formData.get("ordem_passo") ? parseInt(formData.get("ordem_passo")) : null
        };

        const result = await createItinerario(data)


        if (result.success) {
            alert(result.message)
            router.refresh()
        } else {
            alert("Ocorreu um erro ao adicionar: " + result.message)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <FieldGroup>
                <Field>
                    <Label htmlFor="id_oferta">id_oferta</Label>
                    <Input 
                        name="id_oferta"
                        placeholder="id_oferta"
                        required
                    />
                </Field>


                <Field>
                    <Label htmlFor="id_municipio">id_municipio</Label>
                    <Input 
                        name="id_municipio"
                        placeholder="id_municipio"
                        required
                    />
                </Field>


                <Field>
                    <Label htmlFor="data_hora_inicio">data_hora_inicio</Label>
                    <Input 
                        type="datetime-local"
                        name="data_hora_inicio"
                        placeholder="data_hora_inicio"
                    />
                </Field>


                <Field>
                    <Label htmlFor="data_hora_fim">data_hora_fim</Label>
                    <Input 
                        type="datetime-local"
                        name="data_hora_fim"
                        placeholder="data_hora_fim"
                    />
                </Field>


                <Field>
                    <Label htmlFor="voucher_codigo">voucher_codigo</Label>
                    <Input 
                        name="voucher_codigo"
                        placeholder="voucher_codigo"
                    />
                </Field>

                <Field>
                    <Label htmlFor="tipo_evento">tipo_evento</Label>
                    <Textarea 
                        name="tipo_evento"
                        placeholder="tipo_evento"
                    />
                </Field>


                <Field>
                    <Label htmlFor="roteiro">roteiro</Label>
                    <Textarea 
                        name="roteiro"
                        placeholder="roteiro"
                    />
                </Field>

                <Field>
                    <Label htmlFor="ordem_passo">passo</Label>
                    <Input 
                        type="numeric"
                        name="ordem_passo"
                        placeholder="passo"
                    />
                </Field>


                <Button>Criar</Button>
            </FieldGroup>
        </form>
    )
}