"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Color, CreateColorDto, UpdateColorDto } from "@/lib/api";

interface ColorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateColorDto | UpdateColorDto) => void;
  isPending: boolean;
  color?: Color | null;
}

export function ColorFormModal({ isOpen, onClose, onSubmit, isPending, color }: ColorFormModalProps) {
  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      nombre: '',
      hexCode: '#FFFFFF',
      pantone: '',
    }
  });

  useEffect(() => {
    if (color) {
      setValue('nombre', color.nombre);
      setValue('hexCode', color.hexCode);
      setValue('pantone', color.pantone || '');
    } else {
      reset({
        nombre: '',
        hexCode: '#FFFFFF',
        pantone: '',
      });
    }
  }, [color, setValue, reset, isOpen]);

  const onFormSubmit = (data: any) => {
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{color ? 'Editar Color' : 'Nuevo Color'}</DialogTitle>
          <DialogDescription className="sr-only">
            Formulario para {color ? 'editar' : 'crear'} un color.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Nombre</Label>
            <Controller
              name="nombre"
              control={control}
              rules={{ required: true }}
              render={({ field }) => <Input {...field} placeholder="Ej. Rojo Carmesí" />}
            />
          </div>
          <div className="space-y-2">
            <Label>Código Hexadecimal</Label>
            <div className="flex gap-2">
              <Controller
                name="hexCode"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Input type="color" className="w-12 h-10 p-1 cursor-pointer" {...field} />
                )}
              />
              <Controller
                name="hexCode"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Input className="flex-1 uppercase font-mono" {...field} placeholder="#FFFFFF" />
                )}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Pantone (Opcional)</Label>
            <Controller
              name="pantone"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Ej. 185 C" />}
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
