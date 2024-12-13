const urlProductos = "https://api.escuelajs.co/api/v1/products";
const urlCategorias = "https://api.escuelajs.co/api/v1/categories";
var categorias = 1;
var offset = 0;
var limit = 3;
var offsetCategorias =0;
var limitCategorias =10;
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
var peticionEnCurso = false;

window.onload = () => {
    window.cargando = document.querySelector(".cargando");
    document.getElementById("btnCarrito").addEventListener("click", mostrarCarrito);
    document.getElementById("cerrarCarrito").addEventListener("click", cerrarCarrito);
    document.getElementById("realizarPedido").addEventListener("click", realizarPedido)


    const hamburguesa = document.getElementById("hamburguesa")
    const navbarLinks = document.querySelector('.navbar-links');
    const fondoOscuro = document.querySelector('.fondoOscuro');

    // Abrir y cerrar el menú hamburguesa
    hamburguesa.addEventListener('click', () => {
        navbarLinks.classList.toggle('active');
        hamburguesa.classList.toggle('active'); 
        fondoOscuro.classList.toggle('active'); 
    });

    // Cerrar el menú si se hace clic fuera de él
    fondoOscuro.addEventListener('click', () => {
        navbarLinks.classList.remove('active');
        hamburguesa.classList.remove('active');
        fondoOscuro.classList.remove('active');
    });

    peticionMasVendidos();

    while (categorias <= 5) {
        peticionCategorias();
        categorias++;
    }

    const masDatosProductos = document.getElementById("masProductos");
    masDatosProductos.addEventListener("click", peticionMasVendidos);
};

function peticionCategorias() {
    window.cargando.style.display = "flex";

    if(peticionEnCurso)return;
    fetch(urlCategorias + "/" + categorias, { method: "GET" })
        .then((res) => res.json())
        .then((datosRecibidos) => {

            peticionEnCurso = true;
            const seccion = document.getElementById("categorias");
            const lista = document.getElementById("listaCategorias");

            const contenedorCategoria = document.createElement("div");
            contenedorCategoria.className = "contenedorCategoria";

            const contenedorImagen = document.createElement("figure");
            contenedorImagen.className = "imagenCategoria";

            const imagen = document.createElement("img");
            imagen.src = datosRecibidos.image;
            imagen.alt = datosRecibidos.name;
            imagen.addEventListener("error", (e) => {
                e.target.src = "img/porDefecto.webp";
            });

            const nombreCategoria = document.createElement("h3");
            nombreCategoria.innerText = datosRecibidos.name;
            nombreCategoria.className=" bruno-ace-sc-regular"

            contenedorImagen.appendChild(imagen);
            contenedorCategoria.appendChild(contenedorImagen);
            contenedorCategoria.appendChild(nombreCategoria);
            lista.appendChild(contenedorCategoria);
            seccion.appendChild(lista);

            contenedorCategoria.addEventListener("click", () =>
                peticionBuscarPorCategoria(datosRecibidos.id)
            );
            window.cargando.style.display = "none";
            peticionEnCurso=false;
        })
        .catch((err) => {
            console.error("Error en la solicitud:", err);
            window.cargando.style.display = "none";
            peticionEnCurso=false;
        });
}

function peticionMasVendidos() {
    window.cargando.style.display = "flex";
    offset += limit;

    if(peticionEnCurso)return;
    fetch(urlProductos + "?offset=" + offset + "&limit=" + limit, { method: "GET" })
        .then((res) => res.json())
        .then((datosRecibidos) => {
            peticionEnCurso=true;

            const seccion = document.getElementById("productos");
            const lista = document.getElementById("listaProductos");

            datosRecibidos.forEach((item) => {
                const contenedor = document.createElement("div");
                contenedor.className = "itemProductos";

                const contenedorImagen = document.createElement("figure");
                contenedorImagen.className = "imagenProductos";

                const imagen = document.createElement("img");
                imagen.src = item.images[0];
                imagen.alt = item.title;
                imagen.addEventListener("error", (e) => {
                    e.target.src = "img/porDefecto.webp";  // Imagen por defecto si falla la carga
                });

                const nombre = document.createElement("h3");
                nombre.innerText = item.title;
                nombre.className ="bruno-ace-sc-regular";

                const precio = document.createElement("p");
                precio.className = "precio montserrat-alternates-extralight";
                precio.innerText = item.price + " €";

                contenedorImagen.appendChild(imagen);
                contenedor.appendChild(contenedorImagen);
                contenedor.appendChild(nombre);
                contenedor.appendChild(precio);

                // Agregar el contenedor del producto a la lista
                lista.appendChild(contenedor);

                // Evento para ver más detalles del producto
                contenedor.addEventListener("click", () => masDatosProductos(item.id));
            });

            // Crear el botón si no existe aún
            let botonMasProductos = document.getElementById("masProductos");
            if (!botonMasProductos) {
                botonMasProductos = document.createElement("button");
                botonMasProductos.className = "masProductos bruno-ace-sc-regular";
                botonMasProductos.id = "masProductos";
                botonMasProductos.innerText = "Más Productos";
                // Agregar el botón al final de la sección de productos
                seccion.appendChild(botonMasProductos);
                
                // Evento para cargar más productos cuando se hace click en "Más Productos"
                botonMasProductos.addEventListener("click", peticionMasVendidos);
            }

            window.cargando.style.display = "none";
            peticionEnCurso=false;
        })
        .catch((err) => {
            console.error("Error en la solicitud:", err);
            window.cargando.style.display = "none";
            peticionEnCurso=false;
        });
}


