(() => {
    console.log (WEBHACK V2)

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '10px';
    container.style.right = '10px';
    container.style.background = '#1e1e1e';
    container.style.color = 'white';
    container.style.padding = '10px';
    container.style.border = '1px solid #444';
    container.style.zIndex = '10000';
    container.id = 'networkMonitor';

    container.innerHTML = `
        <h3 style="margin: 0; padding-bottom: 10px;">WebHack V2</h3>
        <button style="background: #333; color: white; border: 1px solid #555;" onclick="saveLocalStorage()">Save LocalStorage</button>
        <button style="background: #333; color: white; border: 1px solid #555;" onclick="loadLocalStorage()">Load LocalStorage</button>
        <button style="background: #333; color: white; border: 1px solid #555;" onclick="clearLocalStorage()">Clear LocalStorage</button>
        <br><br>
        <button style="background: #333; color: white; border: 1px solid #555;" onclick="saveCookies()">Save Cookies</button>
        <button style="background: #333; color: white; border: 1px solid #555;" onclick="loadCookies()">Load Cookies</button>
        <button style="background: #333; color: white; border: 1px solid #555;" onclick="clearCookies()">Clear Cookies</button>
        <br><br>
        <button style="background: #333; color: white; border: 1px solid #555;" onclick="sendRequest()">Send Request</button>
        <br><br>
        <button style="background: #333; color: white; border: 1px solid #555;" onclick="startMonitor()">Start Network Monitor</button>
        <button style="background: #333; color: white; border: 1px solid #555;" onclick="exportNetworkData()">Export & Stop Monitor</button>
        <br>
        <button style="background: #333; color: white; border: 1px solid #555;" id="hideButton">Hide</button>
    `;
    document.body.appendChild(container);

    const toggleButton = document.createElement('button');
    toggleButton.innerText = 'Show Menu';
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '10px';
    toggleButton.style.left = '50%';
    toggleButton.style.transform = 'translateX(-50%)';
    toggleButton.style.display = 'none';
    toggleButton.style.background = '#333';
    toggleButton.style.color = 'white';
    toggleButton.style.border = '1px solid #555';
    toggleButton.id = 'showButton';
    toggleButton.onclick = () => {
        container.style.display = 'block';
        toggleButton.style.display = 'none';
    };
    document.body.appendChild(toggleButton);

    document.getElementById('hideButton').onclick = function() {
        container.style.display = 'none';
        toggleButton.style.display = 'block';
    };

    let networkLogs = [];

    window.startMonitor = function() {
        if (window.networkObserver) return;
        networkLogs = [];
        window.networkObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                networkLogs.push({
                    url: entry.name,
                    time: new Date().toLocaleString()
                });
            });
        });
        window.networkObserver.observe({ entryTypes: ['resource'] });
        alert('Network monitoring started.');
    };

    window.exportNetworkData = function() {
        if (!window.networkObserver) return;
        window.networkObserver.disconnect();
        window.networkObserver = null;

        const blob = new Blob([JSON.stringify(networkLogs, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'network_logs.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        alert('Network monitoring stopped. Data exported.');
    };

    window.saveLocalStorage = function() {
        localStorage.setItem('data', prompt('Enter Local Storage Data:'));
        alert('Local storage saved!');
    };
    
    window.loadLocalStorage = function() {
        alert('Local Storage: ' + (localStorage.getItem('data') || 'No data'));
    };
    
    window.clearLocalStorage = function() {
        localStorage.clear();
        alert('Local storage cleared!');
    };
    
    window.saveCookies = function() {
        document.cookie = `data=${prompt('Enter Cookie Data:')}; path=/`;
        alert('Cookie saved!');
    };
    
    window.loadCookies = function() {
        let match = document.cookie.match(/data=([^;]*)/);
        alert('Cookies: ' + (match ? match[1] : 'No data'));
    };
    
    window.clearCookies = function() {
        document.cookie = 'data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
        alert('Cookie cleared!');
    };
    
    window.sendRequest = function() {
        let url = prompt('Enter Request URL:');
        let body = prompt('Enter Request Body (Optional):');
        
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: body ? JSON.stringify({ data: body }) : null
        })
        .then(response => response.text())
        .then(data => alert('Response: ' + data))
        .catch(error => alert('Error: ' + error));
    };
})();
