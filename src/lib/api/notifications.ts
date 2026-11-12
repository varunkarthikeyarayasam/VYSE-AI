import { supabase } from "../supabase";
import type { UserNotification } from "../../types/database";

export async function getNotifications(userId: string): Promise<UserNotification[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) throw error;
  return data as UserNotification[];
}

export async function markNotificationAsRead(id: string): Promise<void> {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", id);
  if (error) throw error;
}

export function subscribeToNotifications(userId: string, onNewNotification: (notif: UserNotification) => void) {
  return supabase
    .channel(`notifications-${userId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        onNewNotification(payload.new as UserNotification);
      }
    )
    .subscribe();
}