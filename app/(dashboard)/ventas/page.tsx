"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Download, Filter, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";

const mockSales = [
  { id: "ORD-2026-081", date: "2026-06-20", client: "WhatsApp - +54 9 11 1234-5678", items: "1x Soporte VESA, 2x Ganchos", total: 4500.00, status: "COMPLETADO" },
  { id: "ORD-2026-082", date: "2026-06-20", client: "WhatsApp - +54 9 11 8765-4321", items: "1x Maceta Groot", total: 2800.00, status: "PENDIENTE PAGO" },
  { id: "ORD-2026-083", date: "2026-06-19", client: "WhatsApp - +54 9 11 5555-4444", items: "4x Llaveros Logo", total: 1200.00, status: "EN PRODUCCIÓN" },
  { id: "ORD-2026-084", date: "2026-06-18", client: "WhatsApp - +54 9 11 3333-2222", items: "1x Figura Personalizada", total: 15000.00, status: "COMPLETADO" },
];

export default function SalesPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Historial de Ventas</h1>
          <p className="text-muted-foreground mt-1">Registro de órdenes de compra (Solo lectura - Ventas por WhatsApp).</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 gap-4">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Buscar orden..." className="pl-9 w-[250px]" />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" /> Filtro
            </Button>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Exportar a Excel
          </Button>
        </CardHeader>
        <div className="border-t">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="text-xs font-bold uppercase">Nº ORDEN</TableHead>
                <TableHead className="text-xs font-bold uppercase">FECHA</TableHead>
                <TableHead className="text-xs font-bold uppercase">CLIENTE / CANAL</TableHead>
                <TableHead className="text-xs font-bold uppercase w-[300px]">DETALLE ITEMS</TableHead>
                <TableHead className="text-xs font-bold uppercase text-right">TOTAL</TableHead>
                <TableHead className="text-xs font-bold uppercase text-center">ESTADO</TableHead>
                <TableHead className="text-xs font-bold uppercase text-right">ACCIÓN</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium text-xs">{sale.id}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{sale.date}</TableCell>
                  <TableCell className="font-medium text-sm">{sale.client}</TableCell>
                  <TableCell className="text-muted-foreground text-sm truncate max-w-[300px]">{sale.items}</TableCell>
                  <TableCell className="text-right font-bold">${sale.total.toFixed(2)}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={
                      sale.status === "COMPLETADO" ? "default" : 
                      sale.status === "PENDIENTE PAGO" ? "destructive" : "secondary"
                    } className={
                      sale.status === "COMPLETADO" ? "bg-primary/10 text-primary hover:bg-primary/20" : 
                      sale.status === "EN PRODUCCIÓN" ? "bg-sidebar-primary/20 text-sidebar-primary hover:bg-sidebar-primary/30" : ""
                    }>
                      {sale.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                      <Eye className="h-4 w-4" />
                    </Button>
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
