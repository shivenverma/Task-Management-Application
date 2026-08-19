/**
 * Check if a task is overdue.
 * A task is overdue when dueDate < current Date AND status !== 'Completed'
 */
export const isTaskOverdue = (dueDate, status) => {
  if (!dueDate) return false;
  if (status === 'Completed') return false;

  const due = new Date(dueDate);
  const now = new Date();
  
  // Set time of now to start of today for fair date comparisons
  now.setHours(0, 0, 0, 0);
  due.setHours(23, 59, 59, 999);

  return due < now;
};

/**
 * Format date for display (e.g., "20 Aug 2026")
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'No due date';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid date';

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

/**
 * Format date for HTML date input (YYYY-MM-DD)
 */
export const formatInputDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};
