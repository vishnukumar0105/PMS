import { Router } from 'express';
import { pool } from '../db/mysql.js';

const router = Router();

router.get('/master-list', async (req, res) => {
  try {
    const {
      search = '',
      departmentId = null,
      appraisalTypeId = null,
      locationId = null,
      discussionStatus = '',
      page = 1,
      pageSize = 50,
      sortColumn = 'employeeid',
      sortDirection = 'ASC'
    } = req.query;

    const [resultSets] = await pool.query(
      'CALL sp_hr_master_list(?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        search,
        departmentId ? Number(departmentId) : null,
        appraisalTypeId ? Number(appraisalTypeId) : null,
        locationId ? Number(locationId) : null,
        discussionStatus,
        Number(page),
        Number(pageSize),
        sortColumn,
        sortDirection
      ]
    );

    const rows = resultSets?.[0] ?? [];
    const total = resultSets?.[1]?.[0]?.total_records ?? 0;
    return res.json({ rows, total });
  } catch (error) {
    console.error('Master list API error:', error);
    return res.status(500).json({ message: 'Failed to load master list' });
  }
});

export default router;
