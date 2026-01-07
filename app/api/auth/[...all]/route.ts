import { auth } from "@/lib/auth"; // Import dari file langkah 4
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);