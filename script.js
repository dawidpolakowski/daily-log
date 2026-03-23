async function loadLogs() {
    const res = await fetch('logs/logs.json');
    const logs = await res.json();

    const container = document.getElementById('logs');

    logs.reverse().forEach(log => {
        const el = document.createElement('div');
        el.innerHTML = `
  <a href="log.html?file=${log.file}">
    ${log.title}
  </a>
`;
        container.appendChild(el);
    });
}

loadLogs();