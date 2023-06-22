class Pregunta {
  static contadorPregunta = 0;
  numero;
  texto;
  opciones;
  opcionCorrecta;

  constructor(numero, texto, opciones, opcionCorrecta) {
    if (numero > Pregunta.contadorPregunta) {
      Pregunta.contadorPregunta = numero;
    }
    this.numero += numero;
    this.texto = texto;
    this.opciones = opciones;
    this.opcionCorrecta = opcionCorrecta;
  }

  static crearPregunta(texto, opciones, opcionCorrecta) {
    Pregunta.contadorPregunta += 1;
    return new Persona(Pregunta.contadorPregunta, texto, opciones, opcionCorrecta);
  }
}

class Opcion {
  static contadorOpcion = 0;
  numero;
  texto;

  constructor(numero, texto) {
    if (numero > Opcion.contadorOpcion) {
      Opcion.contadorOpcion = numero;
    }
    this.numero = numero;
    this.texto = texto;
  }

  static crearOpcion(texto) {
    Opcion.contadorOpcion += 1;
    return new Opcion(Opcion.contadorOpcion, texto);
  }
}

let divMenuPrincipal = document.getElementById("seccion-menu-principal");
let divPreguntas = document.getElementById("seccion-preguntas");
let divResultados = document.getElementById("seccion-resultados");
let divPartida = document.getElementById("seccion-partida");

let formNombre = document.getElementById("form-nombre");
let menuOpciones = document.getElementById("menu-opciones");

let btnIngresarNombre = document.getElementById("btn-IngresarNombre");
let btnJugar = document.getElementById("btn-jugar");
let btnCambiarNombre = document.getElementById("btn-cambiar-nombre");
let btnReiniciar = document.getElementById("btn-reiniciar");
let btnCancelar = document.getElementById("btn-cancelar");
let spanNombreJugador = document.getElementById("nombre-jugador");
let spanTemporizador = document.getElementById("pregunta__temporizador");
let spanPreguntaNumeroActual = document.getElementById("pregunta__numero-actual");
let spanPreguntaNumeroTotal = document.getElementById("pregunta__numero-total");
let pPreguntaTexto = document.getElementById("pregunta__texto");
let btnOpciones = Array.from(document.getElementsByClassName("pregunta__opcion"));
let spanOpciones = Array.from(document.getElementsByClassName("opcion__texto"));
let imgResultado = document.getElementById("resultado-img");
let spanPreguntaTotal = document.getElementById("total_preguntas");
let spanResultadoPreguntasCorrectas = document.getElementById("resultado-preguntas__correctas");
let spanResultadoPreguntasIncorrectas = document.getElementById("resultado-preguntas__incorrectas");
let spanResultadoPreguntasPorcentaje = document.getElementById("resultado-preguntas__porcentaje");
let divResumenesPreguntas = document.getElementById("resumenes-preguntas");

let preguntas = [];
let preguntaActual = null;
let preguntasCorrectas = 0;
let preguntasIncorrectas = 0;
let nombre = "";
let intervaloPreguntaActual = null;
let finIntervaloPreguntaActual = null;
let numeroPreguntaActual = 0;
let numeroPreguntasNumeroTotal = 0;
let resumenPreguntas = [];
const imagenes = {
  tonto: "./img/tonto.png",
  inteligente: "./img/inteligente.png",
  genio: "./img/genio.png",
};

document.addEventListener("DOMContentLoaded", () => {
  btnIngresarNombre.addEventListener("click", () => {
    let inputNombre = document.getElementById("input-nombre");
    var nombre = inputNombre.value;
    inputNombre.value = "";
    if (nombre.trim() === "") {
      nombre = "Batman";
    }
    spanNombreJugador.innerText = nombre;

    hidden(formNombre);
    show(menuOpciones);
  });

  btnCambiarNombre.addEventListener("click", () => {
    show(formNombre);
    hidden(menuOpciones);
  });

  btnJugar.addEventListener("click", async () => {
    hidden(divMenuPrincipal);
    await jugar();
    show(divPartida);
    show(divPreguntas);
  });

  btnReiniciar.addEventListener("click", () => {
    preguntas = [];
    preguntaActual = null;
    preguntasCorrectas = 0;
    preguntasIncorrectas = 0;
    clearInterval(intervaloPreguntaActual);
    clearTimeout(finIntervaloPreguntaActual);
    numeroPreguntaActual = 0;
    numeroPreguntasNumeroTotal = 0;
    resumenPreguntas = [];

    hidden(divResultados);
    show(divPreguntas);
    jugar();
  });

  btnCancelar.addEventListener("click", () => {
    preguntas = [];
    preguntaActual = null;
    preguntasCorrectas = 0;
    preguntasIncorrectas = 0;
    clearInterval(intervaloPreguntaActual);
    clearTimeout(finIntervaloPreguntaActual);
    numeroPreguntaActual = 0;
    numeroPreguntasNumeroTotal = 0;
    resumenPreguntas = [];

    hidden(divPartida);
    hidden(divPreguntas);
    hidden(divResultados);
    show(divMenuPrincipal);
  });

  btnOpciones.forEach((btnOpcion) => {
    btnOpcion.addEventListener("click", () => {
      evaluarResultado(btnOpcion);
    });
  });
});

