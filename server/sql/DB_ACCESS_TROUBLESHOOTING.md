# DB Access Troubleshooting

If the UI/API shows this error:

```text
Access denied for user 'dev'@'<machine-name>' (using password: YES)
```

check these items with the DB developer.

## 1. Password contains `#`

The password in `server/.env` is quoted because `#` can be treated as a comment marker by env parsers.

```env
MYSQL_PASSWORD="Cent@#321"
```

Restart the Express API after changing `.env`.

## 2. MySQL user host permission

The error includes the client machine/host, for example:

```text
'dev'@'IE130.InformationEvolution.com'
```

That means MySQL is checking whether user `dev` is allowed to connect from that host. If password quoting is correct and the error still appears, the DB developer should grant access for this host/IP or `%` according to company policy.

Example for DB developer only:

```sql
-- Prefer a specific host/IP if possible instead of '%'.
CREATE USER IF NOT EXISTS 'dev'@'%' IDENTIFIED BY 'Cent@#321';
GRANT EXECUTE, SELECT ON pms_devp.* TO 'dev'@'%';
FLUSH PRIVILEGES;
```

If the user already exists with a different host, the DB developer may need to update that account or create a host-specific account.

## 3. Confirm database and SP exist

The API expects database `pms_devp` and procedure `sp_hr_master_list_flag_method`.

```sql
USE pms_devp;
SHOW PROCEDURE STATUS WHERE Db = 'pms_devp' AND Name = 'sp_hr_master_list_flag_method';
CALL sp_hr_master_list_flag_method(1, '', NULL, NULL, NULL, '', 1, 50);
CALL sp_hr_master_list_flag_method(2, '', NULL, NULL, NULL, '', 1, 50);
```
