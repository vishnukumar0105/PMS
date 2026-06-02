# DB Access Troubleshooting

If the UI/API shows this error:

```text
Access denied for user 'dev'@'<machine-name>' (using password: YES)
```

this is a MySQL login/permission issue before the stored procedure runs.

## Important: `dev@IE130.InformationEvolution.com` is not an email

MySQL accounts are checked as:

```text
'user_name'@'client_host'
```

So this error:

```text
'dev'@'IE130.InformationEvolution.com'
```

means:

- MySQL username: `dev`
- Client/API machine name seen by MySQL: `IE130.InformationEvolution.com`

It is not a mail ID and it will not appear in frontend code.

## Step 1: Confirm API is reading the expected DB config

Start the server, then open:

```text
http://localhost:5000/api/diagnostics/db
```

This endpoint never returns the password. It returns host, database, username, API machine name, and either:

- successful MySQL `CURRENT_USER()` details, or
- the exact MySQL error.

## Step 2: Password contains `#`

The password in `server/.env` is quoted because `#` can be treated as a comment marker by env parsers.

```env
MYSQL_PASSWORD="Cent@#321"
```

Restart the Express API after changing `.env`.

## Step 3: MySQL user host permission

If password quoting is correct and the error still appears, the DB developer should grant access for the host shown in the error (`IE130.InformationEvolution.com`) or the API machine IP.

Example for DB developer only:

```sql
-- Prefer a specific host/IP if possible instead of '%'.
CREATE USER IF NOT EXISTS 'dev'@'IE130.InformationEvolution.com' IDENTIFIED BY 'Cent@#321';
GRANT EXECUTE, SELECT ON pms_devp.* TO 'dev'@'IE130.InformationEvolution.com';
FLUSH PRIVILEGES;
```

If DB policy allows wildcard host temporarily for testing:

```sql
CREATE USER IF NOT EXISTS 'dev'@'%' IDENTIFIED BY 'Cent@#321';
GRANT EXECUTE, SELECT ON pms_devp.* TO 'dev'@'%';
FLUSH PRIVILEGES;
```

If the user already exists with a different host, DB developer may need to update that exact account or create a host-specific account.

## Step 4: Confirm database and SP exist

After DB login works, the API expects database `pms_devp` and procedure `Getmasterlistmethod`.

```sql
USE pms_devp;
SHOW PROCEDURE STATUS WHERE Db = 'pms_devp' AND Name = 'Getmasterlistmethod';
CALL Getmasterlistmethod(1, '', NULL, NULL, NULL, '', 1, 50);
CALL Getmasterlistmethod(2, '', NULL, NULL, NULL, '', 1, 50);
```

## Will the UI show data after this error is fixed?

Yes, the Master List UI should load data after this access error is fixed, if:

1. `dev` can connect to `pms_devp` from the API machine.
2. `Getmasterlistmethod` exists.
3. The required tables/columns exist.
4. The tables have active employee rows matching the filters.

If the DB/SP works but no employees match, UI will show the empty table message instead of an access error.

## Step 5: Illegal mix of collations on `LIKE`

If terminal shows:

```text
Illegal mix of collations (utf8mb4_0900_ai_ci,IMPLICIT) and (utf8mb4_unicode_ci,IMPLICIT) for operation 'like'
```

then the stored procedure in MySQL is still using mixed collations while comparing search text with employee/department fields.

Fix:

1. DB developer should re-run the latest `server/sql/Getmasterlistmethod.sql`.
2. The latest SP converts search and discussion-status values to `utf8mb4_unicode_ci` before comparing.
3. Restart API after DB developer updates the procedure.

Important: if `/api/hr/master-list/filters` shows this error and the SQL log says `CALL Getmasterlistmethod(1, ...)`, it usually means the DB still has an older SP where `intFlag = 1` was table/search logic. In the latest SP:

- `intFlag = 1` = dropdown/filter result sets only
- `intFlag = 2` = table data and search/filter logic
