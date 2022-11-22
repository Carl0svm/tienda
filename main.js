//capturas DOM
let divProductos = document.getElementById("productos")
let btnGuardarLibro = document.getElementById("guardarLibroBtn")
let buscador = document.getElementById("buscador")
let btnVerCatalogo = document.getElementById("verCatalogo")
let btnOcultarCatalogo = document.getElementById("ocultarCatalogo")
let modalBodyCarrito = document.getElementById("modal-bodyCarrito")
let botonCarrito = document.getElementById("botonCarrito")
let coincidencia = document.getElementById("coincidencia")
let selectOrden = document.getElementById("selectOrden")
let divCompra = document.getElementById("precioTotal")
let loaderTexto = document.getElementById("loaderTexto")
let loader = document.getElementById("loader")
let botonFinalizarCompra = document.getElementById("botonFinalizarCompra")

let productosEnCarrito = JSON.parse(localStorage.getItem("carrito")) || []
//FUNCTIONS
function mostrarCatalogo(array){
    divProductos.innerHTML = ""
    for(let libro of array){
        let nuevoLibro = document.createElement("div")
        nuevoLibro.classList.add("col-12", "col-md-6", "col-lg-4", "my-1")
        
        nuevoLibro.innerHTML = `<div id="${libro.id}" class="card" style="width: 18rem;">
                                    <img class="card-img-top img-fluid" style="height: 200px;"src="assets/${libro.imagen}" alt="${libro.titulo} de ${libro.autor}">
                                    <div class="card-body">
                                        <h4 class="card-title">${libro.titulo}</h4>
                                        <p>Autor: ${libro.autor}</p>
                                        <p class="${libro.precio <= 2000 ? "ofertaColor" : "precioComun"}">Precio: ${libro.precio}</p>
                                    <button id="agregarBtn${libro.id}" class="btn btn-outline-success">Agregar al carrito</button>
                                    </div>
    </div>`
        divProductos.appendChild(nuevoLibro)
        let btnAgregar = document.getElementById(`agregarBtn${libro.id}`)
        
        btnAgregar.addEventListener("click", ()=>{
            agregarAlCarrito(libro)
            
        })
    }
}
//function AGREGAR AL CARRITO
function agregarAlCarrito(libro){
    //Primer paso
    productosEnCarrito.push(libro)
    console.log(productosEnCarrito)
    localStorage.setItem("carrito", JSON.stringify(productosEnCarrito))
    //sweetAlert para agregar al carrito
    Swal.fire({
        // position: "top-end",
        title: "Ha agregado un producto",
        icon: "success",
        confirmButtonText: "Entendido",
        confirmButtonColor: "green",
        timer: 3000,
        text: `El libro ${libro.titulo} del autor ${libro.autor} ha sido agregado`,
        imageUrl: `assets/${libro.imagen}`,
        imageHeight: 200,
        imageAlt: `${libro.titulo} de ${libro.autor}`
    })
}
//function IMPRIMIR en modal
function cargarProductosCarrito(array){
    modalBodyCarrito.innerHTML = ""
    array.forEach((productoCarrito)=>{
        modalBodyCarrito.innerHTML += `
        <div class="card border-primary mb-3" id ="productoCarrito${productoCarrito.id}" style="max-width: 540px;">
            <img class="card-img-top" height="300px" src="assets/${productoCarrito.imagen}" alt="${productoCarrito.titulo}">
            <div class="card-body">
                    <h4 class="card-title">${productoCarrito.titulo}</h4>
                
                    <p class="card-text">$${productoCarrito.precio}</p> 
                    <button class= "btn btn-danger" id="botonEliminar${productoCarrito.id}"><i class="fas fa-trash-alt"></i></button>
            </div>    
        </div>
`
    })
    array.forEach((productoCarrito, indice)=>{
        //capturo elemento del DOM sin guardarlo en variable
        document.getElementById(`botonEliminar${productoCarrito.id}`).addEventListener("click",()=>{
           
           //Eliminar del DOM
           let cardProducto = document.getElementById(`productoCarrito${productoCarrito.id}`)
           cardProducto.remove()
           //Eliminar del array de comprar
           productosEnCarrito.splice(indice, 1) 
           console.log(productosEnCarrito)
           //Eliminar del storage
           localStorage.setItem('carrito', JSON.stringify(productosEnCarrito))
           //vuelvo a calcular el total
           compraTotal(array)
        })
    })
    compraTotal(array)
}

