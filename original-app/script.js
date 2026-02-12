// Data storage
let data = {
    memories: [],
    dates: [],
    restaurants: [],
    dateIdeas: [],
    books: [],
    watch: [],
    games: []
};

// Form field configurations for each type
const formConfigs = {
    memory: {
        title: 'Add Memory',
        fields: [
            { name: 'title', label: 'Title', type: 'text', required: true },
            { name: 'date', label: 'Date', type: 'date', required: true },
            { name: 'description', label: 'Description', type: 'textarea', required: true },
            { name: 'location', label: 'Location', type: 'text', required: false }
        ]
    },
    date: {
        title: 'Plan Date',
        fields: [
            { name: 'title', label: 'Date Title', type: 'text', required: true },
            { name: 'date', label: 'Date & Time', type: 'datetime-local', required: true },
            { name: 'location', label: 'Location', type: 'text', required: true },
            { name: 'description', label: 'Details', type: 'textarea', required: false },
            { name: 'status', label: 'Status', type: 'select', options: ['Planned', 'Completed'], required: true }
        ]
    },
    restaurant: {
        title: 'Add Restaurant',
        fields: [
            { name: 'name', label: 'Restaurant Name', type: 'text', required: true },
            { name: 'cuisine', label: 'Cuisine Type', type: 'text', required: true },
            { name: 'location', label: 'Location', type: 'text', required: true },
            { name: 'notes', label: 'Notes', type: 'textarea', required: false },
            { name: 'rating', label: 'Rating (1-5)', type: 'number', min: 1, max: 5, required: false }
        ]
    },
    dateIdea: {
        title: 'Add Date Idea',
        fields: [
            { name: 'title', label: 'Idea Title', type: 'text', required: true },
            { name: 'category', label: 'Category', type: 'select', options: ['Indoor', 'Outdoor', 'Adventure', 'Relaxing', 'Creative', 'Other'], required: true },
            { name: 'description', label: 'Description', type: 'textarea', required: true },
            { name: 'estimatedCost', label: 'Estimated Cost', type: 'text', required: false }
        ]
    },
    book: {
        title: 'Add Book',
        fields: [
            { name: 'title', label: 'Book Title', type: 'text', required: true },
            { name: 'author', label: 'Author', type: 'text', required: true },
            { name: 'genre', label: 'Genre', type: 'text', required: false },
            { name: 'status', label: 'Status', type: 'select', options: ['Want to Read', 'Reading', 'Completed'], required: true },
            { name: 'notes', label: 'Notes', type: 'textarea', required: false }
        ]
    },
    watch: {
        title: 'Add Show/Movie',
        fields: [
            { name: 'title', label: 'Title', type: 'text', required: true },
            { name: 'type', label: 'Type', type: 'select', options: ['Movie', 'TV Show', 'Documentary', 'Anime', 'Other'], required: true },
            { name: 'genre', label: 'Genre', type: 'text', required: false },
            { name: 'status', label: 'Status', type: 'select', options: ['Want to Watch', 'Watching', 'Completed'], required: true },
            { name: 'platform', label: 'Platform', type: 'text', required: false },
            { name: 'notes', label: 'Notes', type: 'textarea', required: false }
        ]
    },
    game: {
        title: 'Add Game',
        fields: [
            { name: 'title', label: 'Game Title', type: 'text', required: true },
            { name: 'type', label: 'Type', type: 'select', options: ['Video Game', 'Board Game', 'Card Game', 'Outdoor Game', 'Party Game', 'Other'], required: true },
            { name: 'players', label: 'Players', type: 'text', required: false },
            { name: 'status', label: 'Status', type: 'select', options: ['Want to Play', 'Playing', 'Completed'], required: true },
            { name: 'notes', label: 'Notes', type: 'textarea', required: false }
        ]
    }
};

let currentType = null;

// Initialize app
function init() {
    loadData();
    setupEventListeners();
    renderAll();

    // Show memories section by default
    showSection('memories');
}

