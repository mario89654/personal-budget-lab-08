const form = document.querySelector("form");
const transactionList = document.querySelector("#transaction-list");
const totalIncomeEl = document.querySelector("#total-income");
const totalExpenseEl = document.querySelector("#total-expense");
const confirmationMessage = document.querySelector("#confirmation-message");

const transacciones = [];

function getDataFromForm() {
  const formData = new FormData(form);
  const description = formData.get("description");
  const amount = Number(formData.get("amount"));
  const type = formData.get("type");

  return {
    description,
    amount,
    type,
  };
}

function createMovement(movement) {
  const nuevoMovimiento = movement.type === "income"
    ? new Ingreso(movement.amount, movement.description)
    : new Egreso(movement.amount, movement.description);

  const validacion = nuevoMovimiento.validarMovimiento();

  if (validacion.ok) {
    transacciones.push(nuevoMovimiento);
    nuevoMovimiento.render();
    Movimiento.prototype.recalcularTotales();
    showConfirmationMessage("Movimiento registrado correctamente");
    form.reset();
  } else {
    alert(validacion.message);
  }
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const newMovement = getDataFromForm();
  createMovement(newMovement);
});

function Movimiento(monto, descripcion) {
  this.monto = monto;
  this.descripcion = descripcion;
  this.fecha = new Date().toLocaleDateString();
}

Movimiento.prototype.render = function () {
  const esEgreso = this instanceof Egreso;
  const colorTexto = esEgreso ? "text-red-600" : "text-green-600";
  const colorFondo = esEgreso ? "bg-red-50" : "bg-green-50";
  const signo = esEgreso ? "-" : "+";

  const newRow = `
    <tr class="hover:${colorFondo} ${colorFondo}/30 transition-colors duration-200">
      <td class="px-4 py-3 font-medium">${this.descripcion}</td>
      <td class="px-4 py-3 ${colorTexto} font-bold">${signo}$${Math.abs(
    this.monto
  ).toFixed(2)}</td>
      <td class="px-4 py-3 text-gray-500">${this.fecha}</td>
    </tr>
  `;
  transactionList.innerHTML += newRow;
};

Movimiento.prototype.recalcularTotales = function () {
  let totalIngresos = 0;
  let totalEgresos = 0;

  transacciones.forEach((mov) => {
    if (mov instanceof Ingreso) {
      totalIngresos += mov.monto;
    } else if (mov instanceof Egreso) {
      totalEgresos += mov.monto;
    }
  });

  totalIncomeEl.textContent = `$${totalIngresos.toFixed(2)}`;
  totalExpenseEl.textContent = `$${totalEgresos.toFixed(2)}`;
};

Movimiento.prototype.validarMovimiento = function () {
  if (this.monto <= 0 || isNaN(this.monto)) {
    return {
      ok: false,
      message: "El monto debe ser un número mayor a 0",
    };
  }
  if (!this.descripcion || this.descripcion.trim() === "") {
    return {
      ok: false,
      message: "Debe completar la descripción",
    };
  }
  return {
    ok: true,
    message: "Movimiento registrado correctamente",
  };
};

function Ingreso(monto, descripcion) {
  Movimiento.call(this, monto, descripcion);
}
Ingreso.prototype = Object.create(Movimiento.prototype);
Ingreso.prototype.constructor = Ingreso;

function Egreso(monto, descripcion) {
  Movimiento.call(this, monto, descripcion);
}
Egreso.prototype = Object.create(Movimiento.prototype);
Egreso.prototype.constructor = Egreso;

function showConfirmationMessage(message) {
  confirmationMessage.textContent = message;
  confirmationMessage.classList.remove("hidden");
  setTimeout(() => {
    confirmationMessage.classList.add("hidden");
  }, 3000);
}
