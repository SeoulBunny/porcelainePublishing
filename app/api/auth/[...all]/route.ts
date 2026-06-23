import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Better Auth catch-all: sign-up/in/out, verification, reset, OAuth callbacks.
export const { GET, POST } = toNextJsHandler(auth);