//function calcular total
function compraTotal(array){
    let acumulador = 0
    acumulador = array.reduce((acc, productoCarrito)=>acc + productoCarrito.precio,0)
    console.log(acumulador)
    acumulador == 0 ? divCompra.innerHTML = `No hay productos en el carrito`: divCompra.innerHTML = `EL total de su carrito es ${acumulador}`
}
//Función para agregar libros: 
function cargarLibro(array){
    //captura y utilización de input para crear nuevo objeto
    let inputAutor = document.getElementById("autorInput")  
    let inputTitulo = document.getElementById("tituloInput")
    let inputPrecio = document.getElementById("precioInput")
    
    let libroCreado = new Libro(array.length+1, inputAutor.value, inputTitulo.value, parseInt(inputPrecio.value), "libroNuevo.jpg")
    //Objeto creado lo pusheo al array
    array.push(libroCreado)
    //TAMBIÉN MODIFICAMOS ARRAY DEL STORAGE:
    localStorage.setItem("estanteria", JSON.stringify(array))
    mostrarCatalogo(array)

    inputAutor.value = ""
    inputTitulo.value = ""
    inputPrecio.value =""

    //toastify:
    Toastify({
        text: "El libro ha sido agregado a la estanteria",
        duration: 2500,

        //para posionar
        gravity: "bottom", //top o bottom
        position: "center", //left, rigth, center
        style: {
            background: "green",
            color: "black"
        }
    }).showToast()
}

//function buscador que se activa con evento change del input para buscar
function buscarInfo(buscado, array){
    let busqueda = array.filter(
        (libro) => libro.autor.toLowerCase().includes(buscado.toLowerCase()) || libro.titulo.toLowerCase().includes(buscado.toLowerCase())
        // Coincidencias sin includes (libro) => libro.autor.toLowerCase() == buscado.toLowerCase() || libro.titulo.toLowerCase() == buscado.toLowerCase()
    )
    //con ternario:
    busqueda.length == 0 ? 
    (coincidencia.innerHTML = `<h3 class="text-success m-2">No hay coincidencias con su búsqueda.. a continuación tiene todo nuestro catálogo disponible</h3>`, mostrarCatalogo(array)) 
    : (coincidencia.innerHTML = "", mostrarCatalogo(busqueda))
}

//SORT -- ATENCIÖN METODO QUE DESTRUYE (AFECTA) AL ARRAY ORIGINAL -- en el after lo seguimos
// //https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
// // https://davidyero.medium.com/ordenar-arreglo-de-objetos-por-propiedad-o-atributo-javascript-56f74fc48906
//Functions ordenar stock
function ordenarMayorMenor(array){
   let mayorMenor = [].concat(array)
   mayorMenor.sort((a,b) => (b.precio - a.precio))
   console.log(array)
   console.log(mayorMenor)
   mostrarCatalogo(mayorMenor)
}
function ordenarMenorMayor(array){
let menorMayor = [].concat(array)
   menorMayor.sort((a,b) => (a.precio - b.precio))
   console.log(array)
   console.log(menorMayor)
   mostrarCatalogo(menorMayor)
}
function ordenarAlfabeticamente(array){
    let alfabeticamente = array.slice()
    alfabeticamente.sort((a,b) => {
    if(a.titulo < b.titulo)return -1
    if(a.titulo > b.titulo)return 1
    return 0
   })
   console.log(array)
   console.log(alfabeticamente)
   mostrarCatalogo(alfabeticamente)
}





