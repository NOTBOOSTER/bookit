import { NextResponse } from "next/server";
import createPool from "@/app/lib/db/mysql";
import { RowDataPacket } from "mysql2/promise";
import Logger from "@/app/lib/logger";

const logger = new Logger("PROMO");

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Promo code is required" },
        { status: 400 }
      );
    }

    const pool = await createPool();

    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM promo_codes WHERE code = ? AND is_active = TRUE",
      [code.toUpperCase()]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid or expired promo code" },
        { status: 404 }
      );
    }

    const promoCode = rows[0];

    return NextResponse.json({
      code: promoCode.code,
      discount_type: promoCode.discount_type,
      discount_value: promoCode.discount_value,
    });

  } catch (error) {
    logger.error("Error validating promo code:", error);
    return NextResponse.json(
      { error: "Failed to validate promo code" },
      { status: 500 }
    );
  }
}