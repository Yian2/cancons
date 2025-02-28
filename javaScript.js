window.onload = function () {
    createStructure();
    // Totes les imatges
    const imatges = document.querySelectorAll('.carousel img');
    let imgAct = 0; // Imatge actual
  
    // Botons de navegació
    const botoPrev = document.getElementById("botoPrev");
    const botoNext = document.getElementById("botoNext");
  
    // Funció per actualitzar la imatge visible
    function mostraImatge(index) {
      imatges.forEach((img, i) => {
        img.style.display = i === index ? 'block' : 'none'; // Només mostra la imatge actual
      });
    }
  
    // Mostrar la primera imatge inicialment
    mostraImatge(imgAct);
    
    // Navegació a la imatge anterior
    botoPrev.addEventListener("click", function (e) {
      e.preventDefault();
      imgAct = imgAct > 0 ? imgAct - 1 : imatges.length - 1; // Si és la primera, torna a l'última
      mostraImatge(imgAct);
    });
  
    // Navegació a la imatge següent
    botoNext.addEventListener("click", function (e) {
      e.preventDefault();
      imgAct = imgAct < imatges.length - 1 ? imgAct + 1 : 0; // Si és l'última, torna a la primera
      mostraImatge(imgAct);
    });

    // Moure el carrusel amb el teclat
    document.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft") {
            imgAct = imgAct > 0 ? imgAct - 1 : imatges.length - 1;
        } else if (e.key === "ArrowRight") {
            imgAct = imgAct < imatges.length - 1 ? imgAct + 1 : 0;
        }
        mostraImatge(imgAct);
    });

};

function createStructure(){
  content.albums.forEach(
    (album, i) => {
     let carousel = document.getElementsByClassName('carousel')[0];
     let img = document.createElement('img');
     img.setAttribute('alt', album.name);
     img.setAttribute('src', "img/"+album.cover);
     let a = document.createElement('a');
     a.setAttribute('href', "reproductor.html?album="+i);
     a.appendChild(img);
     carousel.appendChild(a);
    }
  )
}


