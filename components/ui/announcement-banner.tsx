import { getActiveBroadcast } from "@/actions/settings";
import { AnnouncementToast } from "@/components/ui/announcement-toast";

export async function AnnouncementBanner() {
  const broadcast = await getActiveBroadcast();

  if (!broadcast?.data) return null;

  return (
    <AnnouncementToast
      title={broadcast.data.title}
      content={broadcast.data.content}
    />
  );
}
