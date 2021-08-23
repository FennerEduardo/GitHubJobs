const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

document.addEventListener('DOMContentLoaded', () => {
    formulario.addEventListener('submit', validarBusqueda)
})

function validarBusqueda(e) {
    e.preventDefault()

    const busqueda = document.querySelector('#busqueda').value;

    if (busqueda.length < 3) {
        mostrarMensaje('Búsqueda muy corta... Añade más información')
        return
    }
    consultarAPI(busqueda)
}

function mostrarMensaje(mensaje) {
    const existeAlerta = document.querySelector('.alerta');
    if (!existeAlerta) {
        const alerta = document.createElement('div')
        alerta.classList.add('bg-gray-100', 'p-3', 'text-center', 'mt-3', 'alerta')
        alerta.textContent = mensaje
        formulario.appendChild(alerta)

        setTimeout(() => {
            alerta.remove()
        }, 3000);
    }
}

function consultarAPI(busqueda){
    const githubUrl = `https://jobs.github.com/positions.json?search=${busqueda}`

    // Codificar la url para poder para la plitica de CORS del backend de GitHub
    const url = `https://api.allorigins.win/get?url=${ encodeURIComponent(githubUrl)}`
    
    //Usando la librería de Axios para el fetch, siempre retorna DATA en el objeto
    axios.get(url)
        .then( respuesta => mostrarVacantes(JSON.parse(  respuesta.data.contents)))
}

function mostrarVacantes(vacantes){
    //limpiar el html
    while(resultado.firstChild){
        resultado.firstChild.remove()
    }

    if(vacantes.length > 0){
        resultado.classList.add('grid')

        vacantes.forEach(vacante => {
            const { company, type, title, url } = vacante

            resultado.innerHTML += `
                <div class="shadow bg-white p-6 rounded">
                    <h2 class="text-2xl font-light mb-4">${title}</h2>
                    <p class="font-bold uppercase">Compañia:  <span class="font-light normal-case">${company} </span></p>
                    <p class="font-bold uppercase">Tipo de Contrato:   <span class="font-light normal-case">${type} </span></p>
                    <a class="bg-teal-500 max-w-lg mx-auto mt-3 rounded p-2 block uppercase font-xl font-bold text-white text-center" href="${url}">Ver Vacante</a>
                </div>
            `
        })
    } else {
        const noResultado = document.createElement('p')
        resultado.classList.remove('grid')
        noResultado.classList.add('text-center', 'mt-10', 'text-gray-600', 'w-full')
        noResultado.textContent = 'No hay vacantes, intenta con otro término de búsqueda'
        resultado.appendChild(noResultado)

    }
}