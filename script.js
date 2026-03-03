// ===== PAGE LOADER =====
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  if (loader) {
    const timeout = window.innerWidth < 768 ? 1000 : 1500;
    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(() => {
        loader.style.display = 'none';
      }, 500);
    }, timeout);
  }
});

// ===== HEADER SCROLL EFFECT =====
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  if (header) {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });
}

function closeMobileNav() {
  if (hamburger && mobileNav) {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Close mobile nav on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeMobileNav();
  }
});

// ===== SCROLL REVEAL ANIMATION =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { 
  threshold: 0.1, 
  rootMargin: '0px 0px -50px 0px' 
});

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav.main-nav a.nav-link, .mobile-nav a.mob-nav-link');

function setActiveNav() {
  let current = '';
  const scrollPos = window.scrollY + 100;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', setActiveNav);
window.addEventListener('load', setActiveNav);

// ===== COUNTER ANIMATION =====
function animateCounter(el, target) {
  const duration = window.innerWidth < 768 ? 1500 : 2000;
  const startTime = performance.now();
  
  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    
    el.textContent = current;
    
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      el.textContent = target;
    }
  }
  
  requestAnimationFrame(updateCounter);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNumbers = entry.target.querySelectorAll('.stat-number[data-target]');
      statNumbers.forEach(num => {
        const target = parseInt(num.getAttribute('data-target'));
        if (!isNaN(target)) {
          animateCounter(num, target);
        }
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const statsSection = document.getElementById('stats');
if (statsSection) {
  statsObserver.observe(statsSection);
}

// ===== APPOINTMENT FORM WITH FORMSPREE =====
const appointmentForm = document.getElementById('appointmentForm');

if (appointmentForm) {
  appointmentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.innerHTML;
    
    // Get form data
    const formData = new FormData(appointmentForm);
    
    // Show loading state
    submitBtn.innerHTML = '⏳ Sending...';
    submitBtn.disabled = true;
    
    try {
      // Submit to Formspree
      const response = await fetch(appointmentForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        // Success
        submitBtn.innerHTML = '✅ Request Submitted Successfully!';
        submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        appointmentForm.reset();
        
        // Reset button after 4 seconds
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 4000);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      // Error
      submitBtn.innerHTML = '❌ Error! Please try again.';
      submitBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
      
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 3000);
    }
  });
}

// ===== REVIEWS SYSTEM =====
// Initialize reviews from localStorage
let reviews = JSON.parse(localStorage.getItem('aac_reviews')) || [];

// Default reviews if none exist
if (reviews.length === 0) {
  reviews = [
    {
      id: 1,
      name: 'Rajesh Sharma',
      company: 'Medico Pharma',
      rating: 5,
      text: 'Aaron Air Care Engineering delivered exceptional results for our pharmaceutical facility. Their team\'s attention to detail and commitment to GMP compliance was outstanding.',
      date: '2026-01-15'
    },
    {
      id: 2,
      name: 'Prakash Kumar',
      company: 'Kumar Textiles',
      rating: 5,
      text: 'The modular AHU system they installed has significantly improved our production quality. Humidity control is precise, and we\'ve seen a 30% reduction in yarn breakage.',
      date: '2026-01-10'
    },
    {
      id: 3,
      name: 'Amit Gupta',
      company: 'Gupta Chemicals',
      rating: 5,
      text: 'Professional team, on-time delivery, and excellent after-sales support. Their AMC service keeps our systems running at peak efficiency.',
      date: '2026-01-05'
    }
  ];
  localStorage.setItem('aac_reviews', JSON.stringify(reviews));
}

