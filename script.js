const heroSlides = Array.from(document.querySelectorAll('.hero-slide'));
const heroDots = Array.from(document.querySelectorAll('.dot-button'));
const heroTitle = document.getElementById('heroSlideTitle');
const heroCopy = document.getElementById('heroSlideCopy');
const header = document.querySelector('header');

let heroIndex = 0;
let selectedRate = 2500;

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
});

setInterval(() => {
  showHeroSlide(heroIndex + 1);
}, 6200);

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
