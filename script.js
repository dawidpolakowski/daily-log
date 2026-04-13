const PAGE_SIZE = 10;
let currentPage = 1;
let allLogs = [];

async function loadLogs() {
    try {
        const res = await fetch('logs/logs.json');
        allLogs = await res.json();

        renderPage();

    } catch (err) {
        console.error(err);
        document.getElementById('logs').innerHTML = "Failed to load logs.";
    }
}

function renderPage() {
    const container = document.getElementById('logs');
    container.innerHTML = "";

    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const pageLogs = allLogs.slice(start, end);

    pageLogs.forEach(log => {
        const el = document.createElement('div');

        const link = document.createElement('a');
        link.href = `log.html?file=${log.file}`;
        link.textContent = log.title;

        el.appendChild(link);
        container.appendChild(el);
    });

    renderPagination();
}

function renderPagination() {
    let pagination = document.getElementById('pagination');

    if (!pagination) {
        pagination = document.createElement('div');
        pagination.id = 'pagination';
        pagination.style.marginTop = '20px';
        document.body.appendChild(pagination);
    }

    pagination.innerHTML = "";

    const totalPages = Math.ceil(allLogs.length / PAGE_SIZE);

    const prevBtn = document.createElement('button');
    prevBtn.textContent = "← Prev";
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
        currentPage--;
        renderPage();
    };

    const nextBtn = document.createElement('button');
    nextBtn.textContent = "Next →";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => {
        currentPage++;
        renderPage();
    };

    const info = document.createElement('span');
    info.style.margin = "0 10px";
    info.textContent = `Page ${currentPage} of ${totalPages}`;

    pagination.appendChild(prevBtn);
    pagination.appendChild(info);
    pagination.appendChild(nextBtn);
}

loadLogs();