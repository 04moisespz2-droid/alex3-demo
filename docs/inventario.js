// inventario.js
// Primera versión: solo carga datos de ejemplo en la tabla
// Más adelante aquí meteremos formularios, guardado en storage, etc.

document.addEventListener('DOMContentLoaded', () => {
  // 1. Referencias a elementos del DOM
  const tbody = document.getElementById('tabla-productos');
  const kpiProductos = document.getElementById('kpi-productos');
  const kpiStockBajo = document.getElementById('kpi-stock-bajo');
  const kpiServicios = document.getElementById('kpi-servicios');
  const kpiValorInventario = document.getElementById('kpi-valor-inventario');

  if (!tbody) {
    console.warn('No se encontró la tabla de productos.');
    return;
  }

  // 2. Datos de ejemplo (luego esto vendrá de storage o backend)
  const productosDemo = [
    {
      codigo: 'P-001',
      nombre: 'Gorra básica negra',
      categoria: 'Accesorios',
      stock: 12,
      precioVenta: 85,
      esServicio: false,
      stockMinimo: 5,
      costo: 40
    },
    {
      codigo: 'P-002',
      nombre: 'Perfume importado 100ml',
      categoria: 'Fragancias',
      stock: 4,
      precioVenta: 250,
      esServicio: false,
      stockMinimo: 5,
      costo: 120
    },
    {
      codigo: 'S-001',
      nombre: 'Envío Cargo Expreso',
      categoria: 'Servicio',
      stock: null,
      precioVenta: 35,
      esServicio: true,
      stockMinimo: 0,
      costo: 25
    }
  ];

  // 3. Limpiar tabla
  tbody.innerHTML = '';

  // 4. Rellenar tabla con los productos
  productosDemo.forEach((p) => {
    const tr = document.createElement('tr');

    const tdCodigo = document.createElement('td');
    tdCodigo.textContent = p.codigo;

    const tdNombre = document.createElement('td');
    tdNombre.textContent = p.nombre;

    const tdCategoria = document.createElement('td');
    tdCategoria.textContent = p.categoria;

    const tdStock = document.createElement('td');
    tdStock.textContent = p.esServicio ? '-' : p.stock;

    const tdPrecio = document.createElement('td');
    tdPrecio.textContent = 'Q ' + p.precioVenta.toFixed(2);

    tr.appendChild(tdCodigo);
    tr.appendChild(tdNombre);
    tr.appendChild(tdCategoria);
    tr.appendChild(tdStock);
    tr.appendChild(tdPrecio);

    tbody.appendChild(tr);
  });

  // 5. Actualizar KPIs de arriba
  const totalProductos = productosDemo.filter(p => !p.esServicio).length;
  const totalServicios = productosDemo.filter(p => p.esServicio).length;
  const productosStockBajo = productosDemo.filter(
    p => !p.esServicio && p.stock !== null && p.stock <= p.stockMinimo
  );
  const valorInventario = productosDemo
    .filter(p => !p.esServicio && p.costo != null && p.stock != null)
    .reduce((acc, p) => acc + p.costo * p.stock, 0);

  if (kpiProductos) kpiProductos.textContent = totalProductos.toString();
  if (kpiServicios) kpiServicios.textContent = totalServicios.toString();
  if (kpiStockBajo) kpiStockBajo.textContent = productosStockBajo.length.toString();
  if (kpiValorInventario) {
    kpiValorInventario.textContent = 'Q ' + valorInventario.toFixed(2);
  }

  console.log('Inventario demo cargado correctamente.');
});
