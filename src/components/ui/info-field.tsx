interface InfoFieldProps {
  label: string;
  value: string | null | undefined;
}

export function InfoField({ label, value }: InfoFieldProps) {
  return (
    <div>
      <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </dt>
      <dd className="mt-1 text-sm break-all">
        {value ?? <span className="text-muted-foreground">—</span>}
      </dd>
    </div>
  );
}
