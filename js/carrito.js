const claveCarrito = "carrito";
const panelCarrito = document.getElementById("panel-carrito");
const botonAbrir = document.getElementById("btn-abrir-carrito");
const botonCerrar = document.getElementById("btn-cerrar-carrito");
const botonVaciar = document.getElementById("btn-vaciar-carrito");
const contenedorItems = document.getElementById("items-carrito");
const contador = document.getElementById("contador-carrito");
const totalElemento = document.getElementById("total-carrito");
const botonWhatsapp = document.getElementById("btn-enviar-pedido");
const fondoCarrito = document.getElementById("fondo-carrito");
const numeroWhatsapp = window.numeroWhatsapp || "541123982550";
let focoAnterior = null;

function mostrarError(mensaje, error){
    if(error){
        console.error(mensaje, error);
    } else{
        console.error(mensaje);
    }
    if(!contenedorItems) return;
    let aviso = contenedorItems.querySelector(".cart-error");
    if(!aviso){
        aviso = document.createElement("p");
        aviso.className = "cart-error";
        aviso.setAttribute("role", "alert");
        contenedorItems.prepend(aviso);
    }
    aviso.textContent = mensaje;
}

function normalizarCarrito(datos){
    if (!Array.isArray(datos)) return[];
    return datos.filter(item =>
        item &&
        (typeof item.id === "string" || typeof item.id === "number") && 
        String(item.id).trim() !== "" &&
        typeof item.nombre === "string" &&
        item.nombre.trim() !== "" &&
        item.precio !== null &&
        item.precio !== "" &&
        Number.isFinite(Number(item.precio)) &&
        Number(item.precio) >= 0 &&
        Number.isInteger(Number(item.cantidad)) &&
        Number(item.cantidad) > 0
    ).map(item => ({
        id: String(item.id),
        nombre: item.nombre.trim(),
        precio: Number(item.precio),
        cantidad: Number(item.cantidad)
    }));
}

function guardarCarrito(carrito) {
    try {
        localStorage.setItem(claveCarrito, JSON.stringify(carrito));
        return true;
    } catch (error) {
        mostrarError("No se pudo guardar el carrito en este dispositivo.", error);
        return false;
    }
}

function leerCarrito() {
    let datosGuardados;

    try {
        datosGuardados = localStorage.getItem(claveCarrito);
    } catch (error) {
        mostrarError("No se pudo acceder al carrito guardado en este dispositivo.", error);
        return null;
    }

    if (!datosGuardados) return [];

    let datos;
    try {
        datos = JSON.parse(datosGuardados);
    } catch (error) {
        console.error("El carrito guardado no contiene JSON válido; se intentará reiniciar.", error);
        return guardarCarrito([]) ? [] : null;
    }

    const carrito = normalizarCarrito(datos);
    if (JSON.stringify(datos) !== JSON.stringify(carrito) && !guardarCarrito(carrito)) {
        return null;
    }
    return carrito;
}

function abrirCarrito() {
    if (!panelCarrito) return;
    focoAnterior = document.activeElement;
    panelCarrito.classList.add("is-open");
    panelCarrito.inert = false;
    panelCarrito.setAttribute("aria-hidden", "false");
    if (fondoCarrito) {
        fondoCarrito.hidden = false;
        fondoCarrito.classList.add("is-open");
    }
    if (botonAbrir) botonAbrir.setAttribute("aria-expanded", "true");
    if (botonCerrar) botonCerrar.focus();
}

function cerrarCarrito() {
    if (!panelCarrito) return;
    panelCarrito.classList.remove("is-open");
    panelCarrito.inert = true;
    panelCarrito.setAttribute("aria-hidden", "true");
    if (fondoCarrito) {
        fondoCarrito.classList.remove("is-open");
        fondoCarrito.hidden = true;
    }
    if (botonAbrir) botonAbrir.setAttribute("aria-expanded", "false");
    if (focoAnterior && typeof focoAnterior.focus === "function") focoAnterior.focus();
}

function crearBoton(texto, etiqueta, alHacerClick, deshabilitado = false, clase = "") {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = clase;
    boton.textContent = texto;
    boton.setAttribute("aria-label", etiqueta);
    boton.disabled = deshabilitado;
    boton.addEventListener("click", alHacerClick);
    return boton;
}

