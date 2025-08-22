// ========================================
// Pixel Background Generator
// ========================================

class PixelBackground {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.pixels = [];
    this.animationId = null;
    
    this.setupCanvas();
    this.generatePixels();
    this.animate();
  }
  
  setupCanvas() {
    const resize = () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    };
    
    resize();
    window.addEventListener('resize', resize);
  }
  
  generatePixels() {
    const pixelSize = 4;
    const spacing = 20;
    
    for (let x = 0; x < this.canvas.width; x += spacing) {
      for (let y = 0; y < this.canvas.height; y += spacing) {
        if (Math.random() > 0.7) {
          this.pixels.push({
            x: x,
            y: y,
            size: pixelSize,
            alpha: Math.random() * 0.5 + 0.1,
            speed: Math.random() * 0.02 + 0.01,
            color: this.getPixelColor()
          });
        }
      }
    }
  }
  
  getPixelColor() {
    const colors = ['#ff0040', '#cc0000', '#ff3366', '#ffffff'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  animate() {
    this.ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.pixels.forEach(pixel => {
      const pulse = Math.sin(Date.now() * pixel.speed) * 0.5 + 0.5;
      
      this.ctx.save();
      this.ctx.globalAlpha = pixel.alpha * pulse;
      this.ctx.fillStyle = pixel.color;
      this.ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size);
      
      if (pixel.color !== '#ffffff') {
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = pixel.color;
        this.ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size);
      }
      
      this.ctx.restore();
    });
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

// ========================================
// Particle System
// ========================================

class ParticleSystem {
  constructor() {
    this.container = document.querySelector('.particle-container');
    this.particles = [];
    this.maxParticles = 30;
    
    this.createParticles();
    this.startAnimation();
  }
  
  createParticles() {
    for (let i = 0; i < this.maxParticles; i++) {
      setTimeout(() => {
        this.addParticle();
      }, i * 200);
    }
  }
  
  addParticle() {
    if (this.particles.length >= this.maxParticles) return;
    
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const startX = Math.random() * window.innerWidth;
    const drift = (Math.random() - 0.5) * 200;
    
    particle.style.left = startX + 'px';
    particle.style.setProperty('--drift', drift + 'px');
    particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
    
    this.container.appendChild(particle);
    this.particles.push(particle);
    
    particle.addEventListener('animationend', () => {
      this.removeParticle(particle);
    });
  }
  
  removeParticle(particle) {
    const index = this.particles.indexOf(particle);
    if (index > -1) {
      this.particles.splice(index, 1);
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }
  }
  
  startAnimation() {
    setInterval(() => {
      if (this.particles.length < this.maxParticles) {
        this.addParticle();
      }
    }, 500);
  }
}

// ========================================
// Typing Animation
// ========================================

class TypingAnimation {
  constructor() {
    this.element = document.querySelector('.typing-text');
    this.cursor = document.querySelector('.cursor');
    this.texts = [
      'Football | Coding | Investor | Student',
      'Building awesome digital experiences',
      'One pixel at a time...',
      'Let\'s create something amazing!'
    ];
    this.currentIndex = 0;
    this.currentText = '';
    this.isDeleting = false;
    
    this.startTyping();
  }
  
  startTyping() {
    const fullText = this.texts[this.currentIndex];
    
    if (this.isDeleting) {
      this.currentText = fullText.substring(0, this.currentText.length - 1);
    } else {
      this.currentText = fullText.substring(0, this.currentText.length + 1);
    }
    
    this.element.innerHTML = this.currentText + '<span class="cursor">|</span>';
    
    let typeSpeed = this.isDeleting ? 50 : 100;
    
    if (!this.isDeleting && this.currentText === fullText) {
      typeSpeed = 2000;
      this.isDeleting = true;
    } else if (this.isDeleting && this.currentText === '') {
      this.isDeleting = false;
      this.currentIndex = (this.currentIndex + 1) % this.texts.length;
      typeSpeed = 500;
    }
    
    setTimeout(() => this.startTyping(), typeSpeed);
  }
}

// ========================================
// Scroll Animations
// ========================================

class ScrollAnimations {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    this.setupObserver();
    this.setupSkillBars();
  }
  
  setupObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          
          // Trigger skill bar animations
          if (entry.target.classList.contains('skill-branch')) {
            this.animateSkillBars(entry.target);
          }
        }
      });
    }, this.observerOptions);
    
    // Observe sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      observer.observe(section);
    });
    
    // Observe cards
    const cards = document.querySelectorAll('.project-card, .social-card, .skill-branch');
    cards.forEach(card => {
      observer.observe(card);
    });
  }
  
  setupSkillBars() {
    const skillFills = document.querySelectorAll('.skill-fill');
    skillFills.forEach(fill => {
      fill.style.width = '0%';
    });
  }
  
  animateSkillBars(skillBranch) {
    const skillFills = skillBranch.querySelectorAll('.skill-fill');
    skillFills.forEach((fill, index) => {
      setTimeout(() => {
        const targetWidth = fill.style.getPropertyValue('--width');
        fill.style.width = targetWidth;
      }, index * 200);
    });
  }
}

// ========================================
// Interactive Effects
// ========================================

class InteractiveEffects {
  constructor() {
    this.setupHoverEffects();
    this.setupClickEffects();
    this.setupScrollEffects();
  }
  