async function jugar() {
  await buscarPreguntas();
  numeroPreguntaActual = 0;
  numeroPreguntasNumeroTotal = preguntas.length;
  spanPreguntaNumeroTotal.innerText = numeroPreguntasNumeroTotal;
  cargarSiguientePregunta();
}

function cargarSiguientePregunta() {
  let segundosDuracionPregunta = 10;
  preguntaActual = preguntas[numeroPreguntaActual];
  numeroPreguntaActual += 1;
  cargarPregunta(preguntaActual);
  spanTemporizador.textContent = segundosDuracionPregunta;
  intervaloPreguntaActual = setInterval(() => {
    segundosDuracionPregunta -= 1;
    spanTemporizador.textContent = segundosDuracionPregunta;
  }, 1000);

  setFinIntervaloPregunta();
}

function setFinIntervaloPregunta() {
  finIntervaloPreguntaActual = setTimeout(() => {
    clearInterval(intervaloPreguntaActual);
    armarResumenPregunta(false);
    if (numeroPreguntaActual >= numeroPreguntasNumeroTotal) {
      cargarResultados();
      return;
    }
    mostrarPreguntaCorrecta();
    setTimeout(() => {
      cargarSiguientePregunta();
    }, 1000);
  }, 10000);
}

function mostrarPreguntaCorrecta() {
  btnOpciones.forEach((btnOpcion) => {
    if (btnOpcion.value == preguntaActual.opcionCorrecta) {
      btnOpcion.classList.add("repuestaCorrecta");
    }
  });
}

function cargarPregunta(pregunta) {
  spanPreguntaNumeroActual.innerText = numeroPreguntaActual;
  pPreguntaTexto.innerText = pregunta.texto;

  for (let i = 0; i < btnOpciones.length; i++) {
    btnOpciones[i].classList.remove("repuestaCorrecta", "repuestaIncorrecta");
    btnOpciones[i].disabled = false;
    btnOpciones[i].title = pregunta.opciones[i].texto;
    spanOpciones[i].innerText = pregunta.opciones[i].texto;
  }
}

function evaluarResultado(btnOpcion) {
  btnOpciones.forEach((opcion) => (opcion.disabled = true));
  let resultado = btnOpcion.value == preguntaActual.opcionCorrecta;
  if (resultado) {
    btnOpcion.classList.add("repuestaCorrecta");
    preguntasCorrectas += 1;
  } else {
    mostrarPreguntaCorrecta();
    btnOpcion.classList.add("repuestaIncorrecta");
    preguntasIncorrectas += 1;
  }
  clearInterval(intervaloPreguntaActual);
  clearTimeout(finIntervaloPreguntaActual);

  armarResumenPregunta(resultado);

  setTimeout(() => {
    if (numeroPreguntaActual >= numeroPreguntasNumeroTotal) {
      cargarResultados();
      return;
    }

    cargarSiguientePregunta();
  }, 1000);
}

function cargarResultados() {
  hidden(divPreguntas);
  spanPreguntaTotal.textContent = numeroPreguntasNumeroTotal;
  spanResultadoPreguntasCorrectas.textContent = preguntasCorrectas;
  spanResultadoPreguntasIncorrectas.textContent = preguntasIncorrectas;
  let porcentaje = (preguntasCorrectas / numeroPreguntasNumeroTotal) * 100;
  let incremento = porcentaje / 100;
  let acumulador = 0;

  let setPorcentaje;

  setTimeout(() => {
    setPorcentaje = setInterval(() => {
      acumulador += incremento;
      spanResultadoPreguntasPorcentaje.textContent = acumulador.toFixed(1);
    }, 10);

    setTimeout(() => {
      clearInterval(setPorcentaje);
    }, 1000);
  }, 1000);

  if (porcentaje <= 50) {
    imgResultado.src = imagenes.tonto;
  }

  if (porcentaje > 50 && porcentaje < 90) {
    imgResultado.src = imagenes.inteligente;
  }

  if (porcentaje >= 90) {
    imgResultado.src = imagenes.genio;
  }

  let fragment = document.createDocumentFragment();
  resumenPreguntas.forEach((resumen) => {
    const element = document.createElement("div");
    element.innerHTML = resumen;
    fragment.appendChild(element);
  });
  divResumenesPreguntas.innerHTML = "";
  divResumenesPreguntas.appendChild(fragment);

  show(divResultados);
}

function armarResumenPregunta(resultado) {
  let html = `<div class="resumen-pregunta ${
    resultado ? "resumen-pregunta--correcta" : "resumen-pregunta--incorrecta"
  }">
                <span>Pregunta <span id="resumenes-preguntas__numero">${numeroPreguntaActual}</span></span>
                ${
                  resultado
                    ? '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"> <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>'
                    : '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/></svg>'
                }
              </div>`;

  resumenPreguntas.push(html);
}

