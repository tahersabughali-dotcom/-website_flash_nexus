export type ModuleStatus = "MVP" | "Core" | "Future" | "Planned";

export interface ModuleDefinition {
  slug: string;
  title: string;
  arabicTitle: string;
  description: string;
  status: ModuleStatus;
  plannedFeatures: string[];
}
