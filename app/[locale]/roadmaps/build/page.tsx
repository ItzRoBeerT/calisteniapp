import RoadmapBuilderClient from "@/components/roadmaps/RoadmapBuilderClient";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "@/i18n/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // El builder requiere sesión cuando Supabase está configurado.
  // En modo demo (sin Supabase) se puede abrir, pero no persistir.
  const supabase = await createClient();
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      redirect({ href: "/login", locale });
    }
  }

  return <RoadmapBuilderClient />;
}
