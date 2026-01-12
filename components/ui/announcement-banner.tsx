import { getActiveBroadcast } from "@/actions/settings";
import { AnnouncementToast } from "@/components/ui/announcement-toast";

export async function AnnouncementBanner() {
  const broadcast = await getActiveBroadcast();

  if (!broadcast) return null;

  return (
    <AnnouncementToast title={broadcast.title} content={broadcast.content} />
  );
}
