import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import jwt from "jsonwebtoken";

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  res.sendStatus(200);
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing bearer token" });
  }

  const token = authHeader.slice("Bearer ".length).trim();

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || "supersecret"
    ) as {
      auth_identity_id?: string;
      user_metadata?: { email?: string };
    };

    const authIdentityId = payload.auth_identity_id;
    const email = payload.user_metadata?.email;

    if (!authIdentityId || !email) {
      return res.status(400).json({ message: "Invalid auth token payload" });
    }

    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
    const authService = req.scope.resolve(Modules.AUTH);

    const { data: customers } = await query.graph({
      entity: "customer",
      fields: ["id", "email", "has_account"],
      filters: { email },
    });

    if (!customers?.length) {
      return res.status(404).json({ message: "No existing customer for email" });
    }

    const accountCustomer = customers.find((c: any) => c.has_account) || customers[0];

    const authIdentities = await authService.listAuthIdentities({
      id: authIdentityId,
    });

    const existing = authIdentities?.[0];

    if (!existing) {
      return res.status(404).json({ message: "Auth identity not found" });
    }

    await authService.updateAuthIdentities({
      id: authIdentityId,
      app_metadata: {
        ...(existing.app_metadata || {}),
        customer_id: accountCustomer.id,
      },
    });

    return res.status(200).json({ linked: true, customer_id: accountCustomer.id });
  } catch (e: any) {
    return res.status(400).json({
      message: e?.message || "Failed to link Google auth identity",
    });
  }
}
