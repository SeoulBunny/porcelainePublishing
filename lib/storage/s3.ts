import { S3Client } from "@aws-sdk/client-s3";

// One S3-compatible client. The endpoint is the only thing that changes between
// Cloudflare R2 (today) and a self-hosted MinIO (later) — both speak the S3 API,
// so swapping providers is an env change, not a code change. forcePathStyle is
// required by MinIO and accepted by R2's custom endpoints.

declare global {
  // eslint-disable-next-line no-var
  var __s3Client: S3Client | undefined;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

export function getS3(): S3Client {
  if (!globalThis.__s3Client) {
    globalThis.__s3Client = new S3Client({
      region: process.env.S3_REGION || "auto",
      endpoint: requireEnv("S3_ENDPOINT"),
      forcePathStyle: true,
      credentials: {
        accessKeyId: requireEnv("S3_ACCESS_KEY_ID"),
        secretAccessKey: requireEnv("S3_SECRET_ACCESS_KEY"),
      },
    });
  }
  return globalThis.__s3Client;
}

export function getBucket(): string {
  return requireEnv("S3_BUCKET");
}

export const MAX_PDF_BYTES = 15 * 1024 * 1024; // 15 MB
export const PDF_CONTENT_TYPE = "application/pdf";
