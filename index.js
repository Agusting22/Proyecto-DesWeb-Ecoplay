var imagenes = [
    "url('../assets/WhatsApp Image 2026-06-05 at 16.30.32.jpeg')",
    "url('../assets/secondbanner.png')"
];

var actual = 0;

function mostrarImagen() {
    document.querySelector('.barra-imagen').style.backgroundImage = imagenes[actual];

    var dots = document.querySelectorAll('.carrusel-dot');
    for (var i = 0; i < dots.length; i++) {
        dots[i].classList.remove('active');
    }
    dots[actual].classList.add('active');
}

function siguiente() {
    actual = actual + 1;
    if (actual >= imagenes.length) {
        actual = 0;
    }
    mostrarImagen();
}

function anterior() {
    actual = actual - 1;
    if (actual < 0) {
        actual = imagenes.length - 1;
    }
    mostrarImagen();
}

document.querySelector('.carrusel-next').onclick = siguiente;
document.querySelector('.carrusel-prev').onclick = anterior;

var dot1 = document.createElement('button');
dot1.classList.add('carrusel-dot');
document.querySelector('.carrusel-dots').appendChild(dot1);
dot1.onclick = function() { actual = 0; mostrarImagen(); };

var dot2 = document.createElement('button');
dot2.classList.add('carrusel-dot');
document.querySelector('.carrusel-dots').appendChild(dot2);
dot2.onclick = function() { actual = 1; mostrarImagen(); };

mostrarImagen();
