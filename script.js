// Theme Management
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    
    if (currentTheme === 'dark') {
        body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
}

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
    }
}

// Animated Counter Function
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format number with + for clubs and members
        if (target >= 100) {
            element.textContent = Math.floor(current) + '+';
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Initialize counters when they come into view
function initCounters() {
    const numberCards = document.querySelectorAll('.number-value');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.5 });
    
    numberCards.forEach(card => observer.observe(card));
}

// Page Navigation - Simplified without dropdowns
function showPage(pageId) {
    console.log('Navigating to page:', pageId);
    
    // Hide all pages
    const pages = document.querySelectorAll('.page-content');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page with a small delay for smooth transition
    setTimeout(() => {
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            console.log('Page activated:', pageId);
            
            // Initialize counters if showing about page
            if (pageId === 'about-d124') {
                setTimeout(initCounters, 300);
            }
        } else {
            console.error('Page not found:', pageId);
        }
    }, 50);
    
    // Close mobile menu if open
    const navMenu = document.getElementById('nav-menu');
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    if (navMenu && mobileBtn) {
        navMenu.classList.remove('active');
        mobileBtn.classList.remove('active');
    }
    
    // Smooth scroll to top
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    
    if (navMenu && mobileBtn) {
        navMenu.classList.toggle('active');
        mobileBtn.classList.toggle('active');
    }
}

// Close mobile menu when clicking outside
function initClickOutside() {
    document.addEventListener('click', function(event) {
        const navMenu = document.getElementById('nav-menu');
        const mobileBtn = document.querySelector('.mobile-menu-btn');
        const header = document.querySelector('header');
        
        if (header && !header.contains(event.target)) {
            if (navMenu) navMenu.classList.remove('active');
            if (mobileBtn) mobileBtn.classList.remove('active');
        }
    });
}

// Smooth scrolling for internal links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add subtle scroll effects to header
function initHeaderEffects() {
    let lastScrollTop = 0;
    const header = document.querySelector('header');
    
    if (!header) return;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'linear-gradient(135deg, rgba(0, 65, 101, 0.95), rgba(119, 36, 50, 0.95))';
            header.style.backdropFilter = 'blur(15px)';
        } else {
            header.style.background = 'linear-gradient(135deg, var(--primary-blue), var(--primary-red))';
            header.style.backdropFilter = 'blur(10px)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Search functionality
function performSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        const query = searchInput.value.trim();
        if (query) {
            // Show search results notification
            showNotification(`Searching for clubs: "${query}"`, 'info');
            // In a real application, this would make an API call
        } else {
            showNotification('Please enter a search term', 'warning');
        }
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1002;
        background: var(--white);
        border: 1px solid var(--border-light);
        border-radius: 8px;
        box-shadow: 0 4px 20px var(--shadow-medium);
        padding: 1rem;
        max-width: 400px;
        width: 90%;
        animation: slideDown 0.3s ease;
    `;
    
    // Type-specific styling
    if (type === 'warning') {
        notification.style.borderLeftColor = 'var(--warning)';
        notification.style.borderLeftWidth = '4px';
    } else if (type === 'error') {
        notification.style.borderLeftColor = 'var(--error)';
        notification.style.borderLeftWidth = '4px';
    } else {
        notification.style.borderLeftColor = 'var(--primary-blue)';
        notification.style.borderLeftWidth = '4px';
    }
    
    // Add to document
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Add CSS for notifications
function addNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
        }
        
        .notification-message {
            color: var(--text-dark);
            font-size: 14px;
            font-weight: 500;
        }
        
        .notification-close {
            background: none;
            border: none;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            color: var(--text-light);
            transition: all 0.2s ease;
            flex-shrink: 0;
        }
        
        .notification-close:hover {
            background: var(--bg-accent);
            color: var(--text-dark);
        }
        
        .notification-close svg {
            width: 16px;
            height: 16px;
        }
    `;
    document.head.appendChild(style);
}

// Enhanced search with Enter key support
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing website...');
    
    // Load saved theme
    loadTheme();
    
    // Initialize all features
    initClickOutside();
    initSmoothScrolling();
    initHeaderEffects();
    initSearch();
    addNotificationStyles();
    
    // Initialize counters for the about page if it's currently active
    const aboutPage = document.getElementById('about-d124');
    if (aboutPage && aboutPage.classList.contains('active')) {
        setTimeout(initCounters, 300);
    }
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // ESC key closes mobile menu
        if (e.key === 'Escape') {
            const navMenu = document.getElementById('nav-menu');
            const mobileBtn = document.querySelector('.mobile-menu-btn');
            
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (mobileBtn) mobileBtn.classList.remove('active');
            }
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768) {
            const navMenu = document.getElementById('nav-menu');
            const mobileBtn = document.querySelector('.mobile-menu-btn');
            
            if (navMenu) navMenu.classList.remove('active');
            if (mobileBtn) mobileBtn.classList.remove('active');
        }
    });
    
    console.log('District 124 Toastmasters website initialized successfully!');
});

// Add loading state for search
function setSearchLoading(loading) {
    const searchButton = document.querySelector('.search-button');
    if (searchButton) {
        if (loading) {
            searchButton.disabled = true;
            searchButton.innerHTML = `
                <svg class="search-icon animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                </svg>
                Searching...
            `;
        } else {
            searchButton.disabled = false;
            searchButton.innerHTML = `
                <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="M21 21l-4.35-4.35"></path>
                </svg>
                Search Clubs
            `;
        }
    }
}

// Add spin animation for loading states
const spinStyle = document.createElement('style');
spinStyle.textContent = `
    .animate-spin {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
`;
document.head.appendChild(spinStyle);
