// Separate API Server for Sumsub APIs
// This file should be deployed separately from the static Next.js export
// Deploy this as a Node.js server (Express, Vercel Serverless, etc.)

const express = require('express');
const crypto = require('crypto');
const FormData = require('form-data');
const fetch = require('node-fetch');
const multer = require('multer');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const APP_TOKEN = process.env.SUMSUB_APP_TOKEN;
const SECRET_KEY = process.env.SUMSUB_SECRET_KEY;
const BASE_URL = process.env.SUMSUB_BASE_URL;
const LEVEL_NAME = "id-only";

// Middleware
app.use(express.json());

// CORS middleware - adjust origins as needed
app.use((req, res, next) => {
  const origin = req.headers.origin;
  // Add your frontend domain here
  const allowedOrigins = [
    'http://localhost:3000',
    process.env.FRONTEND_URL,
    // Add your production domain
  ].filter(Boolean);
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

async function getOrCreateApplicant(externalUserId) {
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

async function uploadSide(applicantId, file, side, docType, country) {
  const form = new FormData();
  const metadata = {
    idDocType: docType.toUpperCase(),
    country: country.toUpperCase(),
  };
  
  if (side) {
    metadata.idDocSubType = side === "front" ? "FRONT_SIDE" : "BACK_SIDE";
  }

  form.append("metadata", JSON.stringify(metadata));
  form.append("content", file.buffer, {
    filename: file.originalname || "image.jpg",
    contentType: file.mimetype || "image/jpeg",
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

async function uploadDocument(applicantId, frontFile, backFile, docType, country) {
  const frontRes = await uploadSide(applicantId, frontFile, "front", docType, country);
  let backRes = null;
  
  if (backFile) {
    backRes = await uploadSide(applicantId, backFile, "back", docType, country);
  }

  return { frontRes, backRes };
}

async function startVerification(applicantId) {
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

// Upload endpoint
app.post('/sumsub/upload', upload.fields([
  { name: 'front', maxCount: 1 },
  { name: 'back', maxCount: 1 }
]), async (req, res) => {
  try {
    const frontFile = req.files?.front?.[0];
    const backFile = req.files?.back?.[0];
    const docType = req.body.docType?.toUpperCase();
    const country = req.body.country?.toUpperCase();
    const externalUserId = req.body.externalUserId;

    if (!externalUserId || !docType || !country || !frontFile) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    const applicantId = await getOrCreateApplicant(externalUserId);
    const docRes = await uploadDocument(applicantId, frontFile, backFile, docType, country);
    const verificationRes = await startVerification(applicantId);

    return res.json({
      status: true,
      message: "Document uploaded & verification started",
      document: docRes,
      verification: verificationRes,
      nextStep: "Verification in progress",
      applicantId,
    });
  } catch (err) {
    console.error("Sumsub error:", err);
    return res.status(500).json({ status: false, error: err.message });
  }
});

// Status endpoint
app.get('/sumsub/status', async (req, res) => {
  try {
    const applicantId = req.query.applicantId;

    if (!applicantId) {
      return res.status(400).json({ error: "applicantId is required" });
    }

    const url = `/resources/applicants/${applicantId}/one`;
    const ts = Math.floor(Date.now() / 1000).toString();
    const sig = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(ts + "GET" + url)
      .digest("hex");

    const response = await fetch(BASE_URL + url, {
      method: "GET",
      headers: {
        "X-App-Token": APP_TOKEN,
        "X-App-Access-Sig": sig,
        "X-App-Access-Ts": ts,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    return res.json(data);
  } catch (error) {
    console.error("Sumsub status error:", error);
    return res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  // console.log(`API Server running on port ${PORT}`);
});

module.exports = app;

