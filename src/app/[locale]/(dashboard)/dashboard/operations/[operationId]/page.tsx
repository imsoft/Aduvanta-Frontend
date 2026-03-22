'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation'
import { useRouter } from '@/i18n/navigation'
import { Link } from '@/i18n/navigation'
import {
  ArrowLeft,
  PencilSimple,
  ArrowsClockwise,
  UserCircle,
  X,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { OperationStatusBadge } from '@/components/operations/operation-status-badge';
import { OperationPriorityBadge } from '@/components/operations/operation-priority-badge';
import { OperationTimeline } from '@/components/operations/operation-timeline';
import { OperationCommentsSection } from '@/components/operation-comments/operation-comments-section';
import { OperationDocumentsSection } from '@/components/documents/operation-documents-section';
import { OperationFinanceSection } from '@/components/finance/operation-finance-section';
import { OperationComplianceSection } from '@/components/compliance/operation-compliance-section';
import { OperationAiInsightsSection } from '@/components/ai/operation-ai-insights-section';
import { ChangeOperationStatusDialog } from '@/components/operation-status/change-operation-status-dialog';
import { AssignOperationDialog } from '@/components/operation-assignment/assign-operation-dialog';
import { InfoField } from '@/components/ui/info-field';
import {
  useOperation,
  useUpdateOperation,
  useDeactivateOperation,
  useChangeOperationStatus,
  useAssignOperation,
} from '@/features/operations/hooks/use-operations';
import { useCanManage, useCanComment } from '@/hooks/use-permissions';
import { useMembers } from '@/hooks/use-members';
import { useClients } from '@/features/clients/hooks/use-clients';
import type { UpdateOperationFormData } from '@/features/operations/schemas/operation.schemas';

export default function OperationDetailPage() {
  const params = useParams<{ operationId: string }>();
  const router = useRouter();
  const { operationId } = params;

  const canManage = useCanManage();
  const canComment = useCanComment();

  const { data: operation, isLoading } = useOperation(operationId);
  const updateOperation = useUpdateOperation(operationId);
  const deactivateOperation = useDeactivateOperation();
  const changeStatus = useChangeOperationStatus(operationId);
  const assignOperation = useAssignOperation(operationId);

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  const { data: clients = [] } = useClients();
  const { data: membersRaw = [] } = useMembers();

  const members = membersRaw.map(({ user }) => ({ id: user.id, name: user.name }));
  const clientNames = Object.fromEntries(clients.map((c) => [c.id, c.name]));
  const userNames = Object.fromEntries(
    membersRaw.map(({ user }) => [user.id, user.name]),
  );

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading…</div>;
  }

  if (!operation) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Operation not found.</p>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/operations">
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
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon" className="h-8 w-8">
            <Link href="/dashboard/operations">
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
            <h1 className="text-2xl font-semibold tracking-tight mt-0.5">
              {operation.title}
            </h1>
          </div>
        </div>

        {canManage && (
          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setStatusDialogOpen(true)}
              className="gap-2"
            >
              <ArrowsClockwise size={14} />
              Status
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setAssignDialogOpen(true)}
              className="gap-2"
            >
              <UserCircle size={14} />
              Assign
            </Button>
            {operation.status !== 'CANCELLED' && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive hover:text-destructive gap-2"
                  >
                    <X size={14} />
                    Cancel
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel operation?</AlertDialogTitle>
                    <AlertDialogDescription>
                      {operation.reference} — {operation.title} will be cancelled.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() =>
                        deactivateOperation.mutate(operationId, {
                          onSuccess: () => router.push('/dashboard/operations'),
                        })
                      }
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Cancel operation
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        )}
      </div>

      <Separator />

      {/* Tabs */}
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Information</h2>
            {canManage && !editing && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditing(true)}
                className="gap-2"
              >
                <PencilSimple size={14} />
                Edit
              </Button>
            )}
          </div>

          {editing ? (
            <EditOperationInline
              operation={operation}
              onSave={(data) =>
                updateOperation.mutate(data, { onSuccess: () => setEditing(false) })
              }
              onCancel={() => setEditing(false)}
              isPending={updateOperation.isPending}
            />
          ) : (
            <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              <InfoField label="Client" value={clientNames[operation.clientId] ?? operation.clientId} />
              <InfoField label="Type" value={operation.type} />
              <InfoField label="Assigned to" value={operation.assignedUserId ? (userNames[operation.assignedUserId] ?? operation.assignedUserId) : undefined} />
              <InfoField
                label="Due date"
                value={operation.dueAt ? new Date(operation.dueAt).toLocaleDateString() : undefined}
              />
              <InfoField
                label="Opened"
                value={operation.openedAt ? new Date(operation.openedAt).toLocaleDateString() : undefined}
              />
              <InfoField
                label="Closed"
                value={operation.closedAt ? new Date(operation.closedAt).toLocaleDateString() : undefined}
              />
              {operation.description && (
                <div className="sm:col-span-2 lg:col-span-3">
                  <InfoField label="Description" value={operation.description} />
                </div>
              )}
            </dl>
          )}
        </TabsContent>

        {/* Timeline */}
        <TabsContent value="timeline" className="mt-4 space-y-4">
          <h2 className="text-base font-semibold">Status history</h2>
          <OperationTimeline operationId={operationId} />
        </TabsContent>

        {/* Comments */}
        <TabsContent value="comments" className="mt-4">
          <OperationCommentsSection
            operationId={operationId}
            canComment={canComment}
          />
        </TabsContent>

        {/* Documents */}
        <TabsContent value="documents" className="mt-4">
          <OperationDocumentsSection operationId={operationId} canManage={canManage} />
        </TabsContent>

        {/* Finance */}
        <TabsContent value="finance" className="mt-4">
          <OperationFinanceSection operationId={operationId} canManage={canManage} />
        </TabsContent>

        {/* AI Insights */}
        <TabsContent value="ai-insights" className="mt-4">
          <OperationAiInsightsSection operationId={operationId} />
        </TabsContent>

        {/* Compliance */}
        <TabsContent value="compliance" className="mt-4">
          <OperationComplianceSection operationId={operationId} />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      {canManage && (
        <>
          <ChangeOperationStatusDialog
            open={statusDialogOpen}
            onOpenChange={setStatusDialogOpen}
            currentStatus={operation.status}
            onSubmit={(data) =>
              changeStatus.mutate(data, {
                onSuccess: () => setStatusDialogOpen(false),
              })
            }
            isPending={changeStatus.isPending}
          />
          <AssignOperationDialog
            open={assignDialogOpen}
            onOpenChange={setAssignDialogOpen}
            currentAssignedUserId={operation.assignedUserId}
            members={members}
            onSubmit={(data) =>
              assignOperation.mutate(data, {
                onSuccess: () => setAssignDialogOpen(false),
              })
            }
            isPending={assignOperation.isPending}
          />
        </>
      )}
    </div>
  );
}

