import { httpRouter } from "convex/server";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { auth } from "./auth";

const http = httpRouter();

// Mount Convex Auth routes
auth.addHttpRoutes(http);

// Polar webhook handler
http.route({
  path: "/webhook/polar",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    try {
      const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;

      if (!webhookSecret) {
        console.error("POLAR_WEBHOOK_SECRET not configured");
        return new Response("Webhook secret not configured", { status: 500 });
      }

      // Get the signature from headers
      const _signature = req.headers.get("webhook-signature");

      // TODO: Verify webhook signature with Polar's verification logic
      // For now, we'll process the webhook payload directly
      // In production, you should verify the signature properly

      const payload = await req.json();
      const { data, type } = payload;

      // Process subscription events
      if (
        type === "subscription.created" ||
        type === "subscription.active" ||
        type === "subscription.canceled" ||
        type === "subscription.revoked" ||
        type === "subscription.uncanceled" ||
        type === "subscription.updated"
      ) {
        console.log("🎯 Processing subscription webhook:", type);

        await ctx.runMutation(internal.subscriptions.upsertSubscription, {
          subscriptionData: data,
        });

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Unknown event type
      return new Response(JSON.stringify({ success: true, skipped: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("❌ Error processing Polar webhook:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

export default http;