// Display reviews
function displayReviews() {
  const reviewsList = document.getElementById('reviewsList');
  if (!reviewsList) return;
  
  if (reviews.length === 0) {
    reviewsList.innerHTML = '<div class="no-reviews">No reviews yet. Be the first to share your experience!</div>';
    return;
  }
  
  // Sort by date (newest first)
  const sortedReviews = [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  reviewsList.innerHTML = sortedReviews.map(review => `
    <div class="review-item" data-id="${review.id}">
      <div class="review-header">
        <div class="review-author-info">
          <h4>${escapeHtml(review.name)}</h4>
          <span>${escapeHtml(review.company || 'Customer')}</span>
        </div>
        <div class="review-rating">${'⭐'.repeat(review.rating)}</div>
      </div>
      <p class="review-text">${escapeHtml(review.text)}</p>
      <div class="review-date">${formatDate(review.date)}</div>
    </div>
  `).join('');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-IN', options);
}

// Handle review form submission
const reviewForm = document.getElementById('reviewForm');

if (reviewForm) {
  reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('reviewName').value.trim();
    const company = document.getElementById('reviewCompany').value.trim();
    const text = document.getElementById('reviewText').value.trim();
    const rating = document.querySelector('input[name="rating"]:checked');
    
    if (!name || !text || !rating) {
      alert('Please fill in all required fields and select a rating.');
      return;
    }
    
    const newReview = {
      id: Date.now(),
      name: name,
      company: company,
      rating: parseInt(rating.value),
      text: text,
      date: new Date().toISOString().split('T')[0]
    };
    
    // Add to reviews array
    reviews.push(newReview);
    
    // Save to localStorage
    localStorage.setItem('aac_reviews', JSON.stringify(reviews));
    
    // Show success message
    const submitBtn = reviewForm.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '✅ Review Submitted!';
    submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    
    // Reset form
    reviewForm.reset();
    
    // Update display
    displayReviews();
    
    // Reset button after 3 seconds
    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.style.background = '';
    }, 3000);
  });
}

// Display reviews on page load
document.addEventListener('DOMContentLoaded', displayReviews);

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#' || href === '') return;
    
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      
      const headerHeight = header ? header.offsetHeight : 76;
      const targetPosition = target.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      closeMobileNav();
    }
  });
});

// ===== PHONE INPUT FORMATTING =====
const phoneInput = document.getElementById('phone');
if (phoneInput) {
  phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 0 && !e.target.value.startsWith('+')) {
      if (value.startsWith('91')) {
        value = '+' + value;
      } else if (value.length >= 10) {
        value = '+91' + value;
      }
    }
    
    if (value.startsWith('+91') && value.length > 3) {
      const rest = value.slice(3);
      if (rest.length > 5) {
        value = '+91 ' + rest.slice(0, 5) + ' ' + rest.slice(5, 10);
      } else {
        value = '+91 ' + rest;
      }
    }
    
    e.target.value = value;
  });
}

// ===== LAZY LOADING FOR IMAGES =====
if ('IntersectionObserver' in window) {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  });
  
  lazyImages.forEach(img => imageObserver.observe(img));
}

// ===== DEBOUNCE SCROLL EVENTS =====
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

const debouncedScrollHandler = debounce(() => {
  // Any heavy scroll operations here
}, 16);

window.addEventListener('scroll', debouncedScrollHandler);

// ===== CONSOLE WELCOME MESSAGE =====
console.log('%c🔧 Aaron Air Care Engineering', 'font-size: 24px; font-weight: bold; color: #1e6fc4;');
console.log('%cProfessional HVAC Services', 'font-size: 14px; color: #4faee8;');
console.log('%c📞 Contact: +91 87099 48249', 'font-size: 12px; color: #666;');

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
  console.error('JavaScript Error:', e.message);
});

// ===== FORMSPREE SETUP INSTRUCTIONS =====
console.log('%c📧 FORMSPREE SETUP:', 'font-size: 14px; font-weight: bold; color: #f59e0b;');
console.log('%c1. Go to https://formspree.io/register', 'font-size: 12px; color: #666;');
console.log('%c2. Create account with: Salesaaronaircare@gmail.com', 'font-size: 12px; color: #666;');
console.log('%c3. Create new form and copy the form ID', 'font-size: 12px; color: #666;');
console.log('%c4. Replace YOUR_FORM_ID in HTML with your actual form ID', 'font-size: 12px; color: #666;');