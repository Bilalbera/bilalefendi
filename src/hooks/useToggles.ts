import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "./useAuth";

type Kind = "watchlist" | "favorites" | "episode_likes";

/** Toggle membership of the current user in a per-user join table. */
export function useToggle(table: Kind, id: string) {
  const { user } = useSession();
  const qc = useQueryClient();
  const col = table === "episode_likes" ? "episode_id" : "series_id";
  const key = [table, user?.id, id];
  const q = useQuery({
    queryKey: key,
    enabled: !!user && !!id,
    queryFn: async () => {
      const { data } = await supabase.from(table).select("user_id").eq("user_id", user!.id).eq(col as never, id as never).maybeSingle();
      return !!data;
    },
  });
  async function toggle() {
    if (!user) return toast("Bunun için giriş yapmalısın");
    if (q.data) {
      await supabase.from(table).delete().eq("user_id", user.id).eq(col as never, id as never);
    } else {
      const { error } = await supabase.from(table).insert({ user_id: user.id, [col]: id } as never);
      if (error) return toast.error("İşlem başarısız");
    }
    qc.setQueryData(key, !q.data);
    qc.invalidateQueries({ queryKey: [`my-${table}`] });
  }
  return { active: !!q.data, toggle };
}
