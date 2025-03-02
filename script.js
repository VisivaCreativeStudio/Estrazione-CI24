let numeriDisponibili = Array.from({ length: 3001 }, (_, i) => i.toString().padStart(4, '0'));

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
    var nuovoNumero = generaNumero();

    if (nuovoNumero === null) return; 

    console.log('Numero estratto: ', nuovoNumero);

    animaNumeroSlot(dataPremio, nuovoNumero);
    setTimeout(avviaConfetti, 500);

    // Salva il numero estratto in un cookie (sovrascrive sempre il precedente)
    Cookies.set("numero_estratto" + dataPremio, nuovoNumero);
}

function animaNumeroSlot(dataPremio, numeroFinale) {
    var numeroContainer = document.getElementById("numero" + dataPremio);
    var slotInterval;
    var step = 0;

    console.log('Avvio animazione slot per il numero: ', numeroFinale);

    slotInterval = setInterval(() => {
        if (step < numeroFinale.length) {
            numeroContainer.innerText = numeroFinale.slice(0, step + 1) + getRandomDigits(numeroFinale.length - step - 1);
            step++;
        } else {
            numeroContainer.innerText = numeroFinale;
            clearInterval(slotInterval);
            console.log('Animazione completata per il numero: ', numeroFinale);
        }
    }, 300); 
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
    var currentEstrazione = document.getElementById("estrazione" + (premio - 1));
    currentEstrazione.style.display = 'none';

    var nextEstrazione = document.getElementById("estrazione" + premio);
    nextEstrazione.style.display = 'block';

    nextEstrazione.classList.add('show');
    
    setTimeout(function() {
        nextEstrazione.classList.remove('show');
    }, 500);
}

function resetNumeri() {
    for (var i = 1; i <= 3; i++) {
        Cookies.remove("numero_estratto" + i);
        var numeroContainer = document.getElementById("numero" + i);
        numeroContainer.innerText = '';
    }

    numeriDisponibili = Array.from({ length: 3001 }, (_, i) => i.toString().padStart(4, '0'));

    for (let i = numeriDisponibili.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numeriDisponibili[i], numeriDisponibili[j]] = [numeriDisponibili[j], numeriDisponibili[i]];
    }
    console.log("Numeri resettati!");
}

document.addEventListener("DOMContentLoaded", mostraNumeri);
document.getElementById("reset").addEventListener("click", resetNumeri);
