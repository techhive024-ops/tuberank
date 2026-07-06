// ============================================
// TUBERANK - INTERACTIVE FUNCTIONALITY
// ============================================

// Sample creator data
const creatorsData = [
    {
        id: 1,
        name: "Sarah Chen",
        category: "tech",
        description: "Full-stack development tutorials and cutting-edge web technologies",
        subscribers: "245K",
        views: "1.2M",
        engagement: "4.8/5"
    },
    {
        id: 2,
        name: "Marcus Johnson",
        category: "gaming",
        description: "Competitive gaming strategies and esports analysis",
        subscribers: "512K",
        views: "3.1M",
        engagement: "4.7/5"
    },
    {
        id: 3,
        name: "Elena Rodriguez",
        category: "fitness",
        description: "High-intensity workouts and nutrition science explained",
        subscribers: "387K",
        views: "2.4M",
        engagement: "4.9/5"
    },
    {
        id: 4,
        name: "David Park",
        category: "education",
        description: "Computer science fundamentals and algorithm design",
        subscribers: "198K",
        views: "890K",
        engagement: "4.8/5"
    },
    {
        id: 5,
        name: "Lisa Zhang",
        category: "tech",
        description: "AI/ML projects and machine learning deep dives",
        subscribers: "421K",
        views: "2.8M",
        engagement: "4.9/5"
    },
    {
        id: 6,
        name: "James Wilson",
        category: "gaming",
        description: "Indie game development and game engine tutorials",
        subscribers: "156K",
        views: "745K",
        engagement: "4.6/5"
    },
    {
        id: 7,
        name: "Priya Patel",
        category: "fitness",
        description: "Yoga, meditation, and holistic wellness practices",
        subscribers: "289K",
        views: "1.6M",
        engagement: "4.8/5"
    },
    {
        id: 8,
        name: "Alex Rivera",
        category: "education",
        description: "Mathematics and physics explained through animation",
        subscribers: "334K",
        views: "1.9M",
        engagement: "4.9/5"
    },
    {
        id: 9,
        name: "Nicole Brown",
        category: "tech",
        description: "Cloud architecture and DevOps best practices",
        subscribers: "267K",
        views: "1.45M",
        engagement: "4.7/5"
    },
    {
        id: 10,
        name: "Tom Anderson",
        category: "gaming",
        description: "Retro gaming reviews and emulation setup guides",
        subscribers: "198K",
        views: "912K",
        engagement: "4.8/5"
    },
    {
        id: 11,
        name: "Sofia Garcia",
        category: "fitness",
        description: "Powerlifting training programs and strength coaching",
        subscribers: "224K",
        views: "1.3M",
        engagement: "4.7/5"
    },
    {
        id: 12,
        name: "Michael Lee",
        category: "education",
        description: "Programming languages and software design patterns",
        subscribers: "341K",
        views: "2.1M",
        engagement: "4.8/5"
    }
];

let currentFilter = 'all';

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    renderCreators('all');
    setupFilterButtons();
    setupFormValidation();
});

// Render creator cards
function renderCreators(filter) {
    const grid = document.getElementById('creatorsGrid');
    const filtered = filter === 'all' 
        ? creatorsData 
        : creatorsData.filter(creator => creator.category === filter);
    
    grid.innerHTML = '';
    
    filtered.forEach((creator, index) => {
        const card = createCreatorCard(creator);
        grid.appendChild(card);
        
        // Stagger animation
        setTimeout(() => {
            card.style.animation = 'fadeInUp 0.6s ease-out forwards';
        }, index * 50);
    });
}

// Create individual creator card
function createCreatorCard(creator) {
    const card = document.createElement('div');
    card.className = 'creator-card';
    
    const categoryLabel = capitalizeFirst(creator.category);
    const categoryColor = getCategoryColor(creator.category);
    
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
                        <div class="creator-meta-value">${creator.subscribers}</div>
                        <div class="creator-meta-label">Subscribers</div>
                    </div>
                    <div class="creator-meta-item">
                        <div class="creator-meta-value">${creator.views}</div>
                        <div class="creator-meta-label">Monthly Views</div>
                    </div>
                    <div class="creator-meta-item">
                        <div class="creator-meta-value">${creator.engagement}</div>
                        <div class="creator-meta-label">Engagement</div>
                    </div>
                </div>
                <button class="creator-button" onclick="viewCreator('${creator.name}')">View Channel</button>
            </div>
        </div>
    `;
    
    return card;
}

// Setup filter button functionality
function setupFilterButtons() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            buttons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            currentFilter = filter;
            renderCreators(filter);
        });
    });
}

// Setup form validation
function setupFormValidation() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit(e);
        });
    }
}

// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const channelName = document.getElementById('channelName').value;
    const email = document.getElementById('email').value;
    const category = document.getElementById('category').value;
    
    // Validate form
    if (!channelName || !email || !category) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Show success message
    showNotification('Application submitted successfully! We\'ll review it within 48 hours.', 'success');
    
    // Reset form
    form.reset();
    
    // In a real application, you would send this data to a server
    console.log('Form submitted:', {
        channelName,
        email,
        category,
        timestamp: new Date().toISOString()
    });
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
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
        box-shadow: 0 8px 32px rgba(188, 19, 254, 0.3);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Scroll to sections
function scrollToCreators() {
    document.getElementById('creators').scrollIntoView({ behavior: 'smooth' });
}

function scrollToContact() {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
}

// View creator (placeholder action)
function viewCreator(name) {
    showNotification(`Redirecting to ${name}'s channel...`, 'success');
    // In a real app, this would navigate to the creator's YouTube channel
}

// Utility functions
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
    
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 +
        (G<255?G<1?0:G:255)*0x100 +
        (B<255?B<1?0:B:255))
        .toString(16).slice(1);
}

// Add slide animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Smooth scroll behavior enhancement
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});