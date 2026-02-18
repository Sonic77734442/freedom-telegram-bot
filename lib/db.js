const { Pool } = require('pg');

let pool;

let initPromise;

function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL is required');
    }

    const ssl =
      process.env.PGSSL === 'disable' ? false : { rejectUnauthorized: false };

    pool = new Pool({
      connectionString,
      ssl,
    });
  }

  return pool;
}

function initDb() {
  if (!initPromise) {
    initPromise = getPool().query(`
      CREATE TABLE IF NOT EXISTS quiz_submissions (
        id BIGSERIAL PRIMARY KEY,
        telegram_user_id BIGINT NOT NULL,
        username TEXT,
        first_name TEXT,
        answers JSONB NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
  }

  return initPromise;
}

async function saveQuizSubmission({ telegramUserId, username, firstName, answers }) {
  await initDb();

  await getPool().query(
    `
      INSERT INTO quiz_submissions (telegram_user_id, username, first_name, answers)
      VALUES ($1, $2, $3, $4::jsonb)
    `,
    [telegramUserId, username || null, firstName || null, JSON.stringify(answers || {})]
  );
}

module.exports = {
  saveQuizSubmission,
};
