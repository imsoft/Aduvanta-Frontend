'use client';

import { useTranslations } from 'next-intl';
import { useOperationCompliance } from '@/features/operation-compliance/hooks/use-operation-compliance';
import type { ComplianceAlert, AllowedTransition, CategoryRef } from '@/features/operation-compliance/types/operation-compliance.types';
import { Warning, CheckCircle, XCircle } from '@phosphor-icons/react';

interface OperationComplianceSectionProps {
  operationId: string;
}

export function OperationComplianceSection({
  operationId,
}: OperationComplianceSectionProps) {
  const t = useTranslations('compliance.operation');
  const { data: evaluation, isLoading } = useOperationCompliance(operationId);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">{t('evaluating')}</p>;
  }

  if (!evaluation) return null;

  const noRuleSet = !evaluation.ruleSetId;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <section className="space-y-3">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold">{t('title')}</h2>
          {!noRuleSet && (
            evaluation.canCurrentWorkflowAdvance ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-300">
                <CheckCircle size={12} weight="fill" />
                {t('canAdvance')}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                <Warning size={12} weight="fill" />
                {t('blocked')}
              </span>
            )
          )}
        </div>

        {evaluation.ruleSetName && (
          <p className="text-sm text-muted-foreground">
            {t('ruleSet')}: <span className="font-medium text-foreground">{evaluation.ruleSetName}</span>
          </p>
        )}
      </section>

      {/* Alerts */}
      {evaluation.alerts.length > 0 && (
        <section className="space-y-2">
          <h3 className="text-sm font-semibold">{t('alerts')}</h3>
          <AlertsList alerts={evaluation.alerts} />
        </section>
      )}

      {/* Missing documents */}
      {!noRuleSet && evaluation.missingRequiredDocumentCategories.length > 0 && (
        <section className="space-y-2">
          <h3 className="text-sm font-semibold">{t('missingDocuments')}</h3>
          <MissingDocumentsList categories={evaluation.missingRequiredDocumentCategories} />
        </section>
      )}

      {/* Required documents */}
      {!noRuleSet && evaluation.requiredDocumentCategories.length > 0 && (
        <section className="space-y-2">
          <h3 className="text-sm font-semibold">{t('requiredDocuments')}</h3>
          <DocumentCategoryList
            required={evaluation.requiredDocumentCategories}
            present={evaluation.presentDocumentCategories}
          />
        </section>
      )}

      {/* Allowed transitions */}
      {!noRuleSet && evaluation.allowedTransitions.length > 0 && (
        <section className="space-y-2">
          <h3 className="text-sm font-semibold">{t('transitionsTitle')}</h3>
          <AllowedTransitionsList transitions={evaluation.allowedTransitions} />
        </section>
      )}
    </div>
  );
}

function AlertsList({ alerts }: { alerts: ComplianceAlert[] }) {
  return (
    <ul className="space-y-2">
      {alerts.map((alert, i) => (
        <li
          key={i}
          className={`flex items-start gap-2 rounded-md px-3 py-2 text-sm ${
            alert.type === 'NO_RULE_SET'
              ? 'bg-muted text-muted-foreground'
              : alert.type === 'TRANSITION_BLOCKED'
              ? 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
              : 'bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200'
          }`}
        >
          <Warning size={16} weight="fill" className="mt-0.5 shrink-0" />
          <span>{alert.message}</span>
        </li>
      ))}
    </ul>
  );
}

function MissingDocumentsList({ categories }: { categories: CategoryRef[] }) {
  return (
    <ul className="space-y-1.5">
      {categories.map((cat) => (
        <li
          key={cat.id}
          className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
        >
          <XCircle size={14} weight="fill" className="shrink-0" />
          <span>{cat.name}</span>
          <span className="ml-auto font-mono text-xs opacity-60">{cat.code}</span>
        </li>
      ))}
    </ul>
  );
}

function DocumentCategoryList({
  required,
  present,
}: {
  required: CategoryRef[];
  present: CategoryRef[];
}) {
  const presentIds = new Set(present.map((c) => c.id));

  return (
    <ul className="space-y-1.5">
      {required.map((cat) => {
        const isPresent = presentIds.has(cat.id);
        return (
          <li
            key={cat.id}
            className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
          >
            {isPresent ? (
              <CheckCircle size={14} weight="fill" className="text-green-600 dark:text-green-400 shrink-0" />
            ) : (
              <XCircle size={14} weight="fill" className="text-red-500 shrink-0" />
            )}
            <span>{cat.name}</span>
            <span className="ml-auto font-mono text-xs text-muted-foreground">{cat.code}</span>
          </li>
        );
      })}
    </ul>
  );
}

function AllowedTransitionsList({ transitions }: { transitions: AllowedTransition[] }) {
  return (
    <ul className="space-y-1.5">
      {transitions.map((t, i) => (
        <li
          key={i}
          className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${
            t.isBlocked
              ? 'border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950'
              : 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950'
          }`}
        >
          {t.isBlocked ? (
            <Warning size={14} weight="fill" className="text-amber-600 shrink-0" />
          ) : (
            <CheckCircle size={14} weight="fill" className="text-green-600 shrink-0" />
          )}
          <span className="font-mono text-xs font-medium">{t.toStatus}</span>
          {t.blockReason && (
            <span className="ml-2 text-xs text-amber-700 dark:text-amber-300">
              — {t.blockReason}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
