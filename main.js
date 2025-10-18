document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('rachaBtn');
    if (!btn) return;

    // etiquetas disponibles (se añade el texto inicial si no está)
    const preset = ['la racha', 'Toca aquí', 'estamos', 'perdiendo'];
    const initialText = btn.textContent.trim();
    const labels = preset.includes(initialText) ? preset.slice() : [initialText, ...preset];
    let idx = labels.indexOf(initialText);
    if (idx === -1) idx = 0;
    let moveForward = true; // alterna entre ir al siguiente o volver al anterior

    function createStars(x, y, count = 8) {
        const colors = ['#FFD700', '#ff0000ff', '#00ff22ff', '#0308ffff', '#9000ffff', '#ff008cff', '#00ffddff', '#ff0066ff'];
        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.textContent = '★';

            const size = 12 + Math.random() * 14;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.fontSize = `${size}px`;

            const color = colors[Math.floor(Math.random() * colors.length)];
            star.style.color = color;
            star.style.opacity = '1';

            star.style.left = `${x - size / 2}px`;
            star.style.top = `${y - size / 2}px`;

            const dx = Math.round((Math.random() - 0.5) * 160);
            star.style.setProperty('--dx', `${dx}px`);

            const dur = 1400 + Math.round(Math.random() * 1000);
            const delay = Math.round(Math.random() * 300);
            star.style.animationDuration = `${dur}ms`;
            star.style.animationDelay = `${delay}ms`;

            document.body.appendChild(star);
            star.addEventListener('animationend', () => star.remove());
        }
    }

    function handlePointer(e) {
        // actualizar índice según dirección actual (alternante)
        if (moveForward) {
            idx = (idx + 1) % labels.length;
        } else {
            idx = (idx - 1 + labels.length) % labels.length;
        }
        moveForward = !moveForward;

        // aplicar texto
        btn.textContent = labels[idx];

        // posición del toque/clic
        let x, y;
        if (e.type === 'touchstart') {
            const t = e.touches[0];
            x = t.clientX;
            y = t.clientY;
            e.preventDefault();
        } else {
            x = e.clientX;
            y = e.clientY;
        }
        createStars(x, y, 10);
    }

    btn.addEventListener('click', handlePointer);
    btn.addEventListener('touchstart', handlePointer, { passive: false });
});

// Bloqueo básico de inspección (no infalible)
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
}, { passive: false });

document.addEventListener('keydown', function (e) {
    // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) || (e.ctrlKey && e.key === 'U')) {
        e.preventDefault();
    }
});

// Detección sencilla de DevTools (heurística)
(function () {
    const THRESHOLD = 160;
    function devtoolsOpen() {
        return (window.outerWidth - window.innerWidth) > THRESHOLD || (window.outerHeight - window.innerHeight) > THRESHOLD;
    }
    let wasOpen = devtoolsOpen();
    setInterval(() => {
        const openNow = devtoolsOpen();
        if (openNow && !wasOpen) {
            // acción al abrir: ocultar contenido (o redirigir)
            document.documentElement.style.display = 'none';
        } else if (!openNow && wasOpen) {
            document.documentElement.style.display = '';
        }
        wasOpen = openNow;
    }, 500);
})();