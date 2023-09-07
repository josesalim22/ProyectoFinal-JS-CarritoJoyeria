const mostrarCarrito = () => {
  carritoModal.innerHTML = "";
  carritoModal.style.display = "flex";
  const modalHeader = document.createElement("div");
  modalHeader.className = "modal-header";
  modalHeader.innerHTML = `
      <h1 class="modal-header-title">Carrito de Compras</h1>
    `;
  carritoModal.append(modalHeader);

  const modalbutton = document.createElement("h1");
  modalbutton.innerText = "x";
  modalbutton.className = "modal-header-button";

  modalbutton.addEventListener("click", () => {
    carritoModal.style.display = "none";
  });

  modalHeader.append(modalbutton);

  carrito.forEach((product) => {
    let carritoContent = document.createElement("div");
    carritoContent.className = "modal-content";
    carritoContent.innerHTML = `
        <img src="${product.img}">
        <h3>${product.nombre}</h3>
        <p>$ ${product.precio}</p>
        <span class="restar"> - </span>
        <p>${product.cantidad}</p>
        <span class="sumar"> + </span>
        <p>Total: $${product.cantidad * product.precio}</p>
        <span class="delete-product"> ❌ </span>
      `;

    carritoModal.append(carritoContent);

    let restar = carritoContent.querySelector(".restar");

    restar.addEventListener("click", () => {
      if (product.cantidad !== 1) {
        product.cantidad--;
      }
      guardarLocalS();
      mostrarCarrito();
    });

    let sumar = carritoContent.querySelector(".sumar");
    sumar.addEventListener("click", () => {
      product.cantidad++;
      guardarLocalS();
      mostrarCarrito();
    });

    let eliminar = carritoContent.querySelector(".delete-product");

    eliminar.addEventListener("click", () => {
      eliminarProducto(product.id);

      Toastify({
        text: "Producto eliminado del Carrito",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #DC281E, #F00000)",
          borderRadius: "2rem",
          /*  textTransform: "uppercase", */
          fontSize: ".75rem"
        },
        offset: {
          x: '4rem', // horizontal axis - can be a number or a string indicating unity. eg: '2em'
          y: '1.5rem' // vertical axis - can be a number or a string indicating unity. eg: '2em'
        },

      }).showToast();


    });
  });

  const total = carrito.reduce((acc, el) => acc + el.precio * el.cantidad, 0);



  const totalCompra = document.createElement("div");
  totalCompra.className = "total-content";
  totalCompra.innerHTML = `Total a pagar: $ ${total}`;
  carritoModal.append(totalCompra);

  // Botón "Vaciar Carrito"
  const vaciarCarritoButton = document.createElement("button");
  vaciarCarritoButton.className = "vaciar-carrito-button";
  vaciarCarritoButton.innerText = "Vaciar Carrito";

  // Evento del botón para vaciar el carrito
  vaciarCarritoButton.addEventListener("click", () => {


    Swal.fire({
      title: '¿Estás seguro?',
      icon: 'question',
      html: `Se van a borrar ${carrito.reduce((cantotal, producto) => cantotal + producto.cantidad, 0)} productos.`,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonColor: '#c0871d',
      cancelButtonColor: '#0f0f8f',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {

        carrito = []; // Vaciar el carrito
        carritoCounter(); // Actualizar el contador
        guardarLocalS(); // Guardar en el almacenamiento local
        mostrarCarrito(); // Actualizar la visualización del carrito
        Swal.fire('¡Acción confirmada!',
          'El carrito ha sido vaciado',
          'success');
        carritoModal.style.display = "none";
      } else {
        Swal.fire('Acción cancelada',
          'Puedes continuar tu compra',
          'info');
      }
    })


  });


  // Botón "Comprar"
  const comprarButton = document.createElement("button");
  comprarButton.className = "comprar-button";
  comprarButton.innerText = "Comprar";

  let nombreUsuario = "";

  const solicitarNombreUsuario = async () => {
    if (!nombreUsuario) {
      const { value: nombre } = await Swal.fire({
        title: 'Ingrese su nombre',
        input: 'text',
        inputLabel: 'Nombre',
        showCancelButton: true,
      });
  
      if (nombre) {
        nombreUsuario = nombre; // guardo el nombre en la variable
      }else{
        nombreUsuario = "Usuario Anonimo"; 
      }
    }
  };



  // Evento del botón para realizar la compra
  comprarButton.addEventListener("click", async () => {
    await solicitarNombreUsuario();

    carrito = [];
    carritoCounter();
    guardarLocalS();
    mostrarCarrito();
    Swal.fire('Confirmación de Compra',
      `${nombreUsuario}, gracias por su compra, vuelva pronto`,
      'success');
    carritoModal.style.display = "none";
  });


  // Contenedor de los botones después del total del carrito
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "button-container";
  buttonContainer.append(vaciarCarritoButton, comprarButton);
  carritoModal.append(buttonContainer);

};

verCarrito.addEventListener("click", mostrarCarrito);

const eliminarProducto = (id) => {
  const foundId = carrito.find((element) => element.id === id);

  /*   console.log(foundId); */

  carrito = carrito.filter((carritoId) => {
    return carritoId !== foundId;
  });

  carritoCounter();
  guardarLocalS();
  mostrarCarrito();
};

const carritoCounter = () => {
  cantidadCarrito.style.display = "block";

  const carritoLength = carrito.length;

  localStorage.setItem("carritoLength", JSON.stringify(carritoLength));

  const cantidadTotal = carrito.reduce((cantotal, producto) => cantotal + producto.cantidad, 0);

  console.log(`Cantidad total de productos en el carrito: ${cantidadTotal}`);

  /* 
    cantidadCarrito.innerText = JSON.parse(localStorage.getItem("carritoLength")); */
  cantidadCarrito.innerText = cantidadTotal;
};

carritoCounter();
