const preguntasRespondidasElemento = document.getElementById('preguntas-respondidas');
const preguntasCorrectasElemento = document.getElementById('preguntas-correctas');
const intentosFallidosElemento = document.getElementById('intentos-fallidos');
const volverBoton = document.getElementById('volver');

function cargarEstadisticas() {
    return new Promise((resolve, reject) => {
        try {
            const estadisticas = JSON.parse(localStorage.getItem('estadisticas')) || {
                preguntasRespondidas: 0,
                preguntasCorrectas: 0,
                intentosFallidos: 0
            };
            
            preguntasRespondidasElemento.textContent = `Preguntas Respondidas: ${estadisticas.preguntasRespondidas}`;
            preguntasCorrectasElemento.textContent = `Preguntas Correctas: ${estadisticas.preguntasCorrectas}`;
            intentosFallidosElemento.textContent = `Intentos Fallidos: ${estadisticas.intentosFallidos}`;
            
            resolve();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al cargar las estadísticas.',
            });
            reject(error);
        }
    });
}

cargarEstadisticas().catch(error => {
    console.error('Error al cargar estadísticas:', error);
});

