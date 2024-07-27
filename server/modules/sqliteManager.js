const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function openDatabase() {
  return open({
    filename: './server/modules/bd.db',
    driver: sqlite3.Database
  });
}

// Create
async function createRecord(table, data) {
  const db = await openDatabase();
  const columns = Object.keys(data).join(', ');
  const placeholders = Object.keys(data).map(() => '?').join(', ');
  const values = Object.values(data);

  await db.run(`INSERT INTO ${table} (${columns}) VALUES (${placeholders})`, values);
  await db.close();
}

// Read
async function readRecords(table) {
  const db = await openDatabase();
  const records = await db.all(`SELECT * FROM ${table}`);
  await db.close();
  return records;
}

// Update
async function updateRecord(table, id, data) {
  const db = await openDatabase();
  const updates = Object.keys(data).map(key => `${key} = ?`).join(', ');
  const values = [...Object.values(data), id];

  await db.run(`UPDATE ${table} SET ${updates} WHERE id = ?`, values);
  await db.close();
}

// Delete
async function deleteRecord(table, id) {
  const db = await openDatabase();
  await db.run(`DELETE FROM ${table} WHERE id = ?`, id);
  await db.close();
}

module.exports = { createRecord, readRecords, updateRecord, deleteRecord };
