'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useDocumentVersions } from '@/features/documents/hooks/use-documents';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface DocumentVersionsTableProps {
  documentId: string;
}

export function DocumentVersionsTable({ documentId }: DocumentVersionsTableProps) {
  const { data: versions = [], isLoading } = useDocumentVersions(documentId);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground py-4">Loading versions…</p>;
  }

  if (versions.length === 0) {
    return <p className="text-sm text-muted-foreground py-4">No versions found.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Version</TableHead>
          <TableHead>MIME type</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Uploaded</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {versions.map((v) => (
          <TableRow key={v.id}>
            <TableCell className="font-mono text-xs">v{v.versionNumber}</TableCell>
            <TableCell className="text-xs text-muted-foreground">{v.mimeType}</TableCell>
            <TableCell className="text-xs text-muted-foreground">
              {formatBytes(v.sizeInBytes)}
            </TableCell>
            <TableCell className="text-xs text-muted-foreground">
              {new Date(v.createdAt).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
