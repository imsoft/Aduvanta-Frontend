'use client';

import { useState, useCallback } from 'react';
import { ArrowsLeftRight, Info } from '@phosphor-icons/react';
import { useLocale, useTranslations } from 'next-intl';
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
  symbol: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}

interface Category {
  id: string;
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
    emoji: '⚖️',
    units: [
      { id: 'kg', symbol: 'kg', ...linear(1) },
      { id: 'g', symbol: 'g', ...linear(0.001) },
      { id: 'mg', symbol: 'mg', ...linear(1e-6) },
      { id: 'ug', symbol: 'µg', ...linear(1e-9) },
      { id: 't', symbol: 't', ...linear(1000) },
      { id: 'ton_larga', symbol: 'LT', ...linear(1016.047) },
      { id: 'ton_corta', symbol: 'ST', ...linear(907.185) },
      { id: 'lb', symbol: 'lb', ...linear(0.453592) },
      { id: 'oz', symbol: 'oz', ...linear(0.0283495) },
      { id: 'gr', symbol: 'gr', ...linear(0.0000647989) },
      { id: 'quintal', symbol: 'q', ...linear(100) },
      { id: 'arroba', symbol: '@', ...linear(11.5) },
      { id: 'stone', symbol: 'st', ...linear(6.35029) },
    ],
  },
  {
    id: 'longitud',
    emoji: '📏',
    units: [
      { id: 'm', symbol: 'm', ...linear(1) },
      { id: 'km', symbol: 'km', ...linear(1000) },
      { id: 'cm', symbol: 'cm', ...linear(0.01) },
      { id: 'mm', symbol: 'mm', ...linear(0.001) },
      { id: 'um', symbol: 'µm', ...linear(1e-6) },
      { id: 'nm_len', symbol: 'nm', ...linear(1e-9) },
      { id: 'mi', symbol: 'mi', ...linear(1609.344) },
      { id: 'nmi', symbol: 'nmi', ...linear(1852) },
      { id: 'yd', symbol: 'yd', ...linear(0.9144) },
      { id: 'ft', symbol: 'ft', ...linear(0.3048) },
      { id: 'in', symbol: 'in', ...linear(0.0254) },
      { id: 'fur', symbol: 'fur', ...linear(201.168) },
      { id: 'ly', symbol: 'ly', ...linear(9.461e15) },
      { id: 'au', symbol: 'AU', ...linear(1.496e11) },
    ],
  },
  {
    id: 'volumen',
    emoji: '🧴',
    units: [
      { id: 'l', symbol: 'L', ...linear(1) },
      { id: 'ml', symbol: 'mL', ...linear(0.001) },
      { id: 'cl', symbol: 'cL', ...linear(0.01) },
      { id: 'dl', symbol: 'dL', ...linear(0.1) },
      { id: 'm3', symbol: 'm³', ...linear(1000) },
      { id: 'cm3', symbol: 'cm³', ...linear(0.001) },
      { id: 'mm3', symbol: 'mm³', ...linear(1e-6) },
      { id: 'gal_us', symbol: 'gal (US)', ...linear(3.78541) },
      { id: 'gal_uk', symbol: 'gal (UK)', ...linear(4.54609) },
      { id: 'qt_us', symbol: 'qt', ...linear(0.946353) },
      { id: 'pt_us', symbol: 'pt', ...linear(0.473176) },
      { id: 'cup', symbol: 'cup', ...linear(0.236588) },
      { id: 'floz_us', symbol: 'fl oz', ...linear(0.0295735) },
      { id: 'ft3', symbol: 'ft³', ...linear(28.3168) },
      { id: 'in3', symbol: 'in³', ...linear(0.0163871) },
      { id: 'bbl_oil', symbol: 'bbl', ...linear(158.987) },
      { id: 'bbl_beer', symbol: 'bbl (beer)', ...linear(117.348) },
    ],
  },
  {
    id: 'area',
    emoji: '🗺️',
    units: [
      { id: 'm2', symbol: 'm²', ...linear(1) },
      { id: 'km2', symbol: 'km²', ...linear(1e6) },
      { id: 'cm2', symbol: 'cm²', ...linear(0.0001) },
      { id: 'mm2', symbol: 'mm²', ...linear(1e-6) },
      { id: 'ha', symbol: 'ha', ...linear(10000) },
      { id: 'a', symbol: 'a', ...linear(100) },
      { id: 'ac', symbol: 'ac', ...linear(4046.86) },
      { id: 'mi2', symbol: 'mi²', ...linear(2.59e6) },
      { id: 'yd2', symbol: 'yd²', ...linear(0.836127) },
      { id: 'ft2', symbol: 'ft²', ...linear(0.092903) },
      { id: 'in2', symbol: 'in²', ...linear(0.00064516) },
    ],
  },
  {
    id: 'temperatura',
    emoji: '🌡️',
    units: [
      { id: 'c', symbol: '°C', toBase: (v) => v, fromBase: (v) => v },
      { id: 'f', symbol: '°F', toBase: (v) => (v - 32) * (5 / 9), fromBase: (v) => v * (9 / 5) + 32 },
      { id: 'k', symbol: 'K', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
      { id: 'r', symbol: '°R', toBase: (v) => (v - 491.67) * (5 / 9), fromBase: (v) => (v + 273.15) * (9 / 5) },
      { id: 'reaumur', symbol: '°Ré', toBase: (v) => v * (5 / 4), fromBase: (v) => v * (4 / 5) },
    ],
  },
  {
    id: 'velocidad',
    emoji: '💨',
    units: [
      { id: 'ms', symbol: 'm/s', ...linear(1) },
      { id: 'kmh', symbol: 'km/h', ...linear(1 / 3.6) },
      { id: 'mph', symbol: 'mph', ...linear(0.44704) },
      { id: 'fts', symbol: 'ft/s', ...linear(0.3048) },
      { id: 'kn', symbol: 'kn', ...linear(0.514444) },
      { id: 'mach', symbol: 'Ma', ...linear(340.29) },
      { id: 'c_light', symbol: 'c', ...linear(299792458) },
    ],
  },
  {
    id: 'presion',
    emoji: '🔵',
    units: [
      { id: 'pa', symbol: 'Pa', ...linear(1) },
      { id: 'kpa', symbol: 'kPa', ...linear(1000) },
      { id: 'mpa', symbol: 'MPa', ...linear(1e6) },
      { id: 'bar', symbol: 'bar', ...linear(100000) },
      { id: 'mbar', symbol: 'mbar', ...linear(100) },
      { id: 'atm', symbol: 'atm', ...linear(101325) },
      { id: 'psi', symbol: 'psi', ...linear(6894.76) },
      { id: 'mmhg', symbol: 'mmHg', ...linear(133.322) },
      { id: 'inhg', symbol: 'inHg', ...linear(3386.39) },
      { id: 'torr', symbol: 'Torr', ...linear(133.322) },
    ],
  },
  {
    id: 'energia',
    emoji: '⚡',
    units: [
      { id: 'j', symbol: 'J', ...linear(1) },
      { id: 'kj', symbol: 'kJ', ...linear(1000) },
      { id: 'mj', symbol: 'MJ', ...linear(1e6) },
      { id: 'cal', symbol: 'cal', ...linear(4.184) },
      { id: 'kcal', symbol: 'kcal', ...linear(4184) },
      { id: 'wh', symbol: 'Wh', ...linear(3600) },
      { id: 'kwh', symbol: 'kWh', ...linear(3.6e6) },
      { id: 'ev', symbol: 'eV', ...linear(1.602e-19) },
      { id: 'btu', symbol: 'BTU', ...linear(1055.06) },
      { id: 'ftlbf', symbol: 'ft·lbf', ...linear(1.35582) },
    ],
  },
  {
    id: 'potencia',
    emoji: '🔋',
    units: [
      { id: 'w', symbol: 'W', ...linear(1) },
      { id: 'kw', symbol: 'kW', ...linear(1000) },
      { id: 'mw', symbol: 'MW', ...linear(1e6) },
      { id: 'hp_met', symbol: 'CV', ...linear(735.499) },
      { id: 'hp_imp', symbol: 'hp', ...linear(745.7) },
      { id: 'btuhr', symbol: 'BTU/h', ...linear(0.293071) },
      { id: 'kcalhr', symbol: 'kcal/h', ...linear(1.163) },
    ],
  },
  {
    id: 'datos',
    emoji: '💾',
    units: [
      { id: 'bit', symbol: 'bit', ...linear(1) },
      { id: 'byte', symbol: 'B', ...linear(8) },
      { id: 'kb', symbol: 'KB', ...linear(8 * 1024) },
      { id: 'mb', symbol: 'MB', ...linear(8 * 1024 ** 2) },
      { id: 'gb', symbol: 'GB', ...linear(8 * 1024 ** 3) },
      { id: 'tb', symbol: 'TB', ...linear(8 * 1024 ** 4) },
      { id: 'pb', symbol: 'PB', ...linear(8 * 1024 ** 5) },
      { id: 'kbit', symbol: 'Kbit', ...linear(1024) },
      { id: 'mbit', symbol: 'Mbit', ...linear(1024 ** 2) },
      { id: 'gbit', symbol: 'Gbit', ...linear(1024 ** 3) },
    ],
  },
  {
    id: 'tiempo',
    emoji: '⏱️',
    units: [
      { id: 's', symbol: 's', ...linear(1) },
      { id: 'ms_t', symbol: 'ms', ...linear(0.001) },
      { id: 'us_t', symbol: 'µs', ...linear(1e-6) },
      { id: 'ns_t', symbol: 'ns', ...linear(1e-9) },
      { id: 'min', symbol: 'min', ...linear(60) },
      { id: 'h', symbol: 'h', ...linear(3600) },
      { id: 'd', symbol: 'd', ...linear(86400) },
      { id: 'semana', symbol: 'sem', ...linear(604800) },
      { id: 'mes', symbol: 'mes', ...linear(2592000) },
      { id: 'anio', symbol: 'año', ...linear(31536000) },
    ],
  },
  {
    id: 'angulo',
    emoji: '📐',
    units: [
      { id: 'deg', symbol: '°', ...linear(1) },
      { id: 'rad', symbol: 'rad', ...linear(180 / Math.PI) },
      { id: 'grad', symbol: 'grad', ...linear(0.9) },
      { id: 'arcmin', symbol: "'", ...linear(1 / 60) },
      { id: 'arcsec', symbol: '"', ...linear(1 / 3600) },
      { id: 'turn', symbol: 'vuelta', ...linear(360) },
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

const PRIORITY_CURRENCIES = ['MXN', 'USD', 'EUR', 'GBP', 'CAD', 'JPY', 'CNY', 'CHF', 'AUD', 'BRL', 'KRW', 'SGD', 'HKD', 'NOK', 'SEK'];

export default function ConversionesPag() {
  const t = useTranslations('converter');
  const locale = useLocale();
  const [activeCat, setActiveCat] = useState<string>('masa');
  const [fromUnitId, setFromUnitId] = useState<string>('kg');
  const [toUnitId, setToUnitId] = useState<string>('lb');
  const [inputValue, setInputValue] = useState<string>('1');

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

  const unitLabel = (id: string) => t(`units.${id}`);
  const categoryLabel = (id: string) => t(`categories.${id}`);

  const fmtCurrency = useCallback(
    (value: number, decimals = 4): string => {
      if (!isFinite(value)) return '—';
      return parseFloat(value.toFixed(decimals)).toLocaleString(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: decimals,
      });
    },
    [locale],
  );

  const handleSwap = useCallback(() => {
    setFromUnitId(toUnitId);
    setToUnitId(fromUnitId);
    if (result !== null) setInputValue(fmt(result));
  }, [fromUnitId, toUnitId, result]);

  const allConversions =
    result !== null
      ? category.units
          .filter((u) => u.id !== fromUnit.id)
          .map((u) => ({ unit: u, value: convert(numInput, fromUnit, u) }))
      : [];

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t('subtitle')}</p>
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
            <span>{categoryLabel(cat.id)}</span>
          </button>
        ))}
      </div>

      {/* Main converter */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 w-full space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t('from')}
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
                    <SelectLabel>{categoryLabel(category.id)}</SelectLabel>
                    {category.units.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {unitLabel(u.id)} ({u.symbol})
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">
              {unitLabel(fromUnit.id)} · <span className="font-mono">{fromUnit.symbol}</span>
            </p>
          </div>

          <button
            onClick={handleSwap}
            className="mt-2 sm:mt-6 rounded-full border p-2.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors shrink-0"
            aria-label={t('swapUnits')}
          >
            <ArrowsLeftRight size={18} weight="bold" />
          </button>

          <div className="flex-1 w-full space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t('to')}
            </Label>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center rounded-md border bg-muted/40 px-3 font-mono text-lg select-all min-h-10 overflow-x-auto whitespace-nowrap">
                {result !== null ? fmt(result) : '—'}
              </div>
              <Select value={toUnitId} onValueChange={setToUnitId}>
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{categoryLabel(category.id)}</SelectLabel>
                    {category.units.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {unitLabel(u.id)} ({u.symbol})
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">
              {unitLabel(toUnit.id)} · <span className="font-mono">{toUnit.symbol}</span>
            </p>
          </div>
        </div>

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

      {/* Reference table */}
      {result !== null && allConversions.length > 0 && (
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b bg-muted/20">
            <p className="text-sm font-medium">
              {t('referenceTableTitle')} —{' '}
              <span className="text-muted-foreground font-normal">
                {t('referenceTableDescription', { amount: inputValue, symbol: fromUnit.symbol })}
              </span>
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 divide-x divide-y">
            <div className="px-4 py-3 bg-primary/5 border-primary/20">
              <p className="text-[11px] font-medium uppercase tracking-wide text-primary truncate">
                {unitLabel(fromUnit.id)}
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
                  {unitLabel(unit.id)}
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
          <p className="text-sm font-medium">{t('frequentEquivalences')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 divide-y sm:divide-x sm:divide-y-0">
          {[
            { key: 'weight', items: ['1 t = 1 000 kg', '1 kg = 2.2046 lb', '1 lb = 453.59 g', '1 oz = 28.35 g', '1 quintal = 100 kg'] },
            { key: 'volume', items: ['1 m³ = 1 000 L', '1 gal US = 3.785 L', '1 bbl = 158.987 L', '1 ft³ = 28.317 L', '1 gal UK = 4.546 L'] },
            { key: 'length', items: ['1 m = 3.2808 ft', '1 km = 0.6214 mi', '1 in = 2.54 cm', '1 yd = 91.44 cm', '1 nmi = 1 852 m'] },
          ].map((card) => (
            <div key={card.key} className="px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                {t(`equivalencesCards.${card.key}`)}
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
          <h2 className="text-lg font-semibold tracking-tight">💱 {t('exchange.title')}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{t('exchange.subtitle')}</p>
        </div>

        {/* FIX card */}
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b bg-amber-50 dark:bg-amber-950/20 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                {t('exchange.fixTitle')}
              </span>
              <Badge variant="outline" className="text-[10px] border-amber-400 text-amber-700 dark:text-amber-400">
                {t('exchange.fixBadge')}
              </Badge>
            </div>
            {fixRate && (
              <span className="text-xs text-muted-foreground">
                {t('exchange.publishedOn', { date: fixRate.date })}
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
                {t.rich('exchange.fixMissing', {
                  tokenName: () => (
                    <code className="text-xs bg-muted px-1 rounded">BANXICO_TOKEN</code>
                  ),
                })}
              </p>
            )}
          </div>
        </div>

        {/* Market rates converter */}
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b bg-muted/20 flex items-center justify-between">
            <p className="text-sm font-medium">{t('exchange.converterTitle')}</p>
            {marketRates && (
              <span className="text-xs text-muted-foreground">
                {t('exchange.baseLabel')}: {marketRates.base} ·{' '}
                {marketRates.source === 'cache'
                  ? `📦 ${t('exchange.cacheLabel')}`
                  : `🌐 ${t('exchange.liveLabel')}`}{' '}
                · {new Date(marketRates.updatedAt).toLocaleString(locale, { dateStyle: 'short', timeStyle: 'short' })}
              </span>
            )}
          </div>
          <div className="p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1 w-full space-y-2">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('from')}</Label>
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
                        <SelectLabel>{t('exchange.priority')}</SelectLabel>
                        {PRIORITY_CURRENCIES.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectGroup>
                      {marketRates && (
                        <SelectGroup>
                          <SelectLabel>{t('exchange.all')}</SelectLabel>
                          {Object.keys(marketRates.rates ?? {})
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
                aria-label={t('swapCurrencies')}
              >
                <ArrowsLeftRight size={18} weight="bold" />
              </button>

              <div className="flex-1 w-full space-y-2">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('to')}</Label>
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center rounded-md border bg-muted/40 px-3 font-mono text-lg min-h-10">
                    {loadingMarket ? (
                      <span className="text-muted-foreground text-sm">{t('loading')}</span>
                    ) : marketRates?.rates?.[currencyTarget] != null && currencyAmount !== '' ? (
                      fmtCurrency(parseFloat(currencyAmount) * (marketRates.rates?.[currencyTarget] ?? 1), 4)
                    ) : '—'}
                  </div>
                  <Select value={currencyTarget} onValueChange={setCurrencyTarget}>
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>{t('exchange.priority')}</SelectLabel>
                        {PRIORITY_CURRENCIES.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectGroup>
                      {marketRates && (
                        <SelectGroup>
                          <SelectLabel>{t('exchange.all')}</SelectLabel>
                          {Object.keys(marketRates.rates ?? {})
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

            {marketError && (
              <p className="text-sm text-destructive rounded-md border border-destructive/30 bg-destructive/5 px-4 py-2">
                {t.rich('exchange.error', {
                  keyName: () => (
                    <code className="text-xs bg-muted px-1 rounded">EXCHANGE_RATE_API_KEY</code>
                  ),
                })}
              </p>
            )}

            {!loadingMarket && marketRates && (
              <div>
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide font-medium">
                  {t('exchange.mainCurrenciesTitle', { amount: currencyAmount || '1', base: currencyBase })}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  {PRIORITY_CURRENCIES
                    .filter((c) => c !== currencyBase && marketRates.rates?.[c] != null)
                    .map((code) => {
                      const rate = marketRates.rates?.[code] ?? 1;
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
