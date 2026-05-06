import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type OnboardingStep = 'profile' | 'team' | 'client' | 'done';

interface OnboardingStore {
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  dismissed: boolean;
  setStep: (step: OnboardingStep) => void;
  completeStep: (step: OnboardingStep) => void;
  dismiss: () => void;
  reset: () => void;
  isComplete: () => boolean;
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      currentStep: 'profile',
      completedSteps: [],
      dismissed: false,
      setStep: (step) => set({ currentStep: step }),
      completeStep: (step) =>
        set((s) => ({
          completedSteps: s.completedSteps.includes(step)
            ? s.completedSteps
            : [...s.completedSteps, step],
        })),
      dismiss: () => set({ dismissed: true }),
      reset: () => set({ currentStep: 'profile', completedSteps: [], dismissed: false }),
      isComplete: () => get().completedSteps.includes('done'),
    }),
    {
      name: 'aduvanta-onboarding',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
