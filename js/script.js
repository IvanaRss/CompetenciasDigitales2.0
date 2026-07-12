let indice = 0;
let respuestas = [];
let participante = {};

const contenedor = document.querySelector(".tarjeta");

// =======================
// INICIAR CUESTIONARIO
// =======================

function iniciarCuestionario() {

    contenedor.innerHTML = `

        <h2>Evaluación de Competencias Digitales</h2>

        <p id="contadorPregunta"></p>

        <div class="progreso">
            <div id="barraProgreso"></div>
        </div>

        <p id="pregunta"></p>

        <div class="opciones">

            <button class="opcion verde"
                    data-valor="3"
                    onclick="responder(3)">
                Totalmente
            </button>

            <button class="opcion amarillo"
                    data-valor="2"
                    onclick="responder(2)">
                Parcialmente
            </button>

            <button class="opcion rojo"
                    data-valor="1"
                    onclick="responder(1)">
                Desconozco / No lo utilizo
            </button>

        </div>

        <div class="navegacion">

            <button onclick="anterior()">
                ⬅ Anterior
            </button>

            <button onclick="siguiente()">
                Siguiente ➡
            </button>

        </div>

    `;

    mostrarPregunta();
}

// =======================
// MOSTRAR PREGUNTA
// =======================

function mostrarPregunta() {

    document.getElementById("contadorPregunta").textContent =
        `Pregunta ${indice + 1} de ${preguntas.length}`;

    document.getElementById("pregunta").textContent =
        preguntas[indice];

    document.querySelectorAll(".opcion").forEach(btn => {
        btn.classList.remove("seleccionado");
    });

    if (respuestas[indice] !== undefined) {

        const boton = document.querySelector(
            `.opcion[data-valor="${respuestas[indice]}"]`
        );

        if (boton) {
            boton.classList.add("seleccionado");
        }
    }

    const porcentaje =
        ((indice + 1) / preguntas.length) * 100;

    document.getElementById("barraProgreso").style.width =
        porcentaje + "%";
}

// =======================
// GUARDAR RESPUESTA
// =======================

function responder(valor) {

    respuestas[indice] = valor;

    document.querySelectorAll(".opcion").forEach(btn => {
        btn.classList.remove("seleccionado");
    });

    const boton = document.querySelector(
        `.opcion[data-valor="${valor}"]`
    );

    if (boton) {
        boton.classList.add("seleccionado");
    }
}

// =======================
// SIGUIENTE
// =======================

function siguiente() {

    if (respuestas[indice] === undefined) {

        alert(
            "Selecciona una respuesta antes de continuar."
        );

        return;
    }

    if (indice < preguntas.length - 1) {

        indice++;

        mostrarPregunta();

    } else {

        mostrarResultado();
    }
}

// =======================
// ANTERIOR
// =======================

function anterior() {

    if (indice > 0) {

        indice--;

        mostrarPregunta();
    }
}

// =======================
// RESULTADO
// =======================

function mostrarResultado() {

    let total = respuestas.reduce(
        (acum, valor) => acum + valor,
        0
    );

    let nivel = "";
    let mensaje = "";

    if (total <= 60) {

        nivel = "Nivel Básico";

        mensaje =
            "Requiere apoyo y acompañamiento en competencias digitales.";

    } else if (total <= 100) {

        nivel = "Nivel Intermedio";

        mensaje =
            "Utiliza herramientas digitales comunes y puede desarrollar nuevas habilidades.";

    } else {

        nivel = "Nivel Avanzado";

        mensaje =
            "Demuestra autonomía y dominio en el uso de tecnologías digitales.";
    }

   contenedor.innerHTML = `

    <h2>Resultado Final</h2>

    <h3>${nivel}</h3>

    <p>${mensaje}</p>

    <h3>Puntaje: ${total}</h3>

`;
guardarResultado(total, nivel);

}

// =======================
// FORMULARIO INICIAL
// =======================


document
.getElementById("formDatos")
.addEventListener("submit", function(e){

    e.preventDefault();

    participante = {
        nombre: document.getElementById("nombre").value,
        edad: document.getElementById("edad").value,
        correo: document.getElementById("correo").value,
        genero: document.getElementById("genero").value
    };

    console.log("Participante:", participante);

    iniciarCuestionario();

});

console.log("Cliente Supabase:", supabaseClient);
async function guardarResultado(total, nivel){

    const { data, error } = await supabaseClient
    .from("participantes")
    .insert([
        {
            nombre: participante.nombre,
            edad: participante.edad,
            correo: participante.correo,
            genero: participante.genero,
            respuestas: respuestas,
            puntaje: total,
            nivel: nivel
        }
    ]);


    if(error){

        console.error("Error al guardar:");
        console.log(error.message);
        console.log(error.details);
        console.log(error.hint);

    } else {

        console.log("Resultado guardado correctamente");

    }

}