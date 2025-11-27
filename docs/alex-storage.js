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
