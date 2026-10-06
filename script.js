const heroSlides = Array.from(document.querySelectorAll('.hero-slide'));
const header = document.querySelector('header');
const menuToggle = document.querySelector('.menu-toggle');
const primaryNavigation = document.getElementById('primary-navigation');
const serviceTriggers = Array.from(document.querySelectorAll('.service-explore'));
const serviceDialog = document.getElementById('serviceDialog');
const serviceDialogTitle = document.getElementById('serviceDialogTitle');
const serviceDialogViews = Array.from(document.querySelectorAll('.service-dialog-view'));
const projectCards = Array.from(document.querySelectorAll('#projects .project-card'));
const projectModal = document.getElementById('projectModal');
const closeProjectModalBtn = document.getElementById('closeProjectModal');
const projectModalCta = document.getElementById('projectModalCta');
const processItems = Array.from(document.querySelectorAll('.process-item'));
const reelCards = Array.from(document.querySelectorAll('.reel-card, .spotlight-media'));
const reelModal = document.getElementById('reelModal');
const closeReelModalBtn = document.getElementById('closeReelModal');
const reelModalPlayer = document.getElementById('reelModalPlayer');
const reelModalPlaceholder = reelModal?.querySelector('.reel-modal-placeholder');
let lastReelTrigger = null;

let heroIndex = 0;
let lastScrollY = window.scrollY;
let activeProjectCard = null;
let lastProjectTrigger = null;
let lastServiceTrigger = null;

function setPrimaryNavigationOpen(isOpen) {
  if (!menuToggle || !primaryNavigation) return;

  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  primaryNavigation.classList.toggle('is-open', isOpen);
  header?.classList.toggle('has-open-nav', isOpen);
}

function keepModalFocusInside(event, modal) {
  if (event.key !== 'Tab') return;

  const focusableElements = Array.from(
    modal.querySelectorAll('a[href], button:not(:disabled), [tabindex]:not([tabindex="-1"])')
  ).filter((element) => !element.hidden && element.getClientRects().length);
  if (!focusableElements.length) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  setPrimaryNavigationOpen(!isOpen);
});

primaryNavigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    const menuWasOpen = menuToggle?.getAttribute('aria-expanded') === 'true';
    setPrimaryNavigationOpen(false);
    if (menuWasOpen) menuToggle.focus();
  });
});

document.addEventListener('click', (event) => {
  if (header && !header.contains(event.target)) {
    setPrimaryNavigationOpen(false);
  }
});

window.matchMedia('(max-width: 1000px)').addEventListener('change', (event) => {
  if (!event.matches) setPrimaryNavigationOpen(false);
});

function openReelModal(reelCard) {
  if (!reelModal) return;

  lastReelTrigger = reelCard;
  setReelPreviewsActive(false);
  const title = reelCard.dataset.reelTitle || 'AMKO Reel';
  const copy = reelCard.dataset.reelCopy || '';
  const videoSrc = reelCard.dataset.videoSrc;
  document.getElementById('reelModalTitle').textContent = title;
  document.getElementById('reelModalCopy').textContent = copy;
  reelModal.querySelector('.reel-modal-panel')?.classList.toggle(
    'is-landscape',
    reelCard.classList.contains('spotlight-media')
  );
  if (reelModalPlayer && reelModalPlaceholder) {
    reelModalPlayer.pause();
    reelModalPlayer.hidden = !videoSrc;
    reelModalPlaceholder.hidden = Boolean(videoSrc);
    if (videoSrc) {
      reelModalPlayer.src = videoSrc;
      reelModalPlayer.load();
      reelModalPlayer.play().catch((error) => {
        if (!['AbortError', 'NotAllowedError'].includes(error.name)) {
          console.error('Unable to play featured project video.', error);
        }
      });
    } else {
      reelModalPlayer.removeAttribute('src');
      reelModalPlayer.load();
    }
  }
  reelModal.classList.add('is-open');
  reelModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  window.setTimeout(() => {
    if (reelModal.classList.contains('is-open')) closeReelModalBtn?.focus();
  }, 0);
}

function closeReelModal() {
  if (!reelModal) return;
  reelModal.classList.remove('is-open');
  reelModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (reelModalPlayer && reelModalPlaceholder) {
    reelModalPlayer.pause();
    reelModalPlayer.removeAttribute('src');
    reelModalPlayer.load();
    reelModalPlayer.hidden = true;
    reelModalPlaceholder.hidden = false;
  }
  setReelPreviewsActive(true);
  lastReelTrigger?.focus();
}