  setupHoverEffects() {
    // Project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        this.createHoverParticles(card);
      });
    });
    
    // Skill items
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        this.pulseElement(item);
      });
    });
    
    // Social cards
    const socialCards = document.querySelectorAll('.social-card');
    socialCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        this.createGlowEffect(card);
      });
    });
  }
  
  setupClickEffects() {
    const buttons = document.querySelectorAll('button, .social-card, .project-card');
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        this.createClickRipple(e.target, e);
      });
    });
  }
  
  setupScrollEffects() {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.updateParallax();
          ticking = false;
        });
        ticking = true;
      }
    });
  }
  
  createHoverParticles(element) {
    const rect = element.getBoundingClientRect();
    const particleCount = 5;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: #ff0040;
        box-shadow: 0 0 10px #ff0040;
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
      `;
      
      const x = rect.left + Math.random() * rect.width;
      const y = rect.top + Math.random() * rect.height;
      
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      
      document.body.appendChild(particle);
      
      const animation = particle.animate([
        { 
          transform: 'translate(0, 0) scale(1)',
          opacity: 1
        },
        { 
          transform: `translate(${(Math.random() - 0.5) * 100}px, ${-50 - Math.random() * 50}px) scale(0)`,
          opacity: 0
        }
      ], {
        duration: 1000,
        easing: 'ease-out'
      });
      
      animation.onfinish = () => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      };
    }
  }
  
  pulseElement(element) {
    element.style.animation = 'none';
    element.offsetHeight; // Force reflow
    element.style.animation = 'glow-pulse 0.5s ease-out';
  }
  
  createGlowEffect(element) {
    const glow = element.querySelector('.hover-glow');
    if (glow) {
      glow.style.animation = 'none';
      glow.offsetHeight; // Force reflow
      glow.style.animation = 'pulse-glow 0.8s ease-out';
    }
  }
  
  createClickRipple(element, event) {
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: radial-gradient(circle, rgba(255, 0, 64, 0.3) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
      z-index: 100;
    `;
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    const animation = ripple.animate([
      { transform: 'scale(0)', opacity: 1 },
      { transform: 'scale(2)', opacity: 0 }
    ], {
      duration: 600,
      easing: 'ease-out'
    });
    
    animation.onfinish = () => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    };
  }
  
  updateParallax() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.pixel-avatar, .skill-item');
    
    parallaxElements.forEach((element, index) => {
      const speed = 0.5 + (index * 0.1);
      const yPos = -(scrolled * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  }
}

// ========================================
// Performance Monitor
// ========================================

class PerformanceMonitor {
  constructor() {
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fps = 60;
    
    this.monitor();
  }
  
  monitor() {
    this.frameCount++;
    const currentTime = performance.now();
    
    if (currentTime - this.lastTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
      
      if (this.fps < 30) {
        console.warn('Low FPS detected:', this.fps);
        this.optimizeForLowPerformance();
      }
      
      this.frameCount = 0;
      this.lastTime = currentTime;
    }
    
    requestAnimationFrame(() => this.monitor());
  }
  
  optimizeForLowPerformance() {
    // Reduce particle count
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle, index) => {
      if (index % 2 === 0) {
        particle.style.display = 'none';
      }
    });
    
    // Reduce animation complexity
    document.body.classList.add('low-performance');
  }
}

// ========================================
// Main Portfolio Application
// ========================================

class GamePortfolio {
  constructor() {
    this.pixelBackground = null;
    this.particleSystem = null;
    this.typingAnimation = null;
    this.scrollAnimations = null;
    this.interactiveEffects = null;
    this.performanceMonitor = null;
    
    this.init();
  }
  
  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
    } else {
      this.initializeComponents();
    }
  }
  
  initializeComponents() {
    try {
      // Initialize pixel background
      const canvas = document.getElementById('pixelBackground');
      if (canvas) {
        this.pixelBackground = new PixelBackground(canvas);
      }
      
      // Initialize particle system
      this.particleSystem = new ParticleSystem();
      
      // Initialize typing animation
      this.typingAnimation = new TypingAnimation();
      
      // Initialize scroll animations
      this.scrollAnimations = new ScrollAnimations();
      
      // Initialize interactive effects
      this.interactiveEffects = new InteractiveEffects();
      
      // Initialize performance monitoring
      this.performanceMonitor = new PerformanceMonitor();
      
      // Add smooth scrolling for navigation
      this.setupSmoothScrolling();
      
      // Add loading complete class
      setTimeout(() => {
        document.body.classList.add('loaded');
      }, 1000);
      
    } catch (error) {
      console.error('Error initializing portfolio components:', error);
    }
  }
  
  setupSmoothScrolling() {
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
  
  destroy() {
    if (this.pixelBackground) {
      this.pixelBackground.destroy();
    }
  }
}

// ========================================
// Initialize Application
// ========================================

// Create global instance
window.gamePortfolio = new GamePortfolio();

// Handle page unload
window.addEventListener('beforeunload', () => {
  if (window.gamePortfolio) {
    window.gamePortfolio.destroy();
  }
});

// Add some additional dynamic keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse-glow {
    0% { opacity: 0; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1.2); }
    100% { opacity: 0; transform: scale(1); }
  }
  
  .loaded .animate-in {
    opacity: 1 !important;
    transform: translateY(0) !important;
    transition: all 0.8s ease-out;
  }
  
  .low-performance * {
    animation-duration: 0.1s !important;
  }
`;
document.head.appendChild(style);

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GamePortfolio;
}
