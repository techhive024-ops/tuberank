// ============================================
// TUBERANK - REAL-TIME YOUTUBE DATA INTEGRATION
// ============================================

// YouTube API Configuration
const YOUTUBE_API_KEY = 'YOUR_YOUTUBE_API_KEY_HERE'; // Replace with your actual API key
const GOOGLE_SHEETS_API_KEY = 'YOUR_SHEETS_API_KEY_HERE'; // Optional: for external data

// Sample creator data with YouTube channel IDs
const creatorsData = [
    {
        id: 1,
        name: "Sarah Chen",
        category: "tech",
        description: "Full-stack development tutorials and cutting-edge web technologies",
        youtubeChannelId: "UCwRH985XgdMUtgnLe1QaFhA", // Replace with real channel ID
        subscribers: "245K",
        views: "1.2M",
        engagement: "4.8/5",
        channelUrl: "https://www.youtube.com/@SarahChen"
    },
    {
        id: 2,
        name: "Marcus Johnson",
        category: "gaming",
        description: "Competitive gaming strategies and esports analysis",
        youtubeChannelId: "UCDyWIBQ3fL0-K_M6eVTw8ng",
        subscribers: "512K",
        views: "3.1M",
        engagement: "4.7/5",
        channelUrl: "https://www.youtube.com/@MarcusJohnson"
    },
    {
        id: 3,
        name: "Elena Rodriguez",
        category: "fitness",
        description: "High-intensity workouts and nutrition science explained",
        youtubeChannelId: "UCQu16ThQKI20xjzjwPVDWxA",
        subscribers: "387K",
        views: "2.4M",
        engagement: "4.9/5",
        channelUrl: "https://www.youtube.com/@ElenaRodriguez"
    },
    {
        id: 4,
        name: "David Park",
        category: "education",
        description: "Computer science fundamentals and algorithm design",
        youtubeChannelId: "UCznlHtl7cfNmteuoF7YweXw",
        subscribers: "198K",
        views: "890K",
        engagement: "4.8/5",
        channelUrl: "https://www.youtube.com/@DavidPark"
    }
];

let currentFilter = 'all';
let realTimeDataCache = {};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderCreators('all');
    setupFilterButtons();
    setupFormValidation();
    loadRealTimeData();
    // Refresh every 5 minutes
    setInterval(loadRealTimeData, 5 * 60 * 1000);
});

// Load real-time YouTube data
async function loadRealTimeData() {
    console.log('Fetching real-time YouTube data...');
    for (let creator of creatorsData) {
        try {
            const channelData = await fetchYouTubeChannelData(creator.youtubeChannelId);
            if (channelData) {
                realTimeDataCache[creator.id] = channelData;
                updateCreatorCard(creator.id, channelData);
            }
        } catch (error) {
            console.error(`Failed to load data for ${creator.name}:`, error);
        }
    }
}

// Fetch YouTube channel stats
async function fetchYouTubeChannelData(channelId) {
    try {
        const url = `https://www.googleapis.com/youtube/v3/channels?key=${YOUTUBE_API_KEY}&id=${channelId}&part=statistics,snippet&maxResults=1`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        
        const data = await response.json();
        if (data.items && data.items.length > 0) {
            const channel = data.items[0];
            return {
                subscribers: formatNumber(channel.statistics.subscriberCount),
                views: formatNumber(channel.statistics.viewCount),
                videoCount: channel.statistics.videoCount,
                profileImage: channel.snippet.thumbnails.high.url
            };
        }
    } catch (error) {
        console.error('YouTube API Error:', error);
        return null;
    }
}

// Update card with real-time data
function updateCreatorCard(creatorId, data) {
    const card = document.getElementById(`creator-${creatorId}`);
    if (card) {
        const metaItems = card.querySelectorAll('.creator-meta-item');
        if (metaItems[0]) metaItems[0].querySelector('.creator-meta-value').textContent = data.subscribers;
        if (metaItems[1]) metaItems[1].querySelector('.creator-meta-value').textContent = data.views;
    }
}

// Render creators
function renderCreators(filter) {
    const grid = document.getElementById('creatorsGrid');
    const filtered = filter === 'all' 
        ? creatorsData 
        : creatorsData.filter(creator => creator.category === filter);
    
    grid.innerHTML = '';
    filtered.forEach((creator, index) => {
        const card = createCreatorCard(creator);
        grid.appendChild(card);
        setTimeout(() => {
            card.style.animation = 'fadeInUp 0.6s ease-out forwards';
        }, index * 50);
    });
}