// Setup event listeners
function setupEventListeners() {
    // Navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.dataset.section;
            showSection(section);

            // Update active state
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Form submission
    document.getElementById('item-form').addEventListener('submit', handleFormSubmit);

    // Close modal on outside click
    document.getElementById('modal').addEventListener('click', (e) => {
        if (e.target.id === 'modal') {
            closeModal();
        }
    });
}

// Show section
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

// Open modal
function openModal(type) {
    currentType = type;
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const formFields = document.getElementById('form-fields');

    const config = formConfigs[type];
    modalTitle.textContent = config.title;

    // Generate form fields
    formFields.innerHTML = config.fields.map(field => {
        if (field.type === 'textarea') {
            return `
                <div class="form-group">
                    <label for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>
                    <textarea id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}></textarea>
                </div>
            `;
        } else if (field.type === 'select') {
            return `
                <div class="form-group">
                    <label for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>
                    <select id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}>
                        <option value="">Select ${field.label}</option>
                        ${field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                    </select>
                </div>
            `;
        } else {
            return `
                <div class="form-group">
                    <label for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>
                    <input
                        type="${field.type}"
                        id="${field.name}"
                        name="${field.name}"
                        ${field.required ? 'required' : ''}
                        ${field.min ? `min="${field.min}"` : ''}
                        ${field.max ? `max="${field.max}"` : ''}
                    >
                </div>
            `;
        }
    }).join('');

    modal.classList.add('active');
}

// Close modal
function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('active');
    document.getElementById('item-form').reset();
    currentType = null;
}

// Handle form submit
function handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const item = {
        id: Date.now(),
        createdAt: new Date().toISOString()
    };

    // Get all form values
    for (let [key, value] of formData.entries()) {
        item[key] = value;
    }

    // Add to appropriate array
    const arrayKey = currentType === 'dateIdea' ? 'dateIdeas' : currentType + 's';
    data[arrayKey].push(item);

    // Save and render
    saveData();
    renderSection(currentType);
    closeModal();
}

// Render all sections
function renderAll() {
    renderSection('memory');
    renderSection('date');
    renderSection('restaurant');
    renderSection('dateIdea');
    renderSection('book');
    renderSection('watch');
    renderSection('game');
}

