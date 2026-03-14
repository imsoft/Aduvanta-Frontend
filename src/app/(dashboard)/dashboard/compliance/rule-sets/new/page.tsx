'use client';

import { useRouter } from 'next/navigation';
import { RuleSetForm } from '@/components/compliance/rule-set-form';
import { useCreateComplianceRuleSet } from '@/features/compliance-rule-sets/hooks/use-compliance-rule-sets';
import type { CreateRuleSetFormData } from '@/features/compliance-rule-sets/schemas/rule-set.schemas';

export default function NewRuleSetPage() {
  const router = useRouter();
  const createRuleSet = useCreateComplianceRuleSet();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New rule set</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure a compliance rule set for an operation type.
        </p>
      </div>

      <RuleSetForm
        onSubmit={(dto) =>
          createRuleSet.mutate(dto as CreateRuleSetFormData, {
            onSuccess: (created) => router.push(`/dashboard/compliance/rule-sets/${created.id}`),
          })
        }
        onCancel={() => router.push('/dashboard/compliance/rule-sets')}
        isPending={createRuleSet.isPending}
        submitLabel="Create rule set"
      />
    </div>
  );
}
