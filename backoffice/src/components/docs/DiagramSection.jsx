'use client'
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ZoomIn, ZoomOut, Maximize2, FileDown } from "lucide-react";

export function DiagramSection() {
  const [zoom, setZoom] = useState(100);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 75));
  const handleResetZoom = () => setZoom(100);

  const pdfUrl = "/modelagem_logica_diagrama.pdf";

  return (
    <div className="space-y-6 mb-12">
      <div>
        <h2 className="text-2xl font-semibold mb-2">2. MODELAGEM LÓGICA DO BANCO DE DADOS</h2>
        <p className="text-muted-foreground text-sm">
          Arquitetura visual do esquema relacional, demonstrando tabelas, chaves primárias, estrangeiras e heranças polimórficas.
        </p>
      </div>

      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <div className="space-y-1">
            <CardTitle className="text-base flex items-center gap-2">
              Diagrama Entidade-Relacionamento (DER)
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="secondary">PDF Integrado</Badge>
              <Badge variant="outline">Zoom Atual: {zoom}%</Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleZoomOut} disabled={zoom <= 75} title="Diminuir Zoom">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleZoomIn} disabled={zoom >= 200} title="Aumentar Zoom">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleResetZoom} title="Resetar para o tamanho padrão">
              100%
            </Button>
            <a href={pdfUrl} download="modelagem_logica_turismo.pdf">
              <Button variant="default" size="sm" className="gap-2">
                <FileDown className="h-4 w-4" /> Baixar PDF
              </Button>
            </a>
          </div>
        </CardHeader>

        <CardContent className="p-0 bg-zinc-900 overflow-auto flex justify-center items-start" style={{ height: "650px" }}>
          <div 
            className="transition-all duration-200 ease-in-out origin-top p-4 w-full h-full"
            style={{ 
              transform: `scale(${zoom / 100})`, 
              width: zoom > 100 ? `${zoom}%` : "100%",
              height: zoom > 100 ? `${zoom}%` : "100%"
            }}
          >
            <object
              data={pdfUrl}
              type="application/pdf"
              className="w-full h-full rounded-md shadow-lg border border-zinc-800"
            >
              <div className="flex flex-col items-center justify-center h-full text-zinc-400 p-6 text-center">
                <p className="mb-4">Seu navegador não possui um plugin nativo para visualizar PDFs diretamente.</p>
                <a href={pdfUrl} download>
                  <Button variant="secondary">Baixar Arquivo da Modelagem</Button>
                </a>
              </div>
            </object>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}