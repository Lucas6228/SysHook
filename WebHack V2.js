(() => {
    
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '10px';
    container.style.right = '10px';
    container.style.width = '400px';
    container.style.height = 'auto';
    container.style.background = '#1e1e1e';
    container.style.color = 'white';
    container.style.padding = '20px';
    container.style.border = '1px solid #444';
    container.style.zIndex = '10000';
    container.id = 'networkMonitor';

    container.innerHTML = `
        <h3 style="margin: 0; padding-bottom: 10px; text-align: center;">WebHack V2</h3>
        <button style="width: 100%; background: #333; color: white; border: 1px solid #555;" onclick="saveLocalStorage()">Save LocalStorage</button>
        <button style="width: 100%; background: #333; color: white; border: 1px solid #555;" onclick="loadLocalStorage()">Load LocalStorage</button>
        <button style="width: 100%; background: #333; color: white; border: 1px solid #555;" onclick="clearLocalStorage()">Clear LocalStorage</button>
        <br><br>
        <button style="width: 100%; background: #333; color: white; border: 1px solid #555;" onclick="saveCookies()">Save Cookies</button>
        <button style="width: 100%; background: #333; color: white; border: 1px solid #555;" onclick="loadCookies()">Load Cookies</button>
        <button style="width: 100%; background: #333; color: white; border: 1px solid #555;" onclick="clearCookies()">Clear Cookies</button>
        <br><br>
        <button style="width: 100%; background: #333; color: white; border: 1px solid #555;" onclick="sendCustomData()">Send Custom Request</button>
        <button style="width: 100%; background: #333; color: white; border: 1px solid #555;" onclick="sendMultipleRequests()">Send Multiple Requests</button>
        <br><br>
        <button style="width: 100%; background: #333; color: white; border: 1px solid #555;" onclick="startMonitor()">Start Network Monitor</button>
        <button style="width: 100%; background: #333; color: white; border: 1px solid #555;" onclick="exportNetworkData()">Export & Stop Monitor</button>
        <br><br>
        <button style="width: 100%; background: #333; color: white; border: 1px solid #555;" onclick="viewStorage()">View LocalStorage & Cookies</button>
        <button style="width: 100%; background: #333; color: white; border: 1px solid #555;" onclick="clearAllData()">Clear All Data</button>
        <br>
        <button style="width: 100%; background: #333; color: white; border: 1px solid #555;" id="hideButton">Hide</button>
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

    window.viewStorage = function() {
        alert(`LocalStorage: ${JSON.stringify(localStorage, null, 2)}\n\nCookies: ${document.cookie}`);
    };
    
    window.clearAllData = function() {
        localStorage.clear();
        document.cookie.split(';').forEach(cookie => {
            document.cookie = cookie.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
        });
        alert('All storage and cookies cleared!');
    };

    window.sendCustomData = function() {
        let url = prompt('Enter Request URL:');
        let method = prompt('Enter Request Method (GET, POST, etc.):', 'POST');
        let headers = prompt('Enter Headers as JSON (Optional):', '{}');
        let body = prompt('Enter Request Body (Optional):');
        
        try {
            headers = JSON.parse(headers);
        } catch (e) {
            alert('Invalid headers JSON');
            return;
        }
        
        fetch(url, {
            method: method.toUpperCase(),
            headers: headers,
            body: method.toUpperCase() !== 'GET' && body ? JSON.stringify(body) : null
        })
        .then(response => response.text())
        .then(data => alert('Response: ' + data))
        .catch(error => alert('Error: ' + error));
    };

    window.sendMultipleRequests = function() {
        let count = parseInt(prompt('Enter number of requests:', '5'));
        if (isNaN(count) || count < 1) {
            alert('Invalid number');
            return;
        }
        
        for (let i = 0; i < count; i++) {
            sendCustomData();
        }
    };

})();
