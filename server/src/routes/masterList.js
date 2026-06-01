import { Router } from 'express';
import { pool } from '../db/mysql.js';

const router = Router();

router.get('/master-list/filters', async (_, res) => {
  try {
    const [resultSets] = await pool.query(
      'CALL sp_hr_master_list_flag_method(?, ?, ?, ?, ?, ?, ?, ?)',
      [1, '', null, null, null, '', 1, 50]
    );

    return res.json({
      departments: resultSets?.[0] ?? [],
      appraisalTypes: resultSets?.[1] ?? [],
      locations: resultSets?.[2] ?? [],
      discussionStatuses: resultSets?.[3] ?? []
    });
  } catch (error) {
    console.error('Master list filter API error:', error);
    return res.status(500).json({ message: 'Failed to load master list filters' });
  }
});

router.get('/master-list', async (req, res) => {
  try {
    const {
      search = '',
      departmentId = null,
      appraisalTypeId = null,
      locationId = null,
      discussionStatus = '',
      page = 1,
      pageSize = 50
    } = req.query;

    const [resultSets] = await pool.query(
      'CALL sp_hr_master_list_flag_method(?, ?, ?, ?, ?, ?, ?, ?)',
      [
        2,
        search,
        departmentId ? Number(departmentId) : null,
        appraisalTypeId ? Number(appraisalTypeId) : null,
        locationId ? Number(locationId) : null,
        discussionStatus,
        Number(page),
        Number(pageSize)
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
