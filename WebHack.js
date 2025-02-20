(function () {
  function exportLocalStorage() {
    const data = JSON.stringify(localStorage);
    const blob = new Blob([data], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "localStorageBackup.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function importLocalStorage(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const data = JSON.parse(e.target.result);
        for (const key in data) {
          localStorage.setItem(key, data[key]);
        }
        location.reload();
      } catch (error) {
        showPopup("Error: Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  }

  function exportCookies() {
    const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
      const [key, value] = cookie.split("=");
      acc[key] = value;
      return acc;
    }, {});
    const data = JSON.stringify(cookies);
    const blob = new Blob([data], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "cookiesBackup.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function importCookies(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const cookies = JSON.parse(e.target.result);
        for (const [key, value] of Object.entries(cookies)) {
          document.cookie = `${key}=${value}; path=/`;
        }
        location.reload();
      } catch (error) {
        showPopup("Error: Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  }

  function listCookies() {
    const cookies = document.cookie.split("; ");
    if (cookies.length === 1 && cookies[0] === "") {
      showPopup("No cookies found.");
      return;
    }

    let cookieList = "<strong>Stored Cookies:</strong><br><ul>";
    cookies.forEach((cookie) => {
      cookieList += `<li>${cookie}</li>`;
    });
    cookieList += "</ul>";

    showPopup(cookieList);
  }

  function listLocalStorage() {
    if (localStorage.length === 0) {
      showPopup("LocalStorage is empty.");
      return;
    }

    let storageList = "<strong>LocalStorage Data:</strong><br><ul>";
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      storageList += `<li><strong>${key}:</strong> ${value}</li>`;
    }
    storageList += "</ul>";

    showPopup(storageList);
  }

  function showPopup(content) {
    let popup = document.getElementById("popupBox");
    if (popup) popup.remove();

    popup = document.createElement("div");
    popup.id = "popupBox";
    popup.innerHTML = `
      <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                  background: white; padding: 15px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0,0,0,0.2);
                  min-width: 250px; z-index: 10000; max-height: 300px; overflow-y: auto;">
        <button id="closePopup" style="position: absolute; top: 5px; right: 5px; border: none; background: red; 
                                       color: white; cursor: pointer; border-radius: 50%; width: 20px; height: 20px;">X</button>
        <div style="margin-top: 10px;">${content}</div>
      </div>
    `;

    document.body.appendChild(popup);
    document.getElementById("closePopup").onclick = () => popup.remove();
  }

  function createUI() {
    const div = document.createElement("div");
    div.style.position = "fixed";
    div.style.bottom = "10px";
    div.style.right = "10px";
    div.style.padding = "15px";
    div.style.background = "white";
    div.style.border = "1px solid black";
    div.style.borderRadius = "8px";
    div.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.2)";
    div.style.zIndex = "10000";
    div.style.display = "flex";
    div.style.flexDirection = "column";
    div.style.gap = "8px";

    function addButton(label, onClick) {
      const btn = document.createElement("button");
      btn.innerText = label;
      btn.style.padding = "8px";
      btn.style.border = "1px solid black";
      btn.style.background = "#f8f8f8";
      btn.style.cursor = "pointer";
      btn.style.borderRadius = "4px";
      btn.onmouseover = () => (btn.style.background = "#e0e0e0");
      btn.onmouseout = () => (btn.style.background = "#f8f8f8");
      btn.onclick = onClick;
      div.appendChild(btn);
    }

    addButton("Export LocalStorage", exportLocalStorage);
    
    const importLocalStorageInput = document.createElement("input");
    importLocalStorageInput.type = "file";
    importLocalStorageInput.accept = "application/json";
    importLocalStorageInput.onchange = importLocalStorage;
    div.appendChild(importLocalStorageInput);

    addButton("Export Cookies", exportCookies);

    const importCookiesInput = document.createElement("input");
    importCookiesInput.type = "file";
    importCookiesInput.accept = "application/json";
    importCookiesInput.onchange = importCookies;
    div.appendChild(importCookiesInput);

    addButton("List Cookies", listCookies);
    addButton("List LocalStorage", listLocalStorage);

    document.body.appendChild(div);
  }

  createUI();
})();
