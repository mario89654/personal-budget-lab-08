// Seleccionar los elementos del DOM
const form = document.querySelector("#transaction-form");
const transactionList = document.querySelector("#transaction-list");
const incomeEl = document.querySelector("#income");
const expenseEl = document.querySelector("#expense");
const balanceEl = document.querySelector("#balance");

const transacciones = [];

// A. IMPLEMENTACIÓN DE HERENCIA PROTOTIPAL
// 1. Definir la función constructora base Movimiento
function Movimiento(monto, descripcion) {
  this.monto = monto;
  this.descripcion = descripcion;
  this.fecha = new Date().toLocaleDateString();
}

// 3. Implementar métodos comunes en el prototipo de Movimiento
// Método de validación común para todos los movimientos
Movimiento.prototype.validarMovimiento = function() {
  // Validaciones generales para cualquier movimiento
  if (!this.descripcion || this.descripcion.trim() === "") {
    return {
      ok: false,
      message: "Debe completar la descripción"
    };
  }
  
  if (this.monto <= 0 || isNaN(this.monto)) {
    return {
      ok: false,
      message: "El monto debe ser un número mayor a 0"
    };
  }
  
  return {
    ok: true,
    message: "Movimiento registrado correctamente"
  };
};

// Método de renderización común
Movimiento.prototype.render = function() {
  const esEgreso = this instanceof Egreso;
  const colorTexto = esEgreso ? "text-red-600" : "text-green-600";
  const colorFondo = esEgreso ? "bg-red-50" : "bg-green-50";
  const signo = esEgreso ? "-" : "+";

  // Si es la primera transacción, limpiar el mensaje de "No hay transacciones"
  if (transacciones.length === 1) {
    transactionList.innerHTML = "";
  }

  const newRow = `
    <tr class="hover:${colorFondo} ${colorFondo}/30 transition-colors duration-200">
      <td class="px-6 py-4 font-medium">${this.descripcion}</td>
      <td class="px-6 py-4 ${colorTexto} font-bold">${signo}$${Math.abs(
    this.monto
  ).toFixed(2)}</td>
      <td class="px-6 py-4 text-gray-500">${this.fecha}</td>
      <td class="px-6 py-4 text-right">
        <button onclick="eliminarTransaccion(this)" class="text-red-500 hover:text-red-700">
          Eliminar
        </button>
      </td>
    </tr>
  `;
  transactionList.innerHTML += newRow;
};

// 2. Crear funciones constructoras específicas
// Función constructora para Ingreso
function Ingreso(monto, descripcion) {
  // Llamar al constructor padre
  Movimiento.call(this, monto, descripcion);
}
// Establecer la herencia prototipal
Ingreso.prototype = Object.create(Movimiento.prototype);
Ingreso.prototype.constructor = Ingreso;

// 4. Validaciones específicas para Ingreso
Ingreso.prototype.validarMovimiento = function() {
  // Obtener validación general desde el prototipo padre
  const validacionGeneral = Movimiento.prototype.validarMovimiento.call(this);
  if (!validacionGeneral.ok) {
    return validacionGeneral;
  }
  
  // Validaciones específicas para ingresos
  // En este caso no hay validaciones adicionales, pero podrían añadirse si fuera necesario
  return {
    ok: true,
    message: "Ingreso registrado correctamente"
  };
};

// Función constructora para Egreso
function Egreso(monto, descripcion) {
  // Llamar al constructor padre
  Movimiento.call(this, monto, descripcion);
}
// Establecer la herencia prototipal
Egreso.prototype = Object.create(Movimiento.prototype);
Egreso.prototype.constructor = Egreso;

// 4. Validaciones específicas para Egreso
Egreso.prototype.validarMovimiento = function() {
  // Obtener validación general desde el prototipo padre
  const validacionGeneral = Movimiento.prototype.validarMovimiento.call(this);
  if (!validacionGeneral.ok) {
    return validacionGeneral;
  }
  
  // Validaciones específicas para egresos
  // En este caso no hay validaciones adicionales, pero podrían añadirse si fuera necesario
  return {
    ok: true,
    message: "Egreso registrado correctamente"
  };
};

// B. ACTUALIZACIÓN AUTOMÁTICA DE TOTALES
// 1. Implementar método en el prototipo para recalcular totales
Movimiento.prototype.recalcularTotales = function() {
  let totalIngresos = 0;
  let totalEgresos = 0;

  // Recorrer todos los movimientos y calcular los totales
  transacciones.forEach((mov) => {
    if (mov instanceof Ingreso) {
      totalIngresos += mov.monto;
    } else if (mov instanceof Egreso) {
      totalEgresos += mov.monto;
    }
  });

  // 3. Actualizar la interfaz de usuario con los nuevos valores
  incomeEl.textContent = `$${totalIngresos.toFixed(2)}`;
  expenseEl.textContent = `$${totalEgresos.toFixed(2)}`;
  balanceEl.textContent = `$${(totalIngresos - totalEgresos).toFixed(2)}`;
};

// Obtener datos del formulario
function getDataFromForm() {
  const description = document.getElementById("description").value;
  const amount = Number(document.getElementById("amount").value);
  const type = document.querySelector('input[name="type"]:checked').value;

  return {
    description,
    amount,
    type
  };
}

// 5. Verificar que se instancie el objeto correcto y se ejecuten las validaciones
function createMovement(movement) {
  // Instanciar el objeto adecuado según el tipo
  let nuevoMovimiento;
  
  if (movement.type === "income") {
    nuevoMovimiento = new Ingreso(Math.abs(movement.amount), movement.description);
  } else {
    nuevoMovimiento = new Egreso(Math.abs(movement.amount), movement.description);
  }

  // Ejecutar validaciones específicas según el tipo
  const validacion = nuevoMovimiento.validarMovimiento();

  if (validacion.ok) {
    // Registrar el movimiento
    transacciones.push(nuevoMovimiento);
    
    // Renderizar en la interfaz
    nuevoMovimiento.render();
    
    // 2. Invocar el método recalcularTotales automáticamente
    nuevoMovimiento.recalcularTotales();
    
    alert(validacion.message);
    form.reset();
  } else {
    alert(validacion.message);
  }
}

// Event listener para el formulario
form.addEventListener("submit", function(event) {
  event.preventDefault();
  const newMovement = getDataFromForm();
  createMovement(newMovement);
});

// Función para eliminar transacciones
function eliminarTransaccion(button) {
  const fila = button.closest('tr');
  const index = Array.from(fila.parentNode.children).indexOf(fila);
  
  if (index !== -1 && index < transacciones.length) {
    transacciones.splice(index, 1);
    fila.remove();
    
    // Actualizar totales después de eliminar
    if (transacciones.length > 0) {
      transacciones[0].recalcularTotales();
    } else {
      // Si no quedan transacciones, mostrar mensaje y reiniciar totales
      transactionList.innerHTML = `
        <tr class="text-sm text-gray-500">
          <td colspan="4" class="px-6 py-4 text-center">
            No hay transacciones registradas
          </td>
        </tr>
      `;
      incomeEl.textContent = "$0.00";
      expenseEl.textContent = "$0.00";
      balanceEl.textContent = "$0.00";
    }
  }
}

// Inicializar la aplicación
window.addEventListener('DOMContentLoaded', function() {
  // Inicializar la tabla vacía
  if (transacciones.length === 0) {
    transactionList.innerHTML = `
      <tr class="text-sm text-gray-500">
        <td colspan="4" class="px-6 py-4 text-center">
          No hay transacciones registradas
        </td>
      </tr>
    `;
  }
});