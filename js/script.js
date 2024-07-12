const preguntaElemento = document.getElementById('pregunta');
const respuestasElemento = document.getElementById('respuestas');
const siguienteBoton = document.getElementById('siguiente');
const nuevaPreguntaInput = document.getElementById('nueva-pregunta');
const nuevaRespuestaInput = document.getElementById('nueva-respuesta');
const agregarPreguntaBoton = document.getElementById('agregar-pregunta');
const editarPreguntaIndexInput = document.getElementById('indice-pregunta-editar');
const editarPreguntaInput = document.getElementById('editar-pregunta');
const editarRespuestaInput = document.getElementById('editar-respuesta');
const editarPreguntaBoton = document.getElementById('editar-pregunta-boton');
const vaciarPreguntasBoton = document.getElementById('vaciar-preguntas');
const contarPreguntasBoton = document.getElementById('contar-preguntas');
const contadorElemento = document.getElementById('contador');

let preguntas = [];
let preguntaActualIndex = 0;
let puntuacion = 0;

const preguntasEjemplo = [
    {
        texto: "¿Quién es guitarrista de Queen?",
        respuesta: "Brian May"
    },
    {
        texto: "¿Qué banda es oriunda de Liverpool?",
        respuesta: "The Beatles"
    },
    {
        texto: "¿Qué canción de Luis Alberto Spinetta contiene la frase 'mañana es mejor'?",
        respuesta: "Cantata de Puentes Amarillos"
    },
];
function agregarNuevaPregunta() {
    const textoPregunta = nuevaPreguntaInput.value.trim();
    const textoRespuesta = nuevaRespuestaInput.value.trim();
    if (textoPregunta !== "" && textoRespuesta !== "") {
        const nuevaPregunta = {
            texto: textoPregunta,
            respuesta: textoRespuesta
        };
        preguntas.push(nuevaPregunta);
        guardarEnLocalStorage();
        nuevaPreguntaInput.value = "";
        nuevaRespuestaInput.value = "";
    }
}
function mostrarPregunta() {
    if (preguntaActualIndex < preguntas.length) {
        const preguntaActual = preguntas[preguntaActualIndex];
        preguntaElemento.textContent = preguntaActual.texto;
        respuestasElemento.innerHTML = '';
        const respuestaLi = document.createElement('li');
        respuestaLi.innerHTML = `<input type="text" id="respuesta-input" placeholder="Escribi tu respuesta">`;
        respuestasElemento.appendChild(respuestaLi);
    } else {
        preguntaElemento.textContent = `Juego terminado. Puntuación: ${puntuacion}`;
        respuestasElemento.innerHTML = '';
    }
}
function verificarRespuesta() {
    const respuestaInput = document.getElementById('respuesta-input').value.trim();
    const respuestaCorrecta = preguntas[preguntaActualIndex].respuesta;
    if (respuestaInput.toLowerCase() === respuestaCorrecta.toLowerCase()) {
        puntuacion++;
    }
    preguntaActualIndex++;
    mostrarPregunta();
}

function guardarEnLocalStorage() {
    localStorage.setItem('preguntas', JSON.stringify(preguntas));
}

function cargarDesdeLocalStorage() {
    const preguntasGuardadas = localStorage.getItem('preguntas');
    if (preguntasGuardadas) {
        preguntas = JSON.parse(preguntasGuardadas);
    } else {
        preguntas = preguntasEjemplo;
        guardarEnLocalStorage();
    }
    mostrarPregunta();
}

function editarPregunta() {
    const index = parseInt(editarPreguntaIndexInput.value, 10);
    const nuevoTexto = editarPreguntaInput.value.trim();
    const nuevaRespuesta = editarRespuestaInput.value.trim();
    if (!isNaN(index) && index >= 0 && index < preguntas.length) {
        if (nuevoTexto !== "") {
            preguntas[index].texto = nuevoTexto;
        }
        if (nuevaRespuesta !== "") {
            preguntas[index].respuesta = nuevaRespuesta;
        }
        guardarEnLocalStorage();
        mostrarPregunta();
        editarPreguntaIndexInput.value = "";
        editarPreguntaInput.value = "";
        editarRespuestaInput.value = "";
    }
}

function vaciarPreguntas() {
    preguntas = preguntasEjemplo.slice()
    guardarEnLocalStorage();
    reiniciarJuego();
}

function reiniciarJuego() {
    preguntaActualIndex = 0;
    puntuacion = 0;
    cargarDesdeLocalStorage();
}

function contarPreguntas() {
    contadorElemento.textContent = `Total de preguntas: ${preguntas.length}`;
}

function mostrarResultados(resultados, soloTextos = false) {
    resultadosElemento.innerHTML = '';
    resultados.forEach(resultado => {
        const li = document.createElement('li');
        if (soloTextos) {
            li.textContent = resultado;
        } else {
            li.textContent = `${resultado.texto}: ${resultado.respuesta}`;
        }
        resultadosElemento.appendChild(li);
    });
}

siguienteBoton.addEventListener('click', verificarRespuesta);
agregarPreguntaBoton.addEventListener('click', agregarNuevaPregunta);
editarPreguntaBoton.addEventListener('click', editarPregunta);
vaciarPreguntasBoton.addEventListener('click', vaciarPreguntas);
contarPreguntasBoton.addEventListener('click', contarPreguntas);

cargarDesdeLocalStorage();