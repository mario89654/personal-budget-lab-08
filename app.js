const form = document.querySelector("form");
const transacciones = [];
const balanceEl = document.querySelector("#balance");
const ingresosEl = document.querySelector("#ingresos");
const gastosEl = document.querySelector("#gastos");
const movimientosList = document.querySelector("#movements-list");

function getDataFromForm() {
    const formData = new FormData(form);
    return {
        description: formData.get("description"),
        amount: parseFloat(formData.get("amount").trim()),
        type: formData.get("type")
    };
}

function Movimiento(tipo, monto, descripcion) {
    this.tipo = tipo;
    this.monto = monto;
    this.descripcion = descripcion;
}

Movimiento.prototype.validarMovimiento = function () {
    console.log("Validando movimiento:", this.tipo, this.monto, this.descripcion);
    
    if (isNaN(this.monto) || this.monto <= 0) {
        return { ok: false, message: "El monto debe ser un número mayor a 0" };
    }
    if (this.descripcion.trim() === "") {
        return { ok: false, message: "Debe completar la descripción" };
    }
    if (!["Ingreso", "Gasto"].includes(this.tipo)) {
        return { ok: false, message: "El tipo de transacción es erróneo" };
    }
    return { ok: true, message: "Movimiento validado correctamente" };
};

function createMovement(movement) {
    const nuevoMovimiento = new Movimiento(movement.type, movement.amount, movement.description);
    const validacion = nuevoMovimiento.validarMovimiento();

    if (validacion.ok) {
        transacciones.push(nuevoMovimiento);
        updateUI();
        form.reset();
    } else {
        alert(validacion.message);
    }
}

function updateUI() {
    let balance = 0, ingresos = 0, gastos = 0;
    movimientosList.innerHTML = "";
    
    transacciones.forEach((mov) => {
        const row = document.createElement("tr");
        row.className = "border-b";
        row.innerHTML = `
            <td class="p-2">${mov.descripcion}</td>
            <td class="p-2 ${mov.tipo === 'Ingreso' ? 'text-green-600' : 'text-red-600'}">$${mov.monto.toFixed(2)}</td>
            <td class="p-2">${new Date().toLocaleDateString()}</td>
            <td class="p-2">
                <button class="text-red-500 hover:text-red-700" onclick="deleteMovement(${transacciones.indexOf(mov)})">Eliminar</button>
            </td>
        `;
        movimientosList.appendChild(row);

        if (mov.tipo === "Ingreso") {
            ingresos += mov.monto;
            balance += mov.monto;
        } else {
            gastos += mov.monto;
            balance -= mov.monto;
        }
    });

    balanceEl.textContent = `$${balance.toFixed(2)}`;
    ingresosEl.textContent = `$${ingresos.toFixed(2)}`;
    gastosEl.textContent = `$${gastos.toFixed(2)}`;
}

function deleteMovement(index) {
    transacciones.splice(index, 1);
    updateUI();
}

form.addEventListener("submit", function (event) {
    event.preventDefault();
    const newMovement = getDataFromForm();
    createMovement(newMovement);
});
