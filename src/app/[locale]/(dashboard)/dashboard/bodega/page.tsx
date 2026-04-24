'use client';

import { Link } from '@/i18n/navigation';
import { Warehouse, ArrowRight, Package, ArrowsLeftRight } from '@phosphor-icons/react';

const sections = [
  {
    href: '/dashboard/bodega/inventario',
    icon: Package,
    title: 'Inventario',
    description:
      'Consulta y gestiona las mercancías almacenadas, con control de cantidades, valores y estatus.',
  },
  {
    href: '/dashboard/bodega/movimientos',
    icon: ArrowsLeftRight,
    title: 'Movimientos',
    description:
      'Registra entradas, salidas y transferencias de mercancía entre bodegas y zonas.',
  },
];

export default function BodegaPage() {
  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Control de Almacén
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gestión de inventario en bodega fiscal, depósito fiscal y almacén general
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group rounded-lg border p-6 hover:bg-muted/30 transition-colors flex gap-4"
          >
            <section.icon
              size={28}
              className="text-muted-foreground shrink-0 mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-medium">{section.title}</p>
                <ArrowRight
                  size={16}
                  className="text-muted-foreground group-hover:translate-x-1 transition-transform"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {section.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