function masDatosProductos(productoId) {
    window.cargando.style.display = "flex";

    if(peticionEnCurso)return;
    fetch(urlProductos + "/" + productoId, { method: "GET" })
        .then((res) => res.json())
        .then((datosRecibidos) => {
            peticionEnCurso=true;
            const overlay = document.createElement("div");
            overlay.className = "overlay";

            const contenedor = document.createElement("div");
            contenedor.className = "contenedor";

            const contenedorImagen = document.createElement("figure");
            contenedorImagen.className = "contenedorImagenOverlay";

            const titulo = document.createElement("p");
            titulo.className = "tituloProducto bruno-ace-sc-regular";
            titulo.innerText = datosRecibidos.title;

            const autor = document.createElement("p");
            autor.className = "precio montserrat-alternates-extralight";
            autor.innerText = datosRecibidos.price + " €";

            const descripcion = document.createElement("p");
            descripcion.className = "descripcion montserrat-alternates-extralight";
            descripcion.innerText = datosRecibidos.description;

            const imagenProducto = document.createElement("img");
            imagenProducto.src = datosRecibidos.images[0];
            imagenProducto.alt = datosRecibidos.name;

            imagenProducto.addEventListener("error", (e) => {
                e.target.src = "img/porDefecto.webp";
            });

            const cerrar = document.createElement("button");
            cerrar.className = "cerrar bruno-ace-sc-regular";
            cerrar.innerText = "X";

            const agregar = document.createElement("button");
            agregar.className = "agregar bruno-ace-sc-regular";
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
            peticionEnCurso=false;
        })
        .catch((err) => {
            console.error("Error en la solicitud:", err);
            window.cargando.style.display = "none";
            peticionEnCurso=false;
        });
}

