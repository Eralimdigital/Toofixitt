// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import JSZip from "https://esm.sh/jszip@3.10.1";
import { jsPDF } from "https://esm.sh/jspdf@2.5.1";
import { buildLicensePack, abbreviate, licenseKey as makeLicenseKey } from "./licensepack.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_mail/gmail/v1";
const NOTIFY_TO = "smithmove0@gmail.com";
const FROM_NAME = "ToolifyHQ Delivery";
const SITE_URL = "https://toolfixit.lovable.app";

function htmlPage(title: string, body: string, color = "#a64dff") {
  return `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title><meta name="viewport" content="width=device-width,initial-scale=1"><style>
  body{margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f4f5f7;color:#1a1a2e;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px;}
  .card{background:#fff;max-width:520px;width:100%;border-radius:14px;padding:38px 32px;box-shadow:0 8px 30px rgba(0,0,0,0.08);text-align:center;}
  h1{margin:0 0 12px;font-size:24px;color:${color};}
  p{margin:8px 0;color:#4a4a5e;line-height:1.55;font-size:15px;}
  .badge{display:inline-block;background:${color};color:#fff;font-size:13px;font-weight:700;padding:6px 14px;border-radius:999px;margin-bottom:18px;letter-spacing:0.5px;}
  a{color:${color};}
  </style></head><body><div class="card">${body}</div></body></html>`;
}

function genLicenseKey(toolName: string) {
  return makeLicenseKey(abbreviate(toolName));
}

function buildPdf(opts: {
  toolName: string;
  toolPrice: string;
  buyerName: string;
  technicianEmail: string;
  orderReference: string;
  licenseKey: string;
  description: string;
  benefits: string[];
}): Uint8Array {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const M = 50;

  // Header banner
  doc.setFillColor(166, 77, 255);
  doc.rect(0, 0, W, 110, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("TOOLIFYHQ — OFFICIAL TOOL DELIVERY", M, 45);
  doc.setFontSize(22);
  doc.text(opts.toolName, M, 78);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Order ${opts.orderReference}`, M, 96);

  let y = 150;
  doc.setTextColor(26, 26, 46);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Delivery Details", M, y);
  y += 8;
  doc.setDrawColor(230, 230, 240);
  doc.line(M, y, W - M, y);
  y += 18;

  const row = (label: string, val: string) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 140);
    doc.text(label, M, y);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(26, 26, 46);
    doc.text(val, M + 140, y);
    y += 20;
  };
  row("Buyer", opts.buyerName);
  row("Technician", opts.technicianEmail);
  row("Price Paid", opts.toolPrice);
  row("License Key", opts.licenseKey);

  y += 14;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("About This Tool", M, y);
  y += 8;
  doc.line(M, y, W - M, y);
  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 80);
  const descLines = doc.splitTextToSize(opts.description, W - M * 2);
  doc.text(descLines, M, y);
  y += descLines.length * 15 + 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(26, 26, 46);
  doc.text("Key Benefits", M, y);
  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 80);
  for (const b of opts.benefits) {
    doc.setTextColor(166, 77, 255);
    doc.text("•", M, y);
    doc.setTextColor(60, 60, 80);
    const lines = doc.splitTextToSize(b, W - M * 2 - 14);
    doc.text(lines, M + 14, y);
    y += lines.length * 15 + 4;
  }

  y += 16;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(26, 26, 46);
  doc.text("Quick Start", M, y);
  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 80);
  const steps = [
    "1. Open the *_INSTRUCTIONS.txt file and read the activation notice fully.",
    "2. Go to the activation portal at https://toofixit.lovable.app/activate",
    "3. Enter your Store URL, License Key, License Number and Activation Code from *_LICENSES.txt.",
    "4. Keep the license files private - they are your proof of purchase.",
  ];
  for (const s of steps) {
    const lines = doc.splitTextToSize(s, W - M * 2);
    doc.text(lines, M, y);
    y += lines.length * 15 + 2;
  }

  // Footer
  const H = doc.internal.pageSize.getHeight();
  doc.setDrawColor(230, 230, 240);
  doc.line(M, H - 60, W - M, H - 60);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(140, 140, 160);
  doc.text(
    `ToolifyHQ — ${SITE_URL}  •  Support: ${NOTIFY_TO}  •  Generated ${new Date().toUTCString()}`,
    M,
    H - 40,
  );

  const ab = doc.output("arraybuffer");
  return new Uint8Array(ab);
}

async function buildZip(req: any, licenseKey: string): Promise<Uint8Array> {
  const zip = new JSZip();

  const pdf = buildPdf({
    toolName: req.tool_name,
    toolPrice: req.tool_price,
    buyerName: req.buyer_name,
    technicianEmail: req.technician_email,
    orderReference: req.order_reference,
    licenseKey,
    description: req.description ?? `Premium ${req.tool_name} package delivered by ToolifyHQ.`,
    benefits: req.benefits ?? ["Professional-grade tool", "Step-by-step instructions included", "Priority email support"],
  });

  zip.file(`${req.tool_slug}-guide.pdf`, pdf);

  const pack = buildLicensePack(req.tool_name, licenseKey);
  for (const [name, content] of Object.entries(pack)) {
    zip.file(name, content as string);
  }

  const out = await zip.generateAsync({ type: "uint8array" });
  return out;
}

function buildRawEmailWithAttachment(
  to: string,
  subject: string,
  html: string,
  text: string,
  attachmentName: string,
  attachmentB64: string,
): string {
  const boundary = `bnd_${crypto.randomUUID()}`;
  // Split base64 into 76-char lines for MIME compliance
  const wrapped = attachmentB64.replace(/(.{76})/g, "$1\r\n");
  const lines = [
    `From: ${FROM_NAME} <${NOTIFY_TO}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    "Content-Transfer-Encoding: 7bit",
    "",
    html,
    "",
    `--${boundary}`,
    `Content-Type: application/zip; name="${attachmentName}"`,
    "Content-Transfer-Encoding: base64",
    `Content-Disposition: attachment; filename="${attachmentName}"`,
    "",
    wrapped,
    "",
    `--${boundary}--`,
  ];
  const msg = lines.join("\r\n");
  const b64 = btoa(unescape(encodeURIComponent(msg)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function bytesToBase64(bytes: Uint8Array): string {
  let s = "";
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    s += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + CHUNK)));
  }
  return btoa(s);
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

