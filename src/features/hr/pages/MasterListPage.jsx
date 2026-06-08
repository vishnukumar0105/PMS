import { useEffect, useState } from 'react';
import { getMasterList, getMasterListFilters } from '../../../services/masterListService';

const defaultFilters = {
  search: '',
  departmentId: '',
  appraisalTypeId: '',
  locationId: '',
  discussionStatus: ''
};

const pageSizeOptions = [10, 20, 50, 'all'];

export default function MasterListPage() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filtersLoading, setFiltersLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterOptions, setFilterOptions] = useState({
    departments: [],
    appraisalTypes: [],
    locations: [],
    discussionStatuses: []
  });

  const isAllRows = pageSize === 'all';
  const effectivePageSize = isAllRows ? Math.max(total, 1) : Number(pageSize);
  const totalPages = isAllRows ? 1 : Math.max(1, Math.ceil(total / effectivePageSize));
  const startRow = total === 0 ? 0 : (page - 1) * effectivePageSize + 1;
  const endRow = total === 0 ? 0 : Math.min(page * effectivePageSize, total);

  const loadRows = async (nextFilters = appliedFilters, nextPage = page, nextPageSize = pageSize) => {
    try {
      setLoading(true);
      setErrorMessage('');
      const apiPageSize = nextPageSize === 'all' ? 100000 : Number(nextPageSize);
      const data = await getMasterList({ ...nextFilters, page: nextPage, pageSize: apiPageSize });
      setRows(data.rows || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || 'Failed to load master list. Please check backend/DB setup.');
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setFiltersLoading(true);
        setErrorMessage('');
        const options = await getMasterListFilters();
        setFilterOptions({
          departments: options.departments || [],
          appraisalTypes: options.appraisalTypes || [],
          locations: options.locations || [],
          discussionStatuses: options.discussionStatuses || []
        });
      } catch (error) {
        console.error(error);
        setErrorMessage(error.message || 'Failed to load filter dropdowns. Please check backend/DB setup.');
      } finally {
        setFiltersLoading(false);
      }

      await loadRows(defaultFilters, 1, 10);
    };

    loadInitialData();
  }, []);

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const handleFilter = () => {
    setAppliedFilters(filters);
    setPage(1);
    loadRows(filters, 1, pageSize);
  };

  const handlePageChange = (nextPage) => {
    const safePage = Math.min(Math.max(nextPage, 1), totalPages);
    setPage(safePage);
    loadRows(appliedFilters, safePage, pageSize);
  };

  const handlePageSizeChange = (value) => {
    const nextPageSize = value === 'all' ? 'all' : Number(value);
    setPageSize(nextPageSize);
    setPage(1);
    loadRows(appliedFilters, 1, nextPageSize);
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)
    .filter((pageNumber) => (
      pageNumber === 1 ||
      pageNumber === totalPages ||
      Math.abs(pageNumber - page) <= 2
    ));

  return (
    <div className="master-wrap">
      <div className="master-alert">ℹ Showing employees across all departments. Use filters to narrow by Appraisal Type, Department, or Review Status.</div>
      <div className="master-card">
        <div className="master-filters">
          <input
            className="form-control"
            placeholder="Search by Name, ID, Department, Location..."
            value={filters.search}
            onChange={(event) => updateFilter('search', event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && handleFilter()}
          />
          <select className="form-select" value={filters.departmentId} onChange={(event) => updateFilter('departmentId', event.target.value)} disabled={filtersLoading}>
            <option value="">All Departments</option>
            {filterOptions.departments.map((department) => (
              <option key={department.department_id} value={department.department_id}>{department.department_name}</option>
            ))}
          </select>
          <select className="form-select" value={filters.appraisalTypeId} onChange={(event) => updateFilter('appraisalTypeId', event.target.value)} disabled={filtersLoading}>
            <option value="">All Appraisal Types</option>
            {filterOptions.appraisalTypes.map((type) => (
              <option key={type.appraisal_type_id} value={type.appraisal_type_id}>{type.appraisal_type}</option>
            ))}
          </select>
          <select className="form-select" value={filters.locationId} onChange={(event) => updateFilter('locationId', event.target.value)} disabled={filtersLoading}>
            <option value="">All Locations</option>
            {filterOptions.locations.map((location) => (
              <option key={location.location_id} value={location.location_id}>{location.location_name}</option>
            ))}
          </select>
          <select className="form-select" value={filters.discussionStatus} onChange={(event) => updateFilter('discussionStatus', event.target.value)} disabled={filtersLoading}>
            <option value="">All Statuses</option>
            {filterOptions.discussionStatuses.map((status) => (
              <option key={status.discussion_status_id} value={status.discussion_status}>{status.discussion_status}</option>
            ))}
          </select>
          <button className="btn btn-theme" onClick={handleFilter} disabled={loading}>Apply Filter</button>
        </div>

        {errorMessage ? (
          <div className="alert alert-danger py-2">{errorMessage}</div>
        ) : null}

        {loading ? (
          <div className="p-3">Loading master list...</div>
        ) : (
          <div className="table-responsive">
            <table className="table master-table align-middle">
              <thead>
                <tr>
                  <th></th><th>ID ↕</th><th>NAME ↕</th><th>LOCATION ↕</th><th>DEPARTMENT ↕</th><th>PA SCORE ↕</th><th>ATTENDANCE ↕</th><th>APPRAISAL TYPE ↕</th><th>RANKING ↕</th><th>NEXT REVIEW ↕</th><th>PREV REVIEW ↕</th><th>REVIEW STAGE ↕</th><th>DISCUSSION STATUS ↕</th><th>VIEW DETAILS</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td colSpan="14" className="text-center text-secondary py-4">No employees found for selected filters.</td></tr>
                ) : rows.map((r) => {
                  const attendance = Number(r.attendance_pct || 0);
                  return (
                    <tr key={r.employee_det_id || r.emp_id}>
                      <td><input type="checkbox" /></td>
                      <td>{r.emp_id}</td>
                      <td>{r.employee_name}</td>
                      <td>{r.location_id}</td>
                      <td>{r.department_name}</td>
                      <td>{r.pa_score}%</td>
                      <td><div className="att-cell"><span>{attendance}%</span><div className="att-track"><div className="att-fill" style={{ width: `${attendance}%` }} /></div></div></td>
                      <td><span className={`pill ${r.appraisal_type === 'Annual' ? 'amber' : 'blue'}`}>{r.appraisal_type}</span></td>
                      <td><span className={`rank ${String(r.ranking || '-').toLowerCase()}`}>{r.ranking || '-'}</span></td>
                      <td>{r.next_review_date || 'NA'}</td>
                      <td>{r.prev_review_date || 'NA'}</td>
                      <td><span className="pill gray">{r.review_stage || '-'}</span></td>
                      <td><span className={`pill ${r.discussion_status === 'Approved' ? 'green' : r.discussion_status === 'Extended' ? 'amber' : r.discussion_status === 'Rejected' ? 'red' : 'gray'}`}>{r.discussion_status || 'NA'}</span></td>
                      <td><button className="btn btn-sm btn-outline-secondary">View</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="master-footer">
          <span>{startRow}-{endRow} of {total} Employees</span>
          <div className="master-pagination">
            <span>Rows per Page</span>
            <select className="form-select form-select-sm page-size-select" value={pageSize} onChange={(event) => handlePageSizeChange(event.target.value)} disabled={loading}>
              {pageSizeOptions.map((option) => <option key={option} value={option}>{option === 'all' ? 'All' : option}</option>)}
            </select>
            <button className="page-btn" onClick={() => handlePageChange(1)} disabled={loading || page === 1 || isAllRows}>«</button>
            <button className="page-btn" onClick={() => handlePageChange(page - 1)} disabled={loading || page === 1 || isAllRows}>‹</button>
            {pageNumbers.map((pageNumber, index) => (
              <button
                key={pageNumber}
                className={`page-btn ${pageNumber === page ? 'active' : ''}`}
                onClick={() => handlePageChange(pageNumber)}
                disabled={loading || isAllRows}
              >
                {index > 0 && pageNumber - pageNumbers[index - 1] > 1 ? `… ${pageNumber}` : pageNumber}
              </button>
            ))}
            <button className="page-btn" onClick={() => handlePageChange(page + 1)} disabled={loading || page === totalPages || isAllRows}>›</button>
            <button className="page-btn" onClick={() => handlePageChange(totalPages)} disabled={loading || page === totalPages || isAllRows}>»</button>
            <span>Page {page} / {totalPages}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
