export const STORAGE_KEY = 'pms_auth_email';
export const STORAGE_PAGE_KEY = 'pms_hr_active_page';

export const USERS = {
  'vishnukumar.j@informationevolution.com': { role: 'Employee', key: 'employee' },
  'hr@informationevolution.com': { role: 'HR', key: 'hr' },
  'mathiselvam@informationevolution.com': { role: 'TL', key: 'tl' },
  'samsul@informationevolution.com': { role: 'Manager', key: 'manager' },
  'arfath@informationevolution.com': { role: 'CPO', key: 'cpo' }
};

export const HR_MENU_SECTIONS = [
  {
    title: 'MAIN',
    items: [
      { key: 'dashboard', icon: '⊞', label: 'Dashboard' },
      { key: 'master-list', icon: '☰', label: 'Master List' },
      { key: 'upcoming-review-list', icon: '🗓', label: 'Upcoming Review List', badge: 19 },
      { key: 'review-approval-list', icon: '✓', label: 'Review Approval List', badge: 5 },
      { key: 'discussion-list', icon: '💬', label: 'Discussion List' }
    ]
  },
  {
    title: 'APPRAISAL',
    items: [
      { key: 'appraisal-list', icon: '📋', label: 'Appraisal List' },
      { key: 'beneficiary-list', icon: '🎯', label: 'Beneficiary List' }
    ]
  },
  {
    title: 'RECORDS',
    items: [
      { key: 'attendance', icon: '📊', label: 'Attendance' },
      { key: 'pa-scores', icon: '📈', label: 'PA Scores' },
      { key: 'star-performance-awards', icon: '⭐', label: 'Star Performance Awards' },
      { key: 'feedback-forms', icon: '📝', label: 'Feedback Forms' },
      { key: 'review-history', icon: '🕘', label: 'Review History' }
    ]
  },
  {
    title: 'ADMIN',
    items: [{ key: 'configuration', icon: '⚙', label: 'Configuration' }]
  }
];

export const HR_PAGE_CONTENT = {
  'master-list': { title: 'Master List', subtitle: 'Employee profile index', description: 'Search and maintain employee appraisal records.' },
  'upcoming-review-list': { title: 'Upcoming Review List', subtitle: 'Review schedule planner', description: 'View upcoming due dates and launch review workflow actions.' },
  'review-approval-list': { title: 'Review Approval List', subtitle: 'Approval queue monitor', description: 'Manage pending approvals and escalation timelines.' },
  'discussion-list': { title: 'Discussion List', subtitle: 'Discussion tracking', description: 'Schedule review discussions and capture HR comments.' },
  'appraisal-list': { title: 'Appraisal List', subtitle: 'Compensation recommendations', description: 'Prepare recommendations and send to CPO.' },
  'beneficiary-list': { title: 'Beneficiary List', subtitle: 'Approved benefit roster', description: 'Track approved increments and acknowledgement.' },
  attendance: { title: 'Attendance', subtitle: 'Attendance intelligence', description: 'Monitor attendance trends and threshold violations.' },
  'pa-scores': { title: 'PA Scores', subtitle: 'Performance trend analysis', description: 'Analyze PA trajectory by team and employee.' },
  'star-performance-awards': { title: 'Star Performance Awards', subtitle: 'Recognition ledger', description: 'Review monthly recognition awards.' },
  'feedback-forms': { title: 'Feedback Forms', subtitle: 'Template and submission hub', description: 'Manage form templates and completion rates.' },
  'review-history': { title: 'Review History', subtitle: 'Historical review archive', description: 'Access complete appraisal chronology.' },
  configuration: { title: 'Configuration', subtitle: 'HR policy controls', description: 'Configure probation and review-cycle policies.' }
};
