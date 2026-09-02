(() => {
    const file = location.pathname.split('/').pop() || '';
    const aulaMatch = file.match(/^aula(\d+)\.html$/);
    const isAula = Boolean(aulaMatch);
    const theme = document.querySelector('h1')?.textContent.trim() || document.title;

    const progress = document.createElement('div');
    progress.className = 'study-progress';
    document.body.appendChild(progress);
    window.addEventListener('scroll', () => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = `${total > 0 ? window.scrollY / total * 100 : 0}%`;
    }, { passive: true });

    const toolbar = document.createElement('div');
    toolbar.className = 'study-toolbar';
    toolbar.setAttribute('aria-label', 'Ferramentas de estudo');
    toolbar.innerHTML = '<button type="button" data-action="review">Revisão</button><button type="button" data-action="print">Imprimir</button><button type="button" data-action="top">Topo</button>';
    document.body.appendChild(toolbar);
    toolbar.addEventListener('click', event => {
        const action = event.target.dataset.action;
        if (action === 'review') document.body.classList.toggle('review-mode');
        if (action === 'print') window.print();
        if (action === 'top') window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    if (isAula) {
        const lessonNumber = Number(aulaMatch[1]);
        const progressKey = `minint-aula-${lessonNumber}-concluida`;
        const complete = document.createElement('button');
        complete.type = 'button';
        complete.dataset.action = 'complete';
        complete.textContent = localStorage.getItem(progressKey) === 'true' ? 'Concluída' : 'Concluir aula';
        complete.setAttribute('aria-pressed', localStorage.getItem(progressKey) === 'true');
        toolbar.insertBefore(complete, toolbar.firstChild);
        toolbar.addEventListener('click', event => {
            if (event.target.dataset.action !== 'complete') return;
            const done = localStorage.getItem(progressKey) !== 'true';
            localStorage.setItem(progressKey, done);
            complete.textContent = done ? 'Concluída' : 'Concluir aula';
            complete.setAttribute('aria-pressed', done);
        });

        const sections = [...document.querySelectorAll('main section, body > section')]
            .filter(section => section.querySelector('h2'));
        sections.forEach((section, index) => {
            if (!section.id) section.id = `minint-aula-${lessonNumber}-secao-${index + 1}`;
        });
        if (!document.querySelector('.sidebar')) {
            const sidebar = document.createElement('aside');
            sidebar.className = 'minint-sidebar';
            sidebar.innerHTML = '<h3>Conteúdo da aula</h3><nav class="minint-sidebar-nav"></nav>';
            const navigation = sidebar.querySelector('nav');
            sections.forEach((section, index) => {
                const link = document.createElement('a');
                link.href = `#${section.id}`;
                link.innerHTML = `<strong>${String(index + 1).padStart(2, '0')}.</strong> ${section.querySelector('h2').textContent.trim()}`;
                navigation.appendChild(link);
            });
            document.body.classList.add('has-minint-sidebar');
            document.body.prepend(sidebar);
        }

        const cards = [...document.querySelectorAll('.section, .card, .purpose-card, .lesson')];
        cards.forEach(card => {
            if (card.closest('header, footer, .study-toolbar') || card.dataset.videoOptions) return;
            const heading = card.querySelector('h2, h3');
            if (!heading) return;
            card.dataset.videoOptions = 'true';
            const details = document.createElement('details');
            details.className = 'subtopic-videos';
            details.innerHTML = '<summary>Ver vídeos deste subtema</summary>';
            const list = document.createElement('ul');
            [['Aula completa', `aula ${heading.textContent.trim()} ${theme}`], ['Resumo rápido', `resumo ${heading.textContent.trim()} ${theme}`], ['Questões resolvidas', `questões ${heading.textContent.trim()} concurso`]].forEach(([label, query]) => {
                const item = document.createElement('li');
                const link = document.createElement('a');
                link.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
                link.target = '_blank';
                link.rel = 'noopener';
                link.textContent = label;
                item.appendChild(link);
                list.appendChild(item);
            });
            details.appendChild(list);
            card.appendChild(details);
        });

        const footer = document.querySelector('footer, .footer');
        if (footer) {
            const number = lessonNumber;
            const navigation = document.createElement('p');
            navigation.style.marginTop = '18px';
            const previous = number > 1 ? `<a href="aula${number - 1}.html">Aula anterior</a>` : '';
            const next = number < 5 ? `<a href="aula${number + 1}.html">Próxima aula</a>` : '';
            navigation.innerHTML = [previous, next].filter(Boolean).join(' &nbsp; | &nbsp; ');
            footer.appendChild(navigation);
        }
    } else {
        const lessons = [...document.querySelectorAll('.lesson')];
        const completed = lessons.filter((_, index) => localStorage.getItem(`minint-aula-${index + 1}-concluida`) === 'true').length;
        if (lessons.length) {
            const status = document.createElement('p');
            status.className = 'course-progress';
            status.textContent = `${completed} de ${lessons.length} aulas concluídas`;
            const firstSection = document.querySelector('main section');
            if (firstSection) firstSection.prepend(status);
            lessons.forEach((lesson, index) => {
                if (localStorage.getItem(`minint-aula-${index + 1}-concluida`) !== 'true') return;
                lesson.classList.add('is-complete');
                const label = document.createElement('span');
                label.className = 'completion-label';
                label.textContent = 'Concluída';
                lesson.querySelector('.lesson-content')?.prepend(label);
            });
        }
    }
})();
