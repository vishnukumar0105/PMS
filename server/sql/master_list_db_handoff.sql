-- PMS HR Master List DB handoff for MySQL
-- Database: pms_devp
-- Purpose:
--   1) Provide the table structure expected by the HR Master List API.
--   2) Provide the traditional flag-method stored procedure used by Express API.
--
-- IMPORTANT FOR DB DEVELOPER:
-- - If these base tables already exist, do NOT drop production data.
-- - Review CREATE/ALTER statements and apply only missing columns/tables.
-- - API calls: CALL sp_hr_master_list_flag_method(...)
--   intFlag = 1 => dropdown/filter result sets
--   intFlag = 2 => master list rows + total count

USE pms_devp;

-- ---------------------------------------------------------------------------
-- Existing / expected master tables
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS departmentmaster (
  DepartmentId BIGINT NOT NULL AUTO_INCREMENT,
  DepartmentName VARCHAR(150) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  IsActive TINYINT UNSIGNED NOT NULL DEFAULT 1,
  PRIMARY KEY (DepartmentId),
  KEY idx_departmentmaster_departmentid_isactive (DepartmentId, IsActive)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

CREATE TABLE IF NOT EXISTS designationmaster (
  DesignationId BIGINT NOT NULL AUTO_INCREMENT,
  Designation VARCHAR(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  IsActive TINYINT UNSIGNED NOT NULL DEFAULT 1,
  PRIMARY KEY (DesignationId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- Base employee table. Your DB already has many more HR columns; below are the
-- columns required by the PMS master-list API/SP.
CREATE TABLE IF NOT EXISTS employeedetails (
  EmployeeDetId BIGINT NOT NULL AUTO_INCREMENT,
  LocationId BIGINT NOT NULL,
  FirstName VARCHAR(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  MiddleName VARCHAR(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  LastName VARCHAR(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  EmployeeId VARCHAR(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  DepartmentId BIGINT DEFAULT NULL,
  DesignationId BIGINT DEFAULT NULL,
  IsActive TINYINT UNSIGNED NOT NULL DEFAULT 1,
  appraisal_typeID BIGINT DEFAULT NULL,
  next_review_date DATE NULL,
  prev_review_date DATE NULL,
  PRIMARY KEY (EmployeeDetId),
  KEY idx_EmployeeDetailsEmployeeId (EmployeeId),
  KEY idx_Employeedetails_locationid (LocationId),
  KEY idxEmployeeDetailsDepartmentId (DepartmentId),
  KEY idx_employeedetails_id_active (EmployeeDetId, IsActive)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- Apply these manually if employeedetails already exists but PMS columns are missing:
-- ALTER TABLE employeedetails ADD COLUMN appraisal_typeID BIGINT DEFAULT NULL;
-- ALTER TABLE employeedetails ADD COLUMN next_review_date DATE NULL;
-- ALTER TABLE employeedetails ADD COLUMN prev_review_date DATE NULL;

CREATE TABLE IF NOT EXISTS appraisaltypemaster (
  appraisaltypemasterid BIGINT NOT NULL AUTO_INCREMENT,
  appraisaltype VARCHAR(50) NOT NULL,
  isactive TINYINT(1) NOT NULL DEFAULT 1,
  createdat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (appraisaltypemasterid),
  UNIQUE KEY ukappraisaltype (appraisaltype)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

INSERT IGNORE INTO appraisaltypemaster (appraisaltype)
VALUES ('Annual'), ('Probation');

CREATE TABLE IF NOT EXISTS employeescore (
  employeescoreid BIGINT NOT NULL AUTO_INCREMENT,
  employeeid BIGINT NOT NULL UNIQUE,
  pascore DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  attendancepct DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  scoreperiod VARCHAR(20) NULL,
  updatedat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (employeescoreid),
  CONSTRAINT fkscoreemployee
    FOREIGN KEY (employeeid) REFERENCES employeedetails(EmployeeDetId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

CREATE TABLE IF NOT EXISTS reviewmaster (
  reviewmasterid BIGINT NOT NULL AUTO_INCREMENT,
  mastertype ENUM('Ranking','ReviewStage','DiscussionStatus') NOT NULL,
  mastervalue VARCHAR(100) NOT NULL,
  isactive TINYINT(1) NOT NULL DEFAULT 1,
  createdat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (reviewmasterid),
  UNIQUE KEY ukreviewmaster (mastertype, mastervalue)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

INSERT IGNORE INTO reviewmaster (mastertype, mastervalue)
VALUES
('Ranking', 'Settled'),
('Ranking', 'Deferred'),
('Ranking', 'Priority'),
('Ranking', 'TL Ranking'),
('Ranking', '-'),
('ReviewStage', '-'),
('ReviewStage', 'HR Review'),
('ReviewStage', 'TL Review'),
('ReviewStage', 'Manager Review'),
('DiscussionStatus', 'NA'),
('DiscussionStatus', 'Pending'),
('DiscussionStatus', 'Approved'),
('DiscussionStatus', 'Extended'),
('DiscussionStatus', 'Rejected');

-- Use this normalized reviewcycle table for PMS.
-- If an older reviewcycle table already exists with enum columns, DB developer
-- should migrate/drop that duplicate before creating this normalized version.
CREATE TABLE IF NOT EXISTS reviewcycle (
  reviewcycleid BIGINT NOT NULL AUTO_INCREMENT,
  employeeid BIGINT NOT NULL UNIQUE,
  rankingid BIGINT NULL,
  reviewstageid BIGINT NULL,
  discussionstatusid BIGINT NULL,
  reviewyear VARCHAR(20) NULL,
  updatedat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (reviewcycleid),
  CONSTRAINT fkreviewemployee
    FOREIGN KEY (employeeid) REFERENCES employeedetails(EmployeeDetId),
  CONSTRAINT fkranking
    FOREIGN KEY (rankingid) REFERENCES reviewmaster(reviewmasterid),
  CONSTRAINT fkreviewstage
    FOREIGN KEY (reviewstageid) REFERENCES reviewmaster(reviewmasterid),
  CONSTRAINT fkdiscussionstatus
    FOREIGN KEY (discussionstatusid) REFERENCES reviewmaster(reviewmasterid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- ---------------------------------------------------------------------------
-- Traditional flag-method stored procedure for API
-- ---------------------------------------------------------------------------

DELIMITER $$

DROP PROCEDURE IF EXISTS sp_hr_master_list_flag_method $$
CREATE PROCEDURE sp_hr_master_list_flag_method(
    IN intFlag INT,
    IN strsearch VARCHAR(150),
    IN intdepartmentid BIGINT,
    IN intappraisaltypeid BIGINT,
    IN intlocationid BIGINT,
    IN strdiscussionstatus VARCHAR(50),
    IN intpagenumber INT,
    IN intpagesize INT
)
BEGIN
    DECLARE v_offset INT DEFAULT 0;

    IF intFlag = 1 THEN
        SELECT
            IFNULL(DepartmentId, '') AS department_id,
            IFNULL(DepartmentName, '') AS department_name
        FROM departmentmaster
        WHERE IsActive = 1
        ORDER BY DepartmentName;

        SELECT
            IFNULL(appraisaltypemasterid, '') AS appraisal_type_id,
            IFNULL(appraisaltype, '') AS appraisal_type
        FROM appraisaltypemaster
        WHERE isactive = 1
        ORDER BY appraisaltype;

        SELECT DISTINCT
            LocationId AS location_id,
            CAST(LocationId AS CHAR) AS location_name
        FROM employeedetails
        WHERE IsActive = 1
          AND LocationId IS NOT NULL
        ORDER BY LocationId;

        SELECT
            IFNULL(reviewmasterid, '') AS discussion_status_id,
            IFNULL(mastervalue, '') AS discussion_status
        FROM reviewmaster
        WHERE isactive = 1
          AND mastertype = 'DiscussionStatus'
        ORDER BY mastervalue;
    END IF;

    IF intFlag = 2 THEN
        IF intpagenumber IS NULL OR intpagenumber < 1 THEN
            SET intpagenumber = 1;
        END IF;

        IF intpagesize IS NULL OR intpagesize < 1 THEN
            SET intpagesize = 50;
        END IF;

        SET v_offset = (intpagenumber - 1) * intpagesize;

        DROP TEMPORARY TABLE IF EXISTS tmp_master_list;

        CREATE TEMPORARY TABLE tmp_master_list AS
        SELECT
            ed.EmployeeDetId AS employee_det_id,
            ed.EmployeeId AS emp_id,
            TRIM(CONCAT(IFNULL(ed.FirstName, ''), ' ', IFNULL(ed.MiddleName, ''), ' ', IFNULL(ed.LastName, ''))) AS employee_name,
            ed.LocationId AS location_id,
            dm.DepartmentName AS department_name,
            IFNULL(es.pascore, 0.00) AS pa_score,
            IFNULL(es.attendancepct, 0.00) AS attendance_pct,
            IFNULL(atm.appraisaltype, 'NA') AS appraisal_type,
            IFNULL(rm_rank.mastervalue, '-') AS ranking,
            ed.next_review_date AS next_review_date,
            ed.prev_review_date AS prev_review_date,
            IFNULL(rm_stage.mastervalue, '-') AS review_stage,
            IFNULL(rm_disc.mastervalue, 'NA') AS discussion_status
        FROM employeedetails ed
        LEFT JOIN departmentmaster dm
            ON dm.DepartmentId = ed.DepartmentId
           AND dm.IsActive = 1
        LEFT JOIN employeescore es
            ON es.employeeid = ed.EmployeeDetId
        LEFT JOIN appraisaltypemaster atm
            ON atm.appraisaltypemasterid = ed.appraisal_typeID
           AND atm.isactive = 1
        LEFT JOIN reviewcycle rc
            ON rc.employeeid = ed.EmployeeDetId
        LEFT JOIN reviewmaster rm_rank
            ON rm_rank.reviewmasterid = rc.rankingid
           AND rm_rank.mastertype = 'Ranking'
           AND rm_rank.isactive = 1
        LEFT JOIN reviewmaster rm_stage
            ON rm_stage.reviewmasterid = rc.reviewstageid
           AND rm_stage.mastertype = 'ReviewStage'
           AND rm_stage.isactive = 1
        LEFT JOIN reviewmaster rm_disc
            ON rm_disc.reviewmasterid = rc.discussionstatusid
           AND rm_disc.mastertype = 'DiscussionStatus'
           AND rm_disc.isactive = 1
        WHERE ed.IsActive = 1
          AND (
                strsearch IS NULL OR strsearch = '' OR
                ed.EmployeeId LIKE CONCAT('%', strsearch, '%') OR
                CONCAT(IFNULL(ed.FirstName, ''), ' ', IFNULL(ed.MiddleName, ''), ' ', IFNULL(ed.LastName, '')) LIKE CONCAT('%', strsearch, '%') OR
                dm.DepartmentName LIKE CONCAT('%', strsearch, '%') OR
                CAST(ed.LocationId AS CHAR) LIKE CONCAT('%', strsearch, '%')
              )
          AND (intdepartmentid IS NULL OR ed.DepartmentId = intdepartmentid)
          AND (intappraisaltypeid IS NULL OR ed.appraisal_typeID = intappraisaltypeid)
          AND (intlocationid IS NULL OR ed.LocationId = intlocationid)
          AND (strdiscussionstatus IS NULL OR strdiscussionstatus = '' OR IFNULL(rm_disc.mastervalue, 'NA') = strdiscussionstatus);

        SELECT
            employee_det_id,
            emp_id,
            employee_name,
            location_id,
            department_name,
            pa_score,
            attendance_pct,
            appraisal_type,
            ranking,
            next_review_date,
            prev_review_date,
            review_stage,
            discussion_status
        FROM tmp_master_list
        ORDER BY emp_id ASC
        LIMIT intpagesize OFFSET v_offset;

        SELECT COUNT(*) AS total_records FROM tmp_master_list;

        DROP TEMPORARY TABLE IF EXISTS tmp_master_list;
    END IF;
END $$

DELIMITER ;

-- ---------------------------------------------------------------------------
-- Test calls for DB developer
-- ---------------------------------------------------------------------------
-- Dropdown/filter data:
-- CALL sp_hr_master_list_flag_method(1, '', NULL, NULL, NULL, '', 1, 50);
--
-- Table data without filters:
-- CALL sp_hr_master_list_flag_method(2, '', NULL, NULL, NULL, '', 1, 50);
--
-- Table data with filters example:
-- CALL sp_hr_master_list_flag_method(2, 'Employee', 1, 1, 1, 'Approved', 1, 50);