// Render specific section
function renderSection(type) {
    const arrayKey = type === 'dateIdea' ? 'dateIdeas' : type + 's';
    const items = data[arrayKey];

    let containerId;
    switch(type) {
        case 'memory':
            containerId = 'memories-grid';
            break;
        case 'date':
            containerId = 'dates-list';
            break;
        case 'restaurant':
            containerId = 'restaurants-grid';
            break;
        case 'dateIdea':
            containerId = 'date-ideas-grid';
            break;
        case 'book':
            containerId = 'books-grid';
            break;
        case 'watch':
            containerId = 'watch-grid';
            break;
        case 'game':
            containerId = 'games-grid';
            break;
    }

    const container = document.getElementById(containerId);

    if (items.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">♡</div>
                <p>No items yet. Click the button above to add your first one!</p>
            </div>
        `;
        return;
    }

    // Render based on type
    if (type === 'date') {
        container.innerHTML = items.map(item => renderDateItem(item)).join('');
    } else {
        container.innerHTML = items.map(item => renderCard(item, type)).join('');
    }
}

// Render card
function renderCard(item, type) {
    let content = '';

    switch(type) {
        case 'memory':
            content = `
                <div class="card-header">
                    <div>
                        <h3>${escapeHtml(item.title)}</h3>
                        <p class="card-date">${formatDate(item.date)}</p>
                    </div>
                    <button class="delete-btn" onclick="deleteItem('${type}', ${item.id})">×</button>
                </div>
                <p>${escapeHtml(item.description)}</p>
                ${item.location ? `<p><strong>📍 ${escapeHtml(item.location)}</strong></p>` : ''}
            `;
            break;

        case 'restaurant':
            content = `
                <div class="card-header">
                    <div>
                        <h3>${escapeHtml(item.name)}</h3>
                        <p class="card-date">${escapeHtml(item.cuisine)}</p>
                    </div>
                    <button class="delete-btn" onclick="deleteItem('${type}', ${item.id})">×</button>
                </div>
                <p>📍 ${escapeHtml(item.location)}</p>
                ${item.rating ? `<p>⭐ ${item.rating}/5</p>` : ''}
                ${item.notes ? `<p>${escapeHtml(item.notes)}</p>` : ''}
            `;
            break;

        case 'dateIdea':
            content = `
                <div class="card-header">
                    <div>
                        <h3>${escapeHtml(item.title)}</h3>
                        <span class="card-status">${escapeHtml(item.category)}</span>
                    </div>
                    <button class="delete-btn" onclick="deleteItem('${type}', ${item.id})">×</button>
                </div>
                <p>${escapeHtml(item.description)}</p>
                ${item.estimatedCost ? `<p><strong>💰 ${escapeHtml(item.estimatedCost)}</strong></p>` : ''}
            `;
            break;

        case 'book':
            content = `
                <div class="card-header">
                    <div>
                        <h3>${escapeHtml(item.title)}</h3>
                        <p class="card-date">by ${escapeHtml(item.author)}</p>
                    </div>
                    <button class="delete-btn" onclick="deleteItem('${type}', ${item.id})">×</button>
                </div>
                ${item.genre ? `<p>📚 ${escapeHtml(item.genre)}</p>` : ''}
                <span class="card-status ${item.status === 'Completed' ? 'completed' : 'pending'}">${escapeHtml(item.status)}</span>
                ${item.notes ? `<p style="margin-top: 0.8rem;">${escapeHtml(item.notes)}</p>` : ''}
            `;
            break;

        case 'watch':
            content = `
                <div class="card-header">
                    <div>
                        <h3>${escapeHtml(item.title)}</h3>
                        <p class="card-date">${escapeHtml(item.type)}</p>
                    </div>
                    <button class="delete-btn" onclick="deleteItem('${type}', ${item.id})">×</button>
                </div>
                ${item.genre ? `<p>🎬 ${escapeHtml(item.genre)}</p>` : ''}
                ${item.platform ? `<p>📺 ${escapeHtml(item.platform)}</p>` : ''}
                <span class="card-status ${item.status === 'Completed' ? 'completed' : 'pending'}">${escapeHtml(item.status)}</span>
                ${item.notes ? `<p style="margin-top: 0.8rem;">${escapeHtml(item.notes)}</p>` : ''}
            `;
            break;

        case 'game':
            content = `
                <div class="card-header">
                    <div>
                        <h3>${escapeHtml(item.title)}</h3>
                        <p class="card-date">${escapeHtml(item.type)}</p>
                    </div>
                    <button class="delete-btn" onclick="deleteItem('${type}', ${item.id})">×</button>
                </div>
                ${item.players ? `<p>👥 ${escapeHtml(item.players)}</p>` : ''}
                <span class="card-status ${item.status === 'Completed' ? 'completed' : 'pending'}">${escapeHtml(item.status)}</span>
                ${item.notes ? `<p style="margin-top: 0.8rem;">${escapeHtml(item.notes)}</p>` : ''}
            `;
            break;
    }

    return `<div class="card">${content}</div>`;
}

// Render date list item
function renderDateItem(item) {
    return `
        <div class="list-item">
            <div class="list-item-content">
                <h3>${escapeHtml(item.title)}</h3>
                <p>📅 ${formatDateTime(item.date)} | 📍 ${escapeHtml(item.location)}</p>
                ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ''}
                <span class="card-status ${item.status === 'Completed' ? 'completed' : 'pending'}">${escapeHtml(item.status)}</span>
            </div>
            <button class="delete-btn" onclick="deleteItem('date', ${item.id})">×</button>
        </div>
    `;
}

// Delete item
function deleteItem(type, id) {
    const arrayKey = type === 'dateIdea' ? 'dateIdeas' : type + 's';
    data[arrayKey] = data[arrayKey].filter(item => item.id !== id);
    saveData();
    renderSection(type);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Format date and time
function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('coupleAppData', JSON.stringify(data));
}

// Load data from localStorage
function loadData() {
    const savedData = localStorage.getItem('coupleAppData');
    if (savedData) {
        try {
            data = JSON.parse(savedData);
        } catch (e) {
            console.error('Error loading data:', e);
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', init);
