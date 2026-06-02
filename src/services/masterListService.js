const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function parseApiResponse(res, fallbackMessage) {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const details = body.sqlMessage || body.errorCode || body.message || fallbackMessage;
    throw new Error(details);
  }
  return body;
}

export async function getMasterList(params = {}) {
  const qs = new URLSearchParams({
    search: params.search ?? '',
    departmentId: params.departmentId ?? '',
    appraisalTypeId: params.appraisalTypeId ?? '',
    locationId: params.locationId ?? '',
    discussionStatus: params.discussionStatus ?? '',
    page: String(params.page ?? 1),
    pageSize: String(params.pageSize ?? 50)
  });

  const res = await fetch(`${API_BASE}/hr/master-list?${qs.toString()}`);
  return parseApiResponse(res, 'Failed to fetch master list');
}

export async function getMasterListFilters() {
  const res = await fetch(`${API_BASE}/hr/master-list/filters`);
  return parseApiResponse(res, 'Failed to fetch master list filters');
}
