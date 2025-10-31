import { NextResponse } from "next/server";
import Stripe from "stripe";
import Logger from "@/app/lib/logger";

const logger = new Logger("CHECKOUT");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});


export async function POST(request: Request) {
  try {
    const { experienceId, slotId, quantity, experienceName, total, email, fullName } = await request.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: experienceName,
              description: `Booking for ${quantity} person(s)`,
            },
            unit_amount: Math.round(total * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_API_URL}/api/confirm-booking?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_API_URL}/checkout?experienceId=${experienceId}&slotId=${slotId}&quantity=${quantity}`,
      metadata: {
        experienceId,
        slotId,
        quantity: quantity.toString(),
        email,
        fullName,
      },
      customer_email: email,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    logger.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}