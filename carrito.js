// ===== Carrito de compras =====

// Acá guardamos los productos. Cada producto es un objeto:
// { nombre, precio, imagen, cantidad }
let carrito = [];

// --- Cálculos ---

// Cuántos productos hay en total (sumando las cantidades)
function totalItems() {
    let total = 0;
    for (let i = 0; i < carrito.length; i++) {
        total += carrito[i].cantidad;
    }
    return total;
}

// Cuánto cuesta todo el carrito
function totalPrecio() {
    let total = 0;
    for (let i = 0; i < carrito.length; i++) {
        total += carrito[i].precio * carrito[i].cantidad;
    }
    return total;
}

// Arma la ruta de la imagen para que funcione desde cualquier página.
// Nos quedamos solo con el nombre del archivo y le ponemos "/assets/" adelante.
function rutaImagen(imagen) {
    return '/assets/' + imagen.split('/').pop();
}

// --- Mostrar en pantalla ---

// Escribe el número del carrito (puede haber varios contadores en la página)
function actualizarContador() {
    let contadores = document.querySelectorAll('#contadorCarrito');
    for (let i = 0; i < contadores.length; i++) {
        contadores[i].textContent = totalItems();
    }
}

// Dibuja la lista de productos dentro del desplegable del carrito
function mostrarCarrito() {
    let lista = document.getElementById('carritoLista');
    let total = document.getElementById('carritoTotal');
    if (!lista || !total) return;

    lista.innerHTML = '';

    if (carrito.length === 0) {
        lista.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío</p>';
        total.textContent = '';
        return;
    }

    for (let i = 0; i < carrito.length; i++) {
        let producto = carrito[i];
        let fila = document.createElement('div');
        fila.className = 'carrito-item';
        fila.innerHTML =
            '<img src="' + rutaImagen(producto.imagen) + '" alt="' + producto.nombre + '">' +
            '<div class="carrito-item-info">' +
                '<span class="carrito-item-nombre">' + producto.nombre + '</span>' +
                '<span class="carrito-item-detalle">x' + producto.cantidad + ' — $' + (producto.precio * producto.cantidad) + '</span>' +
            '</div>' +
            '<button class="carrito-item-eliminar" data-nombre="' + producto.nombre + '">✕</button>';
        lista.appendChild(fila);
    }

    total.textContent = 'Total: $' + totalPrecio();
}

// --- Acciones ---

// Agrega un producto al carrito (si ya estaba, le suma 1)
function agregarProducto(nombre, precio, imagen) {
    let encontrado = false;
    for (let i = 0; i < carrito.length; i++) {
        if (carrito[i].nombre === nombre) {
            carrito[i].cantidad += 1;
            encontrado = true;
        }
    }
    if (!encontrado) {
        carrito.push({ nombre: nombre, precio: precio, imagen: imagen, cantidad: 1 });
    }
    actualizarContador();
    mostrarCarrito();
}

// Saca un producto del carrito por su nombre
function eliminarProducto(nombre) {
    let nuevoCarrito = [];
    for (let i = 0; i < carrito.length; i++) {
        if (carrito[i].nombre !== nombre) {
            nuevoCarrito.push(carrito[i]);
        }
    }
    carrito = nuevoCarrito;
    actualizarContador();
    mostrarCarrito();
}

// --- Cuando carga la página ---

actualizarContador();

// Botones "Agregar al carrito" de cada producto
let botonesAgregar = document.querySelectorAll('.btn-agregar');
for (let i = 0; i < botonesAgregar.length; i++) {
    botonesAgregar[i].addEventListener('click', function() {
        let nombre = this.getAttribute('data-nombre');
        let precio = parseInt(this.getAttribute('data-precio'));
        let imagen = this.getAttribute('data-imagen');
        agregarProducto(nombre, precio, imagen);
    });
}

// Mostrar u ocultar el desplegable al tocar el ícono del carrito
let iconoCarrito = document.querySelector('.nav-carrito');
if (iconoCarrito) {
    iconoCarrito.addEventListener('click', function() {
        let dropdown = document.getElementById('carritoDropdown');
        if (dropdown) {
            mostrarCarrito();
            dropdown.classList.toggle('visible');
        }
    });
}

// Botón "✕" para eliminar productos (lo escuchamos en la lista)
let listaCarrito = document.getElementById('carritoLista');
if (listaCarrito) {
    listaCarrito.addEventListener('click', function(e) {
        if (e.target.classList.contains('carrito-item-eliminar')) {
            let nombre = e.target.getAttribute('data-nombre');
            eliminarProducto(nombre);
        }
    });
}