async function buscarPreguntas() {
  let dataPreguntas = [];

  try {
    let response = await fetch("./js/preguntas.json");
    let json = await response.json();
    dataPreguntas = desordenarPreguntas(json.data);
  } catch (error) {
    console.log("Se produjo el siguiente error: ", error);
    console.log("Se cargaran unas preguntas por defecto, pero estas seran limitdas");
    dataPreguntas = [
      {
        numero: 1,
        texto: "¿Cuál es la capital de Francia?",
        opciones: [
          { numero: 1, texto: "Roma" },
          { numero: 2, texto: "Madrid" },
          { numero: 3, texto: "París" },
          { numero: 4, texto: "Berlín" },
        ],
        opcionCorrecta: 3,
      },
      {
        numero: 2,
        texto: "¿Cuál es el océano más grande del mundo?",
        opciones: [
          { numero: 1, texto: "Atlántico" },
          { numero: 2, texto: "Pacífico" },
          { numero: 3, texto: "Índico" },
          { numero: 4, texto: "Ártico" },
        ],
        opcionCorrecta: 1,
      },
      {
        numero: 3,
        texto: "¿En qué año se llevó a cabo la Revolución Francesa?",
        opciones: [
          { numero: 1, texto: "1789" },
          { numero: 2, texto: "1812" },
          { numero: 3, texto: "1856" },
          { numero: 4, texto: "1901" },
        ],
        opcionCorrecta: 1,
      },
      {
        numero: 4,
        texto: "¿Cuál es el país más grande del mundo en términos de superficie?",
        opciones: [
          { numero: 1, texto: "Rusia" },
          { numero: 2, texto: "Estados Unidos" },
          { numero: 3, texto: "Canadá" },
          { numero: 4, texto: "China" },
        ],
        opcionCorrecta: 1,
      },
      {
        numero: 5,
        texto: "¿Cuál es el autor de la novela 'Cien años de soledad'?",
        opciones: [
          { numero: 1, texto: "Gabriel García Márquez" },
          { numero: 2, texto: "Jorge Luis Borges" },
          { numero: 3, texto: "Julio Cortázar" },
          { numero: 4, texto: "Mario Vargas Llosa" },
        ],
        opcionCorrecta: 1,
      },
      {
        numero: 6,
        texto: "¿Cuál es el planeta más cercano al Sol?",
        opciones: [
          { numero: 1, texto: "Mercurio" },
          { numero: 2, texto: "Venus" },
          { numero: 3, texto: "Marte" },
          { numero: 4, texto: "Júpiter" },
        ],
        opcionCorrecta: 1,
      },
      {
        numero: 7,
        texto: "¿Cuál es el río más largo del mundo?",
        opciones: [
          { numero: 1, texto: "Amazonas" },
          { numero: 2, texto: "Nilo" },
          { numero: 3, texto: "Yangtsé" },
          { numero: 4, texto: "Misisipi" },
        ],
        opcionCorrecta: 2,
      },
      {
        numero: 8,
        texto: "¿Cuál es la montaña más alta del mundo?",
        opciones: [
          { numero: 1, texto: "Monte Everest" },
          { numero: 2, texto: "Monte Kilimanjaro" },
          { numero: 3, texto: "Monte Aconcagua" },
          { numero: 4, texto: "Monte McKinley" },
        ],
        opcionCorrecta: 1,
      },
      {
        numero: 9,
        texto: "¿Quién pintó la Mona Lisa?",
        opciones: [
          { numero: 1, texto: "Leonardo da Vinci" },
          { numero: 2, texto: "Pablo Picasso" },
          { numero: 3, texto: "Vincent van Gogh" },
          { numero: 4, texto: "Michelangelo" },
        ],
        opcionCorrecta: 1,
      },
      {
        numero: 10,
        texto: "¿Cuál es el elemento químico con el número atómico 6?",
        opciones: [
          { numero: 1, texto: "Oxígeno" },
          { numero: 2, texto: "Carbono" },
          { numero: 3, texto: "Nitrógeno" },
          { numero: 4, texto: "Hidrógeno" },
        ],
        opcionCorrecta: 2,
      },
    ];
  }

  let i = 0;
  dataPreguntas.forEach((p) => {
    i++;
    preguntas.push(
      new Pregunta(
        (numero = p.numero),
        (texto = p.texto),
        (opciones = obtenerArrayJsonOpciones(p.opciones)),
        (opcionCorrecta = p.opcionCorrecta)
      )
    );
  });
}

function obtenerArrayJsonOpciones(jsonOpciones) {
  let opciones = [];
  jsonOpciones.forEach((opcion) => {
    opciones.push(new Opcion(opcion.numero, opcion.texto));
  });
  return opciones;
}

function desordenarPreguntas(preguntas) {
  for (let i = preguntas.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [preguntas[i], preguntas[j]] = [preguntas[j], preguntas[i]];
  }
  return preguntas;
}

function show(element) {
  // element.style.transform = "translateX(0)";

  element.classList.remove("hidden");
  element.classList.add("show");
}

function hidden(element) {
  //element.style.transform = "translateX(-1000%)";
  element.classList.remove("show");
  element.classList.add("hidden");
}
