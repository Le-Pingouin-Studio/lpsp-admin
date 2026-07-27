"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getColors, createColor, updateColor, deleteColor, Color } from "@/lib/api";
import { ColorFormModal } from "@/components/colores/ColorFormModal";

export default function ColorsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingColor, setEditingColor] = useState<Color | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const queryClient = useQueryClient();

  const { data: colors = [], isLoading } = useQuery({
    queryKey: ['colors'],
    queryFn: getColors,
  });

  const createMutation = useMutation({
    mutationFn: createColor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colors'] });
      setIsDialogOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateColor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colors'] });
      setIsDialogOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteColor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colors'] });
    },
  });

  const handleOpenNew = () => {
    setEditingColor(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (color: Color) => {
    setEditingColor(color);
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: any) => {
    if (editingColor) {
      updateMutation.mutate({ id: editingColor.colorId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const filteredColors = colors.filter(c => c.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Gestión de Colores</h1>
        <p className="text-muted-foreground mt-1">Gestione los colores disponibles para los filamentos.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Buscar color..." 
              className="pl-9 w-[250px]" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button onClick={handleOpenNew} className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 gap-2">
            <Plus className="h-4 w-4" /> Agregar Color
          </Button>
        </CardHeader>
        <div className="border-t">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="text-xs font-bold uppercase w-16 text-center">COLOR</TableHead>
                <TableHead className="text-xs font-bold uppercase">NOMBRE</TableHead>
                <TableHead className="text-xs font-bold uppercase">HEX CODE</TableHead>
                <TableHead className="text-xs font-bold uppercase">PANTONE</TableHead>
                <TableHead className="text-xs font-bold uppercase text-right">ACCIONES</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Cargando colores...</TableCell>
                </TableRow>
              ) : filteredColors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No hay colores registrados.</TableCell>
                </TableRow>
              ) : filteredColors.map((color) => (
                <TableRow key={color.colorId}>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full border border-border shadow-sm" style={{ backgroundColor: color.hexCode }} title={color.nombre} />
                    </div>
                  </TableCell>
                  <TableCell className="font-bold">{color.nombre}</TableCell>
                  <TableCell className="text-muted-foreground font-mono uppercase">{color.hexCode}</TableCell>
                  <TableCell className="font-medium">{color.pantone || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => handleOpenEdit(color)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => {
                          if (confirm(`¿Estás seguro de que quieres eliminar el color ${color.nombre}?`)) {
                            deleteMutation.mutate(color.colorId);
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
      
      <ColorFormModal 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmit}
        isPending={createMutation.isPending || updateMutation.isPending}
        color={editingColor}
      />
    </div>
  );
}
