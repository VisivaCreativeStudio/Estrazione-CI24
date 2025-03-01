let estrazioneEffettuata = [false, false, false]; // Un array per tenere traccia dell'estrazione per ciascun premio



// Array di numeri da escludere (puoi modificarlo a piacere)
let numeriEsclusi = ["0005", "0123", "2500"]; // Esempio: escludi questi numeri

// Genera array di numeri disponibili escludendo quelli specificati
let numeriDisponibili = Array.from({ length: 3001 }, (_, i) => i.toString().padStart(4, '0'))
    .filter(num => !numeriEsclusi.includes(num)); // Rimuove i numeri esclusi

// Mescola i numeri usando Fisher-Yates Shuffle
for (let i = numeriDisponibili.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numeriDisponibili[i], numeriDisponibili[j]] = [numeriDisponibili[j], numeriDisponibili[i]];
}

function generaNumero() {
    if (numeriDisponibili.length === 0) {
        alert("Tutti i numeri sono stati estratti!");
        return null; 
    }
    return numeriDisponibili.pop(); 
}

function estraiNumero(event) {
    var dataPremio = event.currentTarget.getAttribute('data-premio');
    var premioIndex = dataPremio - 1; 

    console.log('Estrazione in corso per il premio: ', dataPremio);

    if (!estrazioneEffettuata[premioIndex]) {
        var nuovoNumero = generaNumero();

        if (nuovoNumero === null) return; 

        console.log('Numero estratto: ', nuovoNumero);

        animaNumeroSlot(dataPremio, nuovoNumero);


        setTimeout(avviaConfetti, 500);

        // Salva il numero estratto in un cookie
        Cookies.set("numero_estratto" + dataPremio, nuovoNumero);

        estrazioneEffettuata[premioIndex] = true;
    } else {
        alert("Hai già estratto un numero per questo premio!");
    }
}

function animaNumeroSlot(dataPremio, numeroFinale) {
    var numeroContainer = document.getElementById("numero" + dataPremio);
    var slotInterval;
    var step = 0;

    console.log('Avvio animazione slot per il numero: ', numeroFinale);


    slotInterval = setInterval(() => {
        if (step < numeroFinale.length) {
            // Aggiorna il contenitore con una cifra alla volta
            numeroContainer.innerText = numeroFinale.slice(0, step + 1) + getRandomDigits(numeroFinale.length - step - 1);
            step++;
        } else {

            numeroContainer.innerText = numeroFinale;
            clearInterval(slotInterval);
            console.log('Animazione completata per il numero: ', numeroFinale);
        }
    }, 300); // Cambia cifra ogni 300 ms
}

function getRandomDigits(length) {
    let randomDigits = '';
    for (let i = 0; i < length; i++) {
        randomDigits += Math.floor(Math.random() * 10);
    }
    return randomDigits;
}

function avviaConfetti() {
    console.log('Avvio animazione confetti...');
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: 0.5, y: 0.5 }
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

function vaiAllaProssimaEstrarzione(premio) {
    // Nascondi il blocco attuale
    var currentEstrazione = document.getElementById("estrazione" + (premio - 1));
    currentEstrazione.style.display = 'none';

    // Mostra il blocco successivo
    var nextEstrazione = document.getElementById("estrazione" + premio);
    nextEstrazione.style.display = 'block';

    // Aggiungi animazione di transizione
    nextEstrazione.classList.add('show');
    
    // Durata animazione
    setTimeout(function() {
        nextEstrazione.classList.remove('show');
    }, 500); // durata dell'animazione
}

function resetNumeri() {
    for (var i = 1; i <= 3; i++) {
        Cookies.remove("numero_estratto" + i);
        var numeroContainer = document.getElementById("numero" + i);
        numeroContainer.innerText = '';
    }
    estrazioneEffettuata = [false, false, false];

    // Reimposta l'array numeriDisponibili
    numeriDisponibili = Array.from({ length: 3001 }, (_, i) => i.toString().padStart(4, '0'));

    // Mescola di nuovo i numeri
    for (let i = numeriDisponibili.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numeriDisponibili[i], numeriDisponibili[j]] = [numeriDisponibili[j], numeriDisponibili[i]];
    }
    console.log("Numeri resettati!");
}

document.addEventListener("DOMContentLoaded", mostraNumeri);
document.getElementById("reset").addEventListener("click", resetNumeri);

