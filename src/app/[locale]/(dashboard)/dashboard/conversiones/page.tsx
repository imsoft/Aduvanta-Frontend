'use client';

import { useState, useCallback } from 'react';
import { ArrowsLeftRight, Info } from '@phosphor-icons/react';
import { useMarketRates, useFixRate } from '@/features/exchange-rates/hooks/use-exchange-rates';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// ─── Types ──────────────────────────────────────────────────────────────────

interface Unit {
  id: string;
  label: string;
  symbol: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}

interface Category {
  id: string;
  label: string;
  emoji: string;
  units: Unit[];
}

// ─── Conversion data ─────────────────────────────────────────────────────────

const linear =
  (factor: number): Pick<Unit, 'toBase' | 'fromBase'> => ({
    toBase: (v) => v * factor,
    fromBase: (v) => v / factor,
  });

const CATEGORIES: Category[] = [
  {
    id: 'masa',
    label: 'Masa / Peso',
    emoji: '⚖️',
    units: [
      { id: 'kg', label: 'Kilogramo', symbol: 'kg', ...linear(1) },
      { id: 'g', label: 'Gramo', symbol: 'g', ...linear(0.001) },
      { id: 'mg', label: 'Miligramo', symbol: 'mg', ...linear(1e-6) },
      { id: 'ug', label: 'Microgramo', symbol: 'µg', ...linear(1e-9) },
      { id: 't', label: 'Tonelada métrica', symbol: 't', ...linear(1000) },
      { id: 'ton_larga', label: 'Tonelada larga (UK)', symbol: 'LT', ...linear(1016.047) },
      { id: 'ton_corta', label: 'Tonelada corta (US)', symbol: 'ST', ...linear(907.185) },
      { id: 'lb', label: 'Libra', symbol: 'lb', ...linear(0.453592) },
      { id: 'oz', label: 'Onza', symbol: 'oz', ...linear(0.0283495) },
      { id: 'gr', label: 'Grano', symbol: 'gr', ...linear(0.0000647989) },
      { id: 'quintal', label: 'Quintal métrico', symbol: 'q', ...linear(100) },
      { id: 'arroba', label: 'Arroba', symbol: '@', ...linear(11.5) },
      { id: 'stone', label: 'Stone', symbol: 'st', ...linear(6.35029) },
    ],
  },
  {
    id: 'longitud',
    label: 'Longitud',
    emoji: '📏',
    units: [
      { id: 'm', label: 'Metro', symbol: 'm', ...linear(1) },
      { id: 'km', label: 'Kilómetro', symbol: 'km', ...linear(1000) },
      { id: 'cm', label: 'Centímetro', symbol: 'cm', ...linear(0.01) },
      { id: 'mm', label: 'Milímetro', symbol: 'mm', ...linear(0.001) },
      { id: 'um', label: 'Micrómetro', symbol: 'µm', ...linear(1e-6) },
      { id: 'nm_len', label: 'Nanómetro', symbol: 'nm', ...linear(1e-9) },
      { id: 'mi', label: 'Milla terrestre', symbol: 'mi', ...linear(1609.344) },
      { id: 'nmi', label: 'Milla náutica', symbol: 'nmi', ...linear(1852) },
      { id: 'yd', label: 'Yarda', symbol: 'yd', ...linear(0.9144) },
      { id: 'ft', label: 'Pie', symbol: 'ft', ...linear(0.3048) },
      { id: 'in', label: 'Pulgada', symbol: 'in', ...linear(0.0254) },
      { id: 'fur', label: 'Furlong', symbol: 'fur', ...linear(201.168) },
      { id: 'ly', label: 'Año luz', symbol: 'ly', ...linear(9.461e15) },
      { id: 'au', label: 'Unidad astronómica', symbol: 'AU', ...linear(1.496e11) },
    ],
  },
  {
    id: 'volumen',
    label: 'Volumen',
    emoji: '🧴',
    units: [
      { id: 'l', label: 'Litro', symbol: 'L', ...linear(1) },
      { id: 'ml', label: 'Mililitro', symbol: 'mL', ...linear(0.001) },
      { id: 'cl', label: 'Centilitro', symbol: 'cL', ...linear(0.01) },
      { id: 'dl', label: 'Decilitro', symbol: 'dL', ...linear(0.1) },
      { id: 'm3', label: 'Metro cúbico', symbol: 'm³', ...linear(1000) },
      { id: 'cm3', label: 'Centímetro cúbico', symbol: 'cm³', ...linear(0.001) },
      { id: 'mm3', label: 'Milímetro cúbico', symbol: 'mm³', ...linear(1e-6) },
      { id: 'gal_us', label: 'Galón US', symbol: 'gal (US)', ...linear(3.78541) },
      { id: 'gal_uk', label: 'Galón UK', symbol: 'gal (UK)', ...linear(4.54609) },
      { id: 'qt_us', label: 'Cuarto US', symbol: 'qt', ...linear(0.946353) },
      { id: 'pt_us', label: 'Pinta US', symbol: 'pt', ...linear(0.473176) },
      { id: 'cup', label: 'Taza US', symbol: 'cup', ...linear(0.236588) },
      { id: 'floz_us', label: 'Onza líquida US', symbol: 'fl oz', ...linear(0.0295735) },
      { id: 'ft3', label: 'Pie cúbico', symbol: 'ft³', ...linear(28.3168) },
      { id: 'in3', label: 'Pulgada cúbica', symbol: 'in³', ...linear(0.0163871) },
      { id: 'bbl_oil', label: 'Barril (petróleo)', symbol: 'bbl', ...linear(158.987) },
      { id: 'bbl_beer', label: 'Barril (cerveza US)', symbol: 'bbl (beer)', ...linear(117.348) },
    ],
  },
  {
    id: 'area',
    label: 'Área',
    emoji: '🗺️',
    units: [
      { id: 'm2', label: 'Metro cuadrado', symbol: 'm²', ...linear(1) },
      { id: 'km2', label: 'Kilómetro cuadrado', symbol: 'km²', ...linear(1e6) },
      { id: 'cm2', label: 'Centímetro cuadrado', symbol: 'cm²', ...linear(0.0001) },
      { id: 'mm2', label: 'Milímetro cuadrado', symbol: 'mm²', ...linear(1e-6) },
      { id: 'ha', label: 'Hectárea', symbol: 'ha', ...linear(10000) },
      { id: 'a', label: 'Área', symbol: 'a', ...linear(100) },
      { id: 'ac', label: 'Acre', symbol: 'ac', ...linear(4046.86) },
      { id: 'mi2', label: 'Milla cuadrada', symbol: 'mi²', ...linear(2.59e6) },
      { id: 'yd2', label: 'Yarda cuadrada', symbol: 'yd²', ...linear(0.836127) },
      { id: 'ft2', label: 'Pie cuadrado', symbol: 'ft²', ...linear(0.092903) },
      { id: 'in2', label: 'Pulgada cuadrada', symbol: 'in²', ...linear(0.00064516) },
    ],
  },
  {
    id: 'temperatura',
    label: 'Temperatura',
    emoji: '🌡️',
    units: [
      {
        id: 'c',
        label: 'Celsius',
        symbol: '°C',
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      {
        id: 'f',
        label: 'Fahrenheit',
        symbol: '°F',
        toBase: (v) => (v - 32) * (5 / 9),
        fromBase: (v) => v * (9 / 5) + 32,
      },
      {
        id: 'k',
        label: 'Kelvin',
        symbol: 'K',
        toBase: (v) => v - 273.15,
        fromBase: (v) => v + 273.15,
      },
      {
        id: 'r',
        label: 'Rankine',
        symbol: '°R',
        toBase: (v) => (v - 491.67) * (5 / 9),
        fromBase: (v) => (v + 273.15) * (9 / 5),
      },
      {
        id: 'reaumur',
        label: 'Réaumur',
        symbol: '°Ré',
        toBase: (v) => v * (5 / 4),
        fromBase: (v) => v * (4 / 5),
      },
    ],
  },
  {
    id: 'velocidad',
    label: 'Velocidad',
    emoji: '💨',
    units: [
      { id: 'ms', label: 'Metro por segundo', symbol: 'm/s', ...linear(1) },
      { id: 'kmh', label: 'Kilómetro por hora', symbol: 'km/h', ...linear(1 / 3.6) },
      { id: 'mph', label: 'Milla por hora', symbol: 'mph', ...linear(0.44704) },
      { id: 'fts', label: 'Pie por segundo', symbol: 'ft/s', ...linear(0.3048) },
      { id: 'kn', label: 'Nudo', symbol: 'kn', ...linear(0.514444) },
      { id: 'mach', label: 'Mach (ISA)', symbol: 'Ma', ...linear(340.29) },
      { id: 'c_light', label: 'Velocidad de la luz', symbol: 'c', ...linear(299792458) },
    ],
  },
  {
    id: 'presion',
    label: 'Presión',
    emoji: '🔵',
    units: [
      { id: 'pa', label: 'Pascal', symbol: 'Pa', ...linear(1) },
      { id: 'kpa', label: 'Kilopascal', symbol: 'kPa', ...linear(1000) },
      { id: 'mpa', label: 'Megapascal', symbol: 'MPa', ...linear(1e6) },
      { id: 'bar', label: 'Bar', symbol: 'bar', ...linear(100000) },
      { id: 'mbar', label: 'Milibar', symbol: 'mbar', ...linear(100) },
      { id: 'atm', label: 'Atmósfera', symbol: 'atm', ...linear(101325) },
      { id: 'psi', label: 'PSI', symbol: 'psi', ...linear(6894.76) },
      { id: 'mmhg', label: 'Milímetro de mercurio', symbol: 'mmHg', ...linear(133.322) },
      { id: 'inhg', label: 'Pulgada de mercurio', symbol: 'inHg', ...linear(3386.39) },
      { id: 'torr', label: 'Torr', symbol: 'Torr', ...linear(133.322) },
    ],
  },
  {
    id: 'energia',
    label: 'Energía',
    emoji: '⚡',
    units: [
      { id: 'j', label: 'Julio', symbol: 'J', ...linear(1) },
      { id: 'kj', label: 'Kilojulio', symbol: 'kJ', ...linear(1000) },
      { id: 'mj', label: 'Megajulio', symbol: 'MJ', ...linear(1e6) },
      { id: 'cal', label: 'Caloría', symbol: 'cal', ...linear(4.184) },
      { id: 'kcal', label: 'Kilocaloría', symbol: 'kcal', ...linear(4184) },
      { id: 'wh', label: 'Vatio hora', symbol: 'Wh', ...linear(3600) },
      { id: 'kwh', label: 'Kilowatt hora', symbol: 'kWh', ...linear(3.6e6) },
      { id: 'ev', label: 'Electronvolt', symbol: 'eV', ...linear(1.602e-19) },
      { id: 'btu', label: 'BTU', symbol: 'BTU', ...linear(1055.06) },
      { id: 'ftlbf', label: 'Pie-libra fuerza', symbol: 'ft·lbf', ...linear(1.35582) },
    ],
  },
  {
    id: 'potencia',
    label: 'Potencia',
    emoji: '🔋',
    units: [
      { id: 'w', label: 'Vatio', symbol: 'W', ...linear(1) },
      { id: 'kw', label: 'Kilovatio', symbol: 'kW', ...linear(1000) },
      { id: 'mw', label: 'Megavatio', symbol: 'MW', ...linear(1e6) },
      { id: 'hp_met', label: 'Caballo de vapor métrico', symbol: 'CV', ...linear(735.499) },
      { id: 'hp_imp', label: 'Horsepower (imperial)', symbol: 'hp', ...linear(745.7) },
      { id: 'btuhr', label: 'BTU/hora', symbol: 'BTU/h', ...linear(0.293071) },
      { id: 'kcalhr', label: 'kcal/hora', symbol: 'kcal/h', ...linear(1.163) },
    ],
  },
  {
    id: 'datos',
    label: 'Datos digitales',
    emoji: '💾',
    units: [
      { id: 'bit', label: 'Bit', symbol: 'bit', ...linear(1) },
      { id: 'byte', label: 'Byte', symbol: 'B', ...linear(8) },
      { id: 'kb', label: 'Kilobyte', symbol: 'KB', ...linear(8 * 1024) },
      { id: 'mb', label: 'Megabyte', symbol: 'MB', ...linear(8 * 1024 ** 2) },
      { id: 'gb', label: 'Gigabyte', symbol: 'GB', ...linear(8 * 1024 ** 3) },
      { id: 'tb', label: 'Terabyte', symbol: 'TB', ...linear(8 * 1024 ** 4) },
      { id: 'pb', label: 'Petabyte', symbol: 'PB', ...linear(8 * 1024 ** 5) },
      { id: 'kbit', label: 'Kilobit', symbol: 'Kbit', ...linear(1024) },
      { id: 'mbit', label: 'Megabit', symbol: 'Mbit', ...linear(1024 ** 2) },
      { id: 'gbit', label: 'Gigabit', symbol: 'Gbit', ...linear(1024 ** 3) },
    ],
  },
  {
    id: 'tiempo',
    label: 'Tiempo',
    emoji: '⏱️',
    units: [
      { id: 's', label: 'Segundo', symbol: 's', ...linear(1) },
      { id: 'ms_t', label: 'Milisegundo', symbol: 'ms', ...linear(0.001) },
      { id: 'us_t', label: 'Microsegundo', symbol: 'µs', ...linear(1e-6) },
      { id: 'ns_t', label: 'Nanosegundo', symbol: 'ns', ...linear(1e-9) },
      { id: 'min', label: 'Minuto', symbol: 'min', ...linear(60) },
      { id: 'h', label: 'Hora', symbol: 'h', ...linear(3600) },
      { id: 'd', label: 'Día', symbol: 'd', ...linear(86400) },
      { id: 'semana', label: 'Semana', symbol: 'sem', ...linear(604800) },
      { id: 'mes', label: 'Mes (30 días)', symbol: 'mes', ...linear(2592000) },
      { id: 'anio', label: 'Año (365 días)', symbol: 'año', ...linear(31536000) },
    ],
  },
  {
    id: 'angulo',
    label: 'Ángulo',
    emoji: '📐',
    units: [
      { id: 'deg', label: 'Grado', symbol: '°', ...linear(1) },
      { id: 'rad', label: 'Radián', symbol: 'rad', ...linear(180 / Math.PI) },
      { id: 'grad', label: 'Gradián', symbol: 'grad', ...linear(0.9) },
      { id: 'arcmin', label: 'Minuto de arco', symbol: "'", ...linear(1 / 60) },
      { id: 'arcsec', label: 'Segundo de arco', symbol: '"', ...linear(1 / 3600) },
      { id: 'turn', label: 'Vuelta completa', symbol: 'vuelta', ...linear(360) },
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(value: number, decimals = 8): string {
  if (!isFinite(value)) return '—';
  if (Math.abs(value) === 0) return '0';
  if (Math.abs(value) >= 1e15 || (Math.abs(value) < 1e-6 && value !== 0)) {
    return value.toExponential(6);
  }
  const s = parseFloat(value.toPrecision(decimals)).toString();
  return s;
}

function convert(value: number, from: Unit, to: Unit): number {
  const base = from.toBase(value);
  return to.fromBase(base);
}

// ─── Component ───────────────────────────────────────────────────────────────

// Priority currencies to show first in the currency converter
const PRIORITY_CURRENCIES = ['MXN', 'USD', 'EUR', 'GBP', 'CAD', 'JPY', 'CNY', 'CHF', 'AUD', 'BRL', 'KRW', 'SGD', 'HKD', 'NOK', 'SEK'];

function fmtCurrency(value: number, decimals = 4): string {
  if (!isFinite(value)) return '—';
  return parseFloat(value.toFixed(decimals)).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: decimals });
}

export default function ConversionesPag() {
  const [activeCat, setActiveCat] = useState<string>('masa');
  const [fromUnitId, setFromUnitId] = useState<string>('kg');
  const [toUnitId, setToUnitId] = useState<string>('lb');
  const [inputValue, setInputValue] = useState<string>('1');

  // Currency state
  const [currencyBase, setCurrencyBase] = useState<string>('MXN');
  const [currencyTarget, setCurrencyTarget] = useState<string>('USD');
  const [currencyAmount, setCurrencyAmount] = useState<string>('1');
  const { data: marketRates, isLoading: loadingMarket, error: marketError } = useMarketRates(currencyBase);
  const { data: fixRate, isLoading: loadingFix } = useFixRate();

  const category = CATEGORIES.find((c) => c.id === activeCat)!;

  const handleCatChange = (catId: string) => {
    const cat = CATEGORIES.find((c) => c.id === catId)!;
    setActiveCat(catId);
    setFromUnitId(cat.units[0].id);
    setToUnitId(cat.units[1]?.id ?? cat.units[0].id);
    setInputValue('1');
  };

  const fromUnit = category.units.find((u) => u.id === fromUnitId) ?? category.units[0];
  const toUnit = category.units.find((u) => u.id === toUnitId) ?? category.units[1];

  const numInput = parseFloat(inputValue);
  const result = isNaN(numInput) ? null : convert(numInput, fromUnit, toUnit);

  const handleSwap = useCallback(() => {
    setFromUnitId(toUnitId);
    setToUnitId(fromUnitId);
    if (result !== null) setInputValue(fmt(result));
  }, [fromUnitId, toUnitId, result]);

  // All conversions from the input value
  const allConversions =
    result !== null
      ? category.units
          .filter((u) => u.id !== fromUnit.id)
          .map((u) => ({ unit: u, value: convert(numInput, fromUnit, u) }))
      : [];

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Conversiones</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Conversor universal de unidades — masa, longitud, volumen, temperatura y más
        </p>
      </div>

      {/* Category selector */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCatChange(cat.id)}
            className={cn(
              'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
              activeCat === cat.id
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground',
            )}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Main converter */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* From */}
          <div className="flex-1 w-full space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              De
            </Label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="text-lg font-mono flex-1"
                placeholder="0"
              />
              <Select value={fromUnitId} onValueChange={setFromUnitId}>
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{category.label}</SelectLabel>
                    {category.units.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.label} ({u.symbol})
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">
              {fromUnit.label} · <span className="font-mono">{fromUnit.symbol}</span>
            </p>
          </div>

          {/* Swap button */}
          <button
            onClick={handleSwap}
            className="mt-2 sm:mt-6 rounded-full border p-2.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors shrink-0"
            aria-label="Intercambiar unidades"
          >
            <ArrowsLeftRight size={18} weight="bold" />
          </button>

          {/* To */}
          <div className="flex-1 w-full space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              A
            </Label>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center rounded-md border bg-muted/40 px-3 font-mono text-lg select-all min-h-[2.5rem] overflow-x-auto whitespace-nowrap">
                {result !== null ? fmt(result) : '—'}
              </div>
              <Select value={toUnitId} onValueChange={setToUnitId}>
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{category.label}</SelectLabel>
                    {category.units.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.label} ({u.symbol})
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">
              {toUnit.label} · <span className="font-mono">{toUnit.symbol}</span>
            </p>
          </div>
        </div>

        {/* Formula badge */}
        {result !== null && (
          <div className="mt-4 rounded-lg bg-muted/40 px-4 py-2.5 text-sm font-mono text-center">
            <span className="text-foreground font-semibold">{inputValue}</span>
            <span className="mx-1.5 text-muted-foreground">{fromUnit.symbol}</span>
            <span className="text-muted-foreground mx-2">=</span>
            <span className="text-primary font-semibold">{fmt(result)}</span>
            <span className="ml-1.5 text-muted-foreground">{toUnit.symbol}</span>
          </div>
        )}
      </div>

      {/* Reference table — all units */}
      {result !== null && allConversions.length > 0 && (
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b bg-muted/20">
            <p className="text-sm font-medium">
              Tabla de referencia —{' '}
              <span className="text-muted-foreground font-normal">
                {inputValue} {fromUnit.symbol} en todas las unidades
              </span>
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 divide-x divide-y">
            {/* Highlight the source */}
            <div className="px-4 py-3 bg-primary/5 border-primary/20">
              <p className="text-[11px] font-medium uppercase tracking-wide text-primary truncate">
                {fromUnit.label}
              </p>
              <p className="mt-0.5 font-mono text-base font-semibold text-foreground truncate">
                {inputValue}
              </p>
              <Badge variant="secondary" className="mt-1 text-[10px] h-4">
                {fromUnit.symbol}
              </Badge>
            </div>
            {allConversions.map(({ unit, value }) => (
              <div
                key={unit.id}
                className={cn(
                  'px-4 py-3 hover:bg-muted/30 transition-colors cursor-default',
                  unit.id === toUnit.id && 'bg-accent/30',
                )}
              >
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground truncate">
                  {unit.label}
                </p>
                <p className="mt-0.5 font-mono text-base font-semibold text-foreground truncate">
                  {fmt(value)}
                </p>
                <Badge variant="outline" className="mt-1 text-[10px] h-4">
                  {unit.symbol}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick reference cards */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b bg-muted/20">
          <p className="text-sm font-medium">Equivalencias frecuentes en comercio exterior</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 divide-y sm:divide-x sm:divide-y-0">
          {[
            { label: 'Peso', items: ['1 t = 1 000 kg', '1 kg = 2.2046 lb', '1 lb = 453.59 g', '1 oz = 28.35 g', '1 quintal = 100 kg'] },
            { label: 'Volumen', items: ['1 m³ = 1 000 L', '1 gal US = 3.785 L', '1 bbl = 158.987 L', '1 ft³ = 28.317 L', '1 gal UK = 4.546 L'] },
            { label: 'Longitud', items: ['1 m = 3.2808 ft', '1 km = 0.6214 mi', '1 in = 2.54 cm', '1 yd = 91.44 cm', '1 nmi = 1 852 m'] },
          ].map((card) => (
            <div key={card.label} className="px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                {card.label}
              </p>
              <ul className="space-y-1">
                {card.items.map((item) => (
                  <li key={item} className="text-sm font-mono text-foreground/80">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Currency section ─────────────────────────────────────── */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">💱 Tipos de cambio</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Tasas de mercado (ExchangeRate-API) y tipo oficial SAT (Banco de México FIX)
          </p>
        </div>

        {/* FIX card */}
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b bg-amber-50 dark:bg-amber-950/20 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                Tipo de cambio FIX — Banco de México
              </span>
              <Badge variant="outline" className="text-[10px] border-amber-400 text-amber-700 dark:text-amber-400">
                Obligatorio para pedimentos (Art. 20 CFF)
              </Badge>
            </div>
            {fixRate && (
              <span className="text-xs text-muted-foreground">
                Publicado: {fixRate.date}
              </span>
            )}
          </div>
          <div className="px-5 py-4">
            {loadingFix && (
              <div className="h-8 w-48 rounded bg-muted/40 animate-pulse" />
            )}
            {!loadingFix && fixRate && (
              <div className="flex flex-wrap items-end gap-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">1 USD =</p>
                  <p className="font-mono text-3xl font-bold text-foreground">
                    {fmtCurrency(fixRate.usdMxn, 4)}
                    <span className="ml-2 text-base font-normal text-muted-foreground">MXN</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">1 MXN =</p>
                  <p className="font-mono text-xl font-semibold text-foreground">
                    {fmtCurrency(1 / fixRate.usdMxn, 6)}
                    <span className="ml-1.5 text-sm font-normal text-muted-foreground">USD</span>
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-auto">
                  <Info size={13} />
                  <span>{fixRate.source}</span>
                </div>
              </div>
            )}
            {!loadingFix && !fixRate && (
              <p className="text-sm text-muted-foreground">
                Configura <code className="text-xs bg-muted px-1 rounded">BANXICO_TOKEN</code> en el backend para ver el FIX en tiempo real.
              </p>
            )}
          </div>
        </div>

        {/* Market rates converter */}
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b bg-muted/20 flex items-center justify-between">
            <p className="text-sm font-medium">Conversor de monedas — tasas de mercado</p>
            {marketRates && (
              <span className="text-xs text-muted-foreground">
                Base: {marketRates.base} · {marketRates.source === 'cache' ? '📦 caché' : '🌐 en vivo'} · {new Date(marketRates.updatedAt).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })}
              </span>
            )}
          </div>
          <div className="p-5 space-y-4">
            {/* Currency converter inputs */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1 w-full space-y-2">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">De</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={currencyAmount}
                    onChange={(e) => setCurrencyAmount(e.target.value)}
                    className="text-lg font-mono flex-1"
                    placeholder="0"
                  />
                  <Select value={currencyBase} onValueChange={(v) => { setCurrencyBase(v); }}>
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Prioritarias</SelectLabel>
                        {PRIORITY_CURRENCIES.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectGroup>
                      {marketRates && (
                        <SelectGroup>
                          <SelectLabel>Todas</SelectLabel>
                          {Object.keys(marketRates.rates)
                            .filter((c) => !PRIORITY_CURRENCIES.includes(c))
                            .sort()
                            .map((c) => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                        </SelectGroup>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <button
                onClick={() => { setCurrencyBase(currencyTarget); setCurrencyTarget(currencyBase); }}
                className="mt-2 sm:mt-6 rounded-full border p-2.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors shrink-0"
                aria-label="Intercambiar monedas"
              >
                <ArrowsLeftRight size={18} weight="bold" />
              </button>

              <div className="flex-1 w-full space-y-2">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">A</Label>
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center rounded-md border bg-muted/40 px-3 font-mono text-lg min-h-[2.5rem]">
                    {loadingMarket ? (
                      <span className="text-muted-foreground text-sm">Cargando...</span>
                    ) : marketRates?.rates[currencyTarget] != null && currencyAmount !== '' ? (
                      fmtCurrency(parseFloat(currencyAmount) * (marketRates.rates[currencyTarget] ?? 1), 4)
                    ) : '—'}
                  </div>
                  <Select value={currencyTarget} onValueChange={setCurrencyTarget}>
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Prioritarias</SelectLabel>
                        {PRIORITY_CURRENCIES.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectGroup>
                      {marketRates && (
                        <SelectGroup>
                          <SelectLabel>Todas</SelectLabel>
                          {Object.keys(marketRates.rates)
                            .filter((c) => !PRIORITY_CURRENCIES.includes(c))
                            .sort()
                            .map((c) => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                        </SelectGroup>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Error state */}
            {marketError && (
              <p className="text-sm text-destructive rounded-md border border-destructive/30 bg-destructive/5 px-4 py-2">
                No se pudo cargar tasas de cambio. Verifica que <code className="text-xs bg-muted px-1 rounded">EXCHANGE_RATE_API_KEY</code> esté configurada en el backend.
              </p>
            )}

            {/* All currencies grid */}
            {!loadingMarket && marketRates && (
              <div>
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide font-medium">
                  {currencyAmount || '1'} {currencyBase} en monedas principales
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  {PRIORITY_CURRENCIES
                    .filter((c) => c !== currencyBase && marketRates.rates[c] != null)
                    .map((code) => {
                      const rate = marketRates.rates[code]!;
                      const converted = parseFloat(currencyAmount || '1') * rate;
                      return (
                        <button
                          key={code}
                          onClick={() => setCurrencyTarget(code)}
                          className={cn(
                            'rounded-lg border px-3 py-2.5 text-left transition-colors hover:bg-accent/40',
                            currencyTarget === code && 'border-primary bg-primary/5',
                          )}
                        >
                          <p className="text-[11px] font-semibold text-muted-foreground uppercase">{code}</p>
                          <p className="mt-0.5 font-mono text-sm font-bold truncate">
                            {fmtCurrency(converted, converted < 1 ? 6 : 2)}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-mono">
                            1 {currencyBase} = {fmtCurrency(rate, rate < 1 ? 6 : 4)}
                          </p>
                        </button>
                      );
                    })}
                </div>
              </div>
            )}

            {loadingMarket && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="h-16 rounded-lg border bg-muted/30 animate-pulse" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
