const API_BASE = '/api/admin';

// Check auth on load (except for login page)
if (!window.location.pathname.includes('index.html') && !localStorage.getItem('adminToken')) {
    window.location.href = 'index.html';
}

// Login Logic
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorMsg = document.getElementById('errorMessage');

        try {
            const res = await fetch(`${API_BASE}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('adminToken', data.token);
                localStorage.setItem('adminUser', JSON.stringify(data.user));
                window.location.href = 'dashboard.html';
            } else {
                errorMsg.textContent = data.message || 'Login failed';
            }
        } catch (err) {
            errorMsg.textContent = 'Network error. Please try again.';
        }
    });
}

// Dashboard Logic
if (window.location.pathname.includes('dashboard.html')) {

    const token = localStorage.getItem('adminToken');
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = 'index.html';
    });

    // Initial Load
    fetchWebsites();

    async function fetchWebsites() {
        try {
            const res = await fetch(`${API_BASE}/websites`, { headers });
            if (res.status === 401 || res.status === 403) {
                // Token expired or invalid
                localStorage.removeItem('adminToken');
                window.location.href = 'index.html';
                return;
            }

            const websites = await res.json();
            renderDashboard(websites);
        } catch (err) {
            console.error('Error loading dashboard:', err);
        }
    }

    function renderDashboard(websites) {
        // Stats
        const total = websites.length;
        const pending = websites.filter(w => w.status === 'pending').length;
        const approved = websites.filter(w => w.status === 'approved').length;

        document.getElementById('totalWebsites').textContent = total;
        document.getElementById('pendingWebsites').textContent = pending;
        document.getElementById('approvedWebsites').textContent = approved;

        // Table
        const tbody = document.getElementById('websiteTableBody');
        tbody.innerHTML = '';

        if (total === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 20px;">No websites found.</td></tr>';
            return;
        }

        websites.forEach(site => {
            const row = document.createElement('tr');
            row.innerHTML = `
        <td style="color: var(--text-main); font-weight: 500;">${site.title}</td>
        <td><a href="${site.url}" target="_blank" style="color: var(--accent-secondary); text-decoration: none;">${site.url}</a></td>
        <td><span class="status-badge ${site.status}">${site.status}</span></td>
        <td>
          ${site.status === 'pending' ? `
            <button class="neu-btn action-btn approve" onclick="approveSite('${site.id}')" title="Approve">
              <span class="material-icons-round">check</span>
            </button>
          ` : ''}
          <button class="neu-btn action-btn delete" onclick="deleteSite('${site.id}')" title="Delete">
            <span class="material-icons-round">delete</span>
          </button>
        </td>
      `;
            tbody.appendChild(row);
        });
    }

    // Attach global functions for inline onclicks
    window.approveSite = async (id) => {
        if (!confirm('Approve this website?')) return;
        try {
            const res = await fetch(`${API_BASE}/websites/${id}/approve`, {
                method: 'PUT',
                headers
            });
            if (res.ok) fetchWebsites();
            else alert('Failed to approve');
        } catch (err) { alert('Error approving website'); }
    };

    window.deleteSite = async (id) => {
        if (!confirm('Delete this website?')) return;
        try {
            const res = await fetch(`${API_BASE}/websites/${id}`, {
                method: 'DELETE',
                headers
            });
            if (res.ok) fetchWebsites();
            else alert('Failed to delete');
        } catch (err) { alert('Error deleting website'); }
    };

    // Add Website Modal Logic could go here (omitted for brevity, basic implementation requested)
    document.getElementById('addWebsiteBtn').addEventListener('click', () => {
        const url = prompt('Enter Website URL:');
        const title = prompt('Enter Website Title:');
        if (url && title) {
            addSite(url, title);
        }
    });

    async function addSite(url, title) {
        try {
            const res = await fetch(`${API_BASE}/websites`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ url, title, description: 'Added via Admin UI' })
            });
            if (res.ok) fetchWebsites();
            else alert('Failed to add website');
        } catch (err) { alert('Error adding website'); }
    }
}
