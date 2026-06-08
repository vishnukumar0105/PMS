DELIMITER $$

DROP PROCEDURE IF EXISTS sp_hr_master_list_traditional $$
CREATE PROCEDURE sp_hr_master_list_traditional(
    IN p_search VARCHAR(150),
    IN p_department_id BIGINT,
    IN p_appraisal_type_id BIGINT,
    IN p_location_id BIGINT,
    IN p_discussion_status VARCHAR(50),
    IN p_page_number INT,
    IN p_page_size INT
)
BEGIN
    DECLARE v_offset INT DEFAULT 0;

    IF p_page_number IS NULL OR p_page_number < 1 THEN
        SET p_page_number = 1;
    END IF;

    IF p_page_size IS NULL OR p_page_size < 1 THEN
        SET p_page_size = 50;
    END IF;

    SET v_offset = (p_page_number - 1) * p_page_size;

    DROP TEMPORARY TABLE IF EXISTS tmp_master_list;

    CREATE TEMPORARY TABLE tmp_master_list AS
    SELECT
        ed.EmployeeDetId AS employee_det_id,
        ed.EmployeeId AS emp_id,
        TRIM(CONCAT(IFNULL(ed.FirstName, ''), ' ', IFNULL(ed.MiddleName, ''), ' ', IFNULL(ed.LastName, ''))) AS employee_name,
        ed.LocationId AS location_id,
        dm.DepartmentName AS department_name,
        IFNULL(es.PAScore, 0.00) AS pa_score,
        IFNULL(es.AttendancePct, 0.00) AS attendance_pct,
        IFNULL(atm.AppraisalType, 'NA') AS appraisal_type,
        IFNULL(rm_rank.MasterValue, '-') AS ranking,
        ed.Next_Review_Date AS next_review_date,
        ed.Prev_Review_Date AS prev_review_date,
        IFNULL(rm_stage.MasterValue, '-') AS review_stage,
        IFNULL(rm_disc.MasterValue, 'NA') AS discussion_status
    FROM employeedetails ed
    LEFT JOIN departmentmaster dm ON dm.DepartmentId = ed.DepartmentId AND dm.IsActive = 1
    LEFT JOIN employeescore es ON es.EmployeeId = ed.EmployeeDetId
    LEFT JOIN appraisaltypemaster atm ON atm.AppraisalTypeMasterId = ed.Appraisal_TypeId AND atm.IsActive = 1
    LEFT JOIN reviewcycle rc ON rc.EmployeeId = ed.EmployeeDetId
    LEFT JOIN reviewmaster rm_rank ON rm_rank.ReviewMasterId = rc.RankingId AND rm_rank.MasterType = 'Ranking' AND rm_rank.IsActive = 1
    LEFT JOIN reviewmaster rm_stage ON rm_stage.ReviewMasterId = rc.ReviewStageId AND rm_stage.MasterType = 'ReviewStage' AND rm_stage.IsActive = 1
    LEFT JOIN reviewmaster rm_disc ON rm_disc.ReviewMasterId = rc.DiscussionStatusId AND rm_disc.MasterType = 'DiscussionStatus' AND rm_disc.IsActive = 1
    WHERE ed.IsActive = 1
      AND (
            p_search IS NULL OR p_search = '' OR
            ed.EmployeeId LIKE CONCAT('%', p_search, '%') OR
            CONCAT(IFNULL(ed.FirstName, ''), ' ', IFNULL(ed.MiddleName, ''), ' ', IFNULL(ed.LastName, '')) LIKE CONCAT('%', p_search, '%') OR
            dm.DepartmentName LIKE CONCAT('%', p_search, '%')
          )
      AND (p_department_id IS NULL OR ed.DepartmentId = p_department_id)
      AND (p_appraisal_type_id IS NULL OR ed.Appraisal_TypeId = p_appraisal_type_id)
      AND (p_location_id IS NULL OR ed.LocationId = p_location_id)
      AND (p_discussion_status IS NULL OR p_discussion_status = '' OR IFNULL(rm_disc.MasterValue, 'NA') = p_discussion_status);

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
    LIMIT p_page_size OFFSET v_offset;

    SELECT COUNT(*) AS total_records FROM tmp_master_list;

    DROP TEMPORARY TABLE IF EXISTS tmp_master_list;
END $$

DELIMITER ;
