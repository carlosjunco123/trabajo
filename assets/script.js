// assets/script.js

// Datos ejemplo (puedes cambiar a datos reales o una API)
const libros = [
  {
    id: 1,
    titulo: "El Principito",
    autor: "Antoine de Saint-Exupéry",
    precio: 35.50,
    stock: 12,
    descripcion: "Un clásico de la literatura universal.",
    imagen: "https://images-na.ssl-images-amazon.com/images/I/81gtKoapHFL.jpg"
  },
  {
    id: 2,
    titulo: "Cien años de soledad",
    autor: "Gabriel García Márquez",
    precio: 45.00,
    stock: 8,
    descripcion: "Una novela emblemática del realismo mágico.",
    imagen: "https://images-na.ssl-images-amazon.com/images/I/91vEf5KpzIL.jpg"
  },
  {
    id: 3,
    titulo: "La sombra del viento",
    autor: "Carlos Ruiz Zafón",
    precio: 40.00,
    stock: 15,
    descripcion: "Una historia que combina misterio y romance.",
    imagen: "https://images-na.ssl-images-amazon.com/images/I/81KsPf7WshL.jpg"
  }
];

// Funciones para localStorage
function guardarEnLocal(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function obtenerDeLocal(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

// -------------------- INDEX.HTML --------------------
function mostrarLibrosEnIndex() {
  const contenedor = document.getElementById('libros-lista');
  if (!contenedor) return;

  contenedor.innerHTML = libros.map(libro => `
    <div class="libro-item" onclick="verDetalle(${libro.id})">
      <img src="${libro.imagen}" alt="Portada de ${libro.titulo}">
      <h4>${libro.titulo}</h4>
      <p>Autor: ${libro.autor}</p>
      <p>Precio: S/ ${libro.precio.toFixed(2)}</p>
    </div>
  `).join('');
}

function verDetalle(id) {
  window.location.href = `detail.html?id=${id}`;
}

// -------------------- DETAIL.HTML --------------------
function cargarDetalleLibro() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  if (!id) return;

  const libro = libros.find(l => l.id === id);
  if (!libro) return;

  document.getElementById('book-cover').src = libro.imagen;
  document.getElementById('book-title').textContent = libro.titulo;
  document.getElementById('book-author').textContent = libro.autor;
  document.getElementById('book-price').textContent = libro.precio.toFixed(2);
  document.getElementById('book-stock').textContent = libro.stock;
  document.getElementById('book-description').textContent = libro.descripcion;

  document.getElementById('btn-favorite').onclick = () => agregarAFavoritos(libro);
  document.getElementById('btn-add-cart').onclick = () => agregarAlCarrito(libro);
}

// -------------------- FAVORITOS --------------------
function agregarAFavoritos(libro) {
  let favoritos = obtenerDeLocal('favoritos') || [];
  if (favoritos.find(f => f.id === libro.id)) {
    alert('Este libro ya está en tus favoritos.');
    return;
  }
  favoritos.push(libro);
  guardarEnLocal('favoritos', favoritos);
  alert('Libro agregado a favoritos ❤️');
}

function mostrarFavoritos() {
  const contenedor = document.getElementById('favorites-list');
  if (!contenedor) return;

  let favoritos = obtenerDeLocal('favoritos') || [];

  if (favoritos.length === 0) {
    contenedor.innerHTML = '<p>No tienes libros favoritos aún.</p>';
    return;
  }

  contenedor.innerHTML = favoritos.map(libro => `
    <div class="favorite-item" onclick="verDetalle(${libro.id})">
      <img src="${libro.imagen}" alt="Portada de ${libro.titulo}">
      <h4>${libro.titulo}</h4>
      <p>Autor: ${libro.autor}</p>
      <p>Precio: S/ ${libro.precio.toFixed(2)}</p>
    </div>
  `).join('');
}

// -------------------- CARRITO --------------------
function agregarAlCarrito(libro) {
  let carrito = obtenerDeLocal('carrito') || [];

  const index = carrito.findIndex(item => item.id === libro.id);
  if (index !== -1) {
    if (carrito[index].cantidad < libro.stock) {
      carrito[index].cantidad += 1;
    } else {
      alert('No hay más stock disponible de este libro.');
      return;
    }
  } else {
    carrito.push({ ...libro, cantidad: 1 });
  }

  guardarEnLocal('carrito', carrito);
  alert('Libro agregado al carrito 🛒');
}

function mostrarCarrito() {
  const contenedor = document.getElementById('cart-items');
  const totalDiv = document.getElementById('cart-total');
  if (!contenedor || !totalDiv) return;

  let carrito = obtenerDeLocal('carrito') || [];

  if (carrito.length === 0) {
    contenedor.innerHTML = '<p>Tu carrito está vacío.</p>';
    totalDiv.textContent = '';
    return;
  }

  contenedor.innerHTML = carrito.map(item => `
    <div class="cart-item">
      <p>${item.titulo} (x${item.cantidad})</p>
      <p>S/ ${(item.precio * item.cantidad).toFixed(2)}</p>
    </div>
  `).join('');

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  totalDiv.textContent = `Total: S/ ${total.toFixed(2)}`;
}

function checkout() {
  let carrito = obtenerDeLocal('carrito') || [];
  if (carrito.length === 0) {
    alert('Tu carrito está vacío.');
    return;
  }
  alert('Compra simulada con éxito. ¡Gracias por tu compra!');
  localStorage.removeItem('carrito');
  mostrarCarrito();
}

// -------------------- LOGIN (muy básico) --------------------
function login() {
  const form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const username = form.username.value.trim();
    const password = form.password.value.trim();

    if (username === 'usuario' && password === '1234') {
      alert('Ingreso exitoso!');
      window.location.href = 'index.html';
    } else {
      alert('Usuario o contraseña incorrectos.');
    }
  });
}

// -------------------- INICIALIZADORES --------------------
window.onload = () => {
  mostrarLibrosEnIndex();
  cargarDetalleLibro();
  mostrarFavoritos();
  mostrarCarrito();
  login();
};
