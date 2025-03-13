# Backlog de Historias de Usuario

Este documento contiene las historias de usuario propuestas para la mejora de la aplicación de gestión de presupuesto.

## Historias de Usuario (HU)

### 1. Edición de Transacciones

**Descripción:**
Como usuario, quiero poder editar una transacción existente para corregir errores o actualizar información sin necesidad de eliminarla y volver a ingresarla.

**Criterios de Aceptación:**

- Debe haber un botón de edición en cada transacción registrada.
- Al hacer clic en el botón, la transacción debe cargarse en el formulario para su modificación.
- Al guardar los cambios, la transacción debe actualizarse en la interfaz y en los totales.

---

### 2. Categorización de Movimientos

**Descripción:**
Como usuario, quiero poder asignar categorías a mis ingresos y egresos para analizar mejor mis finanzas.

**Criterios de Aceptación:**

- El formulario debe incluir un campo de selección de categoría (ejemplo: "Salario", "Alimentación", "Entretenimiento").
- La categoría debe mostrarse junto a cada transacción en la tabla.
- Debe haber una opción para filtrar las transacciones por categoría.

---

### 3. Persistencia de Datos

**Descripción:**
Como usuario, quiero que mis transacciones se guarden incluso después de cerrar la aplicación para no perder mi historial financiero.

**Criterios de Aceptación:**

- Los datos de las transacciones deben guardarse en `localStorage` o `IndexedDB`.
- Al cargar la aplicación, los datos guardados deben mostrarse automáticamente.
- Debe haber una opción para restablecer los datos.

---

### 4. Reporte de Resumen Financiero

**Descripción:**
Como usuario, quiero ver un resumen gráfico de mis ingresos y egresos para entender mejor mi situación financiera.

**Criterios de Aceptación:**

- Debe haber una sección con un gráfico de barras o pastel mostrando la proporción de ingresos y egresos.
- El gráfico debe actualizarse automáticamente al agregar, editar o eliminar transacciones.
- Opcional: Permitir visualizar el resumen por mes o categoría.

---

### 5. Configuración de Presupuesto Mensual

**Descripción:**
Como usuario, quiero establecer un presupuesto mensual para controlar mis gastos y recibir alertas si lo supero.

**Criterios de Aceptación:**

- Debe haber una opción para ingresar un presupuesto mensual.
- Se debe mostrar el porcentaje del presupuesto utilizado en función de los egresos registrados.
- Si los egresos superan el presupuesto, se debe mostrar una advertencia.
