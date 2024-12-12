const urlProductos = "https://api.escuelajs.co/api/v1/products";
const urlCategorias = "https://api.escuelajs.co/api/v1/categories";
var categorias = 1;

window.onload = () => {
    peticionMasVendidos();

    while (categorias <= 4) {
        peticionCategorias();
        categorias++;
    }

    // Scroll infinito (comentado)
    /*
    window.addEventListener("scroll", () => {
        const endOfPage = window.innerHeight + window.scrollY >= document.body.offsetHeight - 550;
        if (endOfPage && !peticionEnCurso) {
            peticionProductos();
        }
    });

    // Cerrar modal al hacer clic fuera
    document.body.addEventListener("click", (e) => {
        if (e.target.classList.contains("cerrar")) {
            const contenedor = e.target.closest(".contenedor");
            if (contenedor) {
                contenedor.remove();
            }
        }
    });
    */
};

function peticionCategorias() {
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
        })
        .catch((err) => {
            console.error("Error en la solicitud:", err);
        });
}

function peticionMasVendidos() {
    fetch(urlProductos + "?offset=0&limit=6", { method: "GET" })
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
        })
        .catch((err) => {
            console.error("Error en la solicitud:", err);
        });
}

function masDatosProductos(productoId) {
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
            titulo.innerText =  datosRecibidos.title;

            const autor = document.createElement("p");
            autor.className = "precio";
            autor.innerText = datosRecibidos.price + " €";

            const descripcion = document.createElement("p");
            descripcion.className = "descripcion";
            descripcion.innerText =  datosRecibidos.description;

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
        })
        .catch((err) => {
            console.error("Error en la solicitud:", err);
        });
}

function peticionBuscarPorCategoria(categoriaId) {
    fetch(urlCategorias + "/" + categoriaId + "/products", { method: "GET" })
        .then((res) => res.json())
        .then((datosRecibidos) => {

            // Crear el overlay
            const vistaProductos = document.createElement("div");
            vistaProductos.className = "overlayProductos";
            const listaProductos = document.createElement("div");
            listaProductos.className = "listaTodosProductos";

            // Recorrer los productos recibidos
            datosRecibidos.forEach((item) => {

                // Crear el contenedor para cada producto
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

                // Botón de cerrar para el overlay
                volver.addEventListener("click", () => {
                    vistaProductos.remove();
                    document.body.style.overflow = ""; // Habilitar scroll
                });

                // Añadir elementos al contenedor del producto
                contenedorImagen.appendChild(imagen);
                contenedor.appendChild(contenedorImagen);
                contenedor.appendChild(nombre);
                contenedor.appendChild(precio);

                // Añadir el botón de cerrar
                listaProductos.appendChild(volver);
                listaProductos.appendChild(contenedor);

                // Añadir el contenedor al overlay
                vistaProductos.appendChild(listaProductos);

                // Añadir el overlay a la página
                document.body.appendChild(vistaProductos);

                // Agregar el evento click a cada contenedor para mostrar más detalles del producto
                contenedor.addEventListener("click", function() {
                    // Llamar a la función masDatosProductos solo si el usuario hace clic en el producto
                    masDatosProductos(item.id);
                });

            });

            // Deshabilitar scroll cuando el overlay esté activo
            document.body.style.overflow = "hidden"; // Deshabilitar scroll
        })
        .catch((err) => {
            console.error("Error en la solicitud:", err);
        });
}
