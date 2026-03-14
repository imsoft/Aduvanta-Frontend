export interface FeatureFlag {
  id: string;
  key: string;
  description: string | null;
  isEnabled: boolean;
  organizationId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeatureFlagInput {
  key: string;
  description?: string;
  isEnabled: boolean;
}

export interface UpdateFeatureFlagInput {
  isEnabled?: boolean;
  description?: string;
}
