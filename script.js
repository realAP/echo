class Echo {
    constructor() {
        this.sections = [];
    }

    addSection(provider) {
        this.sections.push(provider);
    }

    render() {
        const container = document.getElementById('app');
        container.innerHTML = '';

        this.sections.forEach(provider => {
            const section = provider();
            const secEl = document.createElement('section');

            const title = document.createElement('h2');
            title.textContent = section.title;

            const content = document.createElement('pre');
            content.textContent = section.content;

            secEl.appendChild(title);
            secEl.appendChild(content);
            container.appendChild(secEl);
        });
    }
}

const echo = new Echo();

echo.addSection(() => ({
    title: 'User Agent',
    content: navigator.userAgent
}));

echo.addSection(() => ({
    title: 'Language',
    content: navigator.language
}));

echo.addSection(() => ({
    title: 'Screen Size',
    content: `${window.screen.width} x ${window.screen.height}`
}));


echo.addSection(async () => {
    const result = await fetch('/client-ip', {cache: 'no-store'})
    const body = await result.json()
    return {
        title: 'IP Address',
        content: body.ip
    }
})

echo.render();
