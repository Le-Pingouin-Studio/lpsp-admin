"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Filament, CreateFilamentDto, UpdateFilamentDto } from "@/lib/api";

interface FilamentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateFilamentDto | UpdateFilamentDto) => void;
  isPending: boolean;
  filament?: Filament | null;
}

export function FilamentFormModal({ isOpen, onClose, onSubmit, isPending, filament }: FilamentFormModalProps) {
  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      marca: '',
      modelo: 'Básico',
      tipo: 'PLA',
      color: '#FFFFFF',
      cantidadGramos: 1000,
    }
  });

  useEffect(() => {
    if (filament) {
      setValue('marca', filament.marca);
      setValue('modelo', filament.modelo);
      setValue('tipo', filament.tipo);
      setValue('color', filament.color);
      setValue('cantidadGramos', filament.cantidadGramos);
    } else {
      reset({
        marca: '',
        modelo: 'Básico',
        tipo: 'PLA',
        color: '#FFFFFF',
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
            <Label>Color (HEX)</Label>
            <div className="flex gap-2">
              <Controller
                name="color"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Input type="color" className="w-12 h-10 p-1 cursor-pointer" {...field} />
                )}
              />
              <Controller
                name="color"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Input className="flex-1 uppercase font-mono" {...field} placeholder="#FFFFFF" />
                )}
              />
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
