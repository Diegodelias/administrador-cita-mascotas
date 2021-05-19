import {datosCita, nuevaCita, crearDB , DB } from '../funciones.js' ;
import { mascotaInput,
    propietarioInput,
    telefonoInput, 
    fechaInput,
     horaInput,
     formulario,
     sintomasInput } 
     from '../selectores.js';


class App {
    constructor(){
        this.initApp()
        this.IndexDbStart()
       
    }
    initApp() {
        mascotaInput.addEventListener('input',datosCita);
        propietarioInput.addEventListener('input',datosCita);
        telefonoInput.addEventListener('input',datosCita);
        fechaInput.addEventListener('input',datosCita);
        horaInput.addEventListener('input',datosCita);
        sintomasInput.addEventListener('input',datosCita);
        //Formualrio nueva citas
        formulario.addEventListener('submit',nuevaCita);
    }

    IndexDbStart(){
       
        crearDB()
    }
    
}


export  default App;