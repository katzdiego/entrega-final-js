const preguntaElemento = document.getElementById('pregunta');
const respuestasElemento = document.getElementById('respuestas');
const siguienteBoton = document.getElementById('siguiente');
const nuevaPreguntaInput = document.getElementById('nueva-pregunta');
const nuevaRespuestaInput = document.getElementById('nueva-respuesta');

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

function filtrarPreguntas(textoFiltro) {
    return preguntas.filter(pregunta => pregunta.texto.includes(textoFiltro));
}

function mapearPreguntas(callback) {
    return preguntas.map(callback);
}

siguienteBoton.addEventListener('click', verificarRespuesta);

cargarDesdeLocalStorage();