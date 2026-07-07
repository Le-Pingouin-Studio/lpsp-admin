"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";
import { 
  Banknote, Package, AlertTriangle, CheckCircle2, 
  MoreHorizontal, Download, Calendar 
} from "lucide-react";
import { Button } from "@/components/ui/button";

const salesData = [
  { name: "LUN", ganancia: 4000, unidades: 240 },
  { name: "MAR", ganancia: 3000, unidades: 139 },
  { name: "MIÉ", ganancia: 2000, unidades: 980 },
  { name: "JUE", ganancia: 2780, unidades: 390 },
  { name: "VIE", ganancia: 1890, unidades: 480 },
  { name: "SÁB", ganancia: 2390, unidades: 380 },
  { name: "DOM", ganancia: 3490, unidades: 430 },
];

const pendingJobs = [
  { id: "#PR-992", cliente: "AeroSpace Dynamic", material: "Carbon Fiber Nylon", estado: "EN PROGRESO", progreso: 65, restante: "restan 2h 15m" },
  { id: "#PR-993", cliente: "BioMed Solutions", material: "Medical Resin", estado: "EN COLA", progreso: 0, restante: "Pendiente de inicio" },
  { id: "#PR-994", cliente: "Urban Arch Lab", material: "PLA White", estado: "EN PROGRESO", progreso: 92, restante: "restan 12m" },
];

const recentActivity = [
  { id: 1, title: "Pedido #8821 Completado", desc: "Custom Engine Housing (ABS)", time: "HACE 2 MINS", type: "success" },
  { id: 2, title: "Material Bajo: PETG Black", desc: "Printer-X5 (Cluster Alpha)", time: "HACE 15 MINS", type: "alert" },
  { id: 3, title: "Nueva orden recibida", desc: "12x Architectural Brackets", time: "HACE 45 MINS", type: "new" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Resumen del Panel</h1>
          <p className="text-muted-foreground mt-1">Métricas de rendimiento de impresión 3D en tiempo real.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Últimos 30 Días
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Ingresos Totales
            </CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$42,850</div>
            <p className="text-xs text-sidebar-primary mt-1 flex items-center font-medium">
              +12% vs. mes anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Pedidos Activos
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124 <span className="text-base font-normal text-muted-foreground">Trabajos</span></div>
            <p className="text-xs text-muted-foreground mt-1">
              8 impresoras operativas
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-destructive">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-destructive uppercase tracking-wider">
              Alertas
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">3 <span className="text-base font-normal">SKUs Bajo</span></div>
            <p className="text-xs text-muted-foreground mt-1">
              PETG, Resin Clear
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Éxito de Impresión
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.4% <Badge variant="outline" className="ml-2 text-xs border-sidebar-primary text-sidebar-primary">ESTABLE</Badge></div>
            <p className="text-xs text-muted-foreground mt-1">
              En 12 nodos
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4 lg:col-span-5">
          <CardHeader>
            <CardTitle>Rendimiento de Ventas</CardTitle>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} dy={10} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  />
                  <Line type="monotone" dataKey="ganancia" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Actividad Reciente</CardTitle>
            <Button variant="link" className="text-xs text-muted-foreground h-auto p-0">VER TODO</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex gap-4">
                  <div className="mt-0.5">
                    {activity.type === "success" && <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center"><CheckCircle2 className="h-4 w-4 text-primary" /></div>}
                    {activity.type === "alert" && <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center"><AlertTriangle className="h-4 w-4 text-destructive" /></div>}
                    {activity.type === "new" && <div className="h-8 w-8 rounded-full bg-sidebar-primary/10 flex items-center justify-center"><Package className="h-4 w-4 text-sidebar-primary" /></div>}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{activity.desc}</p>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground mt-2 tracking-wider">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle>Trabajos de Impresión Pendientes</CardTitle>
          <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground">8 ACTIVO</Badge>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[100px] text-xs font-bold uppercase">ID DE TRABAJO</TableHead>
                <TableHead className="text-xs font-bold uppercase">CLIENTE</TableHead>
                <TableHead className="text-xs font-bold uppercase">MATERIAL</TableHead>
                <TableHead className="text-xs font-bold uppercase">ESTADO</TableHead>
                <TableHead className="text-xs font-bold uppercase w-[250px]">PROGRESO</TableHead>
                <TableHead className="text-xs font-bold uppercase text-right">ACCIÓN</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.id}</TableCell>
                  <TableCell>{job.cliente}</TableCell>
                  <TableCell>{job.material}</TableCell>
                  <TableCell>
                    <Badge variant={job.estado === "EN PROGRESO" ? "default" : "secondary"} className={job.estado === "EN PROGRESO" ? "bg-muted text-foreground hover:bg-muted" : "bg-orange-100 text-orange-800"}>
                      {job.estado}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1.5">
                      <Progress value={job.progreso} className="h-1.5 w-[60%]" />
                      <div className="flex justify-between w-[60%] text-[10px] text-muted-foreground">
                        <span>{job.progreso}%</span>
                        <span>{job.restante}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
