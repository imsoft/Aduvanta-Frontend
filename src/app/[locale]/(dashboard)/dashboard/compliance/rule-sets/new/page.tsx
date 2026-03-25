'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation'
import { RuleSetForm } from '@/components/compliance/rule-set-form';
import { useCreateComplianceRuleSet } from '@/features/compliance-rule-sets/hooks/use-compliance-rule-sets';
import type { CreateRuleSetFormData } from '@/features/compliance-rule-sets/schemas/rule-set.schemas';

export default function NewRuleSetPage() {
  const t = useTranslations();
  const router = useRouter();
  const createRuleSet = useCreateComplianceRuleSet();

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t('compliance.newTitle')}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t('compliance.newDescription')}
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
        submitLabel={t('compliance.createRuleSet')}
      />
    </div>
  );
}
