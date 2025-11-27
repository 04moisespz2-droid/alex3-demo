/* ============================
   SISTEMA DE GUARDADO GLOBAL
   ALEX 3.0 - localStorage
============================ */

// Guardar un dato
function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Cargar un dato
function load(key, defaultValue) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
}
// =====================================
// MONEDA DEL SISTEMA - FUNCIONES GLOBALES
// =====================================

const ALEX3_MONEDAS = {
  GTQ: { simbolo: "Q", sufijo: "" },
  MXN: { simbolo: "$", sufijo: " MXN" },
  USD: { simbolo: "$", sufijo: " USD" },
  COP: { simbolo: "$", sufijo: " COP" },
  PEN: { simbolo: "S/", sufijo: "" },
  CLP: { simbolo: "$", sufijo: " CLP" },
  BRL: { simbolo: "R$", sufijo: "" },
  ARS: { simbolo: "$", sufijo: " ARS" }
};

function alex3ObtenerConfigMoneda() {
  let codigo = localStorage.getItem("alex3_moneda_sistema") || "GTQ";
  if (!ALEX3_MONEDAS[codigo]) codigo = "GTQ";
  return ALEX3_MONEDAS[codigo];
}

function alex3FormatearMoneda(valor) {
  const m = alex3ObtenerConfigMoneda();
  const numero = Number(valor || 0);
  return `${m.simbolo}${numero.toFixed(2)}${m.sufijo}`;
}