//EVENTOS PROYECTO
btnGuardarLibro.addEventListener("click", ()=>{cargarLibro(estanteria)})
buscador.addEventListener("input", ()=>{buscarInfo(buscador.value, estanteria)})
botonCarrito.addEventListener("click", ()=>{
    cargarProductosCarrito(productosEnCarrito)
})
selectOrden.addEventListener("change", ()=>{
    console.log(selectOrden.value)

    if(selectOrden.value == 1){
        ordenarMayorMenor(estanteria)
    }else if (selectOrden.value == 2){
        ordenarMenorMayor(estanteria)
    }else if (selectOrden.value == 3){
        ordenarAlfabeticamente(estanteria)
    }else{
        mostrarCatalogo(estanteria)
    }
}) 
botonFinalizarCompra.addEventListener("click",()=>{
    finalizarCompra()
})
function finalizarCompra(){
    Swal.fire({
        title: 'Está seguro de realizar la compra',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Sí, seguro',
        cancelButtonText: 'No, no quiero',
        confirmButtonColor: 'green',
        cancelButtonColor: 'red',
    }).then((result)=>{
        if(result.isConfirmed){
            Swal.fire({
            title: 'Compra realizada',
            icon: 'success',
            confirmButtonColor: 'green',
            text: `Muchas gracias por su compra ha adquirido nuestros productos. `,
            })
            //resetear o llevar a cero el array de carrito
            //Tenemos que researtearlo tanto al array como al localStorage
            productosEnCarrito =[]
            localStorage.removeItem("carrito")
        }else{
            //Va a entrar cuando ponga
            Swal.fire({
                title: 'Compra no realizada',
                icon: 'info',
                text: `La compra no ha sido realizada! Atención sus productos siguen en el carrito :D`,
                confirmButtonColor: 'green',
                timer:3500
            })
        }
    })
}
//CÓDIGO:
setTimeout(()=>{
    loaderTexto.innerHTML = ""
    loader.remove()
    mostrarCatalogo(estanteria)

}, 3000)

//CLASE 13

// Swal.fire(
//     'The Internet?',
//     'That thing is still around?',
//     'question'
//   )

//   Swal.fire({
//     title: 'Bienvenidos a clase 13',
//     text: 'Hoy vemos librerías',
//     icon: 'info',
//     confirmButtonText: 'Gracias!!'
// })

// Toastify({
//     text: "This is a toast",
//     duration: 3000,
//     destination: "https://github.com/apvarun/toastify-js",
//     newWindow: true,
//     close: true,
//     gravity: "top", // `top` or `bottom`
//     position: "left", // `left`, `center` or `right`
//     stopOnFocus: true, // Prevents dismissing of toast on hover
//     style: {
//       background: "linear-gradient(to right, #00b09b, #96c93d)",
//     },
//     onClick: function(){} // Callback after click
//   }).showToast();

//Luxon
const DateTime = luxon.DateTime

const iso = DateTime.fromISO("1993-07-19")


const fechaHoy = DateTime.now()

let divFechaHoy = document.getElementById("fechaHoy")
// let fecha = fechaHoy.toLocaleString(DateTime.DATE_SHORT)
// let fecha = fechaHoy.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)
let fecha = fechaHoy.toLocaleString(DateTime.DATE_FULL)
divFechaHoy.innerHTML = `${fecha}`

//CLASE 14 ASINCRONIA

//setTimeOut recibe dos parametros function y cant tiempo
// console.log("Inicio de proceso")
// setTimeout(()=>{
//     console.log("Mitad de proceso")
// }, 3000)
// console.log("Fin de proceso")

// let time = 0
// for (let letra of "Hola"){
//     time+=1000
//     setTimeout(()=>{
//         console.log(letra)
//     },time)
// }

// //Function con misma sintaxis recibe dos parámetros
// let i = 0

// const intervalo = setInterval(()=>{
//     i++
//     console.log("Tic " + i)
//     if(i > 5){
//         //limpiamos el intervalo
//         clearInterval(intervalo)
//         console.log("Fin del contador Tic")
//     }
// },1000)

// //Promesa pendiente
// const eventoFuturo = (valor) => {
//     return new Promise( (resolve, reject) => {
//         //cuerpo de la promesa
//             if(valor){
//             //estado fulfilled
//             resolve("La promesa se ha cumplido")
//             }else{
//             //estado rejected
//             reject("La promesa NO se ha cumplido")
//             } 
//     } )
// }
// console.log( eventoFuturo(true))
// console.log( eventoFuturo(false))

class Tutor{
    constructor(nombre, apellido){
        this.nombre = nombre,
        this.apellido = apellido
    }
}
const tutor1 = new Tutor("Germán", "Cuevas")
const tutor2 = new Tutor("David", "Gonzalez")
let tutores = [tutor1, tutor2]

function llamarTutores(resultado){
    return new Promise((res, rej)=>{
        if(resultado){
            res(tutores)
        }else{
            rej("No se pudo llamar a los tutores")
        }
    })
}
//estructura con then, catch y finally
llamarTutores(false)
.then((respuesta) => {console.log(respuesta)})
.catch(respuesta => console.log("PROMESA NO RESUELTA "+respuesta))
.finally(()=>{
    console.log("Se finalizó la promesa")
})