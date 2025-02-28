
let albumActual; // aquí el álbum actual

window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);
  albumActual = urlParams.get('album');
  createStructureAudio();
};

function createStructureAudio() {
  const catalog = document.getElementById('catalog');
  catalog.innerHTML = ""; // Limpia el contenido anterior

  if (!content.albums[albumActual] || !content.albums[albumActual].songs) {
    console.error("Error: El álbum o las canciones no están disponibles.");
    return;
  }

  content.albums[albumActual].songs.forEach(song => {
    let songContainer = document.createElement('div');
    songContainer.classList.add('song');

    let title = document.createElement('h3');
    title.innerText = song.title;

    // ft a la cançp
    let songImage = createSongImage(song);
    songContainer.appendChild(songImage); // Agregar la imagen al contenedor de la canción

    let audio = new Audio('audios/' + song.canco);

    // Obtener el tiempo guardat de la canço actual
    let savedTime = getSavedTime(albumActual, song.id - 1);
    audio.currentTime = savedTime; // posar el tems actual del audio desdel localStorage

    let controls = createCustomControls(audio);
    let speedButtons = createSpeedButtons(audio);
    let progressBar = createProgressBar(audio, albumActual, song.id - 1);

    songContainer.appendChild(title);
    songContainer.appendChild(controls);
    songContainer.appendChild(progressBar);
    songContainer.appendChild(speedButtons);
    catalog.appendChild(songContainer);
  });
}


// progresbar
function createProgressBar(audio, albumActual, songActual) {
  let progressContainer = document.createElement('div');
  progressContainer.classList.add('progress-container');

  let progressBar = document.createElement('div');
  progressBar.classList.add('progress-bar');

  // minutss
  let timeDisplay = document.createElement('span');
  timeDisplay.classList.add('time-display');
  timeDisplay.innerText = "00:00 / 00:00"; // Valor inicial

  progressContainer.appendChild(progressBar);
  progressContainer.appendChild(timeDisplay); // Agregar el tiemps

  // temps format
  function formatTime(seconds) {
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);
    return min + ':' + sec.toString().padStart(2, '0'); // Asegurar format al 0:00
  }

  // asegurar q shagui carregat del tot
  audio.addEventListener('loadedmetadata', () => {
    if (!isNaN(audio.duration) && audio.duration > 0) {
      // temps inicial - duracio
      timeDisplay.innerText = formatTime(audio.currentTime) + ' / ' + formatTime(audio.duration);
    }
  });

  // Actualiza la barra 
  audio.ontimeupdate = () => {
    let percent = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = percent + "%";
    timeDisplay.innerText = formatTime(audio.currentTime) + ' / ' + formatTime(audio.duration);

    // Guardar el progres en localStorage
    saveProgress(albumActual, songActual, audio.currentTime);
    console.log(`Guardando tiempo de reproducción: ${audio.currentTime} segundos para la canción ${songActual}`); // Log del tiempo guardado
  
  };

  // boto per avançar i revobinar
  progressContainer.onclick = (event) => {
    let rect = progressContainer.getBoundingClientRect();
    let clickX = event.clientX - rect.left;
    let percent = clickX / rect.width;
    audio.currentTime = percent * audio.duration;
  };

  return progressContainer;
}

// Funció pper obtenir el temps guardat del localStorage
function getSavedTime(album, song) {
  let savedData = JSON.parse(localStorage.getItem('reproduction')) || { times: [] };
  return savedData.times?.[album]?.[song] || 0; // Devuelve 0 si no hi h ares guardat
}

// Funcióper guardar el progres al local storage
function saveProgress(album, song, time) {
  let savedData = JSON.parse(localStorage.getItem('reproduction')) || { times: [] };

  if (!savedData.times[album]) {
    savedData.times[album] = [];
  }
  savedData.times[album][song] = time;

  localStorage.setItem('reproduction', JSON.stringify(savedData));
}

// Funció (Play, Pause, Stop)
function createCustomControls(audio) {
  let controlsDiv = document.createElement('div');
  controlsDiv.classList.add('custom-controls');

  let playButton = document.createElement('button');
  playButton.innerHTML = "&#9654;"; // Icono Play
  playButton.onclick = () => audio.play();

  let pauseButton = document.createElement('button');
  pauseButton.innerHTML = "&#9208;"; // Icono Pause
  pauseButton.onclick = () => audio.pause();

  let stopButton = document.createElement('button');
  stopButton.innerHTML = "&#9209;"; // Icono Stop
  stopButton.onclick = () => {
    audio.pause();
    audio.currentTime = 0; // Reinicia el tiempo
  };

  controlsDiv.appendChild(playButton);
  controlsDiv.appendChild(pauseButton);
  controlsDiv.appendChild(stopButton);

  return controlsDiv;
}

// Función que crea los boto de velocitat
function createSpeedButtons(audio) {
  let speedButtons = document.createElement('div');
  speedButtons.classList.add('speed-buttons');

  let speeds = [0.5, 1, 1.5];
  speeds.forEach(speed => {
    let button = document.createElement('button');
    button.innerText = `x${speed}`;
    button.onclick = () => {
      audio.playbackRate = speed;
    };
    speedButtons.appendChild(button);
  });

  return speedButtons;
}

function createSongImage(song) {
  let img = document.createElement('img');
  img.src = 'fotos/' + song.ft; 
  img.alt = song.title;
  img.classList.add('song-image'); 
  return img;
}








//js de la llista de preferits
const table = document.getElementById('songs');
		const inputTitle = document.getElementById('title');
		const inputStars = document.getElementById('stars');

		let songsArray = localStorage.getItem('songs') ? 
			JSON.parse(localStorage.getItem('songs')) : [];

		songsArray.forEach(addSong);

		function addSong(element) {
			const node = document.querySelector("#toClone tr");
			const newRow = node.cloneNode(true);
			const cells = newRow.querySelectorAll("td");
			cells[0].textContent = element.title;
			cells[1].textContent = element.stars;
			table.appendChild(newRow);
		}

		function add() {
			if (inputTitle.value.length > 0) {
				let newElement = { title: inputTitle.value, stars: inputStars.value };
				songsArray.push(newElement);
				localStorage.setItem('songs', JSON.stringify(songsArray));
				addSong(newElement);
				inputTitle.value = '';
				inputStars.value = '';
			}
		}

		function del() {
			if (confirm("¿Borrar todas las canciones y vaciar la lista?")) {
				localStorage.clear();
				const rows = table.childNodes;
				for (let i = rows.length - 1; i > 1; i--) {
					table.removeChild(rows[i]);
				}
				songsArray = [];
			}
    }