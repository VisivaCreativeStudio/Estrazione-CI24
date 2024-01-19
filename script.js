// script.js

var estrazioneEffettuata = false;

function estraiNumero(event) {
    var dataPremio = event.currentTarget.getAttribute('data-premio');

    if (!estrazioneEffettuata) {
        var nuovoNumero = generaNumero();
        animaNumero(dataPremio, nuovoNumero);
        // salva il numero estratto in un cookie con il nome "numero_estratto" + dataPremio
        Cookies.set("numero_estratto" + dataPremio, nuovoNumero);
        estrazioneEffettuata = true;
    } else {
        alert("Hai già estratto un numero per questa pagina!");
    }
}


function animaNumero(dataPremio, numero) {
    var numeroContainer = document.getElementById("numero" + dataPremio);
    numeroContainer.innerText = numero;
}

function generaNumero() {
    return Math.floor(Math.random() * 2000).toString().padStart(4, '0');
}

function mostraNumeri() {
    // per ogni premio da 1 a 3
    for (var i = 1; i <= 3; i++) {
        // leggi il cookie con il nome "numero_estratto" + i
        var numeroEstratto = Cookies.get("numero_estratto" + i);
        // se il cookie esiste, mostra il numero nell'h1 con l'id "numero" + i
        if (numeroEstratto) {
            var h1 = document.getElementById("numero" + i);
            h1.innerText = numeroEstratto;
        }
    }
}


// quando la pagina di riepilogo viene caricata, chiama la funzione mostraNumeri
document.addEventListener("DOMContentLoaded", mostraNumeri);


// Chiamata alla funzione resetNumeri quando viene cliccato il link di reset
document.getElementById("reset").addEventListener("click", resetNumeri);

// Funzione per azzerare i numeri estratti salvati nei cookie
function resetNumeri() {
    // Per ogni premio da 1 a 3
    for (var i = 1; i <= 3; i++) {
        // Elimina il cookie con il nome "numero_estratto" + i
        Cookies.remove("numero_estratto" + i);

        // Pulisci il testo dell'h1 con l'id "numero" + i
        var h1 = document.getElementById("numero" + i);
        h1.innerText = '';
    }

    // Reimposta il flag di estrazione
    estrazioneEffettuata = false;
}



