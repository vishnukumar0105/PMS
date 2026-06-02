# PMS HR Master List - DB Developer Handoff

Use `master_list_db_handoff.sql` for the complete DB handoff.

## Execution order

1. Open MySQL connected to database `pms_devp`.
2. Review the table section in `server/sql/master_list_db_handoff.sql`.
   - If tables already exist, do not drop live data.
   - Apply only missing columns/tables.
3. Execute the stored procedure section, or run the full file after review.
4. Test with:

```sql
CALL sp_hr_master_list_flag_method(1, '', NULL, NULL, NULL, '', 1, 50);
CALL sp_hr_master_list_flag_method(2, '', NULL, NULL, NULL, '', 1, 50);
```

## Result sets

### `intFlag = 1`
Returns four separate result sets:

1. Departments
2. Appraisal Types
3. Locations
4. Discussion Statuses

### `intFlag = 2`
Returns two result sets:

1. Master List rows
2. Total count as `total_records`

## API expectation

The Express API calls:

```sql
CALL sp_hr_master_list_flag_method(?, ?, ?, ?, ?, ?, ?, ?);
```

So this procedure name and parameter order should not be changed without also updating `server/src/routes/masterList.js`.

## Collation note

If API logs show `Illegal mix of collations ... for operation 'like'`, re-run the latest `sp_hr_master_list_flag_method.sql` file. The current version normalizes search inputs and compared columns to `utf8mb4_unicode_ci` before `LIKE` comparisons.
