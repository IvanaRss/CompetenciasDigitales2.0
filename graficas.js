async function cargarDatos() {

    const { data, error } = await supabaseClient
        .from("participantes")
        .select("*");


    if (error) {

        console.error("Error al obtener datos:", error);
        return;

    }


    console.log("Datos:", data);


    generarNivel(data);

    generarEdad(data);

    generarGenero(data);

    generarIndicadores(data);

    generarPreguntas(data);

    generarCompetencias(data);

}


Chart.register(ChartDataLabels);

cargarDatos();

// ===============================
// GRÁFICA DE NIVEL
// ===============================

function generarNivel(datos) {

    let niveles = {
        "Nivel Básico": 0,
        "Nivel Intermedio": 0,
        "Nivel Avanzado": 0
    };

    datos.forEach(persona => {

        if (niveles.hasOwnProperty(persona.nivel)) {
            niveles[persona.nivel]++;
        }

    });

    new Chart(document.getElementById("graficaNivel"), {

        type: "bar",

        data: {

            labels: Object.keys(niveles),

            datasets: [{

                label: "Participantes",

                data: Object.values(niveles),

               backgroundColor:"#005CA9",
                borderColor:"#003B71",

                borderWidth: 2,

                borderRadius: 8,

                barThickness: 60

            }]

        },

        options:{

    responsive:true,

    plugins:{

        legend:{
            position:"bottom"
        },

        datalabels:{

    color:"#fff",

    font:{
        size:14,
        weight:"bold"
    },

    formatter:(value,context)=>{

        const total=context.dataset.data.reduce((a,b)=>a+b,0);

        return ((value/total)*100).toFixed(1)+"%";

    }



        }

    },

            scales: {

                y: {

                    beginAtZero: true,

                    ticks: {

                        color: "#111",

                        font: {

                            size: 14

                        }

                    }

                },

                x: {

                    ticks: {

                        color: "#111",

                        font: {

                            size: 14,
                            weight: "bold"

                        }

                    }

                }

            }

        }

    });

}



// ===============================
// GRÁFICA DE EDADES
// ===============================

function generarEdad(datos) {

    let edades = {};

    datos.forEach(persona => {

        let edad = persona.edad;

        if (edades[edad]) {

            edades[edad]++;

        } else {

            edades[edad] = 1;

        }

    });

    new Chart(document.getElementById("graficaEdad"), {

        type: "pie",

        data: {

            labels: Object.keys(edades),

            datasets: [{

                label: "Participantes",

                data: Object.values(edades),

                backgroundColor: [

                    "#2563EB",
                    "#22C55E",
                    "#F59E0B",
                    "#EF4444",
                    "#8B5CF6",
                    "#06B6D4",
                    "#EC4899",
                    "#14B8A6"

                ]

            }]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    position: "bottom"

                }

            }

        }

    });

}



// ===============================
// GRÁFICA DE GÉNERO
// ===============================

function generarGenero(datos) {

    let generos = {};

    datos.forEach(persona=>{

        let genero = persona.genero;

        if(generos[genero]){

            generos[genero]++;

        }else{

            generos[genero]=1;

        }

    });


    new Chart(document.getElementById("graficaGenero"), {

        type:"doughnut",

        data:{

            labels:Object.keys(generos),

            datasets:[{

                data:Object.values(generos),

                backgroundColor:[

                    "#2563EB",
                    "#EC4899",
                    "#22C55E"

                ]

            }]

        }

    });

}


// ===============================
// TARJETAS DE INFORMACIÓN
// ===============================

function generarIndicadores(datos){


    document.getElementById("totalParticipantes").textContent =
        datos.length;


    let suma = 0;
    let cantidad = 0;


    datos.forEach(persona=>{


        persona.respuestas.forEach(valor=>{

            suma += valor;
            cantidad++;

        });


    });


    document.getElementById("promedio").textContent =
        (suma/cantidad).toFixed(2);



    let niveles={};


    datos.forEach(persona=>{


        niveles[persona.nivel] =
        (niveles[persona.nivel] || 0) + 1;


    });



    let nivelMayor =
    Object.keys(niveles)
    .reduce((a,b)=>
        niveles[a] > niveles[b] ? a:b
    );


    document.getElementById("nivelFrecuente").textContent =
        nivelMayor;
}

// ===============================
// GRÁFICA DE RESPUESTAS POR PREGUNTA
// ===============================

function generarPreguntas(datos){


    let preguntas = [];


    // Crear posiciones P1, P2, P3...
    for(let i = 0; i < datos[0].respuestas.length; i++){

        preguntas.push("P" + (i + 4));

    }



    let promedios = [];



    // Calcular promedio de cada pregunta

    for(let i = 0; i < datos[0].respuestas.length; i++){


        let suma = 0;


        datos.forEach(persona=>{


            suma += persona.respuestas[i];


        });



        promedios.push(
            (suma / datos.length).toFixed(2)
        );


    }



    new Chart(
        document.getElementById("graficaPreguntas"),
        {


        type:"line",


        data:{


            labels: preguntas,


            datasets:[{


                label:"Promedio de respuesta",


                data: promedios,


                borderWidth:3,


                tension:0.3,


                fill:false


            }]


        },


        options:{


            responsive:true,


            plugins:{


                legend:{


                    position:"bottom"


                }


            },


            scales:{


                y:{


                    beginAtZero:true,


                    max:3


                }


            }


        }


    });


}
// ===============================
// GRÁFICA DE COMPETENCIAS
// ===============================

function generarCompetencias(datos){


    let competencias = {

        "Información y datos":[0,0],
        "Comunicación":[0,0],
        "Contenido digital":[0,0],
        "Seguridad":[0,0],
        "Resolución de problemas":[0,0]

    };


    datos.forEach(persona=>{


        persona.respuestas.forEach((valor,index)=>{


            if(index >=0 && index <=7){

                competencias["Información y datos"][0]+=valor;
                competencias["Información y datos"][1]++;

            }


            if(index >=8 && index <=15){

                competencias["Comunicación"][0]+=valor;
                competencias["Comunicación"][1]++;

            }


            if(index >=16 && index <=24){

                competencias["Contenido digital"][0]+=valor;
                competencias["Contenido digital"][1]++;

            }


            if(index >=25 && index <=34){

                competencias["Seguridad"][0]+=valor;
                competencias["Seguridad"][1]++;

            }


            if(index >=35 && index <=45){

                competencias["Resolución de problemas"][0]+=valor;
                competencias["Resolución de problemas"][1]++;

            }


        });


    });



    let nombres=[];
    let promedios=[];


    Object.keys(competencias).forEach(nombre=>{

        nombres.push(nombre);

        promedios.push(
            (
                competencias[nombre][0] /
                competencias[nombre][1]
            ).toFixed(2)
        );

    });



    new Chart(
        document.getElementById("graficaCompetencias"),
        {


        type:"radar",


        data:{


            labels:nombres,


            datasets:[{


                label:"Nivel promedio",


                data:promedios,


                borderWidth:3,


                backgroundColor:
                "rgba(37,99,235,0.2)"


            }]


        },


        options:{


            responsive:true,


            scales:{


                r:{


                    beginAtZero:true,


                    max:3


                }


            }


        }


    });


}


   
