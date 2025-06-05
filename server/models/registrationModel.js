import { query } from '../db.js';

class RegistrationModel {
  async register(userId, eventId, reason = null) {
    const sql = `
      INSERT INTO registrations (user_id, event_id, reason)
      VALUES ($1, $2, $3)
      RETURNING id, user_id, event_id, registration_date, reason
    `;

    const result = await query(sql, [userId, eventId, reason]);
    return result.rows[0];
  }

  async isRegistered(userId, eventId) {
    const sql = `
      SELECT id FROM registrations
      WHERE user_id = $1 AND event_id = $2
    `;

    const result = await query(sql, [userId, eventId]);
    return result.rowCount > 0;
  }

  async findById(registrationId) {
    const sql = `
      SELECT r.id, r.user_id, r.event_id, r.registration_date, r.reason,
             u.name as user_name, u.email as user_email
      FROM registrations r
      JOIN users u ON r.user_id = u.id
      WHERE r.id = $1
    `;

    const result = await query(sql, [registrationId]);
    return result.rows[0] || null;
  }

  async getParticipants(eventId) {
    const sql = `
      SELECT r.id as registration_id, r.registration_date, r.reason,
             u.id as user_id, u.name, u.email
      FROM registrations r
      JOIN users u ON r.user_id = u.id
      WHERE r.event_id = $1
      ORDER BY r.registration_date
    `;

    const result = await query(sql, [eventId]);
    return result.rows;
  }

  async cancel(registrationId) {
    const sql = `
      DELETE FROM registrations
      WHERE id = $1
      RETURNING id
    `;

    const result = await query(sql, [registrationId]);
    return result.rowCount > 0;
  }

  async getUserRegistrations(userId) {
    const sql = `
      SELECT r.id as registration_id, r.registration_date, r.reason,
             e.id as event_id, e.name as event_name, e.date, e.location
      FROM registrations r
      JOIN events e ON r.event_id = e.id
      WHERE r.user_id = $1
      ORDER BY e.date
    `;

    const result = await query(sql, [userId]);
    return result.rows;
  }
}

export default new RegistrationModel();
