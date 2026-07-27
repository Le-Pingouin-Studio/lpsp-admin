"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Filament, CreateFilamentDto, UpdateFilamentDto, getColors, Color } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

interface FilamentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateFilamentDto | UpdateFilamentDto) => void;
  isPending: boolean;
  filament?: Filament | null;
}

export function FilamentFormModal({ isOpen, onClose, onSubmit, isPending, filament }: FilamentFormModalProps) {
  const { data: availableColors = [] } = useQuery({
    queryKey: ['colors'],
    queryFn: getColors,
  });

  const { control, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      marca: '',
      modelo: 'Básico',
      tipo: 'PLA',
      colorIds: [] as string[],
      cantidadGramos: 1000,
    }
  });

  const selectedColorIds = watch('colorIds');

  useEffect(() => {
    if (filament) {
      setValue('marca', filament.marca);
      setValue('modelo', filament.modelo);
      setValue('tipo', filament.tipo);
      setValue('colorIds', (filament.colors || []).map(c => c.colorId));
      setValue('cantidadGramos', filament.cantidadGramos);
    } else {
      reset({
        marca: '',
        modelo: 'Básico',
        tipo: 'PLA',
        colorIds: [],
        cantidadGramos: 1000,
      });
    }
  }, [filament, setValue, reset, isOpen]);

  const onFormSubmit = (data: any) => {
    onSubmit({
      ...data,
      cantidadGramos: Number(data.cantidadGramos)
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{filament ? 'Editar Filamento' : 'Nuevo Filamento'}</DialogTitle>
          <DialogDescription className="sr-only">
            Formulario para {filament ? 'editar' : 'crear'} un filamento.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Marca</Label>
            <Controller
              name="marca"
              control={control}
              rules={{ required: true }}
              render={({ field }) => <Input {...field} placeholder="Ej. Grilon3" />}
            />
          </div>
          <div className="space-y-2">
            <Label>Modelo</Label>
            <Controller
              name="modelo"
              control={control}
              rules={{ required: true }}
              render={({ field }) => <Input {...field} placeholder="Ej. Básico, Silk" />}
            />
          </div>
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Controller
              name="tipo"
              control={control}
              rules={{ required: true }}
              render={({ field }) => <Input {...field} placeholder="Ej. PLA, PETG" />}
            />
          </div>
          <div className="space-y-2">
            <Label>Colores Disponibles</Label>
            <div className="flex flex-wrap gap-2 p-3 border rounded-md max-h-40 overflow-y-auto">
              {availableColors.length === 0 && <span className="text-sm text-muted-foreground">No hay colores registrados. Cree colores primero.</span>}
              {availableColors.map((c: Color) => {
                const isSelected = selectedColorIds.includes(c.colorId);
                return (
                  <button
                    type="button"
                    key={c.colorId}
                    onClick={() => {
                      if (isSelected) {
                        setValue('colorIds', selectedColorIds.filter(id => id !== c.colorId));
                      } else {
                        setValue('colorIds', [...selectedColorIds, c.colorId]);
                      }
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 border rounded-full text-sm transition-all ${isSelected ? 'border-primary bg-primary/10 ring-1 ring-primary' : 'border-border hover:bg-muted'}`}
                  >
                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: c.hexCode }} />
                    {c.nombre}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Cantidad en Gramos</Label>
            <Controller
              name="cantidadGramos"
              control={control}
              rules={{ required: true, min: 0 }}
              render={({ field }) => <Input type="number" {...field} min={0} />}
            />
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
