/* ======================================================
   INITIALIZE SITE AUTOMATICALLY
====================================================== */

document.addEventListener("DOMContentLoaded", function () {
  initializeSite();
});

function initializeSite() {
  loadData();
  initParticlesIfExists();
}

/* ======================================================
   LOAD DATA FROM JSON
====================================================== */

function loadData() {
  fetch("data.json")
    .then(response => response.json())
    .then(data => {
      if (data.skills) loadSkills(data.skills);
      if (data.projects) loadProjects(data.projects);
      if (data.pink_data_insights) loadProjectInsights(data.pink_data_insights);
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

/* ======================================================
   PROJECTS
====================================================== */

function loadProjects(projects) {
  const container = document.querySelector(".projects-container");
  if (!container) return;

  container.innerHTML = "";

  projects.forEach(project => {
    const card = document.createElement("div");
    card.className = "project-card";

    card.innerHTML = `
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      ${project.link ? `<a href="${project.link}" class="project-link">View Project</a>` : ""}
    `;

    container.appendChild(card);
  });
}

/* ======================================================
   PROJECT INSIGHTS PAGE
====================================================== */

function loadProjectInsights(project) {
  // Só roda se estiver na página project_insights.html

  const totalEl = document.getElementById("total-revenue");
  if (!totalEl) return;

  totalEl.textContent = project.total_revenue.toLocaleString();

  const productList = document.getElementById("product-list");
  const regionList = document.getElementById("region-list");
  const insightList = document.getElementById("insight-list");

  if (productList) {
    project.revenue_by_product.forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${item.product} — ${item.value}`;
      productList.appendChild(li);
    });
  }

  if (regionList) {
    project.revenue_by_region.forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${item.region} — ${item.value}`;
      regionList.appendChild(li);
    });
  }

  if (insightList) {
    project.insights.forEach(text => {
      const li = document.createElement("li");
      li.textContent = text;
      insightList.appendChild(li);
    });
  }
}

/* ======================================================
   PARTICLES BACKGROUND (SAFE VERSION)
====================================================== */

function initParticlesIfExists() {
  const canvas = document.getElementById("particles");
  if (!canvas) return;

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

  initParticles();
}
