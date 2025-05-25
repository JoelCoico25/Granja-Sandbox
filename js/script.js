const semillas = {
  trigo: {
    y: 0, // row
    sprites: {
      plantado: 0, // column    
      regada: 1,      
      creciendo: 2,   
      listo: 3        
    }
  },
  zanahoria: {
    y: 1, 
    sprites: {
      plantado: 0,
      regada: 1,
      creciendo: 2,
      listo: 3
    }
  },
  remolacha: {
    y: 2, 
    sprites: {
      plantado: 0,
      regada: 1,
      creciendo: 2,
      listo: 3
    }
  },
  patata: {
    y: 3, 
    sprites: {
      plantado: 0,
      regada: 1,
      creciendo: 2,
      listo: 3
    }
  },
};

const celdaEstado = new Map();
const gridGranja = document.getElementById("granja");
const gridInventario = document.getElementById("inventario");
const selector = document.getElementById("selector-semilla");
let modo = "plantar";

/**
 * Create grid for the farm.
 * @param {number} filas - Number of rows in the farm.
 * @param {number} columnas - Number of columns in the farm.
 */
function crearGranja(filas, columnas) {
  for (let i = 0; i < filas * columnas; i++) {
    const celda = document.createElement("div");
    celda.className = "celda";
    celda.dataset.estado = "vacia";
    celda.dataset.index = i;
    celda.addEventListener("click", () => interactuarCelda(celda));
    gridGranja.appendChild(celda);
    celdaEstado.set(i, { estado: "vacia", semilla: null });
  }
}

/**
 * Create grid for the inventory.
 * @param {number} filas - Number of rows in the inventory.
 * @param {number} columnas - Number of columns in the inventory.
 */
function crearInventario(filas, columnas) {
  for (let i = 0; i < filas * columnas; i++) {
    const celda = document.createElement("div");
    celda.className = "celda";
    celda.dataset.index = i;
    gridInventario.appendChild(celda);
  }
}

/**
 * Manage interaction with the farm cells.
 * @param {HTMLElement} celda - The cell element in the DOM.
 * @returns {void}
 */
function interactuarCelda(celda) {
  const index = parseInt(celda.dataset.index);
  const info = celdaEstado.get(index);
  const semillaSeleccionada = selector.value;

  if (modo === "plantar" && info.estado === "vacia") {
    const { y, sprites } = semillas[semillaSeleccionada];
    const colIndex = sprites.plantado;
    celda.style.backgroundImage = "url('assets/images/semillas.png')";
    celda.style.backgroundPosition = `-${colIndex * 64}px -${y * 64}px`;
    info.estado = "plantado";
    info.semilla = semillaSeleccionada;
    celda.style.border = "1px solid #555";
    console.log(`Plantado ${semillaSeleccionada} en celda ${index}. Posición: -${colIndex * 64}px -${y * 64}px`);

  } else if (modo === "regar" && info.estado === "plantado") {
    const { y, sprites } = semillas[info.semilla];
    const colIndex = sprites.regada;
    celda.style.backgroundPosition = `-${colIndex * 64}px -${y * 64}px`;
    info.estado = "regada";
    celda.style.border = "2px solid #0cf"; // Blue border to indicate it's watered
    //console.log(`Regado ${info.semilla} en celda ${index}. Posición: -${colIndex * 64}px -${y * 64}px`);
    // After 2 seconds, start growing the plant
    setTimeout(() => crecer(celda, index), 2000);

  } else if (modo === "cosechar" && info.estado === "listo") {
    celda.style.backgroundImage = "none";
    celda.style.border = "1px solid #555"; // Border reset
    info.estado = "vacia";
    info.semilla = null;
    console.log(`Cosechado en celda ${index}.`);
  }
}

/**
 * Manages the growth of the plant in the cell.
 * This function is called after the cell has been watered.
 * @param {HTMLElement} celda - The cell element in the DOM.
 * @param {number} index - The index of the cell in the grid.
 * @returns {void}
 */
function crecer(celda, index) {
  const info = celdaEstado.get(index);
  if (info.estado === "regada") {
    const { y, sprites } = semillas[info.semilla];
    let colIndex = sprites.creciendo;
    celda.style.backgroundPosition = `-${colIndex * 64}px -${y * 64}px`;
    info.estado = "creciendo"; // Estado intermedio de crecimiento
    console.log(`Creciendo (etapa 1) ${info.semilla} en celda ${index}. Posición: -${colIndex * 64}px -${y * 64}px`);

    // A small delay to simulate growth
    setTimeout(() => {
      if (info.estado === "creciendo") {
        // Get the row (y) and column index for the final 'listo' state
        colIndex = sprites.listo;
        celda.style.backgroundPosition = `-${colIndex * 64}px -${y * 64}px`;
        info.estado = "listo";
        celda.style.border = "2px solid #0c0"; // Green border to indicate it's ready for harvest
        //console.log(`Creciendo (lista) ${info.semilla} en celda ${index}. Posición: -${colIndex * 64}px -${y * 64}px`);
      }
    }, 500); // Delay to simulate the growth time
  }
}

const botones = {
  plantar: document.getElementById("accion-plantar"),
  regar: document.getElementById("accion-regar"),
  cosechar: document.getElementById("accion-cosechar"),
};

// Asign event listeners to the buttons
Object.entries(botones).forEach(([modoBtn, btn]) => {
  btn.addEventListener("click", () => {
    modo = modoBtn;
    Object.values(botones).forEach(b => b.style.backgroundColor = "#fff");
    btn.style.backgroundColor = "#ff0";
  });
});


crearGranja(5, 5);
crearInventario(1, 9);

const audio = new Audio("/assets/audio/music_granja.mp3");
const botonSonido = document.getElementById("music");

botonSonido.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    botonSonido.style.backgroundImage = "url('/assets/images/pause.svg')";
    audio.volume = 0.3; // Posible mejora de ajuste de volumen, a futuro puede ser un slider
  } else {
    audio.pause();
    botonSonido.style.backgroundImage = "url('/assets/images/play.svg')";
  }
});


botonSonido.addEventListener("ended", () => {
  audio.currentTime = 0;
  botonSonido.style.backgroundImage = "url('/assets/images/music.svg')";
});