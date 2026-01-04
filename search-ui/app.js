document.addEventListener('DOMContentLoaded', () => {
    updateTime();
    setInterval(updateTime, 1000);

    // Search functionality
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const engineButtons = document.querySelectorAll('.engine-selector .pill');

    let currentEngine = 'default';

    // Engine selection
    engineButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            engineButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentEngine = btn.dataset.engine;
        });
    });

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    function performSearch() {
        const query = searchInput.value.trim();
        if (!query) return;

        if (currentEngine === 'default') {
            // Use internal API
            window.location.href = `/search?q=${encodeURIComponent(query)}`;
        } else {
            // Redirect to external engines
            let url = '';
            switch (currentEngine) {
                case 'google': url = `https://www.google.com/search?q=${query}`; break;
                case 'duckduckgo': url = `https://duckduckgo.com/?q=${query}`; break;
                case 'bing': url = `https://www.bing.com/search?q=${query}`; break;
                case 'brave': url = `https://search.brave.com/search?q=${query}`; break;
            }
            if (url) window.open(url, '_blank');
        }
    }
});

function updateTime() {
    const now = new Date();

    // Time
    const timeEl = document.getElementById('currentTime');
    timeEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Date
    const dayEl = document.getElementById('currentDay');
    const dateEl = document.getElementById('currentDate');
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    dayEl.textContent = days[now.getDay()];
    dateEl.textContent = `${months[now.getMonth()]} ${now.getDate()}`;

    // Greeting
    const greetingEl = document.getElementById('greetingParams');
    const hour = now.getHours();
    let greeting = 'Good Morning';
    if (hour >= 12 && hour < 17) greeting = 'Good Afternoon';
    else if (hour >= 17) greeting = 'Good Evening';

    greetingEl.textContent = greeting;
}