reelCards.forEach((card) => {
  card.addEventListener('click', () => openReelModal(card));
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openReelModal(card);
    }
  });
});

const reelPreviewObserver = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const preview = entry.target;
        if (entry.isIntersecting) {
          if (!preview.src) preview.src = preview.closest('.reel-card').dataset.videoSrc;
          if (preview.paused) {
            preview.play().catch((error) => {
              if (!['AbortError', 'NotAllowedError'].includes(error.name)) {
                console.error('Unable to play featured project preview.', error);
              }
            });
          }
        } else if (!preview.paused) {
          preview.pause();
        }
      });
    }, { threshold: 0.25, rootMargin: '50px' })
  : null;

document.querySelectorAll('[data-reel-preview]').forEach((preview) => {
  if (reelPreviewObserver) {
    reelPreviewObserver.observe(preview);
  } else {
    preview.src = preview.closest('.reel-card').dataset.videoSrc;
    preview.play().catch((error) => {
      if (!['AbortError', 'NotAllowedError'].includes(error.name)) {
        console.error('Unable to play featured project preview.', error);
      }
    });
  }
});

function setReelPreviewsActive(isActive) {
  document.querySelectorAll('[data-reel-preview]').forEach((preview) => {
    if (!isActive) {
      preview.pause();
      reelPreviewObserver?.unobserve(preview);
      return;
    }

    if (reelPreviewObserver) {
      reelPreviewObserver.observe(preview);
    } else if (preview.paused) {
      preview.play().catch((error) => {
        if (!['AbortError', 'NotAllowedError'].includes(error.name)) {
          console.error('Unable to play featured project preview.', error);
        }
      });
    }
  });
}

closeReelModalBtn?.addEventListener('click', closeReelModal);
reelModal?.addEventListener('click', (event) => {
  if (event.target === reelModal) closeReelModal();
});
reelModal?.addEventListener('keydown', (event) => keepModalFocusInside(event, reelModal));

serviceTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => {
    if (!serviceDialog || !serviceDialogTitle) return;

    const service = trigger.dataset.serviceTarget;
    const serviceCard = trigger.closest('.service-card');
    const serviceName = serviceCard?.querySelector('.service-card-label')?.textContent?.trim();
    const activeView = serviceDialogViews.find((view) => view.dataset.serviceDetail === service);
    if (!serviceName || !activeView) return;

    lastServiceTrigger = trigger;
    serviceDialogTitle.textContent = serviceName;
    serviceDialogViews.forEach((view) => {
      view.hidden = view !== activeView;
    });
    serviceDialog.showModal();
  });
});

document.querySelectorAll('.service-card').forEach((card) => {
  card.addEventListener('click', (event) => {
    if (event.target.closest('.service-explore')) return;
    card.querySelector('.service-explore')?.click();
  });
});

serviceDialog?.addEventListener('click', (event) => {
  if (event.target === serviceDialog) serviceDialog.close();
});

serviceDialog?.addEventListener('close', () => {
  lastServiceTrigger?.focus();
});

serviceDialog?.querySelector('.service-dialog-cta')?.addEventListener('click', () => {
  serviceDialog.close();
});

function showHeroSlide(index) {
  if (!heroSlides.length) return;

  heroIndex = (index + heroSlides.length) % heroSlides.length;
  heroSlides.forEach((slide, i) => {
    slide.classList.toggle('is-active', i === heroIndex);
  });
}

