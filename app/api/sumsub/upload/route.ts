import crypto from "crypto";
import FormData from "form-data";

// Note: This API route will not work with static export (output: export)
// Deploy this as a separate API service or use serverless functions
// For static export, these exports are commented out
// export const runtime = "nodejs";
// export const dynamic = "force-dynamic";
// export const revalidate = 0;

const APP_TOKEN = process.env.SUMSUB_APP_TOKEN!;
const SECRET_KEY = process.env.SUMSUB_SECRET_KEY!;
const BASE_URL = process.env.SUMSUB_BASE_URL!;

const LEVEL_NAME = "id-only";

async function getOrCreateApplicant(externalUserId: string) {
  // 1. Try to find existing applicant
  const findUrl = `/resources/applicants?externalUserId=${encodeURIComponent(externalUserId)}`;
  const findTs = Math.floor(Date.now() / 1000).toString();
  const findSig = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(findTs + "GET" + findUrl)
    .digest("hex");

  const findRes = await fetch(BASE_URL + findUrl, {
    method: "GET",
    headers: {
      "X-App-Token": APP_TOKEN,
      "X-App-Access-Sig": findSig,
      "X-App-Access-Ts": findTs,
    },
  });

  const findData = await findRes.json();

  if (findRes.ok) {
    const existingId = findData.id || (findData.items && findData.items[0]?.id);
    if (existingId) return existingId;
  }

  const createUrl = `/resources/applicants?levelName=${encodeURIComponent(LEVEL_NAME)}`;
  const createTs = Math.floor(Date.now() / 1000).toString();
  const createBody = JSON.stringify({ externalUserId });
  const createSig = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(createTs + "POST" + createUrl + createBody)
    .digest("hex");

  const createRes = await fetch(BASE_URL + createUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-App-Token": APP_TOKEN,
      "X-App-Access-Sig": createSig,
      "X-App-Access-Ts": createTs,
    },
    body: createBody,
  });

  const createData = await createRes.json();
  if (!createRes.ok || !createData.id) {
    throw new Error(`Failed to create applicant: ${JSON.stringify(createData)}`);
  }

  return createData.id;
}

async function uploadDocument(
  applicantId: string,
  frontFile: File,
  backFile: File | null,
  docType: string,
  country: string
) {
  const frontRes = await uploadSide(
    applicantId,
    frontFile,
    "front",
    docType,
    country
  );

  let backRes = null;
  if (backFile) {
    backRes = await uploadSide(applicantId, backFile, "back", docType, country);
  }

  return { frontRes, backRes };
}

async function uploadSide(
  applicantId: string,
  file: File,
  side: "front" | "back" | null,
  docType: string,
  country: string
) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const form = new FormData();
  const metadata: any = {
    idDocType: docType.toUpperCase(),
    country: country.toUpperCase(),
  };
  if (side) {
    metadata.idDocSubType = side === "front" ? "FRONT_SIDE" : "BACK_SIDE";
  }

  form.append("metadata", JSON.stringify(metadata));
  form.append("content", buffer, {
    filename: file.name || "image.jpg",
    contentType: file.type || "image/jpeg",
  });

  const body = form.getBuffer();
  const bodyUint8 = new Uint8Array(body);
  const headers = form.getHeaders();

  const url = `/resources/applicants/${applicantId}/info/idDoc`;
  const ts = Math.floor(Date.now() / 1000).toString();
  const sig = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(ts + "POST" + url)
    .update(bodyUint8)
    .digest("hex");

  const res = await fetch(BASE_URL + url, {
    method: "POST",
    headers: {
      ...headers,
      "X-App-Token": APP_TOKEN,
      "X-App-Access-Sig": sig,
      "X-App-Access-Ts": ts,
    },
    body: bodyUint8,
  });

  const responseText = await res.text();
  if (!res.ok) throw new Error(`Upload failed: ${responseText}`);

  try {
    return JSON.parse(responseText);
  } catch (e) {
    return { status: "ok", text: responseText };
  }
}

async function startVerification(applicantId: string) {
  const url = `/resources/applicants/${applicantId}/status/pending`;
  const ts = Math.floor(Date.now() / 1000).toString();
  const sig = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(ts + "POST" + url)
    .digest("hex");

  const res = await fetch(BASE_URL + url, {
    method: "POST",
    headers: {
      "X-App-Token": APP_TOKEN,
      "X-App-Access-Sig": sig,
      "X-App-Access-Ts": ts,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  return data;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const frontFile = formData.get("front") as File | null;
    const backFile = formData.get("back") as File | null;
    const docTypeInput = formData.get("docType") as string;
    const countryInput = formData.get("country") as string;
    const docType = docTypeInput?.toUpperCase();
    const country = countryInput?.toUpperCase();
    const externalUserId = formData.get("externalUserId") as string;

    if (!externalUserId || !docType || !country || !frontFile) {
      return Response.json({ error: "Required fields missing" }, { status: 400 });
    }

    const applicantId = await getOrCreateApplicant(externalUserId);
    const docRes = await uploadDocument(applicantId, frontFile, backFile, docType, country);
    const verificationRes = await startVerification(applicantId);

    return Response.json({
      status: true,
      message: "Document uploaded & verification started",
      document: docRes,
      verification: verificationRes,
      nextStep: "Verification in progress",
      applicantId,
    });
  } catch (err: any) {
    console.error("Sumsub error:", err);
    return Response.json({ status: false, error: err.message }, { status: 500 });
  }
}
