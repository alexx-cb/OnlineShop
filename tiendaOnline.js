const urlProductos = "https://api.escuelajs.co/api/v1/products";
const urlCategorias = "https://api.escuelajs.co/api/v1/categories";
var categorias = 1;
var offset = 0;
var limit = 3;
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let categoriaSeleccionada = null; // Almacena la categoría actualmente seleccionada

window.onload = () => {
    window.cargando = document.querySelector(".cargando");
    document.getElementById("btnCarrito").addEventListener("click", mostrarCarrito);
    document.getElementById("cerrarCarrito").addEventListener("click", cerrarCarrito);
    document.getElementById("realizarPedido").addEventListener("click", realizarPedido)

    peticionMasVendidos();

    while (categorias <= 5) {
        peticionCategorias();
        categorias++;
    }

    const masDatosProductos = document.getElementById("masProductos");
    masDatosProductos.addEventListener("click", peticionMasVendidos);

    /*
    window.addEventListener("scroll", () => {
        const endOfPage = window.innerHeight + window.scrollY >= document.body.offsetHeight - 550;
        if (endOfPage && !peticionEnCurso) {
            peticionProductos();
        }
    });
*//*
    if (datosLocales) {
        carrito = JSON.parse(datosLocales);
    }
*/
};

function peticionCategorias() {
    window.cargando.style.display = "flex";

    fetch(urlCategorias + "/" + categorias, { method: "GET" })
        .then((res) => res.json())
        .then((datosRecibidos) => {
            console.log(datosRecibidos);

            const seccion = document.getElementById("categorias");
            const lista = document.getElementById("listaCategorias");

            const contenedorCategoria = document.createElement("div");
            contenedorCategoria.className = "contenedorCategoria";

            const contenedorImagen = document.createElement("figure");
            contenedorImagen.className = "imagenCategoria";

            const imagen = document.createElement("img");
            imagen.src = datosRecibidos.image;
            imagen.addEventListener("error", (e) => {
                e.target.src = "img/porDefecto.webp";
            });

            const nombreCategoria = document.createElement("p");
            nombreCategoria.innerText = datosRecibidos.name;

            contenedorImagen.appendChild(imagen);
            contenedorCategoria.appendChild(contenedorImagen);
            contenedorCategoria.appendChild(nombreCategoria);
            lista.appendChild(contenedorCategoria);
            seccion.appendChild(lista);

            contenedorCategoria.addEventListener("click", () =>
                peticionBuscarPorCategoria(datosRecibidos.id)
            );
            window.cargando.style.display = "none";
        })
        .catch((err) => {
            console.error("Error en la solicitud:", err);
            window.cargando.style.display = "none";
        });
}

function peticionMasVendidos() {
    window.cargando.style.display = "flex";
    offset += limit;

    fetch(urlProductos + "?offset=" + offset + "&limit=" + limit, { method: "GET" })
        .then((res) => res.json())
        .then((datosRecibidos) => {
            const seccion = document.getElementById("productos");

            datosRecibidos.forEach((item) => {
                const lista = document.getElementById("listaProductos");

                const contenedor = document.createElement("div");
                contenedor.className = "itemProductos";

                const contenedorImagen = document.createElement("figure");
                contenedorImagen.className = "imagenProductos";

                const imagen = document.createElement("img");
                imagen.src = item.images[0];
                imagen.addEventListener("error", (e) => {
                    e.target.src = "img/porDefecto.webp";
                });

                const nombre = document.createElement("h3");
                nombre.innerText = item.title;

                const precio = document.createElement("p");
                precio.className = "precio";
                precio.innerText = item.price + " €";

                contenedorImagen.appendChild(imagen);
                contenedor.appendChild(contenedorImagen);
                contenedor.appendChild(nombre);
                contenedor.appendChild(precio);
                lista.appendChild(contenedor);
                seccion.appendChild(lista);

                contenedor.addEventListener("click", () => masDatosProductos(item.id));
            });
            window.cargando.style.display = "none";
        })
        .catch((err) => {
            console.error("Error en la solicitud:", err);
            window.cargando.style.display = "none";
        });
}

function masDatosProductos(productoId) {
    window.cargando.style.display = "flex";

    fetch(urlProductos + "/" + productoId, { method: "GET" })
        .then((res) => res.json())
        .then((datosRecibidos) => {
            const overlay = document.createElement("div");
            overlay.className = "overlay";

            const contenedor = document.createElement("div");
            contenedor.className = "contenedor";

            const contenedorImagen = document.createElement("figure");
            contenedorImagen.className = "contenedorImagenOverlay";

            const titulo = document.createElement("p");
            titulo.className = "tituloProducto";
            titulo.innerText = datosRecibidos.title;

            const autor = document.createElement("p");
            autor.className = "precio";
            autor.innerText = datosRecibidos.price + " €";

            const descripcion = document.createElement("p");
            descripcion.className = "descripcion";
            descripcion.innerText = datosRecibidos.description;

            const imagenProducto = document.createElement("img");
            imagenProducto.src = datosRecibidos.images[0];

            imagenProducto.addEventListener("error", (e) => {
                e.target.src = "img/porDefecto.webp";
            });

            const cerrar = document.createElement("button");
            cerrar.className = "cerrar";
            cerrar.innerText = "X";

            const agregar = document.createElement("button");
            agregar.className = "agregar";
            agregar.innerText = "Agregar al Carrito";

            agregar.addEventListener("click", () => {
                agregarAlCarrito(
                    datosRecibidos.id,
                    datosRecibidos.title,
                    datosRecibidos.price
                );
            });

            cerrar.addEventListener("click", () => {
                overlay.remove();
                document.body.style.overflow = ""; // Habilitar scroll
            });

            overlay.addEventListener("click", (event) => {
                if (!contenedor.contains(event.target)) {
                    overlay.remove();
                    document.body.style.overflow = ""; // Habilitar scroll
                }
            });

            contenedorImagen.appendChild(imagenProducto);
            contenedor.appendChild(contenedorImagen);
            contenedor.appendChild(titulo);
            contenedor.appendChild(autor);
            contenedor.appendChild(descripcion);
            contenedor.appendChild(cerrar);
            contenedor.appendChild(agregar);
            overlay.appendChild(contenedor);
            document.body.appendChild(overlay);

            document.body.style.overflow = "hidden"; // Deshabilitar scroll
            window.cargando.style.display = "none";
        })
        .catch((err) => {
            console.error("Error en la solicitud:", err);
            window.cargando.style.display = "none";
        });
}

