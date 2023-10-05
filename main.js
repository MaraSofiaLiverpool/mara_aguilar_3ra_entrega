const pacientes = JSON.parse( localStorage.getItem("pacientes")) || []

const crearPaciente = (curp,nombre,apellido,direccion,tel) =>{
        const existe = pacientes.some(paciente => paciente.curp === curp)
        if(existe){
            Swal.fire({
                icon: 'error',
                title: 'Usuario ya registrado',
             })

        }else{
            const paciente = {
                curp,
                nombre,
                apellido,
                direccion,
                tel,
                consultas:[]
            }
            pacientes.push(paciente)
            localStorage.setItem("pacientes",JSON.stringify(pacientes))
        }
}

const cargarPaciente = ()=>{
    const formCrearPaciente = document.getElementById("formCrearPaciente")
formCrearPaciente.addEventListener("submit",(e)=>{
    e.preventDefault()
    const datos = e.target.children
    crearPaciente(datos["curp"].value,datos["nombre"].value,datos["apellido"].value,datos["direccion"].value,datos["tel"].value)
    formCrearPaciente.reset()

})

}


const calcularImc = (curp,peso,altura) =>{
        peso = parseFloat(peso)
        altura = parseFloat(altura)

        if (isNaN(peso) || isNaN(altura)) {
            Swal.fire({
                icon: 'error',
                title: 'Datos inválidos',
                text: 'Por favor, ingrese valores numéricos válidos para peso y altura'
             })
            return;
        }

        const paciente = pacientes.find(paciente => paciente.curp == curp)
        if(!paciente){
            Swal.fire({
                icon: 'error',
                title: 'Paciente no encontrado',
             })
             return
        }

        const fecha = new Date()
        const imcCalculado = peso / (altura * altura) 
        let anotaciones = ""
        if (imcCalculado < 18.5) {
            anotaciones = "IMC Abajo de lo recomendado"
        } else if (imcCalculado >= 18.5 && imcCalculado < 25 ) {   
            anotaciones = "IMC está dentro del intervalo normal"
        } else if (imcCalculado >= 25 && imcCalculado < 30) {    
            anotaciones = "IMC considerado como sobrepeso"
        } else { 
            anotaciones = "IMC considerado como obesidad"
        }

        const consulta = {
            fecha,
            peso,
            altura,
            anotaciones,
            imcCalculado
        }

        paciente.consultas.push(consulta)
        localStorage.setItem("pacientes",JSON.stringify(pacientes))
        Swal.fire({
            icon: 'success',
            title: 'Gracias por elegirnos',
             })
          
}

const crearConsulta = () =>{
    const formCalcularIMC = document.getElementById("formCalcularIMC")
    formCalcularIMC.addEventListener("submit",(e)=>{
        e.preventDefault()
        const datos = e.target.children
        calcularImc(datos["curp"].value,datos["peso"].value,datos["altura"].value)
    })
}

const verPacientes = () => {
    const contenedorPacientes = document.getElementById("contenedorPacientes");
    
    pacientes.forEach(paciente => {
        const tarjetaPaciente = document.createElement("div");
        tarjetaPaciente.className = "tarjetaPaciente";
        tarjetaPaciente.innerHTML = `
            <h3>${paciente.nombre} ${paciente.apellido}</h3>
            <h4>${paciente.curp}</h4>
            <button id="verConsultas${paciente.curp}">Ver consultas</button>
            <div id="consultas${paciente.curp}" style="display: none;"></div>
        `;
    
        contenedorPacientes.appendChild(tarjetaPaciente);
    
        const btnVerConsultas = document.getElementById(`verConsultas${paciente.curp}`);
        const divConsultas = document.getElementById(`consultas${paciente.curp}`);
    
        btnVerConsultas.addEventListener("click", () => {
            mostrarConsultas(paciente, divConsultas);
        });
    });
}

const calcularUltimoIMC = (paciente) => {
    if (paciente.consultas.length > 0) {
        const ultimaConsulta = paciente.consultas[paciente.consultas.length - 1];
        return ultimaConsulta.imcCalculado.toFixed(2);
    }
    return "No hay registros";
}

const mostrarConsultas = (paciente, divConsultas) => {
    divConsultas.innerHTML = "";
    if (paciente.consultas.length > 0) {
        paciente.consultas.forEach(consulta => {
            const consultaHTML = document.createElement("div");
            consultaHTML.className = "consulta";
            consultaHTML.innerHTML = `
                <p>Fecha: ${consulta.fecha.toLocaleDateString()}</p>
                <p>Peso: ${consulta.peso} kg</p>
                <p>Altura: ${consulta.altura} m</p>
                <p>IMC: ${consulta.imcCalculado.toFixed(2)}</p>
                <p>Anotaciones: ${consulta.anotaciones}</p>
            `;
            divConsultas.appendChild(consultaHTML)
        });
        divConsultas.style.display = "block"
    } else {
        divConsultas.innerHTML = "No hay registros de consultas."
        divConsultas.style.display = "block"
    }
}


cargarPaciente()
crearConsulta()
verPacientes()



