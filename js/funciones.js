import Citas from './classes/Citas.js';
import UI from './classes/UI.js';
import { mascotaInput,
    propietarioInput,
    telefonoInput, 
    fechaInput,
     horaInput,
     formulario,
     sintomasInput } 
     from './selectores.js';





const ui = new UI();
export let DB;

const administraCitas = new Citas();

let editando;

const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha:'',
    hora:'',
    sintomas:''


}




export function datosCita(e){
    citaObj[e.target.name] = e.target.value;
   

}


export function nuevaCita(e){
    e.preventDefault();
    //extraer la informacion objeto cita

    const { mascota, propietario, telefono , fecha , hora , sintomas } = citaObj;

    if(mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === ''){
       ui.imprimirAlerta('Todos los campos son obligatorios', 'error')

        return;

    }

    //generar id

    if(editando){
       ui.imprimirAlerta('Editado Correctamente');
       administraCitas.editar({...citaObj})

       //Editar en indexed db

       const transaction = DB.transaction(['citas'],'readwrite');
       const objectStore = transaction.objectStore('citas');
       objectStore.put(citaObj);
       transaction.oncomplete = () =>{

       ui.imprimirAlerta('Guardado Correctamente');
       formulario.querySelector('button[type="submit"]').textContent = ' Crear cita ';
       //quitar modo edicion
       editando = false;

       }
       transaction.onerror = ()=>{
           console.log('Hubo un error')
       }




    }else {
        citaObj.id = Date.now();
        administraCitas.agregarCita({...citaObj});

        //insertar registro en indexed db

        const transaction = DB.transaction(['citas'],'readwrite');

        //habilitar object store
        const objectStore = transaction.objectStore('citas');
        //Insertar en la base de datos
        objectStore.add(citaObj)
        transaction.oncomplete =  function() {
                console.log('Cita Agregada')
                ui.imprimirAlerta('se agrego correctamente');

        }


       
    }


    reiniciarObjeto()

    formulario.reset();

    ui.imprimirCitas();
}

export function reiniciarObjeto(){
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';

}

export function eliminarCita(id) {
   
    const transaction = DB.transaction(['citas'],'readwrite');
    const objectStore = transaction.objectStore('citas');
    objectStore.delete(id);
    ui.imprimirAlerta('La cita se elimino correctamente');

    //imprimiri citas

    transaction.oncomplete = () => {
        console.log(`Cita ${id} eliminada...`);
        ui.imprimirCitas();
    }
    transaction.onerror = () => {
        console.log('Hubo un error');
    }


}

export function cargarEdicion(cita){
    const { mascota, propietario, telefono , fecha , hora , sintomas, id } = cita;

    //
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;

    telefonoInput.value =telefono;

    fechaInput.value = fecha;

    horaInput.value = hora;

    sintomasInput.value = sintomas;

    //llenar objeto
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    formulario.querySelector('button[type="submit"]').textContent = ' Guardar Cambios';

    editando = true;



}

export function crearDB() {
   
    const crearDB = window.indexedDB.open('citas', 1);

    //si hay erro
    crearDB.onerror = function() {
        console.log('Hubo un error');
    }
     crearDB.onsuccess = function() {
         console.log('BD Creada');
         DB =crearDB.result;
         console.log(DB);

         ui.imprimirCitas();
     }

     crearDB.onupgradeneeded = function(e){
         const db = e.target.result;
         const objectStore = db.createObjectStore('citas',{
             keyPath: 'id',
             autoincrement: true
         });
         //definir todsa las columnas
         objectStore.createIndex('mascota','mascota', { unique:false });
         objectStore.createIndex('propietario','propietario', { unique:false });
         objectStore.createIndex('telefono','telefono', { unique:false });
         objectStore.createIndex('fecha','fecha', { unique:false });
         objectStore.createIndex('hora','hora', { unique:false });
         objectStore.createIndex('sintomas','sintomas', { unique:false });
         objectStore.createIndex('id','id', { unique:true });

         console.log('DB ceada y Lista');
     }
    
    
    
    
    }