async function sendGmail(to: string, raw: string) {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const GOOGLE_MAIL_API_KEY = Deno.env.get("GOOGLE_MAIL_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");
  if (!GOOGLE_MAIL_API_KEY) throw new Error("GOOGLE_MAIL_API_KEY not configured");

  const r = await fetch(`${GATEWAY_URL}/users/me/messages/send`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": GOOGLE_MAIL_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ raw }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(`Gmail send failed [${r.status}]: ${JSON.stringify(j)}`);
  return j;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const url = new URL(req.url);
  const token = url.searchParams.get("token") ?? "";
  const action = (url.searchParams.get("action") ?? "approve").toLowerCase();

  const htmlResp = (status: number, html: string) =>
    new Response(html, { status, headers: { "Content-Type": "text/html; charset=utf-8" } });

  if (!token || token.length < 10) {
    return htmlResp(400, htmlPage("Invalid link", `<div class="badge" style="background:#dc2626;">Invalid</div><h1>Invalid link</h1><p>This approval link is missing or malformed.</p>`));
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: reqRow, error: fetchErr } = await supabase
      .from("tool_delivery_requests")
      .select("*")
      .eq("approval_token", token)
      .maybeSingle();

    if (fetchErr) throw fetchErr;
    if (!reqRow) {
      return htmlResp(404, htmlPage("Not found", `<div class="badge" style="background:#dc2626;">Not found</div><h1>Request not found</h1><p>This approval token does not match any order.</p>`));
    }

    if (reqRow.status === "delivered" || reqRow.delivered_at) {
      return htmlResp(200, htmlPage("Already delivered", `<div class="badge" style="background:#16a34a;">Delivered</div><h1>Already delivered ✓</h1><p><strong>${escapeHtml(reqRow.tool_name)}</strong> was already sent to <strong>${escapeHtml(reqRow.technician_email)}</strong>.</p><p style="font-size:13px;color:#888;">Order ${escapeHtml(reqRow.order_reference)}</p>`, "#16a34a"));
    }
    if (reqRow.status === "rejected" || reqRow.rejected_at) {
      return htmlResp(200, htmlPage("Already rejected", `<div class="badge" style="background:#dc2626;">Rejected</div><h1>Order rejected</h1><p>This order was already marked as rejected and the tool was not delivered.</p>`, "#dc2626"));
    }

    if (action === "reject") {
      await supabase
        .from("tool_delivery_requests")
        .update({ status: "rejected", rejected_at: new Date().toISOString() })
        .eq("id", reqRow.id);
      return htmlResp(200, htmlPage("Rejected", `<div class="badge" style="background:#dc2626;">Rejected</div><h1>Order rejected</h1><p>You marked <strong>${escapeHtml(reqRow.tool_name)}</strong> as rejected. No email was sent to the technician.</p><p style="font-size:13px;color:#888;">Order ${escapeHtml(reqRow.order_reference)}</p>`, "#dc2626"));
    }

    // ---- APPROVE: build ZIP and send ----
    const licenseKey = reqRow.license_key || genLicenseKey(reqRow.tool_name);
    const zipBytes = await buildZip(reqRow, licenseKey);
    const zipB64 = bytesToBase64(zipBytes);
    const fileName = `${reqRow.tool_slug}-toolifyhq.zip`;

    const html = `<!doctype html><html><body style="margin:0;padding:0;background:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1a1a2e;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:24px 0;"><tr><td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.06);">
          <tr><td style="background:linear-gradient(135deg,#a64dff 0%,#cc66ff 100%);padding:28px 32px;color:#fff;">
            <div style="font-size:13px;letter-spacing:1px;text-transform:uppercase;opacity:.85;margin-bottom:6px;">ToolifyHQ Tool Delivery</div>
            <div style="font-size:24px;font-weight:700;">Your tool is ready ✓</div>
            <div style="margin-top:10px;font-size:13px;opacity:.9;">Order Ref: <strong style="font-family:monospace;">${escapeHtml(reqRow.order_reference)}</strong></div>
          </td></tr>
          <tr><td style="padding:28px 32px;">
            <p style="margin:0 0 14px;font-size:15px;line-height:1.6;">Hi,</p>
            <p style="margin:0 0 14px;font-size:15px;line-height:1.6;"><strong>${escapeHtml(reqRow.buyer_name)}</strong> has purchased <strong>${escapeHtml(reqRow.tool_name)}</strong> (${escapeHtml(reqRow.tool_price)}) and has chosen you as the technician to receive it.</p>
            <p style="margin:0 0 14px;font-size:15px;line-height:1.6;">The full tool package is attached as a ZIP file. It contains the branded PDF guide, the license credentials file, the activation instructions, and the license generator script.</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0;border:1px solid #ececf3;border-radius:10px;">
              <tr><td style="padding:14px 18px;font-size:14px;">
                <div style="color:#666;font-size:12px;text-transform:uppercase;letter-spacing:.6px;margin-bottom:4px;">License key</div>
                <div style="font-family:'SF Mono',Menlo,monospace;font-size:15px;font-weight:700;color:#a64dff;">${escapeHtml(licenseKey)}</div>
              </td></tr>
            </table>
            <p style="margin:0 0 6px;font-size:13px;color:#666;">Need help? Reply to this email or contact <a href="mailto:${NOTIFY_TO}" style="color:#a64dff;">${NOTIFY_TO}</a>.</p>
          </td></tr>
          <tr><td style="background:#1a1a2e;padding:18px 32px;text-align:center;color:#a8a8b8;font-size:12px;">ToolifyHQ · <a href="${SITE_URL}" style="color:#cc66ff;text-decoration:none;">toolfixit.lovable.app</a></td></tr>
        </table>
      </td></tr></table>
    </body></html>`;

    const subject = `${reqRow.tool_name} — your ToolifyHQ delivery (${reqRow.order_reference})`;
    const raw = buildRawEmailWithAttachment(
      reqRow.technician_email,
      subject,
      html,
      `Your ToolifyHQ tool ${reqRow.tool_name} is attached as ${fileName}. License: ${licenseKey}`,
      fileName,
      zipB64,
    );

    await sendGmail(reqRow.technician_email, raw);

    // also notify the admin
    try {
      const adminRaw = buildRawEmailWithAttachment(
        NOTIFY_TO,
        `[Delivered] ${reqRow.tool_name} → ${reqRow.technician_email}`,
        `<p>Tool <strong>${escapeHtml(reqRow.tool_name)}</strong> was delivered to <strong>${escapeHtml(reqRow.technician_email)}</strong>.</p><p>Order: ${escapeHtml(reqRow.order_reference)}<br/>License: ${escapeHtml(licenseKey)}</p>`,
        `Delivered ${reqRow.tool_name} to ${reqRow.technician_email}. License ${licenseKey}.`,
        fileName,
        zipB64,
      );
      await sendGmail(NOTIFY_TO, adminRaw);
    } catch (e) {
      console.warn("admin copy failed", e);
    }

    await supabase
      .from("tool_delivery_requests")
      .update({
        status: "delivered",
        approved_at: new Date().toISOString(),
        delivered_at: new Date().toISOString(),
        license_key: licenseKey,
      })
      .eq("id", reqRow.id);

    return htmlResp(
      200,
      htmlPage(
        "Tool delivered",
        `<div class="badge" style="background:#16a34a;">Sent ✓</div>
         <h1>Tool delivered successfully</h1>
         <p><strong>${escapeHtml(reqRow.tool_name)}</strong> has been emailed to <strong>${escapeHtml(reqRow.technician_email)}</strong> with the full ZIP package attached.</p>
         <p style="font-size:13px;color:#888;">Order ${escapeHtml(reqRow.order_reference)} · License ${escapeHtml(licenseKey)}</p>`,
        "#16a34a",
      ),
    );
  } catch (err) {
    const m = err instanceof Error ? err.message : "Unknown error";
    console.error("approve-tool-delivery error", m);
    return htmlResp(
      500,
      htmlPage(
        "Error",
        `<div class="badge" style="background:#dc2626;">Error</div><h1>Something went wrong</h1><p>${escapeHtml(m)}</p>`,
        "#dc2626",
      ),
    );
  }
});