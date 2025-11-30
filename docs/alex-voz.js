// =====================
// ALEX 3.0 - Voz GRATIS
// =====================

// Activar síntesis de voz
function alexHablar(texto) {
  try {
    const msg = new SpeechSynthesisUtterance(texto);
    msg.lang = "es-ES";
    msg.rate = 1;
    speechSynthesis.cancel();
    speechSynthesis.speak(msg);
  } catch (e) {
    console.error("Error al hablar:", e);
  }
}

// Reconocimiento de voz nativo
let reconocimiento;
let escuchando = false;

function iniciarReconocimiento() {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) {
    alert("Tu dispositivo no soporta reconocimiento de voz.");
    return;
  }

  reconocimiento = new SpeechRec();
  reconocimiento.lang = "es-ES";
  reconocimiento.continuous = false;
  reconocimiento.interimResults = false;

  reconocimiento.onstart = () => {
    escuchando = true;
    alexHablar("Te escucho.");
    document.getElementById("btnVoz").classList.add("escuchando");
  };

  reconocimiento.onend = () => {
    escuchando = false;
    document.getElementById("btnVoz").classList.remove("escuchando");
  };

  reconocimiento.onerror = () => {
    escuchando = false;
    document.getElementById("btnVoz").classList.remove("escuchando");
  };

  reconocimiento.onresult = (event) => {
    const texto = event.results[0][0].transcript.toLowerCase();
    procesarComandoVoz(texto);
  };

  reconocimiento.start();
}

// =====================
// PROCESAR COMANDOS
// =====================

function procesarComandoVoz(texto) {
  console.log("ALEX escuchó:", texto);

  // ===== Navegación por voz =====
  if (texto.includes("abrir ventas")) return abrirModulo("ventas.html");
  if (texto.includes("abrir inventario")) return abrirModulo("inventario.html");
  if (texto.includes("abrir caja")) return abrirModulo("caja.html");
  if (texto.includes("abrir compras")) return abrirModulo("compras.html");
  if (texto.includes("abrir gastos")) return abrirModulo("gastos.html");
  if (texto.includes("abrir clientes")) return abrirModulo("clientes.html");
  if (texto.includes("abrir proveedores")) return abrirModulo("proveedores.html");
  if (texto.includes("abrir reportes")) return abrirModulo("reportes.html");

  // ===== Leer resumen =====
  if (texto.includes("resumen de hoy")) return leerResumen("hoy");
  if (texto.includes("resumen del mes")) return leerResumen("mes");

  // ===== Registrar venta rápida =====
  if (texto.includes("venta rápida") || texto.includes("registrar venta")) {
    const monto = extraerNumero(texto);
    if (monto) return registrarVentaRapida(monto);
    return alexHablar("No entendí el monto de la venta rápida.");
  }

  // ===== Registrar gasto rápido =====
  if (texto.includes("registrar gasto") || texto.includes("gasto rápido")) {
    const monto = extraerNumero(texto);
    if (monto) return registrarGastoRapido(monto);
    return alexHablar("No entendí el monto del gasto.");
  }

  // Si no entendió:
  alexHablar("No entendí ese comando. Puedes decir abrir ventas, registrar venta rápida o leer resumen.");
}

// =====================
// FUNCIONES AUXILIARES
// =====================

function abrirModulo(url) {
  alexHablar("Abriendo módulo.");
  setTimeout(() => {
    window.location.href = url;
  }, 800);
}

// Extraer números desde la voz
function extraerNumero(texto) {
  const match = texto.match(/([0-9]+)/);
  return match ? parseFloat(match[0]) : null;
}

// ===== Resumen por voz =====
function leerResumen(tipo) {
  const ventas = load("ventas", []);
  const hoy = new Date();

  let total = 0;
  ventas.forEach(v => {
    const f = new Date(v.fechaHora);
    if (tipo === "hoy") {
      if (f.toDateString() === hoy.toDateString()) {
        total += Number(v.total);
      }
    } else if (tipo === "mes") {
      if (f.getMonth() === hoy.getMonth() &&
          f.getFullYear() === hoy.getFullYear()) {
        total += Number(v.total);
      }
    }
  });

  if (tipo === "hoy") {
    alexHablar(`Hoy llevas ${total} quetzales en ventas.`);
  } else {
    alexHablar(`Este mes llevas ${total} quetzales en ventas.`);
  }
}

// ===== Registrar venta rápida =====
function registrarVentaRapida(monto) {
  const ventas = load("ventas", []);
  const ahora = new Date();

  ventas.push({
    id: "venta_rapida_" + Date.now(),
    fecha: ahora.toLocaleString("es-GT"),
    fechaHora: ahora.toISOString(),
    clienteNombre: "Cliente general",
    documentoTipo: "Ticket",
    documentoNumero: "",
    total: monto,
    formaPago: "EFECTIVO",
    notas: "Venta rápida por voz",
    origen: "voz"
  });

  save("ventas", ventas);

  alexHablar(`Venta rápida de ${monto} quetzales registrada correctamente.`);
}

// ===== Registrar gasto rápido =====
function registrarGastoRapido(monto) {
  const gastos = load("gastos", []);
  const ahora = new Date();

  gastos.push({
    id: "gasto_voz_" + Date.now(),
    fecha: ahora.toLocaleString("es-GT"),
    fechaHora: ahora.toISOString(),
    categoria: "General",
    descripcion: "Gasto rápido por voz",
    monto: monto,
    origen: "voz"
  });

  save("gastos", gastos);

  alexHablar(`Gasto de ${monto} quetzales registrado correctamente.`);
}
