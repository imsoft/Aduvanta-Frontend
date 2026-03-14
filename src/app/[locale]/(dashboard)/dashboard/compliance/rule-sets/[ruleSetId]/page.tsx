'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation'
import { useRouter } from '@/i18n/navigation'
import { ArrowLeft, Plus } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { RuleSetForm } from '@/components/compliance/rule-set-form';
import { DocumentRequirementsTable } from '@/components/compliance/document-requirements-table';
import { CreateDocumentRequirementDialog } from '@/components/compliance/create-document-requirement-dialog';
import { StatusRulesTable } from '@/components/compliance/status-rules-table';
import { CreateStatusRuleDialog } from '@/components/compliance/create-status-rule-dialog';
import {
  useComplianceRuleSet,
  useUpdateComplianceRuleSet,
} from '@/features/compliance-rule-sets/hooks/use-compliance-rule-sets';
import {
  useDocumentRequirements,
  useCreateDocumentRequirement,
  useDeleteDocumentRequirement,
} from '@/features/compliance-document-requirements/hooks/use-compliance-document-requirements';
import {
  useStatusRules,
  useCreateStatusRule,
  useDeleteStatusRule,
} from '@/features/compliance-status-rules/hooks/use-compliance-status-rules';
import { useDocumentCategories } from '@/features/document-categories/hooks/use-document-categories';
import { useOrgStore } from '@/store/org.store';
import type { UpdateRuleSetFormData } from '@/features/compliance-rule-sets/schemas/rule-set.schemas';

export default function RuleSetDetailPage() {
  const { ruleSetId } = useParams<{ ruleSetId: string }>();
  const router = useRouter();
  const { organizations, activeOrgId } = useOrgStore();
  const activeOrg = organizations.find((o) => o.id === activeOrgId);
  const canManage = activeOrg?.role === 'OWNER' || activeOrg?.role === 'ADMIN';

  const { data: ruleSet, isLoading: isLoadingRuleSet } = useComplianceRuleSet(ruleSetId);
  const { data: requirements = [], isLoading: isLoadingReqs } =
    useDocumentRequirements(ruleSetId);
  const { data: statusRules = [], isLoading: isLoadingRules } = useStatusRules(ruleSetId);
  const { data: categories = [] } = useDocumentCategories();

  const updateRuleSet = useUpdateComplianceRuleSet(ruleSetId);
  const createRequirement = useCreateDocumentRequirement(ruleSetId);
  const deleteRequirement = useDeleteDocumentRequirement(ruleSetId);
  const createStatusRule = useCreateStatusRule(ruleSetId);
  const deleteStatusRule = useDeleteStatusRule(ruleSetId);

  const [addDocOpen, setAddDocOpen] = useState(false);
  const [addStatusOpen, setAddStatusOpen] = useState(false);

  if (isLoadingRuleSet) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  if (!ruleSet) {
    return <p className="text-sm text-destructive">Rule set not found.</p>;
  }

  const existingCategoryIds = requirements.map((r) => r.documentCategoryId);
  const existingStatusPairs = statusRules.map((r) => ({
    fromStatus: r.fromStatus,
    toStatus: r.toStatus,
  }));

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => router.push('/dashboard/compliance/rule-sets')}
        >
          <ArrowLeft size={16} />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{ruleSet.name}</h1>
          <p className="text-sm text-muted-foreground font-mono">{ruleSet.code}</p>
        </div>
      </div>

      {/* Edit form */}
      {canManage && (
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Settings
          </h2>
          <RuleSetForm
            initialValues={ruleSet}
            onSubmit={(dto) => updateRuleSet.mutate(dto as UpdateRuleSetFormData)}
            onCancel={() => {}}
            isPending={updateRuleSet.isPending}
            submitLabel="Save changes"
          />
        </section>
      )}

      {/* Document requirements */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Document requirements
          </h2>
          {canManage && (
            <Button size="sm" variant="outline" className="gap-2" onClick={() => setAddDocOpen(true)}>
              <Plus size={13} />
              Add requirement
            </Button>
          )}
        </div>
        {isLoadingReqs ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <DocumentRequirementsTable
            requirements={requirements}
            categories={categories}
            canManage={canManage}
            onDelete={(id) => deleteRequirement.mutate(id)}
            isDeletePending={deleteRequirement.isPending}
          />
        )}
      </section>

      {/* Status transition rules */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Status transition rules
          </h2>
          {canManage && (
            <Button
              size="sm"
              variant="outline"
              className="gap-2"
              onClick={() => setAddStatusOpen(true)}
            >
              <Plus size={13} />
              Add rule
            </Button>
          )}
        </div>
        {isLoadingRules ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <StatusRulesTable
            rules={statusRules}
            canManage={canManage}
            onDelete={(id) => deleteStatusRule.mutate(id)}
            isDeletePending={deleteStatusRule.isPending}
          />
        )}
      </section>

      {canManage && (
        <>
          <CreateDocumentRequirementDialog
            open={addDocOpen}
            onOpenChange={setAddDocOpen}
            categories={categories}
            existingCategoryIds={existingCategoryIds}
            onSubmit={(dto) =>
              createRequirement.mutate(dto, { onSuccess: () => setAddDocOpen(false) })
            }
            isPending={createRequirement.isPending}
          />
          <CreateStatusRuleDialog
            open={addStatusOpen}
            onOpenChange={setAddStatusOpen}
            existingPairs={existingStatusPairs}
            onSubmit={(dto) =>
              createStatusRule.mutate(dto, { onSuccess: () => setAddStatusOpen(false) })
            }
            isPending={createStatusRule.isPending}
          />
        </>
      )}
    </div>
  );
}