function peticionBuscarPorCategoria(categoriaId) {
    window.cargando.style.display = "flex";
    // Verificar si ya existe un overlayProductos
    const existingOverlay = document.querySelector(".overlayProductos");
    if (existingOverlay) {
        // Si existe, no crear uno nuevo, solo actualizar la lista de productos
        const listaProductos = existingOverlay.querySelector(".listaTodosProductos");

        // Continuar cargando más productos si es necesario
        if(peticionEnCurso)return;
        fetch(urlProductos + "/?categoryId=" + categoriaId + "&offset=" + offsetCategorias + "&limit=" + limitCategorias, { method: "GET" })
            .then((res) => res.json())
            .then((datosRecibidos) => {
                peticionEnCurso=true;
                datosRecibidos.forEach((item) => {
                    const contenedor = document.createElement("div");
                    contenedor.className = "vistaItemProducto";

                    const contenedorImagen = document.createElement("figure");
                    contenedorImagen.className = "vistaImagenProducto";

                    const imagen = document.createElement("img");
                    imagen.src = item.images[0];
                    imagen.addEventListener("error", (e) => {
                        e.target.src = "img/porDefecto.webp";  // Imagen por defecto si falla la carga
                    });

                    const nombre = document.createElement("h3");
                    nombre.innerText = item.title;
                    nombre.className= "bruno-ace-sc-regular"

                    const precio = document.createElement("p");
                    precio.className = "vistaPrecio montserrat-alternates-extralight";
                    precio.innerText = item.price + " €";

                    contenedorImagen.appendChild(imagen);
                    contenedor.appendChild(contenedorImagen);
                    contenedor.appendChild(nombre);
                    contenedor.appendChild(precio);

                    listaProductos.appendChild(contenedor);

                    contenedor.addEventListener("click", () => {
                        masDatosProductos(item.id);  // Llama a la función de más detalles de producto
                    });
                });

                // Actualizar el offset para la próxima carga de productos
                offsetCategorias += limitCategorias;

                // Si no existe el botón "Más Productos", crearlo
                if (!existingOverlay.querySelector(".masOverlay")) {
                    const masProductos = document.createElement("button");
                    masProductos.innerText = "Más Productos";
                    masProductos.className = "masOverlay";

                    // Agregar el botón "Más Productos" al final de la lista de productos
                    listaProductos.appendChild(masProductos);

                    // Evento para cargar más productos cuando se hace clic en "Más Productos"
                    masProductos.addEventListener("click", () => {
                        peticionBuscarPorCategoria(categoriaId);  // Llamar nuevamente para cargar más productos
                    });
                }

                window.cargando.style.display = "none";  // Ocultar el indicador de carga
                peticionEnCurso=false;
            })
            .catch((err) => {
                console.error("Error en la solicitud:", err);
                window.cargando.style.display = "none";
                peticionEnCurso=false;
            });
    } else {
        // Si no existe un overlay, crear uno nuevo
        window.cargando.style.display = "flex";
        if(peticionEnCurso)return;

        fetch(urlProductos + "/?categoryId=" + categoriaId + "&offset=" + offsetCategorias + "&limit=" + limitCategorias, { method: "GET" })
            .then((res) => res.json())
            .then((datosRecibidos) => {
                peticionEnCurso=true;
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
                        e.target.src = "img/porDefecto.webp";  // Imagen por defecto si falla la carga
                    });

                    const nombre = document.createElement("h3");
                    nombre.innerText = item.title;
                    nombre.className ="montserrat-alternates-extralight"

                    const precio = document.createElement("p");
                    precio.className = "vistaPrecio montserrat-alternates-extralight";
                    precio.innerText = item.price + " €";

                    const volver = document.createElement("button");
                    volver.className = "vistaCerrar bruno-ace-sc-regular";
                    volver.innerText = "X";

                    volver.addEventListener("click", () => {
                        vistaProductos.remove();
                        document.body.style.overflow = "";  // Habilitar scroll
                        offsetCategorias = 0;  // Reiniciar el offset
                    });

                    contenedorImagen.appendChild(imagen);
                    contenedor.appendChild(contenedorImagen);
                    contenedor.appendChild(nombre);
                    contenedor.appendChild(precio);

                    listaProductos.appendChild(volver);
                    listaProductos.appendChild(contenedor);

                    contenedor.addEventListener("click", () => {
                        masDatosProductos(item.id);  // Llama a la función de más detalles de producto
                    });
                });

                // Crear el botón "Más Productos" si no existe
                const masProductos = document.createElement("button");
                masProductos.innerText = "Más Productos";
                masProductos.className = "masOverlay";

                // Agregar el botón "Más Productos" al final de la lista de productos
                listaProductos.appendChild(masProductos);

                vistaProductos.appendChild(listaProductos);
                document.body.appendChild(vistaProductos);

                // Evento para cargar más productos cuando se hace clic en "Más Productos"
                masProductos.addEventListener("click", () => {
                    offsetCategorias += limitCategorias;
                    peticionBuscarPorCategoria(categoriaId);  // Llamar nuevamente para cargar más productos
                });

                offsetCategorias += limitCategorias;
                document.body.style.overflow = "hidden";  // Deshabilitar scroll mientras el overlay esté visible
                window.cargando.style.display = "none";  // Ocultar el indicador de carga
                peticionEnCurso=false;
            })
            .catch((err) => {
                console.error("Error en la solicitud:", err);
                window.cargando.style.display = "none";
                peticionEnCurso=false;
            });
    }
}


// Actualizar UI del carrito
function actualizarCarritoUI() {
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
    

    window.cargando.style.display = "flex"
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
            <button onclick="eliminarProducto(${index})" class="montserrat-alternates-extralight">Eliminar</button>
        `;
  
        listadoCarrito.appendChild(li);
        total += item.precio * item.cantidad; // Sumar correctamente el precio total
    });
  
    carritoTotal.innerText = total.toFixed(2); // Mostrar total en formato decimal
    ventanaCarrito.style.display = "block";

    document.body.style.overflow = "hidden";
    window.cargando.style.display="none"
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