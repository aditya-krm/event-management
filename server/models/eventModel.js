import { query } from '../db.js';

class EventModel {
  async create(eventData, userId) {
    const { name, description = '', date, location } = eventData;

    const sql = `
      INSERT INTO events (name, description, date, location, created_by)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, description, date, location, created_by, created_at
    `;

    const result = await query(sql, [name, description, date, location, userId]);
    return result.rows[0];
  }

  async findAll() {
    const sql = `
      SELECT e.id, e.name, e.description, e.date, e.location, e.created_at,
             u.id as user_id, u.name as creator_name 
      FROM events e
      JOIN users u ON e.created_by = u.id
      ORDER BY e.date DESC
    `;

    const result = await query(sql);
    return result.rows;
  }

  async findById(id) {
    const sql = `
      SELECT e.id, e.name, e.description, e.date, e.location, e.created_at, 
             e.created_by, u.name as creator_name
      FROM events e
      JOIN users u ON e.created_by = u.id
      WHERE e.id = $1
    `;

    const result = await query(sql, [id]);
    return result.rows[0] || null;
  }

  async update(id, eventData) {
    const { name, description, date, location } = eventData;

    const sql = `
      UPDATE events
      SET name = $1, description = $2, date = $3, location = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING id, name, description, date, location, created_by, created_at, updated_at
    `;

    const result = await query(sql, [name, description, date, location, id]);
    return result.rows[0];
  }

  async delete(id) {
    const sql = `
      DELETE FROM events
      WHERE id = $1
      RETURNING id
    `;

    const result = await query(sql, [id]);
    return result.rowCount > 0;
  }

  async isCreator(eventId, userId) {
    const sql = `
      SELECT created_by
      FROM events
      WHERE id = $1
    `;

    const result = await query(sql, [eventId]);
    return result.rows[0] && result.rows[0].created_by === userId;
  }

  async getCreatorId(eventId) {
    const sql = `
      SELECT created_by
      FROM events
      WHERE id = $1
    `;

    const result = await query(sql, [eventId]);
    return result.rows[0]?.created_by || null;
  }
}

export default new EventModel();
