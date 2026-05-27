const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export async function getMasterList(params = {}) {
  const qs = new URLSearchParams({
    search: params.search ?? '',
    departmentId: params.departmentId ?? '',
    appraisalTypeId: params.appraisalTypeId ?? '',
    locationId: params.locationId ?? '',
    discussionStatus: params.discussionStatus ?? '',
    page: String(params.page ?? 1),
    pageSize: String(params.pageSize ?? 50),
    sortColumn: params.sortColumn ?? 'employeeid',
    sortDirection: params.sortDirection ?? 'ASC'
  });

  const res = await fetch(`${API_BASE}/hr/master-list?${qs.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch master list');
  return res.json();
}
