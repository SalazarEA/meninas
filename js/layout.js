const esPaginaInterna = window.location.pathname.includes("/pages/");
const rutaBase = esPaginaInterna ? "../" : "./";
const rutaEnlaces = esPaginaInterna ? "../index.html" : "#";
window.numeroWhatsapp = "541123982550";

const headerHTML = `
<header class="header">
    <div class="container header-content">
        <a href="${rutaEnlaces}#inicio" class="logo"><img src="${rutaBase}images/logo1.png" alt="Meninas"></a>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-principal">Menú</button>
        <nav class="nav" id="nav-principal">
            <a href="${rutaEnlaces}#inicio">Inicio</a>
            <a href="${rutaEnlaces}#productos">Productos</a>
            <a href="${rutaEnlaces}#nosotros">Nosotros</a>
            <a href="${rutaEnlaces}#contacto">Contacto</a>
        </nav>
        <a href="https://wa.me/${window.numeroWhatsapp}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp">Consultar</a>
    </div>
</header>`;

const footerHTML = `
<footer class="global-footer">
    <p>&copy; ${new Date().getFullYear()} Meninas — Accesorios con Amor ♡</p>
</footer>`;

function iniciarMenu() {
    const boton = document.querySelector(".nav-toggle");
    const nav = document.getElementById("nav-principal");
    if (!boton || !nav || boton.dataset.listo === "1") return;

    boton.dataset.listo = "1";
    boton.addEventListener("click", () => {
        const abierto = nav.classList.toggle("is-open");
        boton.setAttribute("aria-expanded", String(abierto));
    });
    nav.querySelectorAll("a").forEach(enlace => {
        enlace.addEventListener("click", () => {
            nav.classList.remove("is-open");
            boton.setAttribute("aria-expanded", "false");
        });
    });
}

function rutaDeImagen(archivo) {
    const valor = String(archivo || "").trim();
    if (/^(https?:)?\/\//i.test(valor) || valor.startsWith("data:")) return valor;
    const archivoCodificado = valor.split("/").map(parte => encodeURIComponent(parte)).join("/");
    return `${rutaBase}images/${archivoCodificado}`;
}

function mostrarEstadoCatalogo(titulo, descripcion) {
    const tituloCategoria = document.getElementById("categoria-titulo");
    const descripcionCategoria = document.getElementById("categoria-descripcion");
    if (tituloCategoria) tituloCategoria.textContent = titulo;
    if (descripcionCategoria) descripcionCategoria.textContent = descripcion;
}

document.addEventListener("DOMContentLoaded", async () => {
    const header = document.getElementById("global-header");
    const footer = document.getElementById("global-footer");
    if (header) header.innerHTML = headerHTML;
    if (footer) footer.innerHTML = footerHTML;
    iniciarMenu();

    const contenedorGrid = document.getElementById("contenedor-productos");
    if (!esPaginaInterna || !contenedorGrid) return;

    let productosGlobales;
    try {
        const respuesta = await fetch(`${rutaBase}json/productos.json`);
        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
        productosGlobales = await respuesta.json();
    } catch (error) {
        console.error("No se pudo cargar json/productos.json", error);
        mostrarEstadoCatalogo(
            "No pudimos cargar la colección",
            "Revisá tu conexión o abrí el sitio con un servidor local, y volvé a intentar."
        );
        return;
    }

    const parametrosURL = new URLSearchParams(window.location.search);
    const categoriaSeleccionada = parametrosURL.get("categoria") || "monos";
    const datosCategoria = productosGlobales[categoriaSeleccionada];

    if (!datosCategoria || !Array.isArray(datosCategoria.items)) {
        mostrarEstadoCatalogo(
            "Colección no encontrada",
            "Volvé al inicio y elegí Moños, Vinchas, Scrunchies o Mucho más."
        );
        contenedorGrid.replaceChildren();
        return;
    }

    mostrarEstadoCatalogo(datosCategoria.titulo, datosCategoria.descripcion);
    contenedorGrid.replaceChildren();

    datosCategoria.items.forEach((prod, indice) => {
        const articulo = document.createElement("article");
        articulo.className = "category-card card-fade";

        const contenedorImagen = document.createElement("div");
        contenedorImagen.className = "category-image";
        const imagen = document.createElement("img");
        imagen.src = rutaDeImagen(prod.img);
        imagen.alt = prod.descripcion ? `${prod.nombre}. ${prod.descripcion}` : prod.nombre;
        imagen.loading = "lazy";
        imagen.decoding = "async";
        contenedorImagen.appendChild(imagen);

        const contenido = document.createElement("div");
        contenido.className = "category-content";
        const nombre = document.createElement("h3");
        nombre.textContent = prod.nombre;
        const descripcion = document.createElement("p");
        descripcion.textContent = prod.descripcion;
        const precio = document.createElement("p");
        precio.className = "product-price";
        precio.textContent = `$${prod.precio}`;
        const botonAgregar = document.createElement("button");
        botonAgregar.type = "button";
        botonAgregar.className = "btn-agregar-carro";
        botonAgregar.textContent = "Agregar al carrito 🛒";
        botonAgregar.addEventListener("click", () => {
            if (typeof window.agregarAlCarrito === "function") {
                window.agregarAlCarrito({
                    id: `${categoriaSeleccionada}-${prod.id}`,
                    nombre: prod.nombre,
                    precio: Number(prod.precio)
                });
            } else {
                console.error("No se pudo agregar el producto: el carrito no está disponible.");
            }
        });
        contenido.append(nombre, descripcion, precio, botonAgregar);
        articulo.append(contenedorImagen, contenido);
        contenedorGrid.appendChild(articulo);
        setTimeout(() => articulo.classList.add("visible"), indice * 100);
    });

    if (typeof window.actualizarCarrito === "function") window.actualizarCarrito();
});
