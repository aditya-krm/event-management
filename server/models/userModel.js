import { query } from '../db.js';
import bcrypt from 'bcryptjs';

class UserModel {
    async create(userData) {
        const { name, email, password } = userData;

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const sql = `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, created_at
    `;

        const result = await query(sql, [name, email, hashedPassword]);
        return result.rows[0];
    }

    async findByEmail(email) {
        const sql = `
      SELECT * FROM users
      WHERE email = $1
    `;

        const result = await query(sql, [email]);
        return result.rows[0] || null;
    }

    async findById(id) {
        const sql = `
      SELECT id, name, email, created_at
      FROM users
      WHERE id = $1
    `;

        const result = await query(sql, [id]);
        return result.rows[0] || null;
    }

    async validatePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

export default new UserModel();
