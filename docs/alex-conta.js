// alex-conta.js
// ============================
// Motor contable de ALEX 3.0
// Genera libro diario, estado de resultados, balance y flujo de caja
// ============================

function alexConta_esMismoMes(fecha, referencia) {
  return (
    fecha.getFullYear() === referencia.getFullYear() &&
    fecha.getMonth() === referencia.getMonth()
  );
}

function alexConta_formatearFecha(fechaIso) {
  const d = new Date(fechaIso);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleString("es-GT");
}

function alexConta_formatearYYYYMMDD(fechaIso) {
  const d = new Date(fechaIso);
  if (isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function alexConta_moneda(n) {
  if (typeof alex3FormatearMoneda === "function") {
    return alex3FormatearMoneda(n);
  }
  const num = Number(n);
  if (isNaN(num)) return "Q 0.00";
  return "Q " + num.toFixed(2);
}

// Carga segura desde localStorage vía alex-storage.js
function alexConta_load(nombre, defecto) {
  if (typeof load === "function") {
    const data = load(nombre, defecto);
    return Array.isArray(defecto) && !Array.isArray(data) ? defecto : data;
  }
  return defecto;
}

/**
 * Calcula todo lo contable de un mes:
 * - libro diario (devengado simple)
 * - estado de resultados
 * - balance básico
 * - vista de caja (flujo de efectivo)
 */
function alexContaCalcularMes(fechaReferencia) {
  const ref = fechaReferencia instanceof Date ? fechaReferencia : new Date();

  // Datos base
  const ventas = alexConta_load("ventas", []);
  const compras = alexConta_load("compras", []);
  // Gastos que definimos en gastos.html
  const gastos = alexConta_load("gastos", []);
  // Movimientos de caja para vista "método de caja"
  const movCaja1 = alexConta_load("caja_movimientos", []);
  const movCaja2 = alexConta_load("movimientosCaja", []);
  const movimientosCaja =
    Array.isArray(movCaja1) && movCaja1.length > 0 ? movCaja1 : movCaja2;

  // Filtrar por MES
  const ventasMes = ventas.filter((v) => {
    const f = new Date(v.fechaHora || v.fecha || Date.now());
    return alexConta_esMismoMes(f, ref);
  });

  const comprasMes = compras.filter((c) => {
    const f = new Date(c.fechaHora || c.fecha || Date.now());
    return alexConta_esMismoMes(f, ref);
  });

  const gastosMes = gastos.filter((g) => {
    const f = new Date(g.fechaHora || g.fecha || Date.now());
    return alexConta_esMismoMes(f, ref);
  });

  const movCajaMes = movimientosCaja.filter((m) => {
    const f = new Date(m.fechaHora || m.fecha || m.fecha || Date.now());
    return alexConta_esMismoMes(f, ref);
  });

  // ===== Libro diario (visión devengado simple) =====
  // Por ahora:
  //  - Venta → Caja/Bancos (Debe) vs Ingresos por ventas (Haber)
  //  - Compra → Inventario mercaderías (Debe) vs Caja/Bancos (Haber)
  //  - Gasto → Gastos operativos (Debe) vs Caja/Bancos (Haber)

  const libroDiario = [];

  ventasMes.forEach((v) => {
    const total = Number(v.total) || 0;
    const fechaIso = v.fechaHora || new Date().toISOString();
    libroDiario.push({
      fecha: fechaIso,
      fechaTexto: alexConta_formatearFecha(fechaIso),
      origenTipo: "venta",
      origenId: v.id || null,
      descripcion:
        "Venta " + (v.clienteNombre || v.cliente || "cliente general"),
      lineas: [
        { cuenta: "Caja / Bancos", debe: total, haber: 0 },
        { cuenta: "Ingresos por ventas", debe: 0, haber: total },
      ],
    });
  });

  comprasMes.forEach((c) => {
    const monto = Number(c.monto) || 0;
    const fechaIso = c.fechaHora || new Date().toISOString();
    libroDiario.push({
      fecha: fechaIso,
      fechaTexto: alexConta_formatearFecha(fechaIso),
      origenTipo: "compra",
      origenId: c.id || null,
      descripcion:
        "Compra a " + (c.proveedorNombre || c.proveedor || "proveedor"),
      lineas: [
        { cuenta: "Inventario mercaderías", debe: monto, haber: 0 },
        { cuenta: "Caja / Bancos", debe: 0, haber: monto },
      ],
    });
  });

  gastosMes.forEach((g) => {
    const monto = Number(g.monto) || 0;
    const fechaIso = g.fechaHora || new Date().toISOString();
    libroDiario.push({
      fecha: fechaIso,
      fechaTexto: alexConta_formatearFecha(fechaIso),
      origenTipo: "gasto",
      origenId: g.id || null,
      descripcion:
        "Gasto: " +
        (g.categoria || "Gasto") +
        " - " +
        (g.descripcion || "Sin detalle"),
      lineas: [
        { cuenta: "Gastos operativos", debe: monto, haber: 0 },
        { cuenta: "Caja / Bancos", debe: 0, haber: monto },
      ],
    });
  });

  // Ordenar libro por fecha
  libroDiario.sort((a, b) => {
    const fa = new Date(a.fecha).getTime();
    const fb = new Date(b.fecha).getTime();
    return fa - fb;
  });

  // ===== Estado de resultados (devengado) =====
  const ingresosVentas = ventasMes.reduce(
    (acc, v) => acc + (Number(v.total) || 0),
    0
  );
  const costosCompras = comprasMes.reduce(
    (acc, c) => acc + (Number(c.monto) || 0),
    0
  );
  const gastosOperativos = gastosMes.reduce(
    (acc, g) => acc + (Number(g.monto) || 0),
    0
  );

  const utilidadBruta = ingresosVentas - costosCompras;
  const utilidadNeta = ingresosVentas - costosCompras - gastosOperativos;

  // ===== Vista de caja (método de caja) =====
  let cajaIngresos = 0;
  let cajaEgresos = 0;
  movCajaMes.forEach((m) => {
    const monto = Number(m.monto) || 0;
    if (m.tipo === "INGRESO" || m.tipo === "ingreso") {
      cajaIngresos += monto;
    } else if (m.tipo === "EGRESO" || m.tipo === "egreso") {
      cajaEgresos += monto;
    }
  });
  const cajaNeta = cajaIngresos - cajaEgresos;

  // ===== Balance súper básico =====
  // Muy simplificado, pero sirve como idea:
  //  Activos:
  //    - Caja (vista caja neta del mes)
  //    - Inventario (total compras del mes como aproximación)
  //  Pasivos:
  //    - (0 por ahora, sin CxP)
  //  Patrimonio:
  //    - Total activos
  const saldoCaja = cajaNeta;
  const saldoInventario = costosCompras;
  const totalActivos = saldoCaja + saldoInventario;
  const totalPasivos = 0;
  const patrimonio = totalActivos;

  const balance = {
    activos: {
      caja: saldoCaja,
      inventario: saldoInventario,
      total: totalActivos,
    },
    pasivos: {
      total: totalPasivos,
    },
    patrimonio: {
      capital: 0,
      utilidadAcumulada: patrimonio,
      total: patrimonio,
    },
  };

  // Resultado final del motor
  return {
    // Meta
    referencia: ref,
    mesClave: `${ref.getFullYear()}-${String(ref.getMonth() + 1).padStart(
      2,
      "0"
    )}`,

    // Listas base filtradas
    ventasMes,
    comprasMes,
    gastosMes,
    movCajaMes,

    // Libro diario completo (devengado simple)
    libroDiario,

    // Estado de resultados (devengado)
    ingresosVentas,
    costosCompras,
    gastosOperativos,
    utilidadBruta,
    utilidadNeta,

    // Vista caja (flujo efectivo)
    cajaIngresos,
    cajaEgresos,
    cajaNeta,

    // Balance simple
    balance,
  };
}
