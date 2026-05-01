const PAGE_SIZE = 10;
const LOGS_INDEX_URL = 'logs/logs.json';

const state = {
  currentPage: 1,
  logs: [],
  query: '',
  month: 'all',
};

const elements = {
  logs: document.getElementById('logs'),
  pagination: document.getElementById('pagination'),
  searchInput: document.getElementById('search-input'),
  monthFilter: document.getElementById('month-filter'),
  resultCount: document.getElementById('result-count'),
  totalLogs: document.getElementById('total-logs'),
  latestLog: document.getElementById('latest-log'),
};

function formatMonth(monthKey) {
  const [year, month] = monthKey.split('-').map(Number);
  const date = new Date(year, month - 1);

  return new Intl.DateTimeFormat('en', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function formatDate(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function normalizeLog(log) {
  const date = log.date || log.file.match(/\d{4}-\d{2}-\d{2}/)?.[0] || '';
  const month = log.month || date.slice(0, 7);

  return {
    ...log,
    date,
    month,
    title: log.title || `Daily Log - ${date}`,
  };
}

function getFilteredLogs() {
  const query = state.query.trim().toLowerCase();

  return state.logs.filter((log) => {
    const matchesMonth = state.month === 'all' || log.month === state.month;
    const searchableText = `${log.title} ${log.date} ${formatMonth(log.month)}`.toLowerCase();
    const matchesSearch = !query || searchableText.includes(query);

    return matchesMonth && matchesSearch;
  });
}

function getPageLogs(logs) {
  const start = (state.currentPage - 1) * PAGE_SIZE;

  return logs.slice(start, start + PAGE_SIZE);
}

function createLogCard(log) {
  const article = document.createElement('article');
  article.className = 'log-card';

  const link = document.createElement('a');
  link.href = `log.html?file=${encodeURIComponent(log.file)}`;
  link.className = 'log-card-link';

  const month = document.createElement('span');
  month.className = 'log-month';
  month.textContent = formatMonth(log.month);

  const title = document.createElement('h3');
  title.textContent = log.title;

  const meta = document.createElement('p');
  meta.textContent = formatDate(log.date);

  link.append(month, title, meta);
  article.appendChild(link);

  return article;
}

function renderLogs() {
  const filteredLogs = getFilteredLogs();
  const pageLogs = getPageLogs(filteredLogs);

  elements.logs.replaceChildren();
  elements.resultCount.textContent = `${filteredLogs.length} ${filteredLogs.length === 1 ? 'entry' : 'entries'}`;

  if (!pageLogs.length) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.textContent = 'No logs match the current filters.';
    elements.logs.appendChild(emptyState);
    renderPagination(filteredLogs.length);
    return;
  }

  pageLogs.forEach((log) => {
    elements.logs.appendChild(createLogCard(log));
  });

  renderPagination(filteredLogs.length);
}

function renderPagination(totalItems) {
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  elements.pagination.replaceChildren();
  elements.pagination.hidden = totalPages <= 1;

  const previousButton = document.createElement('button');
  previousButton.type = 'button';
  previousButton.textContent = 'Previous';
  previousButton.disabled = state.currentPage === 1;
  previousButton.addEventListener('click', () => {
    state.currentPage -= 1;
    renderLogs();
  });

  const nextButton = document.createElement('button');
  nextButton.type = 'button';
  nextButton.textContent = 'Next';
  nextButton.disabled = state.currentPage === totalPages;
  nextButton.addEventListener('click', () => {
    state.currentPage += 1;
    renderLogs();
  });

  const pageInfo = document.createElement('span');
  pageInfo.textContent = `Page ${state.currentPage} of ${totalPages}`;

  elements.pagination.append(previousButton, pageInfo, nextButton);
}

function renderMonthFilter() {
  const months = [...new Set(state.logs.map((log) => log.month))];

  months.forEach((month) => {
    const option = document.createElement('option');
    option.value = month;
    option.textContent = formatMonth(month);
    elements.monthFilter.appendChild(option);
  });
}

function renderStats() {
  const [latestLog] = state.logs;

  elements.totalLogs.textContent = state.logs.length;
  elements.latestLog.textContent = latestLog
    ? `Latest: ${formatDate(latestLog.date)}`
    : 'No logs yet';
}

async function loadLogs() {
  try {
    const response = await fetch(LOGS_INDEX_URL);

    if (!response.ok) {
      throw new Error(`Unable to fetch ${LOGS_INDEX_URL}`);
    }

    const logs = await response.json();
    state.logs = logs.map(normalizeLog);

    renderStats();
    renderMonthFilter();
    renderLogs();
  } catch (error) {
    console.error(error);
    elements.logs.innerHTML = '<div class="empty-state">Failed to load logs.</div>';
    elements.resultCount.textContent = 'Unavailable';
  }
}

elements.searchInput.addEventListener('input', (event) => {
  state.query = event.target.value;
  state.currentPage = 1;
  renderLogs();
});

elements.monthFilter.addEventListener('change', (event) => {
  state.month = event.target.value;
  state.currentPage = 1;
  renderLogs();
});

loadLogs();
