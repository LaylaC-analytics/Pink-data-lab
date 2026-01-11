/* ======================================================
   SIMPLE LOGIN (DEMO PURPOSE)
   ====================================================== */
function login() {
  const name = document.getElementById("username").value || "Visitor";

  alert(
    `Welcome, ${name}!\n\n` +
    `Welcome to my professional portfolio.\n` +
    `I hope you enjoy exploring my work.`
  );

  document.getElementById("login-screen").style.display = "none";
  document.getElementById("site-content").style.display = "block";

  initializeSite();
}

/* ======================================================
   INITIALIZE SITE AFTER LOGIN
   ====================================================== */
function initializeSite() {
  loadData();
  initParticles();
}

/* ======================================================
   LOAD DATA FROM JSON
   ====================================================== */
function loadData() {
  fetch("data.json")
    .then(response => response.json())
    .then(data => {
      loadSkills(data.skills);
      loadProjects(data.projects);
    })
    .catch(error => {
      console.error("Error loading data.json:", error);
    });
}

/* ======================================================
   SKILLS
   ====================================================== */
function loadSkills(skills) {
  const container = document.querySelector(".skills-container");
  if (!container) return;

  container.innerHTML = "";

  skills.forEach(skill => {
    const card = document.createElement("div");
    card.className = "skill-card";

    const name = document.createElement("div");
    name.className = "skill-name";
    name.textContent = skill.name;

    const bar = document.createElement("div");
    bar.className = "skill-bar";

    const level = document.createElement("div");
    level.className = "skill-level";

    bar.appendChild(level);
    card.appendChild(name);
    card.appendChild(bar);
    container.appendChild(card);

    // Animate skill bar
    setTimeout(() => {
      level.style.width = skill.level + "%";
    }, 300);
  });
}

/* ======================================================
   PROJECTS
   ====================================================== */
function loadProjects(projects) {
  const container = document.querySelector(".projects-container");
  if (!container) return;

  container.innerHTML = "";

  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modal-title");
  const modalCategory = document.getElementById("modal-category");
  const modalDescription = document.getElementById("modal-description");
  const closeModal = document.getElementById("close-modal");

  projects.forEach(project => {
    const card = document.createElement("div");
    card.className = "project-card";

    card.innerHTML = `
      <h3>${project.title}</h3>
      <p>${project.description}</p>
    `;

    card.addEventListener("click", () => {
      modal.style.display = "flex";
      modalTitle.textContent = project.title;
      modalCategory.textContent = "Category: " + project.category;
      modalDescription.textContent = project.description;
    });

    container.appendChild(card);
  });

  closeModal.onclick = () => (modal.style.display = "none");

  modal.onclick = event => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
}

/* ======================================================
   PARTICLES BACKGROUND
   ====================================================== */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = Math.random() * 3 + 1;
    this.speedX = Math.random() * 0.6 - 0.3;
    this.speedY = Math.random() * 0.6 - 0.3;
    this.opacity = Math.random() * 0.5 + 0.3;
  }

  move() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 105, 180, ${this.opacity})`;
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < 100; i++) {
    particles.push(new Particle());
  }
  animateParticles();
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(particle => {
    particle.move();
    particle.draw();
  });

  requestAnimationFrame(animateParticles);
}
