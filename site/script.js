// ================= CARREGAR DADOS =================
fetch('data.json')
.then(response => response.json())
.then(data => {
    carregarSkills(data.skills);
    carregarProjects(data.projects);
})
.catch(error => console.error('Erro ao carregar os dados:', error));

// ================= HABILIDADES =================
function carregarSkills(skills) {
    const container = document.querySelector('.skills-container');
    skills.forEach(skill => {
        const card = document.createElement('div');
        card.className = 'skill-card';

        const nome = document.createElement('div');
        nome.className = 'skill-name';
        nome.textContent = skill.name;

        const barra = document.createElement('div');
        barra.className = 'skill-bar';
        const nivel = document.createElement('div');
        nivel.className = 'skill-level';
        barra.appendChild(nivel);

        card.appendChild(nome);
        card.appendChild(barra);
        container.appendChild(card);

        // Animação da barra
        setTimeout(() => {
            nivel.style.width = skill.level + '%';
        }, 200);
    });
}

// ================= PROJETOS =================
function carregarProjects(projects) {
    const container = document.querySelector('.projects-container');
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalCategory = document.getElementById('modal-category');
    const modalDesc = document.getElementById('modal-description');
    const closeModal = document.getElementById('close-modal');

    projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `<h3>${project.title}</h3><p>${project.description}</p>`;
        
        // Abrir modal
        card.addEventListener('click', () => {
            modal.style.display = 'flex';
            modalTitle.textContent = project.title;
            modalCategory.textContent = 'Categoria: ' + project.category;
            modalDesc.textContent = project.description;
        });

        container.appendChild(card);
    });

    // Fechar modal
    closeModal.addEventListener('click', () => modal.style.display = 'none');
    modal.addEventListener('click', e => {
        if (e.target === modal) modal.style.display = 'none';
    });
}

// ================= PARTÍCULAS DE FUNDO =================
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particlesArray;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

class Particle {
    constructor(){
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
    }
    update(){
        this.x += this.speedX;
        this.y += this.speedY;
        if(this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if(this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw(){
        ctx.fillStyle = 'rgba(255,105,180,0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
        ctx.fill();
    }
}

function initParticles(){
    particlesArray = [];
    for(let i=0; i<80; i++){
        particlesArray.push(new Particle());
    }
}
function animateParticles(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particlesArray.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();
