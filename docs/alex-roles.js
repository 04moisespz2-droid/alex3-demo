// alex-roles.js
// Manejo de permisos y protección de páginas según rol

function getUsuarioActualObligatorio() {
  const usuario = load("usuarioActual", null);
  if (!usuario) {
    // Si no hay usuario logueado, se devuelve al login
    window.location.href = "index.html";
  }
  return usuario;
}

function aplicarPermisosYProteger(paginaActual) {
  const usuario = getUsuarioActualObligatorio();
  const rol = usuario.rol;

  const elInventario = document.getElementById("menu-inventario");
  const elVentas = document.getElementById("menu-ventas");
  const elCaja = document.getElementById("menu-caja");
  const elUsuarios = document.getElementById("menu-usuarios");

  // 🔐 Ocultar según rol
  if (rol === "cajero") {
    if (elInventario) elInventario.style.display = "none";
    if (elUsuarios) elUsuarios.style.display = "none";
  } else if (rol === "inventario") {
    if (elVentas) elVentas.style.display = "none";
    if (elCaja) elCaja.style.display = "none";
    if (elUsuarios) elUsuarios.style.display = "none";
  } else if (rol === "invitado") {
    if (elInventario) elInventario.style.display = "none";
    if (elVentas) elVentas.style.display = "none";
    if (elCaja) elCaja.style.display = "none";
    if (elUsuarios) elUsuarios.style.display = "none";
  }

  // Protección fuerte de páginas
  if (paginaActual === "usuarios" && rol !== "dueno") {
    alert("No tienes permiso para ver el módulo de usuarios.");
    window.location.href = "dashboard.html";
  }
}
