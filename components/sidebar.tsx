"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Archive,
  CreditCard,
  Calculator,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Productos", href: "/productos", icon: Package },
  { name: "Categorías", href: "/categorias", icon: Archive },
  // { name: "Inventario", href: "/inventario", icon: Archive },
  // { name: "Ventas", href: "/ventas", icon: CreditCard },
  { name: "Calculadora", href: "/calculadora", icon: Calculator },
  // { name: "Configuración", href: "/configuracion", icon: Settings },
];

import isologo from "../public/isologo.png";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 flex items-center justify-center overflow-hidden shrink-0">
            <Image src={isologo} alt="Logo" width={40} height={40} className="object-contain" priority />
          </div>
          <h1 className="text-xl font-bold font-heading text-white leading-tight">Le Pingouin Studio</h1>
        </div>
        <p className="text-sm text-sidebar-primary/80 mt-2 uppercase tracking-wider font-semibold">Admin Control</p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary/10 text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "text-sidebar-primary" : "")} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
