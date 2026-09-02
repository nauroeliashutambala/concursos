(() => {
    const videoSection = document.querySelector('#videos');
    if (!videoSection || document.querySelector('#estudo-extra')) return;

    const headings = [...document.querySelectorAll('main h3')]
        .map(heading => heading.textContent.trim())
        .filter(Boolean)
        .slice(0, 6);
    const section = document.createElement('section');
    section.id = 'estudo-extra';
    section.innerHTML = `
        <h2 class="section-title">Plano de estudo</h2>
        <p class="section-subtitle">Organize a revisão, pesquise conceitos e teste a memória antes de resolver as questões.</p>
        <div class="card study-tools-card">
            <h3>Objetivos de aprendizagem</h3>
            <ul class="study-objectives">
                <li>Reconhecer os conceitos centrais desta aula.</li>
                <li>Relacionar a teoria com situações do serviço público.</li>
                <li>Revisar os pontos principais sem consultar o texto completo.</li>
            </ul>
            <label for="study-search">Pesquisar nesta aula</label>
            <input id="study-search" type="search" placeholder="Digite um conceito ou palavra-chave" style="display:block;width:100%;margin-top:8px;padding:11px;border:1px solid #cbd5e1;border-radius:8px;font:inherit;">
            <p id="study-search-status" aria-live="polite" style="margin-top:8px;color:#64748b;"></p>
        </div>
        <div class="card">
            <h3>Glossário rápido</h3>
            <div class="study-glossary"></div>
        </div>
        <div class="card study-flashcards">
            <h3>Flashcards</h3>
            <p class="section-subtitle">Clique em cada pergunta para revelar a resposta.</p>
        </div>`;
    videoSection.parentNode.insertBefore(section, videoSection);

    const glossary = section.querySelector('.study-glossary');
    headings.slice(0, 4).forEach((heading, index) => {
        const item = document.createElement('p');
        item.innerHTML = `<strong>${heading}</strong>: conceito que deve ser explicado com palavras próprias e aplicado a um exemplo.`;
        glossary.appendChild(item);
    });

    const flashcards = section.querySelector('.study-flashcards');
    headings.slice(0, 4).forEach((heading, index) => {
        const card = document.createElement('details');
        card.innerHTML = `<summary>O que é importante saber sobre “${heading}”?</summary><p>Defina o conceito, identifique a sua finalidade e dê um exemplo relacionado ao tema desta aula.</p>`;
        flashcards.appendChild(card);
    });

    const search = section.querySelector('#study-search');
    const status = section.querySelector('#study-search-status');
    const searchable = [...document.querySelectorAll('main .card, main .question, main .question-box')];
    search.addEventListener('input', () => {
        const query = search.value.trim().toLocaleLowerCase();
        let visible = 0;
        searchable.forEach(item => {
            const matches = !query || item.textContent.toLocaleLowerCase().includes(query);
            item.hidden = !matches;
            if (matches) visible += 1;
        });
        status.textContent = query ? `${visible} bloco(s) encontrado(s).` : '';
    });
})();

(() => {
    const theme = document.querySelector('main h1')?.textContent.trim() || document.title;
    const cards = [...document.querySelectorAll('main .card, main .mini-card, main .mini')];
    cards.forEach(card => {
        if (card.closest('#videos, #estudo-extra') || card.querySelector('.question, .question-box') || card.dataset.videoOptions) return;
        const heading = card.querySelector('h3');
        if (!heading) return;
        card.dataset.videoOptions = 'true';
        const topics = [
            `aula ${heading.textContent.trim()} ${theme}`,
            `resumo ${heading.textContent.trim()} ${theme}`,
            `questões ${heading.textContent.trim()} concurso`
        ];
        const details = document.createElement('details');
        details.className = 'subtopic-videos';
        const summary = document.createElement('summary');
        summary.textContent = 'Ver vídeos deste subtema';
        details.appendChild(summary);
        const list = document.createElement('ul');
        topics.forEach((topic, index) => {
            const item = document.createElement('li');
            const link = document.createElement('a');
            link.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(topic)}`;
            link.target = '_blank';
            link.rel = 'noopener';
            link.textContent = ['Aula completa', 'Resumo rápido', 'Questões resolvidas'][index];
            item.appendChild(link);
            list.appendChild(item);
        });
        details.appendChild(list);
        card.appendChild(details);
    });
})();
