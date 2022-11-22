//class constructora
class Libro {
    constructor(id, autor, titulo, precio, imagen){
        //propiedades o atributos de nuestra clase
        this.id = id,
        this.autor = autor,
        this.titulo = titulo,
        this.precio = precio,
        this.imagen = imagen

    }
    //métodos
    mostrarData(){
        console.log(`El titulo es ${this.titulo}, el autor es ${this.autor} y su precio es ${this.precio} MËTODO`)
    }
}
//Instanciación de objetos -- respetamos orden y cantidad de atributos

const libro1 = new Libro(1,"Aki SHimazaki","LUNA LLENA", 320,"lunaLlena.jpg")

const libro2 = new Libro(2,"Joana Marcus","Antes de Diciembre", 210, "antesDeDiciembre.jpg")

const libro3 = new Libro(3,"Roberto Martinez", "Arte de Perder", 230,"arteDePerder.jpg.png")

const libro4 = new Libro(4,"Paola Sanchez","Ultimos dias en berlin", 350,"Berlin.jpg")

const libro5 = new Libro(5,"Flor M Salvador", "Boulevard", 200,"florm.jpg")

const libro6 = new Libro(6,"Desconocido", "Libro de Nod", 210,"nod.jpg")

//array de stock
let estanteria = []
//CONDICIONAL EVALUA PRIMERA VEZ QUE ENTRA AL PROYECTO
//inicializar estanteria con operador OR 
if(localStorage.getItem("estanteria")){
    estanteria = JSON.parse(localStorage.getItem("estanteria"))
}else{
    //Entra por primera -- setear el array el original
    console.log("Seteando el array por primera vez")
    estanteria.push(libro1, libro2, libro3, libro4,libro5, libro6)
    localStorage.setItem("estanteria", JSON.stringify(estanteria))
}

