"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calculator as CalculatorIcon, DollarSign, Clock, Scale, PenTool } from "lucide-react";
import { CALCULATOR_CONSTANTS } from "@/constants/calculator";
import { calculateFinalPrice, CalculatePieceDto, CalculatePieceResponse } from "@/lib/api";

type CalculatorForm = {
  gramosPieza: number | string;
  horasImpresion: number | string;
  minutosImpresion: number | string;
  segundosImpresion: number | string;
  pesoBobinaGramos: number | string;
  precioBobina: number | string;
  horasDiseno: number | string;
  horasPostprocesado: number | string;
  porcentajeMargen: number;
};

export default function CalculatorPage() {
  const [result, setResult] = useState<CalculatePieceResponse | null>(null);

  const { control, watch, handleSubmit, formState: { errors } } = useForm<CalculatorForm>({
    defaultValues: {
      gramosPieza: '',
      horasImpresion: '',
      minutosImpresion: '',
      segundosImpresion: '',
      pesoBobinaGramos: CALCULATOR_CONSTANTS.DEFAULT_PESO_BOBINA,
      precioBobina: CALCULATOR_CONSTANTS.DEFAULT_PRECIO_BOBINA,
      horasDiseno: 0,
      horasPostprocesado: 0,
      porcentajeMargen: CALCULATOR_CONSTANTS.DEFAULT_MARGIN_PERCENTAGE,
    },
  });

  const marginValue = watch("porcentajeMargen");

  const calcMutation = useMutation({
    mutationFn: calculateFinalPrice,
    onSuccess: (data) => {
      setResult(data);
    },
  });

  const onSubmit = (data: CalculatorForm) => {
    const dto: CalculatePieceDto = {
      // Valores dinámicos del formulario
      gramosPieza: Number(data.gramosPieza || 0),
      horasImpresion: Number(data.horasImpresion || 0),
      minutosImpresion: Number(data.minutosImpresion || 0),
      segundosImpresion: Number(data.segundosImpresion || 0),
      pesoBobinaGramos: Number(data.pesoBobinaGramos || 0),
      precioBobina: Number(data.precioBobina || 0),
      horasDiseno: Number(data.horasDiseno || 0),
      horasPostprocesado: Number(data.horasPostprocesado || 0),
      porcentajeMargen: Number(data.porcentajeMargen || 0),
      
      // Valores estáticos inyectados globalmente
      ...CALCULATOR_CONSTANTS.FIXED_BACKEND_VALUES
    };

    calcMutation.mutate(dto);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Calculadora de Precios</h1>
        <p className="text-muted-foreground mt-1">Calcula el presupuesto basado en los tiempos reales de impresión y costos de material.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 items-start">
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <form id="calc-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Material */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2"><Scale className="h-4 w-4 text-primary" /> Detalles de Material</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="gramosPieza" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Gramos Pieza
                    </Label>
                    <Controller
                      name="gramosPieza"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Input type="number" step="0.1" id="gramosPieza" placeholder="Ej: 150" {...field} />
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pesoBobinaGramos" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Peso Bobina (Gr)
                    </Label>
                    <Controller
                      name="pesoBobinaGramos"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Input type="number" id="pesoBobinaGramos" {...field} />
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="precioBobina" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Precio Bobina ($)
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Controller
                        name="precioBobina"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Input type="number" id="precioBobina" className="pl-9" {...field} />
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tiempos de Slicer */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Tiempos del Slicer</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="horasImpresion" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Horas
                    </Label>
                    <Controller
                      name="horasImpresion"
                      control={control}
                      render={({ field }) => (
                        <Input type="number" id="horasImpresion" placeholder="0" {...field} />
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minutosImpresion" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Minutos
                    </Label>
                    <Controller
                      name="minutosImpresion"
                      control={control}
                      render={({ field }) => (
                        <Input type="number" id="minutosImpresion" placeholder="0" {...field} />
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="segundosImpresion" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Segundos
                    </Label>
                    <Controller
                      name="segundosImpresion"
                      control={control}
                      render={({ field }) => (
                        <Input type="number" id="segundosImpresion" placeholder="0" {...field} />
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Mano de Obra */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2"><PenTool className="h-4 w-4 text-primary" /> Mano de Obra Adicional</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="horasDiseno" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Horas de Diseño
                    </Label>
                    <Controller
                      name="horasDiseno"
                      control={control}
                      render={({ field }) => (
                        <Input type="number" step="0.5" id="horasDiseno" placeholder="0" {...field} />
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="horasPostprocesado" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Horas de Post-Procesado
                    </Label>
                    <Controller
                      name="horasPostprocesado"
                      control={control}
                      render={({ field }) => (
                        <Input type="number" step="0.5" id="horasPostprocesado" placeholder="0" {...field} />
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Margen */}
              <div className="space-y-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Margen de Ganancia (%)</Label>
                  <span className="font-bold">{marginValue}%</span>
                </div>
                <Controller
                  name="porcentajeMargen"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Slider 
                      value={[typeof value === 'number' ? value : 0]} 
                      max={200} 
                      step={1} 
                      onValueChange={(val: any) => {
                        const newValue = Array.isArray(val) ? val[0] : val;
                        onChange(newValue);
                      }}
                      className="py-4"
                    />
                  )}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>100%</span>
                  <span>200%</span>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Tarjeta de Resultados */}
        <Card className="bg-primary text-primary-foreground sticky top-6">
          <CardHeader className="items-center pb-2">
            <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
              <CalculatorIcon className="h-6 w-6 text-sidebar-primary" />
            </div>
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-primary-foreground/70">
              Resultado Final
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {result ? (
              <>
                <div className="text-center">
                  <div className="text-5xl font-bold">${result.resumenFinanciero.precioSugeridoVenta}</div>
                  <p className="text-sm text-primary-foreground/70 mt-2">Precio sugerido de venta</p>
                </div>
                
                <Separator className="bg-primary-foreground/20" />
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-primary-foreground/70 uppercase tracking-wider text-xs font-medium">Costo Interno Total</span>
                    <span className="font-medium">${result.resumenFinanciero.costoInternoTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary-foreground/70 uppercase tracking-wider text-xs font-medium">Ganancia Neta</span>
                    <span className="text-sidebar-primary font-bold">${result.resumenFinanciero.gananciaNetaEstimada}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary-foreground/70 uppercase tracking-wider text-xs font-medium">Comisión Plataforma</span>
                    <span className="font-medium">${result.resumenFinanciero.montoComisionPlataforma}</span>
                  </div>
                </div>

                <Separator className="bg-primary-foreground/20" />
                
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary-foreground/50 mb-2">Desglose Detallado</h4>
                  <div className="flex justify-between text-xs">
                    <span className="text-primary-foreground/80">Material + Desperdicio</span>
                    <span>${result.desgloseDetallado.materialConDesperdicio}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-primary-foreground/80">Infraestructura y Fallas</span>
                    <span>${result.desgloseDetallado.infraestructuraYFallas}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-primary-foreground/80">Mano de Obra y Prep.</span>
                    <span>${result.desgloseDetallado.manoObraYPreparacion}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-primary-foreground/80">Packaging</span>
                    <span>${result.desgloseDetallado.packagingFijo}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-10 opacity-70">
                <p>Ingresa los datos y presiona calcular para ver el presupuesto detallado.</p>
              </div>
            )}

            <Button 
              type="submit" 
              form="calc-form" 
              disabled={calcMutation.isPending}
              className="w-full bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 mt-4"
            >
              {calcMutation.isPending ? "Calculando..." : "Calcular Presupuesto"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