function EditOperationInline({
  operation,
  onSave,
  onCancel,
  isPending,
}: {
  operation: {
    reference: string;
    title: string;
    description: string | null;
    type: string;
    priority: string;
    dueAt: string | null;
  };
  onSave: (data: UpdateOperationFormData) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const [values, setValues] = useState<UpdateOperationFormData>({
    reference: operation.reference,
    title: operation.title,
    description: operation.description ?? '',
    type: operation.type as UpdateOperationFormData['type'],
    priority: operation.priority as UpdateOperationFormData['priority'],
    dueAt: operation.dueAt
      ? new Date(operation.dueAt).toISOString().split('T')[0]
      : '',
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Reference">
          <input
            className="w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={values.reference ?? ''}
            onChange={(e) => setValues((v) => ({ ...v, reference: e.target.value }))}
          />
        </Field>
        <Field label="Title">
          <input
            className="w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={values.title ?? ''}
            onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
          />
        </Field>
        <Field label="Due date">
          <input
            type="date"
            className="w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={values.dueAt ?? ''}
            onChange={(e) => setValues((v) => ({ ...v, dueAt: e.target.value }))}
          />
        </Field>
      </div>
      <Field label="Description">
        <textarea
          rows={3}
          className="w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          value={values.description ?? ''}
          onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
        />
      </Field>
      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button onClick={() => onSave(values)} disabled={isPending}>
          {isPending ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}
