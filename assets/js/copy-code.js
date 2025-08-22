document.addEventListener('DOMContentLoaded', function () {
  // Selecciona todos los bloques <pre><code>
  document.querySelectorAll('pre > code').forEach(function (codeEl, i) {
    const pre = codeEl.parentElement;
    pre.classList.add('codeblock');

    // Crea botón
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.type = 'button';
    btn.textContent = '📋 Copiar';

    // Acción de copiar
    btn.addEventListener('click', async () => {
      try {
        // innerText evita copiar HTML/etiquetas
        await navigator.clipboard.writeText(codeEl.innerText);
        btn.classList.remove('error');
        btn.classList.add('copied');
        const old = btn.textContent;
        btn.textContent = '✅ Copiado';
        setTimeout(() => { btn.textContent = old; btn.classList.remove('copied'); }, 1600);
      } catch (e) {
        console.error(e);
        btn.classList.add('error');
        btn.textContent = '❌ Error';
        setTimeout(() => { btn.textContent = '📋 Copiar'; btn.classList.remove('error'); }, 1600);
      }
    });

    // Inserta el botón en el <pre>
    pre.appendChild(btn);
  });
});
