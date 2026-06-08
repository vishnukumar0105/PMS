import { Router } from 'express';
import os from 'os';
import { pool } from '../db/mysql.js';

const router = Router();

router.get('/db', async (_, res) => {
  const safeConfig = {
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT || 3306),
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    apiMachineName: os.hostname()
  };

  try {
    const [rows] = await pool.query('SELECT CURRENT_USER() AS currentUser, USER() AS sessionUser, DATABASE() AS databaseName');
    return res.json({
      ok: true,
      config: safeConfig,
      mysql: rows?.[0] || null
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      config: safeConfig,
      errorCode: error.code,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage || error.message,
      note: "If sqlMessage contains user@host like dev@IE130.InformationEvolution.com, that is MySQL's account host check, not an email address. Ask DB developer to grant that user from this host/IP."
    });
  }
});

export default router;
