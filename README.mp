# Meninas

Sitio web estático de presentación para **Meninas**, referente a la pre entrega de proyecto del curso de Front-End JS de Talento Tech.

La marca vende accesorios para niñas y adolescentes: moños, vinchas, scrunchies y más. El sitio presenta la marca, muestra cada colección desde un archivo JSON y arma un pedido que se envía por WhatsApp.

## Contenido del sitio

- **Inicio** (`index.html`): bienvenida, accesos a las colecciones, nosotros y contacto.
- **Productos:** cuatro categorías que abren la página de colección.
  - Moños → `pages/colecciones.html?categoria=monos`
  - Vinchas → `pages/colecciones.html?categoria=vinchas`
  - Scrunchies → `pages/colecciones.html?categoria=scrunchies`
  - Mucho más → `pages/colecciones.html?categoria=mas`
- **Colección** (`pages/colecciones.html`): lee `json/productos.json`, pinta las tarjetas de esa categoría y permite agregarlas al carrito.
- **Nosotros:** historia y propuesta de la marca.
- **Contacto:** WhatsApp e Instagram.
- **Carrito:** disponible en el inicio y en la colección. Guarda el pedido en el navegador y arma el mensaje de WhatsApp.

## Estructura del proyecto

```
Meninas/
├── index.html              # Inicio, secciones ancla y carrito
├── pages/
│   └── colecciones.html    # Catálogo de una categoría (?categoria=)
├── css/
│   └── styles.css          # Estilos, carrito, menú móvil y variables de color
├── js/
│   ├── layout.js           # Menú, header/footer de la colección y render del catálogo
│   └── carrito.js          # Carrito, localStorage y pedido por WhatsApp
├── json/
│   └── productos.json      # Categorías, precios, textos e imágenes
├── images/                 # Logo, fotos de inicio y fotos de productos
└── README.mp               # Este archivo
```

## Tecnologías

- HTML5 semántico
- CSS3 (variables, grillas, diseño responsive, tipografías Google Fonts: DM Sans y Great Vibes)
- JavaScript vanilla, sin frameworks ni npm
- `fetch` para leer el catálogo
- `localStorage` para conservar el carrito en el dispositivo

## Cómo ver el sitio

Entrar en el Sitio https://salazarea.github.io/meninas/



## Catálogo (`json/productos.json`)

El archivo tiene cuatro claves, las mismas que usa el parámetro `categoria` de la URL: `monos`, `vinchas`, `scrunchies` y `mas`.

Cada categoría tiene `titulo`, `descripcion` e `items`. Cada producto tiene:

| Campo         | Uso                                                                 |
|---------------|---------------------------------------------------------------------|
| `id`          | Identificador dentro de la categoría (`M1`, `V1`, `S1`, `C1`, …) |
| `nombre`      | Título de la tarjeta y del ítem en el carrito                       |
| `precio`      | Número, en pesos. Se muestra como `$2000`                           |
| `descripcion` | Texto de la tarjeta y parte del texto alternativo de la imagen      |
| `img`         | Nombre de archivo dentro de `images/`, o una URL `https://...`      |

`js/layout.js` arma el id del carrito como `categoria-id` (por ejemplo `monos-M1`) para que dos productos de categorías distintas no se mezclen. Si la categoría de la URL no existe, la página muestra "Colección no encontrada". Si el JSON no se puede leer, muestra el error en pantalla.

Para sumar un producto, agregá un objeto en `items` y el archivo de imagen en `images/` con el mismo nombre que `img`. Los nombres con espacios o `ñ` se codifican al armar la ruta.

## Carrito (`js/carrito.js`)

- El botón flotante "Mi Carrito" está en el inicio y en la colección.
- Al agregar un producto se abre el panel. Se puede sumar, restar o quitar unidades.
- "Vaciar carrito" pide confirmación.
- El pedido se guarda en `localStorage` con la clave `carrito` y se conserva al recargar o al cambiar de página.
- "Enviar pedido por WhatsApp" abre un chat con el detalle y el total. Si el carrito está vacío, el enlace queda desactivado.
- El panel se cierra con la X, con Escape o con un clic en el fondo oscuro.

El número de WhatsApp del header de la colección y del pedido sale de `window.numeroWhatsapp` en `js/layout.js` (`541123982550`). En el inicio, los botones de WhatsApp e Instagram están escritos directo en `index.html`.

## Header, menú y pie

- En el inicio, el header está en `index.html`.
- En la colección, `js/layout.js` lo inyecta en `#global-header` y el pie en `#global-footer`, con rutas relativas (`../`) para el logo y los anclas del inicio.
- En pantallas de menos de 900px el menú se oculta y aparece el botón **Menú**.

## Contacto

- **WhatsApp:** [+54 11 2398-2550](https://wa.me/541123982550)
- **Instagram:** [@Meninas.Ba](https://instagram.com/Meninas.Ba)

## Personalización rápida

- **Colores y espaciado:** variables `:root` en `css/styles.css`.
- **Textos del inicio:** `index.html`.
- **Productos, precios y fotos:** `json/productos.json` y `images/`.
- **Número del pedido y header de la colección:** `window.numeroWhatsapp` en `js/layout.js`.
- **Textos del mensaje de WhatsApp:** `js/carrito.js`, dentro de `renderizarCarrito`.

## Licencia y créditos

© 2026 Meninas — Accesorios con amor.
Pre entrega de Front-End JS, Talento Tech.
