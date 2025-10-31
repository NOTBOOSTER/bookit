import { NextResponse } from "next/server";
import createPool from "@/app/lib/db/mysql";
import { RowDataPacket } from 'mysql2/promise';
import Logger from "@/app/lib/logger";

const logger = new Logger("EXPERIENCES");

export async function GET(request: Request) {
    try {
        const pool = await createPool();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            const [rows] = await pool.query('SELECT * FROM experiences');
            return NextResponse.json(rows);
        }

        const [experienceRows] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM experiences WHERE id = ?',
            [id]
        );

        if (Array.isArray(experienceRows) && experienceRows.length === 0) {
            return NextResponse.json(
                { error: 'Experience not found' },
                { status: 404 }
            );
        }

        const [slotRows] = await pool.query<RowDataPacket[]>(
            `SELECT 
                id,
                slot_date,
                slot_time,
                total_capacity,
                booked_count,
                (total_capacity - booked_count > 0) as is_available,
                (total_capacity - booked_count) as available_slots
            FROM slots 
            WHERE experience_id = ? 
            AND slot_date >= CURDATE()
            ORDER BY slot_date, slot_time`,
            [id]
        );

        return NextResponse.json({
            experience: experienceRows[0],
            slots: slotRows
        });

    } catch (error) {
        logger.error('Error fetching experiences:', error);
        return NextResponse.json(
            { error: 'Failed to fetch experiences' },
            { status: 500 }
        );
    }
}