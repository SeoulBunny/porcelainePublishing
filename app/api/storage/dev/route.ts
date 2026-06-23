import { readFile } from "node:fs/promises";
import { getActor } from "@/lib/auth/guards";
import { getSubmission, isEditorOfJournal } from "@/lib/db/queries";
import {
  STORAGE_IS_LOCAL,
  verifyUploadedPdf,
  writeLocalPdf,
  readLocalPath,
} from "@/lib/storage/submissions";
import { MAX_PDF_BYTES, PDF_CONTENT_TYPE } from "@/lib/storage/s3";

// Dev-only local PDF store, standing in for R2/S3 until S3_ENDPOINT is set.
// Same-origin PUT (upload) + GET (view). Access is checked against the
// submission the key belongs to, so this is not an open file bucket.

function off() {
  return new Response("Not found", { status: 404 });
}

// key shape: submissions/{journalId}/{submissionId}/{uuid}.pdf
function parseKey(key: string | null): { journalId: string; submissionId: string } | null {
  if (!key || key.includes("..")) return null;
  const m = key.match(/^submissions\/([^/]+)\/([^/]+)\/[^/]+\.pdf$/);
  return m ? { journalId: m[1], submissionId: m[2] } : null;
}

export async function PUT(request: Request) {
  if (!STORAGE_IS_LOCAL) return off();
  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  const parsed = parseKey(key);
  if (!key || !parsed) return new Response("Bad key", { status: 400 });

  // only the submission's author may upload to its key
  const actor = await getActor();
  const sub = await getSubmission(parsed.submissionId);
  if (!sub || sub.authorUserId !== actor.id) return new Response("Forbidden", { status: 403 });

  if (request.headers.get("content-type") !== PDF_CONTENT_TYPE) {
    return new Response("PDF only", { status: 415 });
  }
  const buf = Buffer.from(await request.arrayBuffer());
  if (buf.byteLength <= 0) return new Response("Empty", { status: 400 });
  if (buf.byteLength > MAX_PDF_BYTES) return new Response("Too large", { status: 413 });
  // magic bytes: real PDFs start with "%PDF-"
  if (buf.subarray(0, 5).toString("latin1") !== "%PDF-") return new Response("Not a PDF", { status: 415 });

  await writeLocalPdf(key, buf);
  return new Response(null, { status: 200 });
}

export async function GET(request: Request) {
  if (!STORAGE_IS_LOCAL) return off();
  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  const parsed = parseKey(key);
  if (!key || !parsed) return new Response("Bad key", { status: 400 });

  // author OR an editor/admin of the journal may view
  const actor = await getActor();
  const sub = await getSubmission(parsed.submissionId);
  if (!sub) return new Response("Not found", { status: 404 });
  const isOwner = sub.authorUserId === actor.id;
  const isReviewer =
    actor.role === "admin" ||
    (actor.role === "editor" && (await isEditorOfJournal(actor.id, sub.journalId)));
  if (!isOwner && !isReviewer) return new Response("Forbidden", { status: 403 });

  try {
    const data = await readFile(readLocalPath(key));
    return new Response(new Uint8Array(data), {
      headers: { "content-type": PDF_CONTENT_TYPE, "content-disposition": "inline" },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
