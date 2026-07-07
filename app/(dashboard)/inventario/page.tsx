"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, MoreVertical, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";

const mockInventory = [
  { id: "MAT-CF-009", name: "Carbon Fiber Nylon", category: "Filament", stock: "18.5 kg", threshold: "5.0 kg", status: "IN STOCK" },
  { id: "MAT-PLA-122", name: "PLA Matte White", category: "Filament", stock: "2.1 kg", threshold: "10.0 kg", status: "LOW STOCK" },
  { id: "MAT-RES-404", name: "Flexible Resin 80A", category: "Liquid Resin", stock: "5.8 L", threshold: "2.0 L", status: "IN STOCK" },
  { id: "MAT-PET-088", name: "PETG Industrial Clear", category: "Filament", stock: "0.0 kg", threshold: "3.0 kg", status: "CRITICAL" },
  { id: "MAT-RES-911", name: "Tough Resin V4", category: "Liquid Resin", stock: "12.4 L", threshold: "5.0 L", status: "IN STOCK" },
];

export default function InventoryPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Control de Inventario</h1>
          <p className="text-muted-foreground mt-1">Monitorea los niveles de material de fabricación aditiva.</p>
        </div>
        <div className="flex gap-4">
          <Card className="rounded-md">
            <CardContent className="p-3 px-6 text-center">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Stock</div>
              <div className="text-lg font-bold">142.5 <span className="text-xs font-normal">kg</span></div>
            </CardContent>
          </Card>
          <Card className="rounded-md border-sidebar-primary/30 bg-sidebar-primary/5">
            <CardContent className="p-3 px-6 text-center">
              <div className="text-[10px] font-bold uppercase tracking-wider text-sidebar-primary">Low Stock</div>
              <div className="text-lg font-bold text-sidebar-primary flex items-center justify-center gap-1">
                <AlertTriangle className="h-4 w-4" /> 3 <span className="text-xs font-normal text-muted-foreground">items</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 gap-4">
          <CardTitle>Registro de Stock de Materiales</CardTitle>
          <div className="flex gap-3">
            <Button variant="outline" className="text-xs h-8">EXPORTAR CSV</Button>
            <Button variant="outline" className="text-xs h-8">FILTRAR</Button>
          </div>
        </CardHeader>
        <div className="border-t">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="text-xs font-bold uppercase">ID MATERIAL</TableHead>
                <TableHead className="text-xs font-bold uppercase w-[250px]">PRODUCTO</TableHead>
                <TableHead className="text-xs font-bold uppercase">CATEGORÍA</TableHead>
                <TableHead className="text-xs font-bold uppercase">NIVEL STOCK</TableHead>
                <TableHead className="text-xs font-bold uppercase">UMBRAL</TableHead>
                <TableHead className="text-xs font-bold uppercase">ESTADO</TableHead>
                <TableHead className="text-xs font-bold uppercase text-right">ACCIÓN</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{item.id}</TableCell>
                  <TableCell className={item.status === "CRITICAL" ? "text-destructive font-medium" : "font-medium"}>
                    {item.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.category}</TableCell>
                  <TableCell className={
                    item.status === "LOW STOCK" ? "text-sidebar-primary font-bold" : 
                    item.status === "CRITICAL" ? "text-destructive font-bold" : ""
                  }>
                    {item.stock}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.threshold}</TableCell>
                  <TableCell>
                    <Badge variant={
                      item.status === "IN STOCK" ? "outline" : 
                      item.status === "CRITICAL" ? "destructive" : "secondary"
                    } className={
                      item.status === "IN STOCK" ? "bg-muted border-none text-foreground" : 
                      item.status === "LOW STOCK" ? "bg-sidebar-primary/20 text-sidebar-primary hover:bg-sidebar-primary/30" : ""
                    }>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {item.status === "CRITICAL" ? (
                      <Button variant="destructive" size="sm" className="h-8 text-xs">
                        REORDENAR
                      </Button>
                    ) : (
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