function animateStatNumber(element) {
  if (!element || element.dataset.animated === 'true') return;

  const targetText = element.dataset.target || '0';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    element.textContent = targetText;
    element.dataset.animated = 'true';
    return;
  }

  const match = targetText.match(/\d+(?:\.\d+)?/);
  if (!match) return;

  const targetValue = Number.parseFloat(match[0]);
  const prefix = targetText.slice(0, targetText.indexOf(match[0]));
  const suffix = targetText.slice(targetText.indexOf(match[0]) + match[0].length);
  const duration = 1200;
  const startTime = performance.now();

  function update(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const currentValue = targetValue * eased;
    const displayValue = Number.isInteger(targetValue)
      ? Math.round(currentValue)
      : currentValue.toFixed(1);

    element.textContent = `${prefix}${displayValue}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(update);
      return;
    }

    element.textContent = targetText;
    element.dataset.animated = 'true';
  }

  requestAnimationFrame(update);
}

const statNumbers = document.querySelectorAll('.stat-cell .num');
if (statNumbers.length) {
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateStatNumber(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.35
  });

  statNumbers.forEach((number) => {
    number.textContent = '0';
    statObserver.observe(number);
  });
}

if (processItems.length) {
  const processObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, {
    threshold: 0.25,
    rootMargin: '0px 0px -30px 0px'
  });

  processItems.forEach((item) => {
    processObserver.observe(item);
  });
}

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
    images: [
      'https://picsum.photos/seed/amko-proj-1/900/620',
      'https://picsum.photos/seed/amko-proj-2/900/620',
      'https://picsum.photos/seed/amko-proj-3/900/620',
      'https://picsum.photos/seed/amko-proj-4/900/620'
    ]
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
    images: [
      'https://picsum.photos/seed/amko-proj-2/900/620',
      'https://picsum.photos/seed/amko-proj-3/900/620',
      'https://picsum.photos/seed/amko-proj-4/900/620',
      'https://picsum.photos/seed/amko-proj-1/900/620'
    ]
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
    images: [
      'https://picsum.photos/seed/amko-proj-3/900/620',
      'https://picsum.photos/seed/amko-proj-4/900/620',
      'https://picsum.photos/seed/amko-proj-5/900/620',
      'https://picsum.photos/seed/amko-proj-2/900/620'
    ]
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
    images: [
      'https://picsum.photos/seed/amko-proj-4/900/620',
      'https://picsum.photos/seed/amko-proj-1/900/620',
      'https://picsum.photos/seed/amko-proj-2/900/620',
      'https://picsum.photos/seed/amko-proj-3/900/620'
    ]
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
    images: [
      'https://picsum.photos/seed/amko-proj-5/900/620',
      'https://picsum.photos/seed/amko-proj-1/900/620',
      'https://picsum.photos/seed/amko-proj-2/900/620',
      'https://picsum.photos/seed/amko-proj-4/900/620'
    ]
  },
  'dha-phase-6-300': {
    title: 'DHA Phase 6 — 300 Sq Yd',
    tag: 'G+1 · Complete Construction',
    location: 'DHA Phase 6',
    size: '300 sq yd',
    structure: 'G+1',
    duration: '8 months',
    story: 'A 300 sq yd DHA residence with a practical family layout, coordinated services, and complete finishing works.',
    includes: ['Structural work', 'Electrical & plumbing', 'Flooring & tiling', 'Paint & finishing', 'Exterior completion'],
    images: [
      'https://picsum.photos/seed/dha-300-1/900/620',
      'https://picsum.photos/seed/dha-300-2/900/620',
      'https://picsum.photos/seed/dha-300-3/900/620',
      'https://picsum.photos/seed/dha-300-4/900/620'
    ]
  }
};

function buildModalGallery(images) {
  const dots = document.getElementById('modalProjectDots');

  if (!dots) return [];

  dots.innerHTML = images
    .map((_, index) => `<button class="project-modal-dot${index === 0 ? ' is-active' : ''}" type="button" data-slide="${index}" aria-label="Show project image ${index + 1}"></button>`)
    .join('');

  return images;
}

function showProjectImage(imageIndex, images) {
  const modalImage = document.getElementById('modalProjectImage');
  const dots = document.getElementById('modalProjectDots');
  if (!modalImage || !dots || !images.length) return;

  const cleanIndex = (imageIndex + images.length) % images.length;
  modalImage.classList.add('project-modal-photo-fading');

  setTimeout(() => {
    modalImage.src = images[cleanIndex];
    modalImage.alt = `${document.getElementById('modalProjectTitle')?.textContent || 'Project'}, image ${cleanIndex + 1}`;
    modalImage.classList.remove('project-modal-photo-fading');
  }, 280);

  Array.from(dots.children).forEach((dot, i) => {
    dot.classList.toggle('is-active', i === cleanIndex);
  });
}

function openProjectModal(projectCard) {
  if (!projectModal) return;

  lastProjectTrigger = projectCard;
  activeProjectCard?.classList.remove('is-open');
  activeProjectCard?.setAttribute('aria-expanded', 'false');
  activeProjectCard = projectCard;
  activeProjectCard.classList.add('is-open');
  activeProjectCard.setAttribute('aria-expanded', 'true');

  const projectKey = projectCard.dataset.project || 'naya-nazimabad-400';
  const cardData = projectDetails[projectKey] || projectDetails['naya-nazimabad-400'];

  const modalTitle = document.getElementById('modalProjectTitle');
  const modalLocation = document.getElementById('modalProjectLocation');
  const modalSize = document.getElementById('modalProjectSize');
  const modalStructure = document.getElementById('modalProjectStructure');
  const modalDuration = document.getElementById('modalProjectDuration');
  const modalStory = document.getElementById('modalProjectStory');
  const modalIncludes = document.getElementById('modalProjectIncludes');
  const modalImage = document.getElementById('modalProjectImage');

  if (modalTitle) modalTitle.textContent = cardData.title;
  if (modalLocation) modalLocation.textContent = cardData.location;
  if (modalSize) modalSize.textContent = cardData.size;
  if (modalStructure) modalStructure.textContent = cardData.structure;
  if (modalDuration) modalDuration.textContent = cardData.duration;
  if (modalStory) modalStory.textContent = cardData.story;
  if (modalImage) {
    modalImage.src = cardData.images[0];
    modalImage.alt = `${cardData.title}, image 1`;
  }

  if (modalIncludes) {
    modalIncludes.innerHTML = cardData.includes.map((item) => `<li>${item}</li>`).join('');
  }

  let images = buildModalGallery(cardData.images || []);
  let imageIndex = 0;
  const dots = document.getElementById('modalProjectDots');

  if (dots) {
    dots.querySelectorAll('button').forEach((dot) => {
      dot.addEventListener('click', () => {
        imageIndex = Number(dot.dataset.slide);
        showProjectImage(imageIndex, images);
      });
    });
  }

  const modalMedia = document.querySelector('.project-modal-media');
  if (modalMedia) {
    modalMedia.onmouseenter = () => clearInterval(window.projectCarouselTimer);
    modalMedia.onmouseleave = () => {
      clearInterval(window.projectCarouselTimer);
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.projectCarouselTimer = setInterval(() => {
          imageIndex = (imageIndex + 1) % images.length;
          showProjectImage(imageIndex, images);
        }, 3500);
      }
    };
  }

  clearInterval(window.projectCarouselTimer);
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.projectCarouselTimer = setInterval(() => {
      imageIndex = (imageIndex + 1) % images.length;
      showProjectImage(imageIndex, images);
    }, 3500);
  }

  projectModal.classList.add('is-open');
  projectModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  window.setTimeout(() => {
    if (projectModal.classList.contains('is-open')) closeProjectModalBtn?.focus();
  }, 0);
}

function closeProjectModal() {
  if (!projectModal) return;

  clearInterval(window.projectCarouselTimer);
  projectModal.classList.remove('is-open');
  projectModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  activeProjectCard?.classList.remove('is-open');
  activeProjectCard?.setAttribute('aria-expanded', 'false');
  activeProjectCard = null;
  lastProjectTrigger?.focus();
  lastProjectTrigger = null;
}

projectModal?.addEventListener('keydown', (event) => keepModalFocusInside(event, projectModal));

function initializeProjectCarousel(card) {
  const carousel = card.querySelector('.project-media-stack');
  const slides = Array.from(carousel?.querySelectorAll('.mini-media') || []);
  if (!carousel || !slides.length) return;

  const projectName = card.querySelector('.project-body h3')?.textContent.trim() || 'Project';
  let activeIndex = 0;
  let touchStart = null;
  carousel.setAttribute('role', 'region');
  carousel.setAttribute('aria-roledescription', 'carousel');
  carousel.setAttribute('aria-label', `${projectName} project images`);

  const controls = document.createElement('div');
  controls.className = 'project-carousel-controls';
  controls.setAttribute('aria-label', 'Project image controls');

  const dots = document.createElement('div');
  dots.className = 'project-carousel-dots';

  const updateSlide = (nextIndex) => {
    activeIndex = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, index) => {
      const isActive = index === activeIndex;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
      slide.alt = `${projectName}, project image ${index + 1}`;
    });
    Array.from(dots.children).forEach((dot, index) => {
      dot.setAttribute('aria-pressed', String(index === activeIndex));
    });
  };

  const createArrow = (direction, label, symbol) => {
    const button = document.createElement('button');
    button.className = 'project-carousel-arrow';
    button.type = 'button';
    button.setAttribute('aria-label', label);
    button.textContent = symbol;
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      updateSlide(activeIndex + direction);
    });
    button.addEventListener('keydown', (event) => event.stopPropagation());
    return button;
  };

  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = 'project-carousel-dot';
    dot.type = 'button';
    dot.setAttribute('aria-label', `Show ${projectName} image ${index + 1} of ${slides.length}`);
    dot.addEventListener('click', (event) => {
      event.stopPropagation();
      updateSlide(index);
    });
    dot.addEventListener('keydown', (event) => event.stopPropagation());
    dots.append(dot);
  });

  controls.append(
    createArrow(-1, `Previous ${projectName} image`, '\u2190'),
    dots,
    createArrow(1, `Next ${projectName} image`, '\u2192')
  );
  controls.addEventListener('click', (event) => event.stopPropagation());
  controls.addEventListener('keydown', (event) => event.stopPropagation());
  carousel.append(controls);
  updateSlide(0);

  carousel.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'touch' || event.target.closest('button')) return;
    touchStart = { x: event.clientX, y: event.clientY };
  });
  carousel.addEventListener('pointerup', (event) => {
    if (!touchStart || event.target.closest('button')) {
      touchStart = null;
      return;
    }
    const deltaX = event.clientX - touchStart.x;
    const deltaY = event.clientY - touchStart.y;
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      updateSlide(activeIndex + (deltaX < 0 ? 1 : -1));
    }
    touchStart = null;
  });
  carousel.addEventListener('pointercancel', () => {
    touchStart = null;
  });

  card.tabIndex = 0;
  card.setAttribute('role', 'group');
  card.setAttribute('aria-label', `${projectName} project card. Press Enter for details.`);
  card.setAttribute('aria-haspopup', 'dialog');
  card.setAttribute('aria-expanded', 'false');

  card.addEventListener('keydown', (event) => {
    if (event.target !== card) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      updateSlide(activeIndex + (event.key === 'ArrowRight' ? 1 : -1));
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openProjectModal(card);
    }
  });
}

projectCards.forEach((card) => {
  initializeProjectCarousel(card);
  card.addEventListener('click', (event) => {
    if (event.target.closest('.project-carousel-controls')) return;
    openProjectModal(card);
  });
});

if (closeProjectModalBtn) {
  closeProjectModalBtn.addEventListener('click', closeProjectModal);
}

if (projectModalCta) {
  projectModalCta.addEventListener('click', closeProjectModal);
}

if (projectModal) {
  projectModal.addEventListener('click', (event) => {
    if (event.target === projectModal) closeProjectModal();
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuToggle?.getAttribute('aria-expanded') === 'true') {
    setPrimaryNavigationOpen(false);
    menuToggle.focus();
  }
  if (event.key === 'Escape' && reelModal?.classList.contains('is-open')) {
    closeReelModal();
  }
  if (event.key === 'Escape' && projectModal?.classList.contains('is-open')) {
    closeProjectModal();
  }
});

window.addEventListener('scroll', () => {
  if (!header) return;
  if (header.classList.contains('has-open-nav')) return;

  const currentScrollY = window.scrollY;
  const scrollingDown = currentScrollY > lastScrollY;

  if (currentScrollY <= 24) {
    header.classList.remove('is-hidden');
    header.classList.remove('is-light');
  } else if (scrollingDown) {
    header.classList.add('is-hidden');
    header.classList.remove('is-light');
  } else {
    header.classList.remove('is-hidden');
    header.classList.add('is-light');
  }

  lastScrollY = currentScrollY;
});

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  setInterval(() => {
    showHeroSlide(heroIndex + 1);
  }, 5500);
}

function sendContactForm(){
  const name = document.getElementById('cName').value || 'there';
  const phone = document.getElementById('cPhone').value;
  const area = document.getElementById('cArea').value;
  const type = document.getElementById('cType').value;
  const msg = `Hi AMKO, my name is ${name}.\nPhone: ${phone}\nArea: ${area}\nProject type: ${type}`;
  window.open('https://wa.me/923222538025?text=' + encodeURIComponent(msg), '_blank');
}
