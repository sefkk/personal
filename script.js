// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initProjectFilters();
    initContactForm();
    initTypingEffect();
    initParallaxEffect();
    initSmoothScrolling();
    initReactionGame();
});

// Navigation functionality
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Active navigation link highlighting
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.section-title, .about-content, .game-content, .skills-grid, .projects-grid, .contact-content');
    animatedElements.forEach(el => {
        el.classList.add('loading');
        observer.observe(el);
    });

    // Counter animation for stats
    const stats = document.querySelectorAll('.stat h3');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => {
        statsObserver.observe(stat);
    });
}

// Counter animation
function animateCounter(element) {
    const target = parseInt(element.textContent);
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 16);
}

// Project filtering
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter projects
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                const categories = category ? category.split(' ') : [];
                
                if (filter === 'all' || categories.includes(filter)) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Contact form handling
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    contactForm.addEventListener('submit', function(e) {
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');

        // Basic validation
        if (!name || !email || !subject || !message) {
            e.preventDefault();
            showNotification('Please fill in all fields', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            e.preventDefault();
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        // Let the form submit naturally to Web3Forms
        // Web3Forms will handle sending the email to orkunsefik@gmail.com
    });

    // Handle success message from URL parameter
    if (window.location.search.includes('success=true')) {
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        // Clean up the URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Typing effect for hero title
function initTypingEffect() {
    const titleElement = document.querySelector('.hero-title');
    if (!titleElement) return;

    const beforeHighlight = "Hi, I'm ";
    const highlightText = 'Orkun';
    const pauseBetweenCycles = 3000; // 3 seconds pause between cycles

    function startTypingCycle() {
        // Clear the content
        titleElement.innerHTML = '';

        let index = 0;
        let highlightIndex = 0;
        const typeSpeed = 100;
        const highlightSpeed = 150;

        function typeText() {
            if (index < beforeHighlight.length) {
                titleElement.innerHTML += beforeHighlight[index];
                index++;
                setTimeout(typeText, typeSpeed);
            } else if (index === beforeHighlight.length) {
                // Start typing the highlighted name letter by letter
                if (highlightIndex < highlightText.length) {
                    if (highlightIndex === 0) {
                        titleElement.innerHTML += '<span class="highlight">';
                    }
                    titleElement.innerHTML += highlightText[highlightIndex];
                    highlightIndex++;
                    setTimeout(typeText, highlightSpeed);
                } else {
                    // Close the highlight span
                    titleElement.innerHTML += '</span>';
                    console.log('Typing cycle completed');
                    
                    // Start the next cycle after a delay
                    setTimeout(startTypingCycle, pauseBetweenCycles);
                }
            }
        }

        // Start this typing cycle
        typeText();
    }

    // Start the first typing cycle after a short delay
    setTimeout(startTypingCycle, 1000);
}

// Parallax effect for hero section
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${parallax}px)`;
        }
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Skill items animation on hover
document.addEventListener('DOMContentLoaded', function() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Project card hover effects
document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Scroll to top functionality
function createScrollToTop() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #fbbf24;
        color: #0a0a0a;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
    `;

    document.body.appendChild(scrollToTopBtn);

    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.display = 'flex';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });

    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Hover effects
    scrollToTopBtn.addEventListener('mouseenter', function() {
        this.style.background = '#f59e0b';
        this.style.transform = 'scale(1.1)';
    });

    scrollToTopBtn.addEventListener('mouseleave', function() {
        this.style.background = '#fbbf24';
        this.style.transform = 'scale(1)';
    });
}

// Initialize scroll to top button
document.addEventListener('DOMContentLoaded', createScrollToTop);

// Loading animation for images
function initImageLoading() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        img.addEventListener('error', function() {
            this.style.display = 'none';
        });
    });
}

// Initialize image loading
document.addEventListener('DOMContentLoaded', initImageLoading);

