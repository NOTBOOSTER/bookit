import { NextResponse } from "next/server";
import Stripe from "stripe";
import createPool from "@/app/lib/db/mysql";
import { RowDataPacket } from "mysql2/promise";
import Logger from "@/app/lib/logger";

const logger = new Logger("CONFIRM_BOOKING");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_API_URL}/`);
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_API_URL}/`);
    }

    const { experienceId, slotId, quantity, email, fullName } = session.metadata!;

    const pool = await createPool();

    const [expRows] = await pool.query<RowDataPacket[]>(
      "SELECT price FROM experiences WHERE id = ?",
      [experienceId]
    );

    if (expRows.length === 0) {
      throw new Error("Experience not found");
    }

    const basePrice = expRows[0].price;
    const qty = parseInt(quantity);
    const subtotal = basePrice * qty;
    const taxes = Math.round(subtotal * 0.05);
    const total = subtotal + taxes;

    const bookingRef = `HUF${Date.now().toString(36).toUpperCase()}`;

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const [slots] = await connection.query<RowDataPacket[]>(
        "SELECT total_capacity, booked_count FROM slots WHERE id = ? FOR UPDATE",
        [slotId]
      );

      if (slots.length === 0) {
        throw new Error("Slot not found");
      }

      const slot = slots[0];
      const available = slot.total_capacity - slot.booked_count;

      if (available < qty) {
        throw new Error("Not enough slots available");
      }
      await connection.query(
        `INSERT INTO bookings 
        (experience_id, slot_id, user_name, email, quantity, promo_code, 
         subtotal, discount, taxes, total_amount, booking_ref) 
        VALUES (?, ?, ?, ?, ?, NULL, ?, 0, ?, ?, ?)`,
        [experienceId, slotId, fullName, email, qty, subtotal, taxes, total, bookingRef]
      );

      await connection.query(
        "UPDATE slots SET booked_count = booked_count + ? WHERE id = ?",
        [qty, slotId]
      );

      await connection.commit();
      connection.release();

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_API_URL}/confirmation?ref=${bookingRef}`
      );
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    logger.error("Error confirming booking:", error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_API_URL}/`);
  }
}