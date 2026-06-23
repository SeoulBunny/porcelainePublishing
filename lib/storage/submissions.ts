import { randomUUID } from "node:crypto";
import { mkdir, stat, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import {
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getS3, getBucket, MAX_PDF_BYTES, PDF_CONTENT_TYPE } from "./s3";

// PDF object lifecycle for submissions. Two backends behind one interface:
//  • S3-compatible (R2 now → MinIO later) when S3_ENDPOINT is set — bucket stays
//    private, browser uses short-lived presigned PUT/GET.
//  • Local disk under .uploads/ when S3_ENDPOINT is absent (dev) — "presigned"
//    URLs point at /api/storage/dev, which validates and serves the file.
// Key scheme: submissions/{journalId}/{submissionId}/{uuid}.pdf

const useLocal = !process.env.S3_ENDPOINT;
const LOCAL_ROOT = join(process.cwd(), ".uploads");

export function buildSubmissionKey(journalId: string, submissionId: string): string {
  return `submissions/${journalId}/${submissionId}/${randomUUID()}.pdf`;
}

function localPath(key: string): string {
  // key is server-built (buildSubmissionKey); reject traversal defensively
  if (key.includes("..")) throw new Error("Invalid key");
  return join(LOCAL_ROOT, key);
}

export async function presignUpload(key: string): Promise<string> {
  if (useLocal) return `/api/storage/dev?key=${encodeURIComponent(key)}`;
  return getSignedUrl(
    getS3(),
    new PutObjectCommand({ Bucket: getBucket(), Key: key, ContentType: PDF_CONTENT_TYPE }),
    { expiresIn: 300 },
  );
}

export async function presignDownload(key: string, filename?: string): Promise<string> {
  if (useLocal) return `/api/storage/dev?key=${encodeURIComponent(key)}`;
  return getSignedUrl(
    getS3(),
    new GetObjectCommand({
      Bucket: getBucket(),
      Key: key,
      ResponseContentType: PDF_CONTENT_TYPE,
      ...(filename
        ? { ResponseContentDisposition: `inline; filename="${filename.replace(/"/g, "")}.pdf"` }
        : {}),
    }),
    { expiresIn: 120 },
  );
}

export type UploadCheck = { ok: true } | { ok: false; reason: string };

// Confirm a just-uploaded object is a PDF within the size limit. In local mode
// the dev route already enforces this on write, so we just confirm size on disk.
export async function verifyUploadedPdf(key: string): Promise<UploadCheck> {
  if (useLocal) {
    try {
      const s = await stat(localPath(key));
      if (s.size <= 0) return { ok: false, reason: "Uploaded file is empty." };
      if (s.size > MAX_PDF_BYTES) return { ok: false, reason: "PDF exceeds the 15 MB limit." };
      return { ok: true };
    } catch {
      return { ok: false, reason: "Upload not found." };
    }
  }
  const head = await getS3().send(new HeadObjectCommand({ Bucket: getBucket(), Key: key }));
  const length = head.ContentLength ?? 0;
  const type = head.ContentType ?? "";
  if (type !== PDF_CONTENT_TYPE) return { ok: false, reason: "File must be a PDF." };
  if (length <= 0) return { ok: false, reason: "Uploaded file is empty." };
  if (length > MAX_PDF_BYTES) return { ok: false, reason: "PDF exceeds the 15 MB limit." };
  return { ok: true };
}

export async function deleteObject(key: string): Promise<void> {
  if (useLocal) {
    await rm(localPath(key), { force: true });
    return;
  }
  await getS3().send(new DeleteObjectCommand({ Bucket: getBucket(), Key: key }));
}

// Used only by the dev storage route to persist an uploaded buffer.
export async function writeLocalPdf(key: string, data: Buffer): Promise<void> {
  const path = localPath(key);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, data);
}

export function readLocalPath(key: string): string {
  return localPath(key);
}

export const STORAGE_IS_LOCAL = useLocal;
