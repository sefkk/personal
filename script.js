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
    const animatedElements = document.querySelectorAll('.section-title, .about-content, .game-content, .skills-grid, .projects-grid, .clients-grid, .contact-content');
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

    function handleParallax() {
        const scrolled = window.pageYOffset;
        // Set scroll threshold - larger on mobile to delay the effect
        const isMobile = window.innerWidth <= 768;
        const scrollThreshold = isMobile ? 400 : 200; // Start later on mobile
        
        // Only apply parallax after scrolling past the threshold
        if (scrolled > scrollThreshold) {
            const parallax = (scrolled - scrollThreshold) * 0.5;
            hero.style.transform = `translateY(${parallax}px)`;
        } else {
            // Reset transform when above threshold
            hero.style.transform = 'translateY(0px)';
        }
    }

    window.addEventListener('scroll', handleParallax);
    // Recalculate on resize to handle orientation changes
    window.addEventListener('resize', handleParallax);
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
    
    // Store touch data per card
    const touchData = new Map();
    
    projectCards.forEach(card => {
        touchData.set(card, { startTime: null, moved: false });
        
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Mobile touch support
        card.addEventListener('touchstart', function(e) {
            const data = touchData.get(this);
            data.startTime = Date.now();
            data.moved = false;
        }, { passive: true });
        
        card.addEventListener('touchmove', function() {
            const data = touchData.get(this);
            data.moved = true;
        }, { passive: true });
        
        card.addEventListener('touchend', function(e) {
            const data = touchData.get(this);
            // Only activate if it was a tap (not a swipe) and touch was brief
            const touchDuration = Date.now() - data.startTime;
            if (!data.moved && touchDuration < 300 && touchDuration > 0) {
                // Check if user tapped on a link - if so, let the link handle it
                const link = e.target.closest('.project-link');
                if (link) {
                    // Allow the link to work normally
                    return;
                }
                
                // Toggle the active state
                const isActive = this.classList.contains('mobile-active');
                
                // Remove active state from all other cards
                projectCards.forEach(otherCard => {
                    if (otherCard !== this) {
                        otherCard.classList.remove('mobile-active');
                    }
                });
                
                // Toggle this card's active state
                if (isActive) {
                    this.classList.remove('mobile-active');
                } else {
                    this.classList.add('mobile-active');
                }
            }
            // Reset touch data
            data.startTime = null;
            data.moved = false;
        }, { passive: true });
    });
    
    // Single document listener to remove active state when tapping outside
    document.addEventListener('touchstart', function(e) {
        const clickedCard = e.target.closest('.project-card');
        projectCards.forEach(card => {
            if (card !== clickedCard) {
                card.classList.remove('mobile-active');
            }
        });
    }, { passive: true });
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

