// alex-roles.js
// Manejo de permisos y protección de páginas según rol
// Roles soportados: "dueno" y "empleado"

function getUsuarioActualObligatorio() {
  const usuario = load("usuarioActual", null);
  if (!usuario) {
    // Si no hay usuario logueado, se devuelve al login
    window.location.href = "index.html";
  }
  return usuario;
}

// Helper: obtener elemento del menú (soporta menú viejo y nuevo)
function getMenuElement(slug) {
  // Menú viejo: <li id="menu-dashboard">
  const byId = document.getElementById("menu-" + slug);
  if (byId) return byId;

  // Menú nuevo: <a href="dashboard.html" class="sidebar-link">
  const selector = '.sidebar a[href="' + slug + '.html"]';
  const byHref = document.querySelector(selector);
  if (byHref) return byHref;

  return null;
}

function aplicarPermisosYProteger(paginaActual) {
  const usuario = getUsuarioActualObligatorio();
  const rol = usuario.rol; // "dueno" o "empleado"

  // Si por alguna razón viene un rol raro, lo tratamos como empleado
  const rolNormalizado = (rol === "dueno" || rol === "empleado") ? rol : "empleado";

  // Páginas restringidas para empleados
  const paginasRestringidasParaEmpleado = [
    "usuarios",
    "reportes",
    "contabilidad",
    "sat",
    "ia",
    "configuracion"
  ];

  // Ocultar opciones de menú según rol
  if (rolNormalizado === "empleado") {
    paginasRestringidasParaEmpleado.forEach(slug => {
      const el = getMenuElement(slug);
      if (el) {
        // Si es <li>, lo ocultamos
        if (el.tagName === "LI") {
          el.style.display = "none";
        } else {
          // Si es <a> directo, también
          el.style.display = "none";
        }
      }
    });
  }

  // Protección fuerte de páginas:
  // Si es empleado y está en una página restringida -> lo sacamos al dashboard
  if (rolNormalizado === "empleado") {
    if (paginasRestringidasParaEmpleado.includes(paginaActual)) {
      alert("No tienes permiso para ver este módulo. Solo el dueño puede acceder aquí.");
      window.location.href = "dashboard.html";
      return;
    }
  }

  // Si es dueño, no se bloquea nada. Puede ver todo.
}
