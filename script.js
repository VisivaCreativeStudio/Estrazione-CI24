var estrazioneEffettuata = false;

function estraiNumero(event) {
    var dataPremio = event.currentTarget.getAttribute('data-premio');

    // Aggiungi un log per verificare l'esecuzione della funzione
    console.log('Estrazione in corso per il premio: ', dataPremio);

    if (!estrazioneEffettuata) {
        var nuovoNumero = generaNumero();
        console.log('Numero estratto: ', nuovoNumero);

        // Mostra il numero in stile slot machine
        animaNumeroSlot(dataPremio, nuovoNumero);

        // Aggiungi animazione dei coriandoli con un ritardo di 500 ms
        setTimeout(avviaConfetti, 500);

        // Salva il numero estratto in un cookie
        Cookies.set("numero_estratto" + dataPremio, nuovoNumero);

        estrazioneEffettuata = true;
    } else {
        alert("Hai già estratto un numero per questa pagina!");
    }
}

function generaNumero() {
    return Math.floor(Math.random() * 2000).toString().padStart(4, '0');
}

function animaNumeroSlot(dataPremio, numeroFinale) {
    var numeroContainer = document.getElementById("numero" + dataPremio);
    var slotInterval;
    var step = 0;

    console.log('Avvio animazione slot per il numero: ', numeroFinale);

    // Avvia l'animazione del numero in stile slot machine
    slotInterval = setInterval(() => {
        if (step < numeroFinale.length) {
            // Aggiorna il contenitore con una cifra alla volta
            numeroContainer.innerText = numeroFinale.slice(0, step + 1) + getRandomDigits(numeroFinale.length - step - 1);
            step++;
        } else {
            // Quando l'animazione è completa, mostra il numero finale e ferma l'intervallo
            numeroContainer.innerText = numeroFinale;
            clearInterval(slotInterval);
            console.log('Animazione completata per il numero: ', numeroFinale);
        }
    }, 100); // Cambia cifra ogni 100 ms
}

function getRandomDigits(length) {
    let randomDigits = '';
    for (let i = 0; i < length; i++) {
        randomDigits += Math.floor(Math.random() * 10); // Cifra casuale (0-9)
    }
    return randomDigits;
}

function avviaConfetti() {
    console.log('Avvio animazione confetti...');
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: 0.5, y: 0.5 } // Centro dello schermo
    });
}

function mostraNumeri() {
    for (var i = 1; i <= 3; i++) {
        var numeroEstratto = Cookies.get("numero_estratto" + i);
        if (numeroEstratto) {
            var numeroContainer = document.getElementById("numero" + i);
            numeroContainer.innerText = numeroEstratto;
        }
    }
}

function resetNumeri() {
    for (var i = 1; i <= 3; i++) {
        Cookies.remove("numero_estratto" + i);
        var numeroContainer = document.getElementById("numero" + i);
        numeroContainer.innerText = '';
    }
    estrazioneEffettuata = false;
}

document.addEventListener("DOMContentLoaded", mostraNumeri);
document.getElementById("reset").addEventListener("click", resetNumeri);
