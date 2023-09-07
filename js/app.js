const productosTienda = document.getElementById("productosTienda");
const verCarrito = document.getElementById("verCarrito");
const carritoModal = document.getElementById("contenidoCarrito");
const cantidadCarrito = document.getElementById("cantidadCarrito");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

let productos = [];

fetch("./js/productos.json")
  .then(response => response.json())
  .then(data => {
    productos = data;
    cargarProductos(productos);
  })

function cargarProductos(productosjson) {
  productosjson.forEach((product) => {
    let content = document.createElement("div");
    content.className = "card";
    content.innerHTML = `
          <img src="${product.img}">
          <h3>${product.nombre}</h3>
          <p class="price">$ ${product.precio}</p>
        `;

    productosTienda.append(content);

    let comprar = document.createElement("button");
    comprar.innerText = "Agregar al carrito";
    comprar.className = "comprar";

    content.append(comprar);

    comprar.addEventListener("click", () => {
      /* console.log("ID del producto actual:", product.id);*/

      const repeat = carrito.some((ProductoCarrito) => ProductoCarrito.id === product.id);
      /* console.log(repeat); */
      if (repeat) {
        carrito.map((prod) => {
          if (prod.id === product.id) {
            prod.cantidad++;
          }
        });

        Toastify({
          text: "Se agregó una unidad más del Producto al Carrito",
          duration: 3000,
          close: true,
          gravity: "top", // `top` or `bottom`
          position: "right", // `left`, `center` or `right`
          stopOnFocus: true, // Prevents dismissing of toast on hover
          style: {
            background: "linear-gradient(to right, #e7210f, #de8415)",
            borderRadius: "2rem",
            /*  textTransform: "uppercase", */
            fontSize: ".75rem"
          },
          offset: {
            x: '4rem', // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: '1.5rem' // vertical axis - can be a number or a string indicating unity. eg: '2em'
          },

        }).showToast();

      } else {
        carrito.push({
          id: product.id,
          img: product.img,
          nombre: product.nombre,
          precio: product.precio,
          cantidad: product.cantidad,
        });
        /*    console.log(carrito);
           console.log(carrito.length); */


        Toastify({
          text: "Producto agregado al Carrito",
          duration: 3000,
          close: true,
          gravity: "top", // `top` or `bottom`
          position: "right", // `left`, `center` or `right`
          stopOnFocus: true, // Prevents dismissing of toast on hover
          style: {
            background: "linear-gradient(to right, #021B79, #0575E6)",
            borderRadius: "2rem",
            fontSize: ".75rem"
          },
          offset: {
            x: '4rem', // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: '1.5rem' // vertical axis - can be a number or a string indicating unity. eg: '2em'
          },
        }).showToast();

      }
      carritoCounter();
      guardarLocalS();
    });
  });

}


const guardarLocalS = () => {
  localStorage.setItem("carrito", JSON.stringify(carrito));
};


