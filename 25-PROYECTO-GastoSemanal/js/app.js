// variables y selectores
const formulario    = document.querySelector('#agregar-gasto');
const gastoListado  = document.querySelector('#gastos ul');


// Eventos
evenListeners();
function evenListeners(){
    document.addEventListener('DOMContentLoaded', PreguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto);
}


// Clases

class Presupuesto{
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante    = Number(presupuesto);
        this.gastos      = [];
    }

    nuevoGasto(gasto){
        //esta línea hace que se copie la variable gasto al array gastos
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante(){
        const gastado = this.gastos.reduce( (total, gasto) => total+ gasto.cantidad, 0 );
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter( gasto => gasto.id !== id );
        console.log(this.gastos);
        this.calcularRestante();
    }
}

class UI{
    insertarPresupuesto(cantidad){
        // console.log(cantidad);
        const {presupuesto, restante} = cantidad;
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje,tipo){

        // crear div 
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        }else{
            divMensaje.classList.add('alert-success');
        }

        // agregar el mensaje 

        divMensaje.textContent = mensaje;

        // Insertar en el html

        document.querySelector('.primario').insertBefore(divMensaje,formulario);

        //quitar formulario

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);

    }

    mostrarGastos(gastos){
        // Iterar sobre los gastos
        this.limpiarHTML(); // Elimina el HTML previo

        gastos.forEach(gasto => {
            const { cantidad, nombre , id} = gasto;

            // Crear un LI
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            // nuevoGasto.setAttribute('data-id', id);
            nuevoGasto.dataset.id = id;

            // Agregar el HTML del gasto
            nuevoGasto.innerHTML = ` ${nombre} <span class="badge badge-primary badge-pill"> $ ${cantidad} </span>`;
            // Borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML='Borrar &times';
            btnBorrar.onclick = () =>{
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);
            // Agregar al HTML
            gastoListado.appendChild(nuevoGasto);

        });
    }

    limpiarHTML(){
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestObj){
        const {presupuesto, restante } = presupuestObj;

        const restanteDiv = document.querySelector('.restante');

        // Comprobar 25 %

        if((presupuesto / 4) > restante ){
            
            restanteDiv.classList.remove('alert-success','alert-warning');
            restanteDiv.classList.add('alert-danger');

        }else if ((presupuesto / 2) > restante ) {
            
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning'); 
        }else{
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success'); 
        }

        // Si el total es 0 o menor
        if(restante <= 0){
            ui.imprimirAlerta('El presupuesto se ha agotado','error');
            formulario.querySelector('button[type = "submit"]').disabled = true;
        }
    }
}

// instanciar

const ui = new UI();

let presupuesto;

// Funciones

function PreguntarPresupuesto(){
    const presupuestoUsuario = prompt('¿Cuál es tu presupuesto?'); 
    //console.log(Number(presupuestoUsuario));

    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
       
        alert('Debes ingresar un monto valido');
        window.location.reload(); // esta línea hace que se vuelva a cargar la página
    }

    // presupuesto valido

    presupuesto = new Presupuesto(presupuestoUsuario);
    console.log(presupuesto);

    ui.insertarPresupuesto(presupuesto);
}

function agregarGasto(e){
    e.preventDefault();

    //leer gasto del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);


    //validar

    if(nombre === '' || cantidad === ''){
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return;
    }else if( cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta('Cantidad no validad','error');
        return;
    }

    //Generar objeto Gasto
    const gasto = {nombre, cantidad, id: Date.now()}

    //añade nuevo gasto

    presupuesto.nuevoGasto(gasto);

    ui.imprimirAlerta('Gasto agregago correctamente');

    //Imprimir los gastos
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);

    // reiniciamos el formulario
    formulario.reset();
}

function eliminarGasto(id){
    //Elimina gasto Objeto
    presupuesto.eliminarGasto(id);
    //Elimina gasto HTML
    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
}