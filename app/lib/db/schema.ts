import mysql from "mysql2/promise";
import Logger from "@/app/lib/logger";

const dbLogger = new Logger('Database');

const Schema = async (pool: mysql.Pool) => {
  try {
    await pool.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`
    );
    
    await pool.query(`USE ${process.env.DB_NAME}`);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS experiences (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        location VARCHAR(100),
        price DECIMAL(10, 2) NOT NULL,
        image_url VARCHAR(500),
        min_age INT DEFAULT 10,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS slots (
        id INT AUTO_INCREMENT PRIMARY KEY,
        experience_id INT NOT NULL,
        slot_date DATE NOT NULL,
        slot_time TIME NOT NULL,
        total_capacity INT DEFAULT 10,
        booked_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_slot (experience_id, slot_date, slot_time),
        FOREIGN KEY (experience_id) REFERENCES experiences(id) ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        experience_id INT NOT NULL,
        slot_id INT NOT NULL,
        user_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        quantity INT NOT NULL,
        promo_code VARCHAR(50),
        subtotal DECIMAL(10, 2) NOT NULL,
        discount DECIMAL(10, 2) DEFAULT 0,
        taxes DECIMAL(10, 2) NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        booking_ref VARCHAR(50) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (experience_id) REFERENCES experiences(id) ON DELETE CASCADE,
        FOREIGN KEY (slot_id) REFERENCES slots(id) ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS promo_codes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        discount_type ENUM('percentage', 'flat') NOT NULL,
        discount_value DECIMAL(10, 2) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await seedSampleData(pool);

  } catch (err) {
    dbLogger.error("Failed to set up database:", err);
    throw err;
  }
};

// blow one iss ample data for testing perposes

const seedSampleData = async (pool: mysql.Pool) => {
  interface CountResult {
    count: number;
  }

  const [promoRows] = await pool.query<mysql.RowDataPacket[]>(
    `SELECT COUNT(*) as count FROM promo_codes`
  );
  const promoCount = (promoRows[0] as CountResult).count;
  
  if (promoCount === 0) {
    await pool.query(`
      INSERT INTO promo_codes (code, discount_type, discount_value) VALUES
      ('SAVE10', 'percentage', 10.00),
      ('FLAT100', 'flat', 100.00),
      ('WELCOME20', 'percentage', 20.00)
    `);
  }

  const [expRows] = await pool.query<mysql.RowDataPacket[]>(
    `SELECT COUNT(*) as count FROM experiences`
  );
  const expCount = (expRows[0] as CountResult).count;
  
  if (expCount === 0) {
    await pool.query(`
  INSERT INTO experiences (name, description, location, price, image_url, min_age) VALUES
  ('Kayaking', 'Curated small-group experience. Certified guide. Safety first with gear included.', 'Udupi', 999.00, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=400&fit=crop', 10),
  ('Nandi Hills Sunrise', 'Curated small-group experience. Certified guide. Safety first with gear included.', 'Bangalore', 899.00, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop', 10),
  ('Coffee Trail', 'Curated small-group experience. Certified guide. Safety first with gear included.', 'Coorg', 1299.00, 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=400&fit=crop', 10),
  ('Kayaking', 'Curated small-group experience. Certified guide. Safety first with gear included.', 'Udupi, Karnataka', 999.00, 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&h=400&fit=crop', 10),
  ('Nandi Hills Sunrise', 'Curated small-group experience. Certified guide. Safety first with gear included.', 'Bangalore', 899.00, 'https://images.unsplash.com/photo-1495954484750-af469f2f9be5?w=800&h=400&fit=crop', 10),
  ('Boat Cruise', 'Curated small-group experience. Certified guide. Safety first with gear included.', 'Sunderban', 999.00, 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=800&h=400&fit=crop', 10),
  ('Bunjee Jumping', 'Curated small-group experience. Certified guide. Safety first with gear included.', 'Manali', 999.00, 'https://images.unsplash.com/photo-1656833111546-07d98abab448?w=800&h=400&fit=crop', 18),
  ('Coffee Trail', 'Curated small-group experience. Certified guide. Safety first with gear included.', 'Coorg', 1299.00, 'https://images.unsplash.com/photo-1511406361295-0a1ff814c0ce?w=800&h=400&fit=crop', 10)
`);

    await pool.query(`
      INSERT INTO slots (experience_id, slot_date, slot_time, total_capacity, booked_count) VALUES
      (1, DATE_ADD(CURDATE(), INTERVAL 0 DAY), '07:00:00', 10, 6),
      (1, DATE_ADD(CURDATE(), INTERVAL 0 DAY), '09:00:00', 10, 8),
      (1, DATE_ADD(CURDATE(), INTERVAL 0 DAY), '11:00:00', 10, 5),
      (1, DATE_ADD(CURDATE(), INTERVAL 0 DAY), '13:00:00', 10, 10),
      (1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '07:00:00', 10, 0),
      (1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '09:00:00', 10, 0),
      (1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '11:00:00', 10, 0),
      (1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '13:00:00', 10, 0),
      (1, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '07:00:00', 10, 0),
      (1, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '09:00:00', 10, 0),
      (1, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '11:00:00', 10, 0),
      (1, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '13:00:00', 10, 0),
      (1, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '07:00:00', 10, 0),
      (1, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '09:00:00', 10, 0),
      (1, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '11:00:00', 10, 0),
      (1, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '13:00:00', 10, 0),
      (1, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '07:00:00', 10, 0),
      (1, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '09:00:00', 10, 0),
      (1, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '11:00:00', 10, 0),
      (1, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '13:00:00', 10, 0),
      (2, DATE_ADD(CURDATE(), INTERVAL 0 DAY), '05:00:00', 10, 0),
      (2, DATE_ADD(CURDATE(), INTERVAL 0 DAY), '05:30:00', 10, 0),
      (2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '05:00:00', 10, 0),
      (2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '05:30:00', 10, 0),
      (3, DATE_ADD(CURDATE(), INTERVAL 0 DAY), '08:00:00', 10, 0),
      (3, DATE_ADD(CURDATE(), INTERVAL 0 DAY), '10:00:00', 10, 0),
      (3, DATE_ADD(CURDATE(), INTERVAL 0 DAY), '14:00:00', 10, 0),
      (4, DATE_ADD(CURDATE(), INTERVAL 0 DAY), '09:00:00', 10, 0),
      (4, DATE_ADD(CURDATE(), INTERVAL 0 DAY), '11:00:00', 10, 0),
      (4, DATE_ADD(CURDATE(), INTERVAL 0 DAY), '15:00:00', 10, 0),
      (5, DATE_ADD(CURDATE(), INTERVAL 0 DAY), '10:00:00', 10, 0),
      (5, DATE_ADD(CURDATE(), INTERVAL 0 DAY), '12:00:00', 10, 0),
      (5, DATE_ADD(CURDATE(), INTERVAL 0 DAY), '16:00:00', 10, 0)
    `);
  }
};

export default Schema;