function renderizarCarrito() {
    if (!contenedorItems) return;

    const carrito = leerCarrito();
    if (carrito === null) return;

    contenedorItems.replaceChildren();
    let total = 0;
    let totalUnidades = 0;

    if (carrito.length === 0) {
        const mensajeVacio = document.createElement("p");
        mensajeVacio.className = "cart-empty";
        mensajeVacio.textContent = "Tu carrito está vacío ♡";
        contenedorItems.appendChild(mensajeVacio);
    }

    carrito.forEach(item => {
        total += item.precio * item.cantidad;
        totalUnidades += item.cantidad;

        const fila = document.createElement("article");
        fila.className = "cart-item";

        const detalle = document.createElement("div");
        detalle.className = "cart-item-details";

        const nombre = document.createElement("p");
        nombre.className = "cart-item-name";
        nombre.textContent = item.nombre;

        const precio = document.createElement("p");
        precio.className = "cart-item-price";
        precio.textContent = `$${item.precio} x ${item.cantidad}`;
        detalle.append(nombre, precio);

        const controles = document.createElement("div");
        controles.className = "cart-item-controls";
        controles.append(
            crearBoton("−", `Restar una unidad de ${item.nombre}`, () => window.cambiarCantidadCarrito(item.id, -1), item.cantidad <= 1, "cart-quantity-btn"),
            crearBoton("+", `Agregar una unidad de ${item.nombre}`, () => window.cambiarCantidadCarrito(item.id, 1), false, "cart-quantity-btn"),
            crearBoton("Quitar", `Quitar ${item.nombre} del carrito`, () => window.eliminarDelCarrito(item.id), false, "cart-remove-btn")
        );

        fila.append(detalle, controles);
        contenedorItems.appendChild(fila);
    });

    if (contador) contador.textContent = String(totalUnidades);
    if (totalElemento) totalElemento.textContent = `$${total}`;
    if (botonVaciar) botonVaciar.disabled = carrito.length === 0;

    if (botonWhatsapp) {
        const estaVacio = carrito.length === 0;
        botonWhatsapp.setAttribute("aria-disabled", String(estaVacio));
        botonWhatsapp.tabIndex = estaVacio ? -1 : 0;
        botonWhatsapp.classList.toggle("is-disabled", estaVacio);

        if (estaVacio) {
            botonWhatsapp.href = "#";
        } else {
            const lineasPedido = carrito.map(item =>
                `• ${item.cantidad}x ${item.nombre} ($${item.precio * item.cantidad})`
            );
            const mensaje = [
                "¡Hola Meninas! Quiero hacer un pedido:",
                "",
                ...lineasPedido,
                "",
                `Total del pedido: $${total}`
            ].join("\n");
            botonWhatsapp.href = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensaje)}`;
        }
    }
}

window.agregarAlCarrito = function(producto) {
    if (!producto ||
        (typeof producto.id !== "string" && typeof producto.id !== "number") ||
        String(producto.id).trim() === "" ||
        typeof producto.nombre !== "string" ||
        producto.nombre.trim() === "" ||
        typeof producto.precio !== "number" ||
        !Number.isFinite(producto.precio) ||
        producto.precio < 0) {
        mostrarError("No se pudo agregar el producto porque sus datos no son válidos.");
        return;
    }

    const carrito = leerCarrito();
    if (carrito === null) return;

    const idProducto = String(producto.id);
    const existente = carrito.find(item => item.id === idProducto);

    if (existente) {
        existente.cantidad += 1;
    } else {
        carrito.push({
            id: idProducto,
            nombre: producto.nombre.trim(),
            precio: producto.precio,
            cantidad: 1
        });
    }

    if (guardarCarrito(carrito)) {
        renderizarCarrito();
        abrirCarrito();
    }
};

window.cambiarCantidadCarrito = function(id, cambio) {
    if (!Number.isInteger(cambio) || cambio === 0) return;

    const carrito = leerCarrito();
    if (carrito === null) return;

    const item = carrito.find(producto => producto.id === String(id));
    if (!item) return;

    item.cantidad = Math.max(1, item.cantidad + cambio);
    if (guardarCarrito(carrito)) renderizarCarrito();
};

window.eliminarDelCarrito = function(id) {
    const carrito = leerCarrito();
    if (carrito === null) return;

    const carritoActualizado = carrito.filter(item => item.id !== String(id));
    if (guardarCarrito(carritoActualizado)) renderizarCarrito();
};

window.vaciarCarrito = function() {
    if (guardarCarrito([])) renderizarCarrito();
};

window.actualizarCarrito = renderizarCarrito;

if (botonAbrir) botonAbrir.addEventListener("click", abrirCarrito);
if (botonCerrar) botonCerrar.addEventListener("click", cerrarCarrito);
if (fondoCarrito) fondoCarrito.addEventListener("click", cerrarCarrito);
if (botonVaciar) {
    botonVaciar.addEventListener("click", () => {
        const carrito = leerCarrito();
        if (!carrito || carrito.length === 0) return;
        if (window.confirm("¿Vaciar el carrito? Se van a quitar todos los productos.")) {
            window.vaciarCarrito();
        }
    });
}

if (botonWhatsapp) {
    botonWhatsapp.addEventListener("click", event => {
        if (botonWhatsapp.getAttribute("aria-disabled") === "true") {
            event.preventDefault();
        }
    });
}

document.addEventListener("keydown", event => {
    if (event.key === "Escape") cerrarCarrito();
});

window.addEventListener("storage", event => {
    if (event.key === claveCarrito || event.key === null) renderizarCarrito();
});

renderizarCarrito();