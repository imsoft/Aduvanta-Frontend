'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation'
import { Plus } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { RuleSetsTable } from '@/components/compliance/rule-sets-table';
import {
  useComplianceRuleSets,
  useDeleteComplianceRuleSet,
} from '@/features/compliance-rule-sets/hooks/use-compliance-rule-sets';
import { useCanManage } from '@/hooks/use-permissions';

export default function ComplianceRuleSetsPage() {
  const canManage = useCanManage();

  const { data: ruleSets = [], isLoading } = useComplianceRuleSets();
  const deleteRuleSet = useDeleteComplianceRuleSet();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Compliance rule sets</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Define validation rules and required documents per operation type.
          </p>
        </div>
        {canManage && (
          <Button asChild size="sm" className="gap-2">
            <Link href="/dashboard/compliance/rule-sets/new">
              <Plus size={14} />
              New rule set
            </Link>
          </Button>
        )}
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <RuleSetsTable
          ruleSets={ruleSets}
          canManage={canManage}
          onDelete={(id) => deleteRuleSet.mutate(id)}
          isDeletePending={deleteRuleSet.isPending}
        />
      )}
    </div>
  );
}
