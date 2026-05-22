import { Router, Request, Response } from "express";
import { getDb } from "../db.js";
import { sendReceiptEmail } from "../email.js";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "";
const PAYSTACK_API = "https://api.paystack.co";

const router = Router();

async function paystackPost(path: string, body: any) {
  const res = await fetch(`${PAYSTACK_API}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function paystackGet(path: string) {
  const res = await fetch(`${PAYSTACK_API}${path}`, {
    headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
  });
  return res.json();
}

router.post("/initialize", async (req: Request, res: Response) => {
  try {
    const { email, amount, metadata } = req.body;
    if (!email || !amount) {
      return res.status(400).json({ error: "Email and amount are required" });
    }

    const response = await paystackPost("/transaction/initialize", {
      email,
      amount: Math.round(amount * 100),
      currency: "GHS",
      channels: ["mobile_money", "card"],
      metadata: {
        ...metadata,
        source: "stsc-college",
      },
    });

    if (!response.status) {
      return res.status(400).json({ error: response.message || "Failed to initialize payment" });
    }

    res.json({
      success: true,
      authorizationUrl: response.data.authorization_url,
      accessCode: response.data.access_code,
      reference: response.data.reference,
    });
  } catch (error) {
    console.error("[payments] initialize error:", error);
    res.status(500).json({ error: "Failed to initialize payment" });
  }
});

router.post("/initialize-momo", async (req: Request, res: Response) => {
  try {
    const { email, amount, phone, network, metadata } = req.body;
    if (!email || !amount || !phone || !network) {
      return res.status(400).json({ error: "Email, amount, phone, and network are required" });
    }

    const response = await paystackPost("/transaction/initialize", {
      email,
      amount: Math.round(amount * 100),
      currency: "GHS",
      channels: ["mobile_money"],
      mobile_money: { phone, provider: network },
      metadata: {
        ...metadata,
        source: "stsc-college",
        payment_channel: network,
      },
    });

    if (!response.status) {
      return res.status(400).json({ error: response.message || "Failed to initialize payment" });
    }

    res.json({
      success: true,
      authorizationUrl: response.data.authorization_url,
      accessCode: response.data.access_code,
      reference: response.data.reference,
    });
  } catch (error) {
    console.error("[payments] initialize-momo error:", error);
    res.status(500).json({ error: "Failed to initialize mobile money payment" });
  }
});

router.get("/verify/:reference", async (req: Request, res: Response) => {
  try {
    const { reference } = req.params;
    const response = await paystackGet(`/transaction/verify/${reference}`);

    if (!response.status) {
      return res.status(400).json({ error: response.message || "Verification failed" });
    }

    const data = response.data;
    res.json({
      success: true,
      verified: data.status === "success",
      amount: data.amount / 100,
      currency: data.currency,
      channel: data.channel,
      paidAt: data.paid_at,
      reference: data.reference,
      customer: {
        email: data.customer.email,
        name: `${data.customer.first_name || ""} ${data.customer.last_name || ""}`.trim(),
      },
    });
  } catch (error) {
    console.error("[payments] verify error:", error);
    res.status(500).json({ error: "Failed to verify payment" });
  }
});

router.post("/webhook", async (req: Request, res: Response) => {
  try {
    const event = req.body;

    if (event.event === "charge.success") {
      const { reference, status, amount, channel, paid_at, customer, metadata } = event.data;

      if (status === "success") {
        const db = await getDb();
        const appRef = metadata?.application_ref || metadata?.reference || reference;

        await db.application.updateMany({
          where: { paymentRef: appRef },
          data: {
            paymentStatus: "VERIFIED",
            paidAt: new Date(paid_at),
            paymentAmount: amount / 100,
          },
        });
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("[payments] webhook error:", error);
    res.sendStatus(200);
  }
});

router.get("/banks", async (_req: Request, res: Response) => {
  try {
    const response = await paystackGet("/bank?country=ghana");
    if (!response.status) {
      return res.status(400).json({ error: "Failed to fetch banks" });
    }
    res.json({ success: true, banks: response.data });
  } catch (error) {
    console.error("[payments] banks error:", error);
    res.status(500).json({ error: "Failed to fetch banks" });
  }
});

// ============================================================
// NEW FEATURE: Direct Mobile Money Push Payment (via Charge)
// ============================================================
router.post("/charge-momo", async (req: Request, res: Response) => {
  try {
    const { email, amount, phone, network, metadata } = req.body;
    if (!email || !amount || !phone || !network) {
      return res.status(400).json({ error: "Email, amount, phone, and network are required" });
    }

    const response = await paystackPost("/charge", {
      email,
      amount: Math.round(amount * 100),
      currency: "GHS",
      mobile_money: { phone, provider: network },
      metadata: {
        ...metadata,
        source: "stsc-college",
        payment_channel: network,
      },
    });

    if (!response.status) {
      return res.status(400).json({ error: response.message || "Charge failed" });
    }

    res.json({
      success: true,
      reference: response.data.reference,
      status: response.data.status,
      displayText: response.data.display_text,
    });
  } catch (error) {
    console.error("[payments] charge-momo error:", error);
    res.status(500).json({ error: "Failed to initiate mobile money charge" });
  }
});

// ============================================================
// NEW FEATURE: Payment Receipt
// ============================================================
router.get("/receipt/:reference", async (req: Request, res: Response) => {
  try {
    const { reference } = req.params;
    const response = await paystackGet(`/transaction/verify/${reference}`);

    if (!response.status) {
      return res.status(400).json({ error: response.message || "Transaction not found" });
    }

    const data = response.data;
    const receipt = {
      receiptNumber: `RCP-${data.reference}`,
      reference: data.reference,
      amount: data.amount / 100,
      currency: data.currency,
      channel: data.channel,
      status: data.status,
      paidAt: data.paid_at,
      customer: {
        email: data.customer.email,
        name: `${data.customer.first_name || ""} ${data.customer.last_name || ""}`.trim(),
      },
      authorization: data.authorization
        ? {
            last4: data.authorization.last4,
            cardType: data.authorization.card_type,
            bank: data.authorization.bank,
          }
        : null,
      processor: "Paystack",
    };

    res.json({ success: true, receipt });
  } catch (error) {
    console.error("[payments] receipt error:", error);
    res.status(500).json({ error: "Failed to generate receipt" });
  }
});

// ============================================================
// NEW FEATURE: Send Receipt via Email
// ============================================================
router.post("/receipt/send", async (req: Request, res: Response) => {
  try {
    const { reference, email } = req.body;
    if (!reference || !email) {
      return res.status(400).json({ error: "Reference and email are required" });
    }

    const verifyRes = await paystackGet(`/transaction/verify/${reference}`);
    if (!verifyRes.status) {
      return res.status(400).json({ error: verifyRes.message || "Transaction not found" });
    }

    const data = verifyRes.data;
    const receipt = {
      receiptNumber: `RCP-${data.reference}`,
      reference: data.reference,
      amount: data.amount / 100,
      currency: data.currency,
      channel: data.channel,
      status: data.status,
      paidAt: data.paid_at,
      customer: {
        email: data.customer.email,
        name: `${data.customer.first_name || ""} ${data.customer.last_name || ""}`.trim(),
      },
    };

    const sent = await sendReceiptEmail(email, receipt);
    if (!sent) {
      return res.status(500).json({ error: "Failed to send receipt email" });
    }

    res.json({ success: true, message: "Receipt sent successfully" });
  } catch (error) {
    console.error("[payments] send receipt error:", error);
    res.status(500).json({ error: "Failed to send receipt" });
  }
});

// ============================================================
// NEW FEATURE: Payment Lookup by Email (for Payment History)
// ============================================================
router.get("/lookup", async (req: Request, res: Response) => {
  try {
    const email = req.query.email as string;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const db = await getDb();
    const applications = await db.application.findMany({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        paymentRef: true,
        paymentChannel: true,
        paymentStatus: true,
        paymentAmount: true,
        paidAt: true,
        program: { select: { title: true } },
        submittedAt: true,
      },
      orderBy: { submittedAt: "desc" },
    });

    res.json({ success: true, payments: applications });
  } catch (error) {
    console.error("[payments] lookup error:", error);
    res.status(500).json({ error: "Failed to lookup payments" });
  }
});

// ============================================================
// NEW FEATURE: Refund Payment (Admin)
// ============================================================
router.post("/refund", async (req: Request, res: Response) => {
  try {
    const { reference, amount } = req.body;
    if (!reference) {
      return res.status(400).json({ error: "Transaction reference is required" });
    }

    const body: any = { transaction: reference };
    if (amount) {
      body.amount = Math.round(amount * 100);
    }

    const response = await paystackPost("/refund", body);

    if (!response.status) {
      return res.status(400).json({ error: response.message || "Refund failed" });
    }

    // Update application in DB
    const db = await getDb();
    await db.application.updateMany({
      where: { paymentRef: reference },
      data: { paymentStatus: "REFUNDED" },
    });

    res.json({
      success: true,
      refundId: response.data.id,
      status: response.data.status,
    });
  } catch (error) {
    console.error("[payments] refund error:", error);
    res.status(500).json({ error: "Failed to process refund" });
  }
});

// ============================================================
// NEW FEATURE: Payment Analytics
// ============================================================
router.get("/analytics", async (_req: Request, res: Response) => {
  try {
    const db = await getDb();
    const applications = await db.application.findMany({
      select: {
        paymentStatus: true,
        paymentChannel: true,
        paymentAmount: true,
        paidAt: true,
        submittedAt: true,
      },
    });

    const total = applications.length;
    const paid = applications.filter((a) => a.paymentStatus === "PAID" || a.paymentStatus === "VERIFIED").length;
    const unpaid = applications.filter((a) => a.paymentStatus === "UNPAID").length;
    const refunded = applications.filter((a) => a.paymentStatus === "REFUNDED").length;
    const totalRevenue = applications.reduce((sum, a) => sum + (a.paymentAmount || 0), 0);

    const channelBreakdown: Record<string, number> = {};
    applications.forEach((a) => {
      if (a.paymentChannel) {
        const key = a.paymentChannel.includes("momo") ? "Mobile Money" : a.paymentChannel.includes("card") ? "Card" : a.paymentChannel;
        channelBreakdown[key] = (channelBreakdown[key] || 0) + 1;
      }
    });

    // Monthly payment data (last 12 months)
    const monthlyData: Record<string, { count: number; revenue: number }> = {};
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthlyData[key] = { count: 0, revenue: 0 };
    }
    applications.forEach((a) => {
      if (a.paidAt) {
        const d = new Date(a.paidAt);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        if (monthlyData[key]) {
          monthlyData[key].count++;
          monthlyData[key].revenue += a.paymentAmount || 0;
        }
      }
    });

    const monthly = Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({ month, ...data }));

    res.json({
      success: true,
      analytics: {
        total,
        paid,
        unpaid,
        refunded,
        totalRevenue,
        channelBreakdown: Object.entries(channelBreakdown).map(([channel, count]) => ({ channel, count })),
        monthly,
      },
    });
  } catch (error) {
    console.error("[payments] analytics error:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

export default router;
