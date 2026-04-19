// ===========================
// Storage Keys
// ===========================
const KEY_USED = 'ci24_used';
const KEY_WIN  = (n) => `ci24_winner_${n}`;

// ===========================
// Pool Management
// ===========================

function getTuttiINumeri() {
    // Range: 0001–4000
    return Array.from({ length: 4000 }, (_, i) => (i + 1).toString().padStart(4, '0'));
}

function getUsedNumbers() {
    try {
        return JSON.parse(localStorage.getItem(KEY_USED) || '[]');
    } catch (e) { return []; }
}

function addUsedNumber(n) {
    const used = getUsedNumbers();
    if (!used.includes(n)) {
        used.push(n);
        localStorage.setItem(KEY_USED, JSON.stringify(used));
    }
}

function getPool() {
    const used = new Set(getUsedNumbers());
    return getTuttiINumeri().filter(function(n) { return !used.has(n); });
}

function estraiCasuale() {
    const pool = getPool();
    if (pool.length === 0) return null;

    // crypto.getRandomValues()
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const idx = array[0] % pool.length;

    return pool[idx];
}

// ===========================
// Winner Management
// ===========================

function getWinner(premio) {
    return localStorage.getItem(KEY_WIN(premio));
}

function setWinner(premio, numero) {
    localStorage.setItem(KEY_WIN(premio), numero);
}

// ===========================
// Reset
// ===========================

function resetTutto() {
    localStorage.removeItem(KEY_USED);
    for (var i = 1; i <= 3; i++) {
        localStorage.removeItem(KEY_WIN(i));
    }
    console.log('Reset completato. Pool ripristinato: 0001–4000 (4000 numeri).');
}

// ===========================
// Estrazione UI Init
// ===========================

var numeroCorrente = null;

function initEstrazioneUI(premioNum) {
    var estraiBtn    = document.getElementById('estraiButton');
    var confermaBtn  = document.getElementById('confermaButton');
    var riestraiBtn  = document.getElementById('riestraiButton');
    var prossimaLink = document.getElementById('prossimaLink');
    var numeroEl     = document.getElementById('numero' + premioNum);
    var poolInfo     = document.getElementById('poolInfo');

    if (!estraiBtn) return;

    // Aggiorna il contatore pool disponibile
    function aggiornaPoolInfo() {
        if (poolInfo) {
            var rimasti = getPool().length;
            poolInfo.innerText = 'Numeri disponibili: ' + rimasti + ' / 4000';
        }
    }
    aggiornaPoolInfo();

    // Se c'è già un vincitore confermato per questo premio, mostra
    var winner = getWinner(premioNum);
    if (winner) {
        if (numeroEl) numeroEl.innerText = winner;
        estraiBtn.disabled = true;
        if (prossimaLink) prossimaLink.style.display = 'inline-block';
        if (confermaBtn)  confermaBtn.style.display  = 'none';
        if (riestraiBtn)  riestraiBtn.style.display  = 'none';
        return;
    }

    // ---- Estrai ----
    estraiBtn.addEventListener('click', function() {
        var numero = estraiCasuale();
        if (!numero) {
            alert('Tutti i 4000 numeri sono stati estratti!');
            return;
        }

        // Segna subito come usato - non verrà mai più estratto (neanche per altri premi)
        addUsedNumber(numero);
        numeroCorrente = numero;

        if (numeroEl) numeroEl.innerText = numero;
        aggiornaPoolInfo();

        // disabilita Estrai, mostra Conferma e Ri-estrai
        estraiBtn.disabled = true;
        if (confermaBtn)  confermaBtn.style.display  = 'inline-block';
        if (riestraiBtn)  riestraiBtn.style.display  = 'inline-block';
        if (prossimaLink) prossimaLink.style.display = 'none';

        avviaConfetti();
    });

    // ---- Conferma vincitore ----
    if (confermaBtn) {
        confermaBtn.addEventListener('click', function() {
            if (!numeroCorrente) return;

            setWinner(premioNum, numeroCorrente);

            confermaBtn.style.display = 'none';
            riestraiBtn.style.display = 'none';
            if (prossimaLink) prossimaLink.style.display = 'inline-block';
        });
    }

    // ---- Ri-estrai (numero non venduto) ----
    if (riestraiBtn) {
        riestraiBtn.addEventListener('click', function() {
            // Il numero corrente è già in "used" e non uscirà mai più
            var nuovoNumero = estraiCasuale();
            if (!nuovoNumero) {
                alert('Tutti i 4000 numeri sono stati estratti!');
                return;
            }

            addUsedNumber(nuovoNumero);
            numeroCorrente = nuovoNumero;

            if (numeroEl) numeroEl.innerText = nuovoNumero;
            aggiornaPoolInfo();

            avviaConfetti();
            // Conferma e Ri-estrai restano visibili per il nuovo numero
        });
    }
}

// ===========================
// Riepilogo
// ===========================

function mostraRiepilogo() {
    for (var i = 1; i <= 3; i++) {
        var winner = getWinner(i);
        var el = document.getElementById('numero' + i);
        if (el && winner) {
            el.innerText = winner;
        } else if (el) {
            el.innerText = '—';
        }
    }
}

// ===========================
// Confetti
// ===========================

function avviaConfetti() {
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 120,
            spread: 80,
            origin: { x: 0.5, y: 0.5 }
        });
    }
}

// ===========================
// DOMContentLoaded
// ===========================

document.addEventListener('DOMContentLoaded', function() {

    // Pagina estrazione
    var estraiBtn = document.getElementById('estraiButton');
    if (estraiBtn) {
        var premioNum = parseInt(estraiBtn.getAttribute('data-premio'));
        initEstrazioneUI(premioNum);
    }

    // Pagina riepilogo
    if (document.querySelector('.container')) {
        mostraRiepilogo();
    }

    // Reset da index
    var resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Vuoi resettare tutte le estrazioni? Tutti i dati salvati verranno eliminati.')) {
                resetTutto();
                window.location.reload();
            }
        });
    }
});
