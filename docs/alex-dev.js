// ================================================================
// ALEX 3.0 - MODO DESARROLLADOR
// Control de caché + logging + auto-refresco
// ================================================================

function alexDevLog(msg) {
  if (localStorage.getItem("alex3_modo_dev") === "1") {
    console.log("%c[ALEX DEV]", "color:#00eaff;font-weight:bold;", msg);
  }
}

// Evitar caché
(function() {
  const dev = localStorage.getItem("alex3_modo_dev");
  if (dev === "1") {
    alexDevLog("Modo desarrollador ACTIVADO. Desactivando caché...");
    // Agrega ?v=timestamp a todos los archivos CSS y JS
    const timestamp = Date.now();

    document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
      link.href = link.href.split('?')[0] + "?v=" + timestamp;
    });

    document.querySelectorAll('script[src]').forEach(script => {
      script.src = script.src.split('?')[0] + "?v=" + timestamp;
    });

    alexDevLog("Archivos recargados con timestamp: " + timestamp);
  }
})();
