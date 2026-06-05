const PAGE_SIZE = 9;
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
  monthCount: document.getElementById('month-count'),
  latestLog: document.getElementById('latest-log'),
};

function formatMonth(monthKey) {
  const [year, month] = monthKey.split('-').map(Number);
  return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' })
    .format(new Date(year, month - 1));
}

function formatDate(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Intl.DateTimeFormat('en', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(year, month - 1, day));
}

function normalizeLog(log) {
  const date = log.date || log.file.match(/\d{4}-\d{2}-\d{2}/)?.[0] || '';
  const month = log.month || date.slice(0, 7);

  return {
    ...log,
    date,
    month,
    title: log.title || `Daily Log - ${date}`,
    excerpt: log.excerpt || '',
    tags: Array.isArray(log.tags) ? log.tags : [],
  };
}

function getFilteredLogs() {
  const query = state.query.trim().toLowerCase();

  return state.logs.filter((log) => {
    const matchesMonth = state.month === 'all' || log.month === state.month;
    const haystack = `${log.title} ${log.excerpt} ${log.tags.join(' ')} ${log.date} ${formatMonth(log.month)}`.toLowerCase();
    const matchesSearch = !query || haystack.includes(query);

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

  const excerpt = document.createElement('p');
  excerpt.className = 'log-excerpt';
  excerpt.textContent = log.excerpt;

  const foot = document.createElement('div');
  foot.className = 'log-foot';

  const date = document.createElement('span');
  date.textContent = formatDate(log.date);

  const read = document.createElement('span');
  read.className = 'read';
  read.textContent = 'Read →';

  foot.append(date, read);
  link.append(month, title);
  if (log.excerpt) link.appendChild(excerpt);
  link.appendChild(foot);
  article.appendChild(link);

  if (log.tags.length) {
    const tags = document.createElement('div');
    tags.className = 'tags';

    log.tags.forEach((tag) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'tag';
      chip.textContent = tag;
      chip.addEventListener('click', () => filterByTag(tag));
      tags.appendChild(chip);
    });

    article.appendChild(tags);
  }

  return article;
}

function filterByTag(tag) {
  elements.searchInput.value = tag;
  state.query = tag;
  state.currentPage = 1;
  renderLogs();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderSkeletons(count = 6) {
  elements.logs.replaceChildren(
    ...Array.from({ length: count }, () => {
      const card = document.createElement('div');
      card.className = 'skeleton';
      card.innerHTML = '<span class="s1"></span><span class="s2"></span>'
        + '<span class="s3"></span><span class="s4"></span><span class="s5"></span>';
      return card;
    }),
  );
}

function renderLogs() {
  const filteredLogs = getFilteredLogs();
  const pageLogs = getPageLogs(filteredLogs);

  elements.logs.replaceChildren();
  elements.resultCount.textContent = `${filteredLogs.length} ${filteredLogs.length === 1 ? 'entry' : 'entries'}`;

  if (pageLogs.length) {
    elements.logs.append(...pageLogs.map(createLogCard));
  } else {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.textContent = 'No logs match the current filters.';
    elements.logs.appendChild(emptyState);
  }

  renderPagination(filteredLogs.length);
}

function renderPagination(totalItems) {
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  state.currentPage = Math.min(state.currentPage, totalPages);

  elements.pagination.replaceChildren();
  elements.pagination.hidden = totalPages <= 1;

  const previousButton = document.createElement('button');
  previousButton.type = 'button';
  previousButton.textContent = 'Previous';
  previousButton.disabled = state.currentPage === 1;
  previousButton.addEventListener('click', () => {
    state.currentPage -= 1;
    renderLogs();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const nextButton = document.createElement('button');
  nextButton.type = 'button';
  nextButton.textContent = 'Next';
  nextButton.disabled = state.currentPage === totalPages;
  nextButton.addEventListener('click', () => {
    state.currentPage += 1;
    renderLogs();
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
  const months = new Set(state.logs.map((log) => log.month));

  elements.totalLogs.textContent = state.logs.length;
  if (elements.monthCount) elements.monthCount.textContent = months.size;
  elements.latestLog.textContent = latestLog ? formatDate(latestLog.date) : '—';
}

async function loadLogs() {
  renderSkeletons();

  try {
    const response = await fetch(LOGS_INDEX_URL);
    if (!response.ok) throw new Error(`Unable to fetch ${LOGS_INDEX_URL}`);

    const logs = await response.json();
    state.logs = logs.map(normalizeLog);

    renderStats();
    renderMonthFilter();
    renderLogs();
  } catch (error) {
    console.error(error);
    const errorState = document.createElement('div');
    errorState.className = 'empty-state';
    errorState.textContent = 'Failed to load logs.';
    elements.logs.replaceChildren(errorState);
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
