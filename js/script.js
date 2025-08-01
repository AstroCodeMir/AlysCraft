// ========== DOMContentLoaded ==========
document.addEventListener('DOMContentLoaded', () => {
  // --- Navigation toggle ---
  const toggleBtn = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const homeSection = document.getElementById('home');

  toggleBtn?.addEventListener('click', () => {
    const opening = navMenu.classList.contains('hidden');
    navMenu.classList.toggle('hidden');
    homeSection?.classList.toggle('mt-20', opening);
  });

  // --- Tab switching ---
  const tabButtons = document.querySelectorAll('[data-tab]');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = button.getAttribute('data-tab');
      tabContents.forEach(content => {
        if (targetId === 'all' || content.id === targetId) {
          content.classList.remove('hidden');
        } else {
          content.classList.add('hidden');
        }
      });
    });
  });

  // --- Fade on scroll ---
  const faders = document.querySelectorAll(".fade-on-scroll");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("opacity-100");
      }
    });
  }, { threshold: 0.1 });

  faders.forEach(el => observer.observe(el));
});


// ========== Testimonial Slider ==========
const testimonials = [
  {
    image: "images/469697456_439131182589515_360826362590728064_n.jpg",
    text: `I absolutely love this crochet top! The quality is amazing and it fits perfectly. The blue and white combination is so fresh and perfect for summer. I’ve gotten so many compliments every time I wear it. Thank you for this beautiful piece!`,
    author: "Ann Earl Reyes",
    avatar: "images/T-Ann.jpg",
  },
  {
    image: "images/JOY.jpg",
    text: `This crochet set is stunning! It's comfortable and stylish at the same time. I feel confident and beautiful every time I wear it. Totally worth it!`,
    author: "Joy Foja",
    avatar: "images/T-Joy.jpg",
  },
  {
    image: "images/TAMARA.jpg",
    text: `Little Tamara looks absolutely adorable in our Ice Bear bucket hat! The fit is perfect and the design is just too cute to handle. We’re in love! A must-have for every little fashionista!`,
    author: "Tamara",
    avatar: "images/T-TAMARA.jpg",
  },
];

let current = 0;
const bgImage = document.querySelector("img[alt='Background']");
const testimonialText = document.querySelector("blockquote p");
const authorName = document.querySelector("figcaption div");
const authorImg = document.querySelector("figcaption img");
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

function updateTestimonial(index) {
  const t = testimonials[index];
  if (bgImage) bgImage.src = t.image;
  if (testimonialText) testimonialText.textContent = t.text;
  if (authorName) authorName.textContent = t.author;
  if (authorImg) authorImg.src = t.avatar;
}

updateTestimonial(current);

prevBtn?.addEventListener("click", () => {
  current = (current - 1 + testimonials.length) % testimonials.length;
  updateTestimonial(current);
});

nextBtn?.addEventListener("click", () => {
  current = (current + 1) % testimonials.length;
  updateTestimonial(current);
});


// ========== Smooth Navigation Fade ==========
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        document.body.classList.add('transition-opacity', 'duration-500', 'opacity-0');
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'auto' });
          document.body.classList.remove('opacity-0');
        }, 400);
      }
    }
  });
});


// ========== Gallery Loading Spinner ==========
const urlParams = new URLSearchParams(window.location.search);
const shouldLoad = urlParams.get('load') === 'true';
const spinner = document.getElementById('loadingArea');
const galleryTabs = document.querySelectorAll('.tab-content');

if (spinner && galleryTabs.length) {
  if (shouldLoad) {
    spinner.classList.remove('hidden');
    galleryTabs.forEach(tab => tab.classList.add('hidden'));

    setTimeout(() => {
      spinner.classList.add('hidden');
      galleryTabs.forEach(tab => tab.classList.remove('hidden'));
    }, 2000);
  } else {
    spinner.classList.add('hidden');
    galleryTabs.forEach(tab => tab.classList.remove('hidden'));
  }
}


// ========== Modal Form Logic ==========
function openModal(button) {
  const title = button.getAttribute("data-title") || "";
  const description = button.getAttribute("data-description") || "";

  document.getElementById("formTitle").value = title;
  document.getElementById("formDescription").value = description;

  document.getElementById("inquireModal").classList.remove("hidden");
  document.getElementById("inquireModal").classList.add("flex");
}

function closeModal() {
  document.getElementById("inquireModal").classList.add("hidden");
  document.getElementById("inquireModal").classList.remove("flex");
  document.getElementById("modalForm").reset();
  hideAlert();
}

function showAlert(message, isSuccess = true) {
  const alert = document.getElementById("formAlert");
  alert.textContent = message;
  alert.className = isSuccess
    ? "text-green-700 bg-green-100 p-2 rounded"
    : "text-red-700 bg-red-100 p-2 rounded";
  alert.classList.remove("hidden");
}

function hideAlert() {
  const alert = document.getElementById("formAlert");
  alert.classList.add("hidden");
  alert.textContent = "";
}

document.getElementById("modalForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  fetch("https://formspree.io/f/xdkddvyz", {
    method: "POST",
    headers: {
      Accept: "application/json"
    },
    body: formData
  })
  .then(response => {
    if (response.ok) {
      showAlert("Thank you! Your inquiry was sent successfully.");
      setTimeout(() => {
        closeModal();
      }, 2000);
    } else {
      response.json().then(data => {
        const errorMsg = data?.errors?.[0]?.message || "Submission failed.";
        showAlert(errorMsg, false);
      });
    }
  })
  .catch(() => {
    showAlert("Network error. Please try again later.", false);
  });
});


// ========== Reset form on page load ==========
window.onload = function () {
  const form = document.querySelector("form");
  if (form) form.reset();
};
