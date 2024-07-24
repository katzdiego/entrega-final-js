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
const reiniciarJuegoBoton = document.getElementById('reiniciar-juego');

let preguntas = [];
let preguntasOrginales = []
let preguntaActualIndex = 0;
let puntuacion = 0;

async function cargarPreguntas() {
    try {
        const response = await fetch('db/preguntas.json');
        if (!response.ok) {
            throw new Error('La respuesta de la red no fue correcta');
        }
        preguntasOrginales = await response.json();
        preguntas= [...preguntasOrginales];
        guardarEnLocalStorage();
        mostrarPregunta();
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error al cargar preguntas',
            text: 'No se pudieron cargar las preguntas. Intenta de nuevo más tarde.',
        });
        console.error('Error en cargarPreguntas:', error);
    }
}

function agregarNuevaPregunta() {
    try {
        const textoPregunta = nuevaPreguntaInput.value.trim();
        const textoRespuesta = nuevaRespuestaInput.value.trim();
        if (textoPregunta !== "" && textoRespuesta !== "") {
            const nuevaPregunta = {
                texto: textoPregunta,
                respuesta: textoRespuesta
            };
            const preguntaExiste = preguntas.some(pregunta => pregunta.texto === textoPregunta);
            if (!preguntaExiste) {
                preguntas.push(nuevaPregunta);
                guardarEnLocalStorage();
                nuevaPreguntaInput.value = "";
                nuevaRespuestaInput.value = "";
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Pregunta duplicada',
                    text: 'Ya existe una pregunta con ese texto.',
                });
            }
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Datos incompletos',
                text: 'Por favor, completa tanto la pregunta como la respuesta.',
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al agregar la pregunta. Inténtalo de nuevo.',
        });
        console.error('Error en agregarNuevaPregunta:', error);
    }
}

function mostrarPregunta() {
    try {
        if (preguntaActualIndex < preguntas.length) {
            const preguntaActual = preguntas[preguntaActualIndex];
            preguntaElemento.textContent = preguntaActual.texto;
            respuestasElemento.innerHTML = '';
            const respuestaLi = document.createElement('li');
            respuestaLi.innerHTML = `<input type="text" id="respuesta-input" placeholder="Escribí tu respuesta">`;
            respuestasElemento.appendChild(respuestaLi);
        } else {
            preguntaElemento.textContent = `Juego terminado. Puntuación: ${puntuacion}`;
            respuestasElemento.innerHTML = '';
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al mostrar la pregunta. Inténtalo de nuevo.',
        });
        console.error('Error en mostrarPregunta:', error);
    }
}

function verificarRespuesta() {
    try {
        const estadisticas = JSON.parse(localStorage.getItem('estadisticas'));
        const respuestaInput = document.getElementById('respuesta-input').value.trim();
        const respuestaCorrecta = preguntas[preguntaActualIndex].respuesta;
        estadisticas.preguntasRespondidas++; 
        if (respuestaInput.toLowerCase() === respuestaCorrecta.toLowerCase()) {
            puntuacion++;
            estadisticas.preguntasCorrectas++;
        }else{
            estadisticas.intentosFallidos++;
        }
        preguntaActualIndex++;
        mostrarPregunta();
        localStorage.setItem('estadisticas',JSON.stringify(estadisticas));
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al verificar la respuesta. Inténtalo de nuevo.',
        });
        console.error('Error en verificarRespuesta:', error);
    }
}

function guardarEnLocalStorage() {
    try {
        localStorage.setItem('preguntas', JSON.stringify(preguntas));
        localStorage.setItem('preguntasOriginales', JSON.stringify(preguntasOrginales))
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo guardar en el almacenamiento local.',
        });
        console.error('Error en guardarEnLocalStorage:', error);
    }
}

function cargarDesdeLocalStorage() {
    try {
        const preguntasGuardadas = localStorage.getItem('preguntas');
        const preguntasOrginalesGuardadas = localStorage.getItem ('preguntasOriginales')
        if (preguntasGuardadas) {
            preguntas = JSON.parse(preguntasGuardadas);
        } else {
            cargarPreguntas();
        }
        if (preguntasOrginalesGuardadas) {
            preguntasOrginales = JSON.parse(preguntasOrginalesGuardadas)
        } else {
            cargarPreguntas(); 
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo cargar las preguntas desde el almacenamiento local.',
        });
        console.error('Error en cargarDesdeLocalStorage:', error);
    }
}

function editarPregunta() {
    try {
        const index = parseInt(editarPreguntaIndexInput.value, 10);
        const nuevoTexto = editarPreguntaInput.value.trim();
        const nuevaRespuesta = editarRespuestaInput.value.trim();
        if (!isNaN(index) && index > 0 && index <= preguntas.length) {
            const adjustedIndex = index -1; 
            if (nuevoTexto !== "") {
                preguntas[adjustedIndex].texto = nuevoTexto;
            }
            if (nuevaRespuesta !== "") {
                preguntas[adjustedIndex].respuesta = nuevaRespuesta;
            }
            guardarEnLocalStorage();
            mostrarPregunta();
            editarPreguntaIndexInput.value = "";
            editarPreguntaInput.value = "";
            editarRespuestaInput.value = "";
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Índice inválido',
                text: 'Por favor, ingresa un índice válido para la pregunta a editar.',
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al editar la pregunta. Inténtalo de nuevo.',
        });
        console.error('Error en editarPregunta:', error);
    }
}

function vaciarPreguntas() {
    try {
        preguntas = preguntasOrginales.slice();
        guardarEnLocalStorage();
        reiniciarJuego();
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron vaciar las preguntas. Inténtalo de nuevo.',
        });
        console.error('Error en vaciarPreguntas:', error); 
    }
}

function reiniciarJuego() {
    try {
        preguntaActualIndex = 0;
        puntuacion = 0;
        cargarDesdeLocalStorage();
        mostrarPregunta();
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo reiniciar el juego. Inténtalo de nuevo.',
        });
        console.error('Error en reiniciarJuego:', error);
    }
}

function contarPreguntas() {
    try {
        contadorElemento.textContent = `Total de preguntas: ${preguntas.length}`;
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo contar las preguntas. Inténtalo de nuevo.',
        });
        console.error('Error en contarPreguntas:', error);
    }
}

const estadisticas = JSON.parse(localStorage.getItem('estadisticas')) || {
    preguntasRespondidas: 0,
    preguntasCorrectas: 0,
    intentosFallidos: 0,
};

localStorage.setItem('estadisticas', JSON.stringify(estadisticas));


siguienteBoton.addEventListener('click', verificarRespuesta);
agregarPreguntaBoton.addEventListener('click', agregarNuevaPregunta);
editarPreguntaBoton.addEventListener('click', editarPregunta);
vaciarPreguntasBoton.addEventListener('click', vaciarPreguntas);
contarPreguntasBoton.addEventListener('click', contarPreguntas);
reiniciarJuegoBoton.addEventListener('click', reiniciarJuego);

reiniciarJuego();
mostrarPregunta();
cargarDesdeLocalStorage();