// Reaction Time Game
function initReactionGame() {
    const gameStartBtn = document.getElementById('game-start-btn');
    const gameContent = document.getElementById('game-content');
    const gameCloseBtn = document.getElementById('game-close-btn');
    const gameButton = document.getElementById('game-button');
    const resetButton = document.getElementById('game-reset');
    const bestTimeEl = document.getElementById('best-time');
    const currentTimeEl = document.getElementById('current-time');
    const averageTimeEl = document.getElementById('average-time');
    const attemptsEl = document.getElementById('attempts');
    
    if (!gameStartBtn || !gameContent || !gameButton || !resetButton || !gameCloseBtn) return;
    
    let bestTime = localStorage.getItem('reactionBestTime') ? parseFloat(localStorage.getItem('reactionBestTime')) : null;
    let attempts = parseInt(localStorage.getItem('reactionAttempts')) || 0;
    let reactionTimes = JSON.parse(localStorage.getItem('reactionTimes')) || [];
    let startTime = null;
    let waitingForClick = false;
    let timeoutId = null;
    let gameStarted = false;
    
    // Calculate average reaction time
    function calculateAverage() {
        if (reactionTimes.length === 0) return null;
        const sum = reactionTimes.reduce((acc, time) => acc + time, 0);
        return sum / reactionTimes.length;
    }
    
    // Update display
    function updateDisplay() {
        if (bestTime !== null) {
            bestTimeEl.textContent = bestTime.toFixed(2) + 'ms';
        }
        const average = calculateAverage();
        if (average !== null) {
            averageTimeEl.textContent = average.toFixed(1) + 'ms';
        } else {
            averageTimeEl.textContent = '--';
        }
        attemptsEl.textContent = attempts;
    }
    
    // Start button click handler
    gameStartBtn.addEventListener('click', function() {
        // Reset start button styles
        gameStartBtn.style.opacity = '';
        gameStartBtn.style.transform = '';
        gameStartBtn.style.transition = '';
        
        // Hide start button
        gameStartBtn.classList.add('hidden');
        
        // Show and fade in game content
        gameContent.style.display = 'block';
        gameContent.style.opacity = '0';
        gameContent.style.transform = 'translateY(20px)';
        // Use setTimeout to ensure display is set before adding visible class
        setTimeout(() => {
            gameContent.classList.add('visible');
            gameContent.style.opacity = '1';
            gameContent.style.transform = 'translateY(0)';
        }, 10);
        
        // Initialize game after fade-in
        setTimeout(() => {
            gameStarted = true;
            updateDisplay();
            startRound();
        }, 600);
    });
    
    // Start a new round
    function startRound() {
        if (!gameStarted) return;
        
        gameButton.textContent = 'Wait for green...';
        gameButton.className = 'game-button waiting';
        gameButton.disabled = true;
        waitingForClick = false;
        currentTimeEl.textContent = '--';
        
        // Random delay
        const delay = Math.random() * 2500 + 500;
        
        timeoutId = setTimeout(() => {
            gameButton.textContent = 'CLICK NOW!';
            gameButton.className = 'game-button ready';
            gameButton.disabled = false;
            startTime = Date.now();
            waitingForClick = true;
        }, delay);
    }
    
    // Handle button click
    gameButton.addEventListener('click', function() {
        if (!gameStarted) return;
        
        if (!waitingForClick) {
            // Clicked too early
            gameButton.textContent = 'Too early! Wait for green.';
            gameButton.className = 'game-button waiting';
            clearTimeout(timeoutId);
            setTimeout(startRound, 1500);
            return;
        }
        
        if (startTime) {
            const reactionTime = Date.now() - startTime - 100;
            currentTimeEl.textContent = reactionTime.toFixed(2) + 'ms';
            
            // Add reaction time to array
            reactionTimes.push(reactionTime);
            localStorage.setItem('reactionTimes', JSON.stringify(reactionTimes));
            
            // Update best time
            if (bestTime === null || reactionTime < bestTime) {
                bestTime = reactionTime;
                localStorage.setItem('reactionBestTime', bestTime.toString());
            }
            
            attempts++;
            localStorage.setItem('reactionAttempts', attempts.toString());
            updateDisplay();
            
            gameButton.textContent = `Great! ${reactionTime.toFixed(2)}ms`;
            gameButton.className = 'game-button clicked';
            waitingForClick = false;
            
            // Start next round after 2 seconds
            setTimeout(startRound, 1500);
        }
    });
    
    // Reset button
    resetButton.addEventListener('click', function() {
        if (!gameStarted) return;
        
        bestTime = null;
        attempts = 0;
        reactionTimes = [];
        localStorage.removeItem('reactionBestTime');
        localStorage.removeItem('reactionAttempts');
        localStorage.removeItem('reactionTimes');
        clearTimeout(timeoutId);
        updateDisplay();
        startRound();
    });
    
    // Close button handler
    function closeGame() {
        // Clear any active timeouts
        clearTimeout(timeoutId);
        
        // Reset game state
        gameStarted = false;
        waitingForClick = false;
        startTime = null;
        
        // Reset button state
        gameButton.textContent = 'Wait for green...';
        gameButton.className = 'game-button waiting';
        gameButton.disabled = true;
        currentTimeEl.textContent = '--';
        
        // Fade out game content
        gameContent.classList.remove('visible');
        gameContent.style.opacity = '0';
        gameContent.style.transform = 'translateY(20px)';
        
        // After fade out completes, hide content and fade in start button
        setTimeout(() => {
            gameContent.style.display = 'none';
            // Show and fade in start button
            gameStartBtn.classList.remove('hidden');
            gameStartBtn.style.opacity = '0';
            gameStartBtn.style.transform = 'translateY(10px)';
            gameStartBtn.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            // Trigger fade in
            setTimeout(() => {
                gameStartBtn.style.opacity = '1';
                gameStartBtn.style.transform = 'translateY(0)';
            }, 50);
        }, 600);
    }
    
    gameCloseBtn.addEventListener('click', closeGame);
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(function() {
    // Scroll-based animations and effects
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Add CSS for scroll to top button
const style = document.createElement('style');
style.textContent = `
    .scroll-to-top:hover {
        background: #f59e0b !important;
        transform: scale(1.1) !important;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
`;
document.head.appendChild(style);
