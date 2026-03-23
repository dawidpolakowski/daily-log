async function loadLogs() {
    try {
        const res = await fetch('logs/logs.json');
        const logs = await res.json();

        const container = document.getElementById('logs');
        container.innerHTML = "";

        logs.forEach(log => {
            const el = document.createElement('div');

            const link = document.createElement('a');
            link.href = `log.html?file=${log.file}`;
            link.textContent = log.title;

            el.appendChild(link);
            container.appendChild(el);
        });

    } catch (err) {
        console.error(err);
        document.getElementById('logs').innerHTML = "Failed to load logs.";
    }
}

loadLogs();