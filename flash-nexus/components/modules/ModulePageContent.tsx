import { notFound } from "next/navigation";

import { PlaceholderPage } from "@/components/shared/PlaceholderPage";
import { getModuleBySlug } from "@/lib/constants/modules";

interface ModulePageContentProps {
  slug: string;
}

export function ModulePageContent({ slug }: ModulePageContentProps) {
  const moduleDef = getModuleBySlug(slug);

  if (!moduleDef) {
    notFound();
  }

  return (
    <PlaceholderPage
      title={moduleDef.title}
      arabicTitle={moduleDef.arabicTitle}
      description={moduleDef.description}
      status={moduleDef.status}
      plannedFeatures={moduleDef.plannedFeatures}
    />
  );
}
