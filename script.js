const heroSlides = Array.from(document.querySelectorAll('.hero-slide'));
const heroDots = Array.from(document.querySelectorAll('.dot-button'));
const heroTitle = document.getElementById('heroSlideTitle');
const heroCopy = document.getElementById('heroSlideCopy');
const header = document.querySelector('header');
const serviceCards = Array.from(document.querySelectorAll('.service-card'));
const projectCards = Array.from(document.querySelectorAll('#projects .project-card'));
const projectModal = document.getElementById('projectModal');
const closeProjectModalBtn = document.getElementById('closeProjectModal');
const projectModalCta = document.getElementById('projectModalCta');

let heroIndex = 0;
let selectedRate = 2500;
let lastScrollY = window.scrollY;

function closeServiceCards() {
  serviceCards.forEach((card) => {
    card.classList.remove('is-open');
    card.setAttribute('aria-expanded', 'false');
  });
}

function toggleServiceCard(card) {
  const isOpen = !card.classList.contains('is-open');
  closeServiceCards();

  if (!isOpen) return;

  card.classList.add('is-open');
  card.setAttribute('aria-expanded', String(isOpen));
}

serviceCards.forEach((card) => {
  card.addEventListener('click', () => toggleServiceCard(card));
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleServiceCard(card);
    }
  });
});

function showHeroSlide(index) {
  if (!heroSlides.length) return;

  heroIndex = (index + heroSlides.length) % heroSlides.length;

  heroSlides.forEach((slide, i) => {
    slide.classList.toggle('is-active', i === heroIndex);
  });

  heroDots.forEach((dot, i) => {
    dot.classList.toggle('is-active', i === heroIndex);
  });

  const activeSlide = heroSlides[heroIndex];
  if (activeSlide && heroTitle && heroCopy) {
    heroTitle.textContent = activeSlide.dataset.title || '';
    heroCopy.textContent = activeSlide.dataset.copy || '';
  }
}

heroDots.forEach((dot) => {
  dot.addEventListener('click', () => {
    showHeroSlide(Number(dot.dataset.slide));
  });
});

const projectDetails = {
  'naya-nazimabad-400': {
    title: 'Naya Nazimabad — 400 Sq Yd',
    tag: 'G+1 · Fully Finished Construction',
    location: 'Naya Nazimabad',
    size: '400 sq yd',
    structure: 'G+1',
    duration: '8 months',
    story: 'A 400 sq yd residential build in Naya Nazimabad, delivered as a fully finished turnkey project. AMKO handled everything from grey structure to final finishing, including flooring, electrical, plumbing and interior completion.',
    includes: ['Structural work','Electrical & plumbing','Flooring & tiling','Paint & finishing','Kitchen & bathroom completion'],
    image: 'https://picsum.photos/seed/amko-proj-1/900/620'
  },
  'naya-nazimabad-block-a': {
    title: 'Naya Nazimabad, Block A — 240 Sq Yd',
    tag: 'G+1 · Fully Finished Construction',
    location: 'Naya Nazimabad, Block A',
    size: '240 sq yd',
    structure: 'G+1',
    duration: '7 months',
    story: 'A compact family residence in Naya Nazimabad, Block A built with a practical layout and complete finishing scope. The project included grey structure works, electrical rough-in, plumbing and final internal fit-out.',
    includes: ['Structural work','Electrical rough-in','Plumbing network','Tiling & flooring','Paint & finishing'],
    image: 'https://picsum.photos/seed/amko-proj-2/900/620'
  },
  'meerut-society': {
    title: 'Meerut Society — 240 Sq Yd',
    tag: 'G+1 · Fully Finished Construction',
    location: 'Meerut Society',
    size: '240 sq yd',
    structure: 'G+1',
    duration: '7 months',
    story: 'A complete residential project in Meerut Society developed with durable materials and coordinated finishing. AMKO supervised the structure, services and final home-ready finishes for a more predictable delivery process.',
    includes: ['Structural work','Brickwork & plaster','Electrical & plumbing','Flooring & finishing','Internal fixtures'],
    image: 'https://picsum.photos/seed/amko-proj-3/900/620'
  },
  'naya-nazimabad-160': {
    title: 'Naya Nazimabad — 160 Sq Yd',
    tag: 'G+1 · Fully Finished Construction',
    location: 'Naya Nazimabad',
    size: '160 sq yd',
    structure: 'G+1',
    duration: '6 months',
    story: 'A compact 160 sq yd home in Naya Nazimabad planned around space efficiency and finish quality. The build focused on practical room planning, high-use areas and a clean handover timeline.',
    includes: ['Structural work','Kitchen planning','Electrical & plumbing','Flooring & wall finish','Paint & final handover'],
    image: 'https://picsum.photos/seed/amko-proj-4/900/620'
  },
  'naya-nazimabad-120': {
    title: 'Naya Nazimabad — 120 Sq Yd',
    tag: 'G+1 · Fully Finished Construction',
    location: 'Naya Nazimabad',
    size: '120 sq yd',
    structure: 'G+1',
    duration: '6 months',
    story: 'A practical 120 sq yd residential construction focused on efficient planning and durable finishing. The delivery included the structure, service lines and final surfaces ready for the homeowner’s move-in process.',
    includes: ['Structural work','Electrical & plumbing','Flooring & tiling','Paint & finishing','Entry & exterior touch-up'],
    image: 'https://picsum.photos/seed/amko-proj-5/900/620'
  }
};

