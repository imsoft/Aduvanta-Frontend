'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OperationStatusBadge } from '@/components/operations/operation-status-badge';
import { OperationPriorityBadge } from '@/components/operations/operation-priority-badge';
import { PortalOperationTimeline } from '@/components/portal/portal-operation-timeline';
import { PortalCommentsSection } from '@/components/portal/portal-comments-section';
import { PortalDocumentsSection } from '@/components/portal/portal-documents-section';
import { usePortalOperation } from '@/features/portal/hooks/use-portal';

function InfoField({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div>
      <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </dt>
      <dd className="mt-1 text-sm">
        {value ?? <span className="text-muted-foreground">—</span>}
      </dd>
    </div>
  );
}

export default function PortalOperationDetailPage() {
  const params = useParams<{ operationId: string }>();
  const { operationId } = params;

  const { data: operation, isLoading } = usePortalOperation(operationId);

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading…</div>;
  }

  if (!operation) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Operation not found.</p>
        <Button asChild variant="outline" size="sm">
          <Link href="/portal/operations">
            <ArrowLeft size={14} />
            Back to operations
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button asChild variant="ghost" size="icon" className="h-8 w-8 shrink-0">
          <Link href="/portal/operations">
            <ArrowLeft size={16} />
          </Link>
        </Button>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-muted-foreground">
              {operation.reference}
            </span>
            <OperationStatusBadge status={operation.status} />
            <OperationPriorityBadge priority={operation.priority} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight mt-0.5">{operation.title}</h1>
        </div>
      </div>

      <Separator />

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general" className="mt-4">
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            <InfoField label="Type" value={operation.type} />
            <InfoField
              label="Due date"
              value={
                operation.dueAt
                  ? new Date(operation.dueAt).toLocaleDateString()
                  : undefined
              }
            />
            <InfoField
              label="Opened"
              value={
                operation.openedAt
                  ? new Date(operation.openedAt).toLocaleDateString()
                  : undefined
              }
            />
            <InfoField
              label="Closed"
              value={
                operation.closedAt
                  ? new Date(operation.closedAt).toLocaleDateString()
                  : undefined
              }
            />
            {operation.description && (
              <div className="sm:col-span-2 lg:col-span-3">
                <InfoField label="Description" value={operation.description} />
              </div>
            )}
          </dl>
        </TabsContent>

        {/* Timeline */}
        <TabsContent value="timeline" className="mt-4 space-y-4">
          <h2 className="text-base font-semibold">Status history</h2>
          <PortalOperationTimeline operationId={operationId} />
        </TabsContent>

        {/* Comments */}
        <TabsContent value="comments" className="mt-4 space-y-4">
          <h2 className="text-base font-semibold">Comments</h2>
          <PortalCommentsSection operationId={operationId} />
        </TabsContent>

        {/* Documents */}
        <TabsContent value="documents" className="mt-4 space-y-4">
          <h2 className="text-base font-semibold">Documents</h2>
          <PortalDocumentsSection operationId={operationId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
