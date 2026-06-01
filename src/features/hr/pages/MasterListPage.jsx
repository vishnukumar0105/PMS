import { useEffect, useState } from 'react';
import { getMasterList, getMasterListFilters } from '../../../services/masterListService';

const defaultFilters = {
  search: '',
  departmentId: '',
  appraisalTypeId: '',
  locationId: '',
  discussionStatus: ''
};

export default function MasterListPage() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filtersLoading, setFiltersLoading] = useState(true);
  const [filters, setFilters] = useState(defaultFilters);
  const [filterOptions, setFilterOptions] = useState({
    departments: [],
    appraisalTypes: [],
    locations: [],
    discussionStatuses: []
  });

  const loadRows = async (nextFilters = filters) => {
    try {
      setLoading(true);
      const data = await getMasterList({ ...nextFilters, page: 1, pageSize: 50 });
      setRows(data.rows || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error(error);
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
        const options = await getMasterListFilters();
        setFilterOptions({
          departments: options.departments || [],
          appraisalTypes: options.appraisalTypes || [],
          locations: options.locations || [],
          discussionStatuses: options.discussionStatuses || []
        });
      } catch (error) {
        console.error(error);
      } finally {
        setFiltersLoading(false);
      }

      await loadRows(defaultFilters);
    };

    loadInitialData();
  }, []);

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const handleFilter = () => {
    loadRows(filters);
  };

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
          <button className="btn btn-light" onClick={handleFilter} disabled={loading}>Filter ▾</button>
        </div>

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

        <div className="master-footer"><span>1-50 of {total} Employees</span><span>Rows per Page 50 · Page 1 / {Math.max(1, Math.ceil(total / 50))}</span></div>
      </div>
    </div>
  );
}