function peticionBuscarPorCategoria(categoriaId) {
    window.cargando.style.display = "flex";

    fetch(urlCategorias + "/" + categoriaId + "/products", { method: "GET" })
        .then((res) => res.json())
        .then((datosRecibidos) => {
            const vistaProductos = document.createElement("div");
            vistaProductos.className = "overlayProductos";
            const listaProductos = document.createElement("div");
            listaProductos.className = "listaTodosProductos";

            datosRecibidos.forEach((item) => {
                const contenedor = document.createElement("div");
                contenedor.className = "vistaItemProducto";

                const contenedorImagen = document.createElement("figure");
                contenedorImagen.className = "vistaImagenProducto";

                const imagen = document.createElement("img");
                imagen.src = item.images[0];
                imagen.addEventListener("error", (e) => {
                    e.target.src = "img/porDefecto.webp";
                });

                const nombre = document.createElement("h3");
                nombre.innerText = item.title;

                const precio = document.createElement("p");
                precio.className = "vistaPrecio";
                precio.innerText = item.price + " €";

                const volver = document.createElement("button");
                volver.className = "vistaCerrar";
                volver.innerText = "X";

                volver.addEventListener("click", () => {
                    vistaProductos.remove();
                    document.body.style.overflow = ""; // Habilitar scroll
                });

                contenedorImagen.appendChild(imagen);
                contenedor.appendChild(contenedorImagen);
                contenedor.appendChild(nombre);
                contenedor.appendChild(precio);

                listaProductos.appendChild(volver);
                listaProductos.appendChild(contenedor);

                vistaProductos.appendChild(listaProductos);
                document.body.appendChild(vistaProductos);

                contenedor.addEventListener("click", () => {
                    masDatosProductos(item.id);
                });
            });

            document.body.style.overflow = "hidden"; // Deshabilitar scroll
            window.cargando.style.display = "none";
        })
        .catch((err) => {
            console.error("Error en la solicitud:", err);
            window.cargando.style.display = "none";
        });
}

// Actualizar UI del carrito
function actualizarCarritoUI() {
    const btnCarrito = document.getElementById("btnCarrito");
    const totalProductos = carrito.reduce((total, item) => total + item.cantidad, 0);
    btnCarrito.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> (${totalProductos})`;
  
    if (carrito.length > 0) {
      localStorage.setItem("carrito", JSON.stringify(carrito));
    } else {
      localStorage.removeItem("carrito");
    }
  }
  
  // Agregar al carrito
  function agregarAlCarrito(id, titulo, precio) {
    const productoEnCarrito = carrito.find((item) => item.id === id);
    if (productoEnCarrito) {
      productoEnCarrito.cantidad++;
    } else {
      carrito.push({ id, titulo, precio, cantidad: 1 });
    }
    actualizarCarritoUI();
    alert("Producto agregado al carrito");
  }
  
  // Mostrar el carrito
function mostrarCarrito() {
    const ventanaCarrito = document.getElementById("ventanaCarrito");
    const listadoCarrito = document.getElementById("listadoCarrito");
    const carritoTotal = document.getElementById("carritoTotal");
  
    listadoCarrito.innerHTML = "";
    let total = 0;
    carrito.forEach((item, index) => {
        const li = document.createElement("li");
  
        li.innerHTML = `
            ${item.titulo} - ${item.precio} € x ${item.cantidad}
            <button onclick="modificarCantidad(${index}, -1)">-</button>
            <button onclick="modificarCantidad(${index}, 1)">+</button>
            <button onclick="eliminarProducto(${index})">Eliminar</button>
        `;
  
        listadoCarrito.appendChild(li);
        total += item.precio * item.cantidad; // Sumar correctamente el precio total
    });
  
    carritoTotal.innerText = total.toFixed(2); // Mostrar total en formato decimal
    ventanaCarrito.style.display = "block";

    document.body.style.overflow = "hidden";
}
  
  // Cerrar el carrito
  function cerrarCarrito() {
    const ventanaCarrito = document.getElementById("ventanaCarrito");
    ventanaCarrito.style.display = "none";

    document.body.style.overflow = "";
  }
  
  // Modificar cantidad de un producto
  function modificarCantidad(index, cambio) {
    carrito[index].cantidad += cambio;
  
    if (carrito[index].cantidad <= 0) {
      carrito.splice(index, 1); // Eliminar si la cantidad llega a 0
    }
  
    actualizarCarritoUI();
    mostrarCarrito();
  }
  
  // Eliminar un producto
  function eliminarProducto(index) {
    carrito.splice(index, 1);
    actualizarCarritoUI();
    mostrarCarrito();
  }
  
  // Realizar pedido
  function realizarPedido() {
    if (carrito.length === 0) {
      alert("El carrito está vacío. Agrega productos antes de realizar un pedido.");
      return;
    }
  
    alert("Pedido realizado con éxito. ¡Gracias por tu compra!");
    carrito = [];
    actualizarCarritoUI();
    cerrarCarrito();
  }