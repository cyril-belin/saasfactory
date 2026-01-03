import { Announcement, AnnouncementType } from "@prisma/client"

const a: Announcement | null = null;
const t: AnnouncementType = "UPDATE";

console.log("Types are importable:", { a, t });
