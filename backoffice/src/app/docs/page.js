import { ConstraintCheckSection } from "@/components/docs/ConstraintCheckSection";
import { DiagramSection } from "@/components/docs/DiagramSection";
import { FunctionSection } from "@/components/docs/FunctionSection";
import { IndexSection } from "@/components/docs/IndexCard";
import { ProblemSection } from "@/components/docs/ProblemSection";
import { ProcedureSection } from "@/components/docs/ProcedureSection";
import { TriggerSection } from "@/components/docs/TriggerSection";
import { ViewSection } from "@/components/docs/ViewSection";

export default function Page() {
  return (
    <div className="container py-10 space-y-12 px-32 mx-auto">
      <h1 className="text-4xl font-bold">Documentação Técnica - Banco de Dados</h1>

      <ProblemSection numberSection={1} />
      <DiagramSection numberSection={2} />
      <ConstraintCheckSection numberSection={3} />
      <IndexSection numberSection={4} />
      <ViewSection numberSection={5} />
      <FunctionSection numberSection={6} />
      <ProcedureSection numberSection={7} />
      <TriggerSection numberSection={8} />
    
    </div>
  );
}
