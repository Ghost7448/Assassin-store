const sqlite3 = require('sqlite3').verbose();

// إنشاء ملف قاعدة البيانات
const db = new sqlite3.Database('./database.db');

// إنشاء جدول الحسابات لو مش موجود
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS accounts (
            userId TEXT PRIMARY KEY,
            name TEXT,
            email TEXT,
            tickets INTEGER DEFAULT 0,
            orders INTEGER DEFAULT 0,
            spent INTEGER DEFAULT 0
        )
    `);
});

module.exports = db;