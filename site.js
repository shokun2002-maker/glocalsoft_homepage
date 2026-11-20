document.documentElement.classList.add('js');

const menu = document.querySelector('.menu-button');
const navigation = document.querySelector('#site-nav');

function setMenu(open) {
  menu.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
}

if (menu && navigation) {
  menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menu.focus();
    }
  });
  matchMedia('(min-width: 951px)').addEventListener('change', (event) => {
    if (event.matches) setMenu(false);
  });
}

const showcase = document.querySelector('.showcase');
if (showcase) {
  function openLegacySection() {
    if (['#calculator', '#tech'].includes(location.hash)) {
      location.replace('/classic.html' + location.hash);
    }
  }

  openLegacySection();
  window.addEventListener('hashchange', openLegacySection);

  function updateHomeNavigation() {
    if (!navigation) return;
    const hash = ['#about', '#work', '#contact'].includes(location.hash) ? location.hash : '';
    navigation.querySelectorAll('a').forEach((link) => {
      if (link.getAttribute('href') === '/' + hash) {
        link.setAttribute('aria-current', hash ? 'location' : 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  updateHomeNavigation();
  window.addEventListener('hashchange', updateHomeNavigation);
  initShowcase(showcase);
}

function initShowcase(root) {
  const slides = [...root.querySelectorAll('.slide')];
  const controls = root.querySelector('.slider-controls');
  const choices = [...controls.querySelectorAll('.slide-numbers button')];
  const progress = controls.querySelector('.slide-progress span');
  const play = controls.querySelector('[data-play]');
  const status = controls.querySelector('[data-slide-status]');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const duration = 6500;
  let active = 0;
  let timer;
  let hovered = false;
  let focusInside = false;
  let userPaused = false;
  let gesture;
  const animation = progress.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], {
    duration, fill: 'both'
  });
  animation.pause();

  function syncPlayback() {
    clearTimeout(timer);
    animation.pause();
    const disabled = userPaused || reducedMotion.matches;
    play.disabled = reducedMotion.matches;
    play.textContent = disabled ? '▶' : 'Ⅱ';
    play.setAttribute('aria-label', reducedMotion.matches ? '모션 감소로 자동 전환 꺼짐' :
      userPaused ? '자동 전환 시작' : '자동 전환 일시정지');

    if (disabled || hovered || focusInside || document.hidden || gesture) return;
    timer = setTimeout(() => select(active + 1, false), Math.max(0, duration - (animation.currentTime ?? 0)));
    animation.play();
  }

  function select(index, announce, enter = true) {
    const next = (index + slides.length) % slides.length;
    if (next !== active && slides[active].contains(document.activeElement)) choices[next].focus();
    active = next;
    root.dataset.active = active;
    slides.forEach((slide, position) => {
      slide.hidden = position !== active;
      slide.inert = slide.hidden;
      slide.classList.toggle('is-entering', enter && position === active);
    });
    choices.forEach((choice, position) => {
      if (position === active) choice.setAttribute('aria-current', 'true');
      else choice.removeAttribute('aria-current');
    });
    if (announce) status.textContent = choices[active].getAttribute('aria-label');
    animation.currentTime = 0;
    syncPlayback();
  }

  choices.forEach((choice, index) => choice.addEventListener('click', () => select(index, true)));
  controls.querySelector('[data-prev]').addEventListener('click', () => select(active - 1, true));
  controls.querySelector('[data-next]').addEventListener('click', () => select(active + 1, true));
  play.addEventListener('click', () => {
    userPaused = !userPaused;
    syncPlayback();
  });
  root.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const next = active + (event.key === 'ArrowRight' ? 1 : -1);
    if (choices.includes(document.activeElement)) choices[(next + choices.length) % choices.length].focus();
    select(next, true);
  });
  root.addEventListener('pointerenter', (event) => {
    if (event.pointerType !== 'mouse') return;
    hovered = true;
    syncPlayback();
  });
  root.addEventListener('pointerleave', (event) => {
    if (event.pointerType !== 'mouse') return;
    hovered = false;
    syncPlayback();
  });
  root.addEventListener('focusin', () => {
    focusInside = true;
    syncPlayback();
  });
  root.addEventListener('focusout', (event) => {
    focusInside = root.contains(event.relatedTarget);
    syncPlayback();
  });
  root.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'touch' || !event.isPrimary) return;
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY };
    syncPlayback();
  });
  root.addEventListener('pointercancel', (event) => {
    if (gesture?.id !== event.pointerId) return;
    gesture = undefined;
    syncPlayback();
  });
  root.addEventListener('pointerup', (event) => {
    if (event.pointerId !== gesture?.id) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    gesture = undefined;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      select(active + (dx < 0 ? 1 : -1), true);
    } else {
      syncPlayback();
    }
  });
  document.addEventListener('visibilitychange', syncPlayback);
  reducedMotion.addEventListener('change', syncPlayback);
  controls.hidden = false;
  root.classList.add('is-enhanced');
  select(0, false, false);
}

const contactForm = document.querySelector('#contact-form');
if (contactForm) initContactForm(contactForm);

function initContactForm(form) {
  const submit = form.querySelector('button[type="submit"]');
  const status = form.querySelector('.form-status');
  const inquiry = form.elements.inquiryType;
  const requested = new URL(location.href).searchParams.get('inquiry');
  if ([...inquiry.options].some((option) => option.value === requested)) inquiry.value = requested;

  form.addEventListener('input', (event) => event.target.setCustomValidity(''));
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submit.disabled || !form.reportValidity()) return;

    const fields = new FormData(form);
    const name = fields.get('name').trim();
    const company = fields.get('company').trim();
    const email = fields.get('email').trim();
    const phone = fields.get('phone').trim();
    const phoneDigits = phone.replace(/\D/g, '').length;
    const message = fields.get('message').trim();
    const invalid = [
      [name.length >= 2, 'name', '담당자 성함은 2자 이상 입력해 주세요.'],
      [/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), 'email', '올바른 이메일 주소를 입력해 주세요.'],
      [phoneDigits >= 9 && phoneDigits <= 12, 'phone', '연락처는 숫자 9~12자리로 입력해 주세요.'],
      [message.length >= 5, 'message', '문의 내용은 5자 이상 입력해 주세요.']
    ].find(([valid]) => !valid);

    if (invalid) {
      const [, field, message] = invalid;
      const input = form.elements[field];
      input.setCustomValidity(message);
      input.reportValidity();
      return;
    }

    submit.disabled = true;
    status.removeAttribute('data-error');
    status.textContent = '문의를 접수하고 있습니다.';
    const payload = {
      _subject: `[글로컬소프트 상담 신청] ${name} (${company || '개인/미기재'})`,
      name, company: company || '미기재', email, phone, message,
      inquiryType: inquiry.value ? inquiry.selectedOptions[0].text : '',
      privacyAgreed: '동의',
      submittedAt: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
    };

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('Form submission failed');
      form.reset();
      status.textContent = '상담 요청이 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.';
    } catch {
      status.setAttribute('data-error', '');
      status.textContent = '문의 전송에 실패했습니다. 입력 내용은 보존되었습니다. 다시 시도하거나 전화 또는 이메일로 문의해 주세요.';
    } finally {
      submit.disabled = false;
    }
  });
}