// Create creator card
function createCreatorCard(creator) {
    const card = document.createElement('div');
    card.className = 'creator-card';
    card.id = `creator-${creator.id}`;
    
    const categoryLabel = capitalizeFirst(creator.category);
    const categoryColor = getCategoryColor(creator.category);
    const realTimeData = realTimeDataCache[creator.id];
    const subscribers = realTimeData ? realTimeData.subscribers : creator.subscribers;
    const views = realTimeData ? realTimeData.views : creator.views;
    
    card.innerHTML = `
        <div class="creator-card-inner">
            <div class="creator-image" style="background: linear-gradient(135deg, ${categoryColor} 0%, ${adjustColorBrightness(categoryColor, -20)} 100%);"></div>
            <div class="creator-info">
                <div class="creator-header">
                    <h3 class="creator-name">${creator.name}</h3>
                    <span class="creator-badge">${categoryLabel}</span>
                </div>
                <p class="creator-category">${categoryLabel} Creator</p>
                <p class="creator-description">${creator.description}</p>
                <div class="creator-meta">
                    <div class="creator-meta-item">
                        <div class="creator-meta-value">${subscribers}</div>
                        <div class="creator-meta-label">Subscribers</div>
                    </div>
                    <div class="creator-meta-item">
                        <div class="creator-meta-value">${views}</div>
                        <div class="creator-meta-label">Monthly Views</div>
                    </div>
                    <div class="creator-meta-item">
                        <div class="creator-meta-value">${creator.engagement}</div>
                        <div class="creator-meta-label">Engagement</div>
                    </div>
                </div>
                <button class="creator-button" onclick="visitChannel('${creator.channelUrl}')">View Channel</button>
            </div>
        </div>
    `;
    return card;
}

// Setup filters
function setupFilterButtons() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            buttons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const filter = this.getAttribute('data-filter');
            renderCreators(filter);
        });
    });
}

// Form validation
function setupFormValidation() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit(e);
        });
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    
    const formData = {
        channelName: document.getElementById('channelName').value,
        email: document.getElementById('email').value,
        subscribers: document.getElementById('subscribers').value,
        category: document.getElementById('category').value,
        channelUrl: document.getElementById('channelUrl').value,
        message: document.getElementById('message').value,
        timestamp: new Date().toISOString()
    };
    
    if (!formData.channelName || !formData.email || !formData.category) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    try {
        await submitFormToBackend(formData);
        showNotification('Application submitted! We\'ll review within 48 hours.', 'success');
        form.reset();
    } catch (error) {
        showNotification('Error submitting form', 'error');
    }
}

// Submit form to backend
async function submitFormToBackend(formData) {
    try {
        // Send to Discord Webhook (most common)
        await fetch('YOUR_DISCORD_WEBHOOK_URL', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: `📝 New TubeRank Application\n\n**Channel:** ${formData.channelName}\n**Email:** ${formData.email}\n**Category:** ${formData.category}\n**Subscribers:** ${formData.subscribers}`
            })
        });
        
        // Or send to Firebase
        // const db = firebase.firestore();
        // await db.collection('submissions').add(formData);
        
    } catch (error) {
        console.error('Backend error:', error);
    }
}

// Show notifications
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'linear-gradient(135deg, #bc13fe 0%, #8b5cf6 100%)' : '#ff6b6b'};
        color: white;
        border-radius: 8px;
        font-weight: 600;
        z-index: 2000;
        animation: slideIn 0.3s ease-out;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Utilities
function scrollToCreators() {
    document.getElementById('creators').scrollIntoView({ behavior: 'smooth' });
}

function scrollToContact() {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
}

function visitChannel(url) {
    window.open(url, '_blank');
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function getCategoryColor(category) {
    const colors = {
        'tech': '#bc13fe',
        'gaming': '#ff006e',
        'fitness': '#00d9ff',
        'education': '#00ff88'
    };
    return colors[category] || '#bc13fe';
}

function adjustColorBrightness(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
}

// Format numbers with K, M, B
function formatNumber(num) {
    if (!num) return 'N/A';
    num = parseInt(num);
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

// Animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);
