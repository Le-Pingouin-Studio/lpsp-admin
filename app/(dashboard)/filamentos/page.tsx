"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFilaments, createFilament, updateFilament, deleteFilament, Filament } from "@/lib/api";
import { FilamentFormModal } from "@/components/filamentos/FilamentFormModal";

export default function FilamentsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFilament, setEditingFilament] = useState<Filament | null>(null);
  
  const queryClient = useQueryClient();

  const { data: filaments = [], isLoading } = useQuery({
    queryKey: ['filaments'],
    queryFn: getFilaments,
  });

  const createMutation = useMutation({
    mutationFn: createFilament,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filaments'] });
      setIsDialogOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateFilament(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filaments'] });
      setIsDialogOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFilament,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filaments'] });
    },
  });

  const handleOpenNew = () => {
    setEditingFilament(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (filament: Filament) => {
    setEditingFilament(filament);
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: any) => {
    if (editingFilament) {
      updateMutation.mutate({ id: editingFilament.filamentId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Inventario de Filamentos</h1>
        <p className="text-muted-foreground mt-1">Gestione los materiales disponibles y sus cantidades.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar filamento..." className="pl-9 w-[250px]" />
          </div>
          
          <Button onClick={handleOpenNew} className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 gap-2">
            <Plus className="h-4 w-4" /> Agregar Filamento
          </Button>
        </CardHeader>
        <div className="border-t">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="text-xs font-bold uppercase">MARCA</TableHead>
                <TableHead className="text-xs font-bold uppercase">MODELO</TableHead>
                <TableHead className="text-xs font-bold uppercase">TIPO</TableHead>
                <TableHead className="text-xs font-bold uppercase text-center">COLOR</TableHead>
                <TableHead className="text-xs font-bold uppercase text-center">STOCK (g)</TableHead>
                <TableHead className="text-xs font-bold uppercase text-right">ACCIONES</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Cargando filamentos...</TableCell>
                </TableRow>
              ) : filaments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No hay filamentos registrados.</TableCell>
                </TableRow>
              ) : filaments.map((fil) => (
                <TableRow key={fil.filamentId}>
                  <TableCell className="font-bold">{fil.marca}</TableCell>
                  <TableCell className="text-muted-foreground">{fil.modelo}</TableCell>
                  <TableCell className="font-medium">{fil.tipo}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap items-center justify-center gap-1">
                      {(!fil.colors || fil.colors.length === 0) && <span className="text-xs text-muted-foreground">Sin colores</span>}
                      {fil.colors?.map(c => (
                        <div key={c.colorId} className="w-5 h-5 rounded-full border border-border shadow-sm flex-shrink-0" style={{ backgroundColor: c.hexCode }} title={`${c.nombre} (${c.hexCode})`} />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    <span className={fil.cantidadGramos < 100 ? "text-destructive font-bold" : ""}>
                      {fil.cantidadGramos}g
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => handleOpenEdit(fil)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => {
                          if (confirm(`¿Estás seguro de que quieres eliminar el filamento ${fil.marca} - ${fil.colors?.map(c => c.name).join(', ') ?? ''}?`)) {
                            deleteMutation.mutate(fil.filamentId);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
      
      <FilamentFormModal 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmit}
        isPending={createMutation.isPending || updateMutation.isPending}
        filament={editingFilament}
      />
    </div>
  );
}
