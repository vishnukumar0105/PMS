DELIMITER $$

DROP PROCEDURE IF EXISTS Getmasterlistmethod $$
CREATE PROCEDURE Getmasterlistmethod(
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
    DECLARE v_search VARCHAR(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '';
    DECLARE v_discussion_status VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '';

    IF intFlag = 1 THEN
        -- Department filter result set
        SELECT
            IFNULL(DepartmentId, '') AS department_id,
            IFNULL(DepartmentName, '') AS department_name
        FROM departmentmaster
        WHERE IsActive = 1
        ORDER BY DepartmentName;

        -- Appraisal type filter result set
        SELECT
            IFNULL(appraisaltypemasterid, '') AS appraisal_type_id,
            IFNULL(appraisaltype, '') AS appraisal_type
        FROM appraisaltypemaster
        WHERE isactive = 1
        ORDER BY appraisaltype;

        -- Location filter result set. If a location master table is available later,
        -- this can be replaced with locationmaster.
        SELECT DISTINCT
            LocationId AS location_id,
            CAST(LocationId AS CHAR) AS location_name
        FROM employeedetails
        WHERE IsActive = 1
          AND LocationId IS NOT NULL
        ORDER BY LocationId;

        -- Discussion status filter result set
        SELECT
            IFNULL(reviewmasterid, '') AS discussion_status_id,
            IFNULL(mastervalue, '') AS discussion_status
        FROM reviewmaster
        WHERE isactive = 1
          AND mastertype = 'DiscussionStatus'
        ORDER BY mastervalue;
    END IF;

    IF intFlag = 2 THEN
        SET v_search = CONVERT(IFNULL(strsearch, '') USING utf8mb4) COLLATE utf8mb4_unicode_ci;
        SET v_discussion_status = CONVERT(IFNULL(strdiscussionstatus, '') USING utf8mb4) COLLATE utf8mb4_unicode_ci;

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
                v_search = '' OR
                CONVERT(IFNULL(ed.EmployeeId, '') USING utf8mb4) COLLATE utf8mb4_unicode_ci LIKE CONCAT('%', v_search, '%') OR
                CONVERT(CONCAT(IFNULL(ed.FirstName, ''), ' ', IFNULL(ed.MiddleName, ''), ' ', IFNULL(ed.LastName, '')) USING utf8mb4) COLLATE utf8mb4_unicode_ci LIKE CONCAT('%', v_search, '%') OR
                CONVERT(IFNULL(dm.DepartmentName, '') USING utf8mb4) COLLATE utf8mb4_unicode_ci LIKE CONCAT('%', v_search, '%') OR
                CONVERT(CAST(ed.LocationId AS CHAR) USING utf8mb4) COLLATE utf8mb4_unicode_ci LIKE CONCAT('%', v_search, '%')
              )
          AND (intdepartmentid IS NULL OR ed.DepartmentId = intdepartmentid)
          AND (intappraisaltypeid IS NULL OR ed.appraisal_typeID = intappraisaltypeid)
          AND (intlocationid IS NULL OR ed.LocationId = intlocationid)
          AND (v_discussion_status = '' OR CONVERT(IFNULL(rm_disc.mastervalue, 'NA') USING utf8mb4) COLLATE utf8mb4_unicode_ci = v_discussion_status);

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
