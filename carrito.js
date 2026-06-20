let carrito = [];
const MAX_POR_PRODUCTO = 100;
let popoverEl = null;

function guardarCarrito() {
    localStorage.setItem('ecoplay-carrito', JSON.stringify(carrito));
}

function cargarCarrito() {
    let guardado = localStorage.getItem('ecoplay-carrito');
    if (guardado) {
        carrito = JSON.parse(guardado);
    }
}

function totalItems() {
    let total = 0;
    for (let i = 0; i < carrito.length; i++) {
        total += carrito[i].cantidad;
    }
    return total;
}

function totalPrecio() {
    let total = 0;
    for (let i = 0; i < carrito.length; i++) {
        total += carrito[i].precio * carrito[i].cantidad;
    }
    return total;
}

function actualizarContador() {
    let contadores = document.querySelectorAll('#contadorCarrito');
    for (let i = 0; i < contadores.length; i++) {
        contadores[i].textContent = totalItems();
    }
}

function renderDropdown() {
    let lista = document.getElementById('carritoLista');
    let totalEl = document.getElementById('carritoTotal');
    if (!lista || !totalEl) return;

    lista.innerHTML = '';

    if (carrito.length === 0) {
        lista.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío</p>';
        totalEl.textContent = '';
        return;
    }

    for (let i = 0; i < carrito.length; i++) {
        let item = carrito[i];
        let div = document.createElement('div');
        div.className = 'carrito-item';
        div.innerHTML =
            '<img src="' + item.imagen + '" alt="' + item.nombre + '">' +
            '<div class="carrito-item-info">' +
                '<span class="carrito-item-nombre">' + item.nombre + '</span>' +
                '<span class="carrito-item-detalle">x' + item.cantidad + ' — $' + (item.precio * item.cantidad) + '</span>' +
            '</div>' +
            '<button class="carrito-item-eliminar" data-nombre="' + item.nombre + '">✕</button>';
        lista.appendChild(div);
    }

    totalEl.textContent = 'Total: $' + totalPrecio();

    let botonesEliminar = lista.querySelectorAll('.carrito-item-eliminar');
    for (let j = 0; j < botonesEliminar.length; j++) {
        botonesEliminar[j].addEventListener('click', function() {
            let nombre = this.getAttribute('data-nombre');
            carrito = carrito.filter(function(p) { return p.nombre !== nombre; });
            guardarCarrito();
            actualizarContador();
            renderDropdown();
        });
    }
}

function cerrarPopover() {
    if (popoverEl) {
        popoverEl.classList.remove('visible');
        popoverEl = null;
    }
}

function cerrarDropdown() {
    let dropdown = document.getElementById('carritoDropdown');
    if (dropdown) dropdown.classList.remove('visible');
}

cargarCarrito();
actualizarContador();

document.addEventListener('click', function(e) {
    let navCarrito = document.querySelector('.nav-carrito');
    let dropdown = document.getElementById('carritoDropdown');

    if (navCarrito && navCarrito.contains(e.target)) {
        cerrarPopover();
        renderDropdown();
        if (dropdown) dropdown.classList.toggle('visible');
        return;
    }

    if (dropdown && !dropdown.contains(e.target)) {
        cerrarDropdown();
    }

    if (!e.target.closest('.btn-agregar') && !e.target.closest('.cantidad-popover')) {
        cerrarPopover();
    }
});

let botonesAgregar = document.querySelectorAll('.btn-agregar');
for (let i = 0; i < botonesAgregar.length; i++) {
    botonesAgregar[i].addEventListener('click', function(e) {
        e.stopPropagation();

        let btn = this;
        let nombre = btn.getAttribute('data-nombre');
        let precio = parseInt(btn.getAttribute('data-precio'));
        let imagen = btn.getAttribute('data-imagen');

        let existente = null;
        for (let k = 0; k < carrito.length; k++) {
            if (carrito[k].nombre === nombre) { existente = carrito[k]; break; }
        }
        let yaEnCarrito = existente ? existente.cantidad : 0;
        let disponible = MAX_POR_PRODUCTO - yaEnCarrito;

        if (disponible <= 0) {
            alert('Ya llegaste al límite de ' + MAX_POR_PRODUCTO + ' unidades para este producto.');
            return;
        }

        cerrarDropdown();

        if (popoverEl) {
            popoverEl.classList.remove('visible');
        }

        if (!popoverEl || popoverEl._btn !== btn) {
            if (!popoverEl) {
                popoverEl = document.createElement('div');
                popoverEl.className = 'cantidad-popover';
                document.body.appendChild(popoverEl);
            }

            popoverEl._btn = btn;
            popoverEl.innerHTML =
                '<label>Cantidad (máx. ' + disponible + ')</label>' +
                '<input type="number" class="popover-input" min="1" max="' + disponible + '" value="0">' +
                '<div class="cantidad-popover-botones">' +
                    '<button class="btn-popover-confirmar">Agregar</button>' +
                    '<button class="btn-popover-cancelar">Cancelar</button>' +
                '</div>';

            popoverEl.querySelector('.btn-popover-confirmar').onclick = function(ev) {
                ev.stopPropagation();
                let cantidad = parseInt(popoverEl.querySelector('.popover-input').value);
                if (isNaN(cantidad) || cantidad < 1) {
                    alert('Ingresá una cantidad válida.');
                    return;
                }
                if (cantidad > disponible) cantidad = disponible;

                if (existente) {
                    existente.cantidad += cantidad;
                } else {
                    carrito.push({ nombre: nombre, precio: precio, imagen: imagen, cantidad: cantidad });
                }

                guardarCarrito();
                actualizarContador();
                cerrarPopover();
            };

            popoverEl.querySelector('.btn-popover-cancelar').onclick = function(ev) {
                ev.stopPropagation();
                cerrarPopover();
            };
        } else {
            let inp = popoverEl.querySelector('.popover-input');
            inp.max = disponible;
            inp.value = 0;
            popoverEl.querySelector('label').textContent = 'Cantidad (máx. ' + disponible + ')';
        }

        let rect = btn.getBoundingClientRect();
        popoverEl.style.left = (rect.left + rect.width / 2 - 90) + 'px';
        popoverEl.style.top = (rect.top - 8) + 'px';
        popoverEl.style.transform = 'translateY(-100%)';

        popoverEl.classList.add('visible');
        popoverEl.querySelector('.popover-input').focus();
    });
}
