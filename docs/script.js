/* ================= SIMPLE LOGIN (DEMO PURPOSE) ================= */
function login() {
  const name =
    document.getElementById("username").value.trim() || "Visitor";

  alert(
    `Welcome, ${name}!\n\n` +
      `Welcome to my professional portfolio.\n` +
      `Feel free to explore my projects and skills.`
  );

  document.getElementById("login-screen").style.display = "none";
  document.getElementById("site-content").style.display = "block";
}

/* ================= SKILLS DATA ================= */
const skills = [
  { name: "Python", level: 85 },
  { name: "SQL", level: 80 },
  { name: "Pandas", level: 85 },
  { name: "Data Visualization", level: 75 },
  { name: "Git & GitHub", level: 70 }
];

/* ================= LOAD SKILLS ================= */
function loadSkills() {
  const container = document.querySelector(".skills-container");
  if (!container) return;

  container.innerHTML = "";

  skills.forEach(skill => {
    const card = document.createElement("div");
    card.className = "skill-card";

    card.innerHTML = `
      <div class="skill-name">${skill.name}</div>
      <div class="skill-bar">
        <div class="skill-level"></div>
      </div>
    `;

    container.appendChild(card);

    const levelBar = card.querySelector(".skill-level");
    setTimeout(() => {
      levelBar.style.width = skill.level + "%";
    }, 300);
  });
}

document.addEventListener("DOMContentLoaded", loadSkills);

/* ================= FLOATING PINK PARTICLES ================= */
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

    if (this.x <= 0 || this.x >= canvas.width) this.speedX *= -1;
    if (this.y <= 0 || this.y >= canvas.height) this.speedY *= -1;
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
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.move();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();