// Snake Game
function initReactionGame() {
    const gameStartBtn = document.getElementById('game-start-btn');
    const gameContent = document.getElementById('game-content');
    const gameCloseBtn = document.getElementById('game-close-btn');
    const canvas = document.getElementById('snake-canvas');
    const gameOverlay = document.getElementById('game-overlay');
    const gameRestartBtn = document.getElementById('game-restart-btn');
    const currentScoreEl = document.getElementById('current-score');
    const highScoreEl = document.getElementById('high-score');
    const snakeLengthEl = document.getElementById('snake-length');
    const gameSpeedEl = document.getElementById('game-speed');
    const finalScoreEl = document.getElementById('final-score');
    
    // Control buttons
    const btnUp = document.getElementById('btn-up');
    const btnDown = document.getElementById('btn-down');
    const btnLeft = document.getElementById('btn-left');
    const btnRight = document.getElementById('btn-right');
    
    if (!gameStartBtn || !gameContent || !canvas || !gameCloseBtn) return;
    
    const ctx = canvas.getContext('2d');
    const gridSize = 20;
    const tileCount = canvas.width / gridSize;
    
    let snake = [{ x: 10, y: 10 }];
    let food = {};
    let dx = 0;
    let dy = 0;
    let score = 0;
    let highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
    let gameLoop = null;
    let gameStarted = false;
    let nextDirection = { x: 0, y: 0 };
    let gameSpeed = 1;
    let baseSpeed = 150;
    
    // Initialize high score display
    highScoreEl.textContent = highScore;
    
    // Generate random food position
    function generateFood() {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        // Make sure food doesn't spawn on snake
        for (let segment of snake) {
            if (segment.x === food.x && segment.y === food.y) {
                generateFood();
                return;
            }
        }
    }
    
    // Draw game
    function drawGame() {
        clearCanvas();
        drawSnake();
        drawFood();
    }
    
    // Clear canvas
    function clearCanvas() {
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Draw snake
    function drawSnake() {
        ctx.fillStyle = '#fbbf24';
        for (let segment of snake) {
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
        }
        // Draw head with different color
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(snake[0].x * gridSize, snake[0].y * gridSize, gridSize - 2, gridSize - 2);
    }
    
    // Draw food
    function drawFood() {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(
            food.x * gridSize + gridSize / 2,
            food.y * gridSize + gridSize / 2,
            gridSize / 2 - 2,
            0,
            2 * Math.PI
        );
        ctx.fill();
    }
    
    // Move snake
    function moveSnake() {
        // Apply next direction
        if (nextDirection.x !== 0 || nextDirection.y !== 0) {
            // Prevent reversing into itself
            if (dx === -nextDirection.x && dy === -nextDirection.y) {
                // Ignore reverse direction
            } else {
                dx = nextDirection.x;
                dy = nextDirection.y;
            }
        }
        
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        
        // Check wall collision
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            gameOver();
            return;
        }
        
        // Check self collision (skip the head itself)
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                gameOver();
                return;
            }
        }
        
        snake.unshift(head);
        
        // Check food collision
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            generateFood();
            updateStats();
            
            // Increase speed every 5 foods
            if (score % 50 === 0 && score > 0) {
                gameSpeed++;
                baseSpeed = Math.max(80, baseSpeed - 10);
                updateStats();
                // Restart game loop with new speed
                clearInterval(gameLoop);
                gameLoop = setInterval(moveSnake, baseSpeed);
            }
        } else {
            snake.pop();
        }
        
        drawGame();
    }
    
    // Update stats display
    function updateStats() {
        currentScoreEl.textContent = score;
        snakeLengthEl.textContent = snake.length;
        gameSpeedEl.textContent = gameSpeed;
        
        if (score > highScore) {
            highScore = score;
            highScoreEl.textContent = highScore;
            localStorage.setItem('snakeHighScore', highScore.toString());
        }
    }
    
    // Game over
    function gameOver() {
        gameStarted = false;
        clearInterval(gameLoop);
        finalScoreEl.textContent = score;
        gameOverlay.classList.add('active');
    }
    
    // Start game
    function startGame() {
        snake = [{ x: 10, y: 10 }];
        dx = 0;
        dy = 0;
        nextDirection = { x: 0, y: 0 };
        score = 0;
        gameSpeed = 1;
        baseSpeed = 150;
        gameStarted = true;
        gameOverlay.classList.remove('active');
        generateFood();
        updateStats();
        drawGame();
        
        // Start game loop
        if (gameLoop) clearInterval(gameLoop);
        gameLoop = setInterval(moveSnake, baseSpeed);
    }
    
    // Handle keyboard input
    function handleKeyPress(e) {
        if (!gameStarted) return;
        
        const key = e.key;
        switch(key) {
            case 'ArrowUp':
                e.preventDefault();
                if (dy !== 1) nextDirection = { x: 0, y: -1 };
                break;
            case 'ArrowDown':
                e.preventDefault();
                if (dy !== -1) nextDirection = { x: 0, y: 1 };
                break;
            case 'ArrowLeft':
                e.preventDefault();
                if (dx !== 1) nextDirection = { x: -1, y: 0 };
                break;
            case 'ArrowRight':
                e.preventDefault();
                if (dx !== -1) nextDirection = { x: 1, y: 0 };
                break;
        }
    }
    
    // Control button handlers
    if (btnUp) {
        btnUp.addEventListener('click', () => {
            if (gameStarted && dy !== 1) nextDirection = { x: 0, y: -1 };
        });
    }
    if (btnDown) {
        btnDown.addEventListener('click', () => {
            if (gameStarted && dy !== -1) nextDirection = { x: 0, y: 1 };
        });
    }
    if (btnLeft) {
        btnLeft.addEventListener('click', () => {
            if (gameStarted && dx !== 1) nextDirection = { x: -1, y: 0 };
        });
    }
    if (btnRight) {
        btnRight.addEventListener('click', () => {
            if (gameStarted && dx !== -1) nextDirection = { x: 1, y: 0 };
        });
    }
    
    // Touch swipe controls - improved for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    let touchMoved = false;
    
    canvas.addEventListener('touchstart', (e) => {
        if (!gameStarted) return;
        e.preventDefault();
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchMoved = false;
    }, { passive: false });
    
    canvas.addEventListener('touchmove', (e) => {
        if (!gameStarted) return;
        e.preventDefault();
        touchMoved = true;
    }, { passive: false });
    
    canvas.addEventListener('touchend', (e) => {
        if (!gameStarted) return;
        e.preventDefault();
        
        // Only process swipe if there was movement
        if (!touchMoved) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        
        // Minimum swipe distance (reduced for better responsiveness)
        const minSwipeDistance = 20;
        
        // Determine if swipe is more horizontal or vertical
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Horizontal swipe
            if (Math.abs(diffX) > minSwipeDistance) {
                if (diffX > 0 && dx !== -1) {
                    // Swipe right
                    nextDirection = { x: 1, y: 0 };
                } else if (diffX < 0 && dx !== 1) {
                    // Swipe left
                    nextDirection = { x: -1, y: 0 };
                }
            }
        } else {
            // Vertical swipe
            if (Math.abs(diffY) > minSwipeDistance) {
                if (diffY > 0 && dy !== -1) {
                    // Swipe down
                    nextDirection = { x: 0, y: 1 };
                } else if (diffY < 0 && dy !== 1) {
                    // Swipe up
                    nextDirection = { x: 0, y: -1 };
                }
            }
        }
        
        touchMoved = false;
    }, { passive: false });
    
    // Keyboard event listener
    window.addEventListener('keydown', handleKeyPress);
    
    // Start button click handler
    gameStartBtn.addEventListener('click', function() {
        gameStartBtn.style.opacity = '';
        gameStartBtn.style.transform = '';
        gameStartBtn.style.transition = '';
        
        gameStartBtn.classList.add('hidden');
        
        gameContent.style.display = 'block';
        gameContent.style.opacity = '0';
        gameContent.style.transform = 'translateY(20px)';
        setTimeout(() => {
            gameContent.classList.add('visible');
            gameContent.style.opacity = '1';
            gameContent.style.transform = 'translateY(0)';
        }, 10);
        
        setTimeout(() => {
            startGame();
        }, 600);
    });
    
    // Restart button
    if (gameRestartBtn) {
        gameRestartBtn.addEventListener('click', startGame);
    }
    
    // Close button handler
    function closeGame() {
        if (gameLoop) clearInterval(gameLoop);
        gameStarted = false;
        gameOverlay.classList.remove('active');
        
        gameContent.classList.remove('visible');
        gameContent.style.opacity = '0';
        gameContent.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            gameContent.style.display = 'none';
            gameStartBtn.classList.remove('hidden');
            gameStartBtn.style.opacity = '0';
            gameStartBtn.style.transform = 'translateY(10px)';
            gameStartBtn.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
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