function openProjectModal(projectCard) {
  if (!projectModal) return;

  const projectKey = projectCard.dataset.project || 'naya-nazimabad-400';
  const cardData = projectDetails[projectKey] || projectDetails['naya-nazimabad-400'];

  const modalTitle = document.getElementById('modalProjectTitle');
  const modalTag = document.getElementById('modalProjectTag');
  const modalLocation = document.getElementById('modalProjectLocation');
  const modalSize = document.getElementById('modalProjectSize');
  const modalStructure = document.getElementById('modalProjectStructure');
  const modalDuration = document.getElementById('modalProjectDuration');
  const modalStory = document.getElementById('modalProjectStory');
  const modalIncludes = document.getElementById('modalProjectIncludes');
  const modalImage = document.getElementById('modalProjectImage');

  if (modalTitle) modalTitle.textContent = cardData.title;
  if (modalTag) modalTag.textContent = cardData.tag;
  if (modalLocation) modalLocation.textContent = cardData.location;
  if (modalSize) modalSize.textContent = cardData.size;
  if (modalStructure) modalStructure.textContent = cardData.structure;
  if (modalDuration) modalDuration.textContent = cardData.duration;
  if (modalStory) modalStory.textContent = cardData.story;
  if (modalImage) modalImage.src = cardData.image;

  if (modalIncludes) {
    modalIncludes.innerHTML = cardData.includes.map((item) => `<li>${item}</li>`).join('');
  }

  projectModal.classList.add('is-open');
  projectModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  if (!projectModal) return;

  projectModal.classList.remove('is-open');
  projectModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

projectCards.forEach((card) => {
  card.addEventListener('click', () => openProjectModal(card));
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openProjectModal(card);
    }
  });
});

if (closeProjectModalBtn) {
  closeProjectModalBtn.addEventListener('click', closeProjectModal);
}

if (projectModalCta) {
  projectModalCta.addEventListener('click', (event) => {
    event.preventDefault();
    closeProjectModal();
    const estimator = document.getElementById('estimator');
    if (estimator) {
      estimator.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    window.location.hash = 'estimator';
  });
}

if (projectModal) {
  projectModal.addEventListener('click', (event) => {
    if (event.target === projectModal) closeProjectModal();
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && projectModal?.classList.contains('is-open')) {
    closeProjectModal();
  }
});

const heroTypeButtons = Array.from(document.querySelectorAll('.hero-estimator-type'));
heroTypeButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const rate = Number(btn.dataset.rate);
    selectedRate = rate;

    heroTypeButtons.forEach((b) => b.classList.toggle('is-selected', b === btn));

    document.querySelectorAll('.type-opt').forEach((opt) => {
      opt.classList.toggle('active', Number(opt.dataset.rate) === rate);
    });
  });
});

window.addEventListener('scroll', () => {
  if (!header) return;
  header.classList.toggle('is-scrolled', window.scrollY > 24);

  if (window.scrollY < lastScrollY) {
    closeServiceCards();
  }

  lastScrollY = window.scrollY;
});

const slideHold = 2000;
setInterval(() => {
  showHeroSlide(heroIndex + 1);
}, slideHold);

function selectType(el){
  document.querySelectorAll('.type-opt').forEach(o => o.classList.remove('active'));
  el.classList.add('active');
  selectedRate = parseInt(el.getAttribute('data-rate'));

  const matchingHeroType = heroTypeButtons.find((btn) => Number(btn.dataset.rate) === selectedRate);
  if (matchingHeroType) {
    heroTypeButtons.forEach((btn) => btn.classList.toggle('is-selected', btn === matchingHeroType));
  }
}
  function formatLakh(num){ return (num/100000).toFixed(1) + ' lac'; }
  function calculate(){
    const plotSize = parseFloat(document.getElementById('plotSize').value);
    const floors = parseInt(document.getElementById('floors').value);
    if(!plotSize || plotSize <= 0){
      document.getElementById('plotSize').focus();
      document.getElementById('plotSize').style.borderColor = '#c2953f';
      return;
    }
    const coveredAreaPerFloor = plotSize * 9 * 0.85;
    const totalCoveredArea = coveredAreaPerFloor * floors;
    const midCost = totalCoveredArea * selectedRate;
    const lowCost = midCost * 0.9, highCost = midCost * 1.1;
    document.getElementById('resultEmpty').style.display = 'none';
    document.getElementById('resultBox').style.display = 'block';
    document.getElementById('resultRange').textContent = 'Rs ' + formatLakh(lowCost) + ' – Rs ' + formatLakh(highCost);
    window._lastEstimate = {plotSize, floors, selectedRate, lowCost, highCost};
  }
  function sendToWhatsApp(){
    const loc = document.getElementById('location').value;
    const est = window._lastEstimate;
    if(!est) return;
    const typeLabel = est.selectedRate === 2500 ? 'Grey Structure with material' : 'Complete/Turnkey with material';
    const floorsLabel = est.floors === 1 ? 'Ground Floor' : est.floors === 2 ? 'Ground + 1' : 'Ground + 2';
    const msg = `Hi AMKO, I'd like a personalized estimate.\nLocation: ${loc}\nPlot size: ${est.plotSize} sq. yd.\nFloors: ${floorsLabel}\nConstruction type: ${typeLabel}`;
    window.open('https://wa.me/923222538025?text=' + encodeURIComponent(msg), '_blank');
  }
  function sendContactForm(){
    const name = document.getElementById('cName').value || 'there';
    const phone = document.getElementById('cPhone').value;
    const area = document.getElementById('cArea').value;
    const type = document.getElementById('cType').value;
    const msg = `Hi AMKO, my name is ${name}.\nPhone: ${phone}\nArea: ${area}\nProject type: ${type}`;
    window.open('https://wa.me/923222538025?text=' + encodeURIComponent(msg), '_blank');
  }
