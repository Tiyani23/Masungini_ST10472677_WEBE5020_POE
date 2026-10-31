(function () {
        const form = $('#siteSearchForm');
        const input = $('#siteSearchInput');
        const results = $('#searchResults');
        if (!form || !input || !results) return;

        const pages = [
            { title: 'Home', url: 'index.html', words: 'home hope hands community foundation welcome donate donation food relief education families youth development community outreach newsletter' },
            { title: 'About Us', url: 'about.html', words: 'about us mission vision values history foundation team who we are helping communities disadvantaged families' },
            { title: 'Programmes', url: 'programmes.html', words: 'programmes projects services education food relief youth development community outreach support' },
            { title: 'Volunteer', url: 'volunteer.html', words: 'volunteer join help get involved application sign up skills community contribute' },
            { title: 'Contact', url: 'contact.html', words: 'contact email phone address message enquiry get in touch questions' }
        ];

        function showResults(query) {
            const term = query.trim().toLowerCase();
            results.innerHTML = '';
            if (!term) { results.classList.remove('show'); return; }
            const matches = pages.filter(function (page) {
                return (page.title + ' ' + page.words).toLowerCase().includes(term);
            });
            if (matches.length) {
                matches.forEach(function (page) {
                    const link = document.createElement('a');
                    link.href = page.url;
                    link.textContent = page.title;
                    results.appendChild(link);
                });
            } else {
                const message = document.createElement('p');
                message.textContent = 'No results found. Try another word.';
                results.appendChild(message);
            }
            results.classList.add('show');
        }

        input.addEventListener('input', function () { showResults(input.value); });
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            showResults(input.value);
            const firstResult = results.querySelector('a');
            if (firstResult) window.location.href = firstResult.href;
        });
        document.addEventListener('click', function (event) {
            if (!form.contains(event.target)) results.classList.remove('show');
        });
        input.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') { results.classList.remove('show'); input.blur(); }
        });
    })();