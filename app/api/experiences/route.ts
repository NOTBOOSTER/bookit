import { NextResponse } from "next/server";
import createPool from "@/app/lib/db/mysql";

export async function GET() {
    try {
        const pool = await createPool();
        const [rows] = await pool.query('SELECT * FROM experiences');
        return NextResponse.json(rows);
    } catch (error) {
        console.error('Error fetching experiences:', error);
        return NextResponse.error();
    }
}