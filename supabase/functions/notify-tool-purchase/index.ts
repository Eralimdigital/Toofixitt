import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_mail/gmail/v1";
const NOTIFY_TO = "smithmove0@gmail.com";
const SITE_URL = "https://toolfixit.lovable.app";
const FROM_NAME = "ToolifyHQ Orders";
const FUNCTIONS_URL = "https://wvcozqxokjeoiacdkhsh.supabase.co/functions/v1";

const ItemSchema = z.object({
  toolSlug: z.string().min(1).max(200),
  toolName: z.string().min(1).max(200),
  toolPrice: z.string().min(1).max(40),
});

const BodySchema = z.object({
  items: z.array(ItemSchema).min(1).max(50),
  buyerName: z.string().min(1).max(120),
  technicianEmail: z.string().email().max(254),
  transactionId: z.string().min(3).max(128),
});

type EmailData = {
  toolSlug: string;
  toolName: string;
  toolPrice: string;
  buyerName: string;
  technicianEmail: string;
  transactionId: string;
  orderReference: string;
  approvalToken: string;
};

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildHtml(d: EmailData) {
  const imageUrl = `${SITE_URL}/images/tools/${encodeURIComponent(d.toolSlug)}.jpg`;
  const toolUrl = `${SITE_URL}/tools/${encodeURIComponent(d.toolSlug)}`;
  const ts = new Date().toLocaleString("en-US", {
    timeZone: "UTC",
    dateStyle: "medium",
    timeStyle: "short",
  });

  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1a1a2e;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.06);">
        <tr><td style="background:linear-gradient(135deg,#a64dff 0%,#cc66ff 100%);padding:28px 32px;color:#ffffff;">
          <div style="font-size:13px;letter-spacing:1px;text-transform:uppercase;opacity:0.85;margin-bottom:6px;">ToolifyHQ Order Notification</div>
          <div style="font-size:24px;font-weight:700;">New Tool Purchase Request</div>
          <div style="margin-top:10px;font-size:13px;opacity:0.9;">Order Ref: <strong style="font-family:monospace;">${escapeHtml(d.orderReference)}</strong></div>
        </td></tr>

        <tr><td style="padding:28px 32px 8px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #ececf3;border-radius:10px;overflow:hidden;">
            <tr>
              <td width="140" style="padding:14px;background:#faf8ff;vertical-align:top;">
                <img src="${imageUrl}" alt="${escapeHtml(d.toolName)}" width="120" style="width:120px;height:120px;object-fit:cover;border-radius:8px;display:block;border:1px solid #ececf3;" />
              </td>
              <td style="padding:16px;vertical-align:top;">
                <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.8px;color:#a64dff;font-weight:700;margin-bottom:6px;">Tool purchased</div>
                <div style="font-size:18px;font-weight:700;color:#1a1a2e;margin-bottom:8px;line-height:1.3;">${escapeHtml(d.toolName)}</div>
                <div style="font-size:22px;font-weight:800;color:#a64dff;margin-bottom:10px;">${escapeHtml(d.toolPrice)}</div>
                <a href="${toolUrl}" style="font-size:12px;color:#7a3dcc;text-decoration:none;border-bottom:1px solid #d6b3ff;">View tool page →</a>
              </td>
            </tr>
          </table>
        </td></tr>

        <tr><td style="padding:20px 32px 8px;">
          <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:#666;margin-bottom:12px;">Order Details</div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
            <tr><td style="padding:8px 0;color:#666;width:160px;">Buyer name</td><td style="padding:8px 0;color:#1a1a2e;font-weight:600;">${escapeHtml(d.buyerName)}</td></tr>
            <tr><td style="padding:8px 0;color:#666;border-top:1px solid #f0f0f5;">Deliver tool to</td><td style="padding:8px 0;color:#1a1a2e;font-weight:600;border-top:1px solid #f0f0f5;"><a href="mailto:${escapeHtml(d.technicianEmail)}" style="color:#a64dff;text-decoration:none;">${escapeHtml(d.technicianEmail)}</a></td></tr>
            <tr><td style="padding:8px 0;color:#666;border-top:1px solid #f0f0f5;">Transaction ID</td><td style="padding:8px 0;color:#1a1a2e;font-weight:600;border-top:1px solid #f0f0f5;font-family:'SF Mono',Menlo,monospace;font-size:13px;">${escapeHtml(d.transactionId)}</td></tr>
            <tr><td style="padding:8px 0;color:#666;border-top:1px solid #f0f0f5;">Submitted</td><td style="padding:8px 0;color:#1a1a2e;border-top:1px solid #f0f0f5;">${escapeHtml(ts)} UTC</td></tr>
          </table>
        </td></tr>

        <tr><td style="padding:20px 32px 28px;">
          <div style="background:linear-gradient(135deg,rgba(166,77,255,0.08) 0%,rgba(204,102,255,0.08) 100%);border:1px solid rgba(166,77,255,0.25);border-radius:10px;padding:16px 18px;">
            <div style="font-size:13px;font-weight:700;color:#7a3dcc;margin-bottom:6px;">⚡ Action required</div>
            <div style="font-size:13px;color:#3a3a4e;line-height:1.55;margin-bottom:14px;">Verify the transaction ID in your payment dashboard. Then click <strong>Approve &amp; Send</strong> to auto-deliver the tool ZIP to the technician, or <strong>Reject</strong> if the payment looks fake.</div>
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr>
              <td style="padding-right:8px;"><a href="${FUNCTIONS_URL}/approve-tool-delivery?token=${encodeURIComponent(d.approvalToken)}&action=approve" style="display:inline-block;background:linear-gradient(135deg,#16a34a,#22c55e);color:#fff;text-decoration:none;padding:12px 22px;border-radius:8px;font-weight:700;font-size:14px;">✓ Approve &amp; Send Tool</a></td>
              <td style="padding-left:8px;"><a href="${FUNCTIONS_URL}/approve-tool-delivery?token=${encodeURIComponent(d.approvalToken)}&action=reject" style="display:inline-block;background:#ffffff;color:#dc2626;text-decoration:none;padding:12px 22px;border-radius:8px;font-weight:700;font-size:14px;border:1.5px solid #dc2626;">✕ Reject</a></td>
            </tr></table>
          </div>
        </td></tr>

        <tr><td style="background:#1a1a2e;padding:18px 32px;text-align:center;color:#a8a8b8;font-size:12px;">
          ToolifyHQ · Automated order notification · <a href="${SITE_URL}" style="color:#cc66ff;text-decoration:none;">toolfixit.lovable.app</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function buildRawEmail(to: string, subject: string, html: string): string {
  const boundary = `bnd_${crypto.randomUUID()}`;
  const lines = [
    `From: ${FROM_NAME} <${NOTIFY_TO}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "",
    "New tool purchase request received. View this email in HTML to see details.",
    "",
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    "Content-Transfer-Encoding: 7bit",
    "",
    html,
    "",
    `--${boundary}--`,
  ];
  const msg = lines.join("\r\n");
  // base64url encode
  const b64 = btoa(unescape(encodeURIComponent(msg)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const GOOGLE_MAIL_API_KEY = Deno.env.get("GOOGLE_MAIL_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");
    if (!GOOGLE_MAIL_API_KEY) throw new Error("GOOGLE_MAIL_API_KEY not configured");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase service credentials not configured");
    }

    const json = await req.json();
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const { items, buyerName, technicianEmail, transactionId } = parsed.data;

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    const rows = items.map((it) => ({
      tool_slug: it.toolSlug,
      tool_name: it.toolName,
      tool_price: it.toolPrice,
      buyer_name: buyerName,
      technician_email: technicianEmail,
      transaction_id: transactionId,
    }));

    const { data: inserted, error: insertError } = await admin
      .from("tool_delivery_requests")
      .insert(rows)
      .select("tool_slug, tool_name, tool_price, order_reference, approval_token");

    if (insertError) {
      console.error("Insert failed", insertError);
      throw new Error(`Failed to record order: ${insertError.message}`);
    }

    const results: { ok: boolean; messageId?: string; error?: string }[] = [];
    for (const row of inserted ?? []) {
      const emailData: EmailData = {
        toolSlug: row.tool_slug,
        toolName: row.tool_name,
        toolPrice: row.tool_price,
        buyerName,
        technicianEmail,
        transactionId,
        orderReference: row.order_reference ?? "",
        approvalToken: row.approval_token ?? "",
      };
      const html = buildHtml(emailData);
      const subject = `🛒 New order: ${row.tool_name} — ${row.tool_price} (${row.order_reference ?? ""})`;
      const raw = buildRawEmail(NOTIFY_TO, subject, html);

      const response = await fetch(`${GATEWAY_URL}/users/me/messages/send`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "X-Connection-Api-Key": GOOGLE_MAIL_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ raw }),
      });
      const result = await response.json();
      if (!response.ok) {
        console.error("Gmail send failed", response.status, result);
        results.push({ ok: false, error: `Gmail [${response.status}]` });
      } else {
        results.push({ ok: true, messageId: result.id });
      }
    }

    return new Response(
      JSON.stringify({ success: true, count: inserted?.length ?? 0, results }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("notify-tool-purchase error:", msg);
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});