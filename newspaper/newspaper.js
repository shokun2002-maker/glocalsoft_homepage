/**
 * GLOCALSOFT NEWSPAPER SAAS LANDING INTERACTION & CONTACT PIPELINE
 */

const CONTACT_CONFIG = {
  mode: 'endpoint',
  endpointUrl: 'https://formspree.io/f/xwllaken'
};

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initServiceButtons();
  initContactForm();
  initModals();
  initLightbox();
});

/* 1. Header & Mobile Navigation */
function initNavbar() {
  const navbar = document.getElementById('header');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (hamburgerBtn && navMenu) {
    let backdrop = document.querySelector('.mobile-nav-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'mobile-nav-backdrop';
      document.body.appendChild(backdrop);
    }

    function toggleMenu(show) {
      const isOpen = typeof show === 'boolean' ? show : !navMenu.classList.contains('open');
      navMenu.classList.toggle('open', isOpen);
      hamburgerBtn.classList.toggle('active', isOpen);
      backdrop.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    hamburgerBtn.addEventListener('click', () => toggleMenu());
    backdrop.addEventListener('click', () => toggleMenu(false));

    navLinks.forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });
  }
}

/* 2. Service & Pricing Plan Auto-fill Mapping (Phase 3-4) */
function initServiceButtons() {
  const allTriggerButtons = document.querySelectorAll('.select-service-btn, .select-plan-btn');
  const neededServiceSelect = document.getElementById('neededService');
  const newspaperStatusSelect = document.getElementById('newspaperStatus');
  const inquiryTypeHidden = document.getElementById('inquiryTypeHidden');
  const selectedPlanHidden = document.getElementById('selectedPlanHidden');

  allTriggerButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const inquiryType = btn.getAttribute('data-inquiry-type') || '';
      const plan = btn.getAttribute('data-plan') || '';

      // 서비스 매핑 기준 도출
      let targetNeededService = '';
      let targetNewspaperStatus = '';

      if (inquiryType.includes('신규 창간') || plan.includes('신규 구축')) {
        targetNeededService = '홈페이지 신규 구축';
        targetNewspaperStatus = '신규 창간 준비';
      } else if (inquiryType.includes('개편') || plan.includes('개편')) {
        targetNeededService = '기존 홈페이지 개편';
        targetNewspaperStatus = '운영 중';
      } else if (inquiryType.includes('AI') || plan.includes('AI') || inquiryType.includes('온라인 데모')) {
        targetNeededService = 'AI 통합 CMS';
        // 운영 상태는 비워두거나 기존 선택 유지
      } else if (plan.includes('데이터 이전') || inquiryType.includes('데이터 이전')) {
        targetNeededService = '기사·데이터 이전';
        targetNewspaperStatus = '운영 중';
      }

      // 1. 필요한 서비스(neededService) 자동 선택
      if (neededServiceSelect && targetNeededService) {
        for (let i = 0; i < neededServiceSelect.options.length; i++) {
          if (neededServiceSelect.options[i].value === targetNeededService) {
            neededServiceSelect.selectedIndex = i;
            break;
          }
        }
        highlightInput(neededServiceSelect);
      }

      // 2. 신문사 운영 상태(newspaperStatus) 자동 선택 (기존 입력이 없을 때만 자동 보조)
      if (newspaperStatusSelect && targetNewspaperStatus && (!newspaperStatusSelect.value || newspaperStatusSelect.selectedIndex === 0)) {
        for (let i = 0; i < newspaperStatusSelect.options.length; i++) {
          if (newspaperStatusSelect.options[i].value === targetNewspaperStatus) {
            newspaperStatusSelect.selectedIndex = i;
            break;
          }
        }
        highlightInput(newspaperStatusSelect);
      }

      // 3. 히든 필드 동기화 (Formspree 전송 시 보조 파라미터)
      if (inquiryTypeHidden && inquiryType) inquiryTypeHidden.value = inquiryType;
      if (selectedPlanHidden && plan) selectedPlanHidden.value = plan;
    });
  });
}

function highlightInput(element) {
  if (!element) return;
  element.classList.add('input-highlight-pulse');
  setTimeout(() => {
    element.classList.remove('input-highlight-pulse');
  }, 1600);
}

/* 3. Modal Dialogs */
function initModals() {
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalContentBody = document.getElementById('modalContentBody');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const viewPrivacyInline = document.getElementById('viewPrivacyInline');

  function openPrivacyModal() {
    if (!modalBackdrop || !modalContentBody) return;
    modalContentBody.innerHTML = `
      <h2>개인정보 수집 및 이용 안내</h2>
      <div class="privacy-modal-detail">
        <p>글로컬소프트(이하 '회사')는 고객님의 개인정보를 소중하게 생각하며 「개인정보 보호법」 및 관계 법령을 준수합니다.</p>
        
        <h4>1. 개인정보의 수집 및 이용 목적</h4>
        <p>인터넷신문사 솔루션 도입 문의 접수, 신문사 운영 현황 진단, 맞춤 견적 산출 및 1:1 온라인 데모 시연 제공, 상담 결과 회신</p>
        
        <h4>2. 수집하는 개인정보 항목</h4>
        <ul>
          <li>• <strong>필수항목:</strong> 신청자 성함(이름), 연락처(전화번호), 현재 신문사 운영 상태, 필요한 서비스, 도입 희망 시기</li>
          <li>• <strong>선택항목:</strong> 이메일 주소, 신문사 / 기관명, 추가 상담 내용, 도입 희망 서비스 구성(요금 플랜)</li>
        </ul>

        <h4>3. 개인정보의 보유 및 이용 기간</h4>
        <p>문의 처리 및 상담 이력 관리를 위해 접수일로부터 <strong>1년간</strong> 보관 후 지체 없이 안전하게 파기합니다. (고객의 파기 요청 시 즉시 파기)</p>

        <h4>4. 동의 거부 권리 및 불이익 안내</h4>
        <p>귀하는 개인정보 수집 및 이용 동의를 거부할 권리가 있습니다. 단, 필수항목 수집에 동의하지 않으실 경우 무료 도입 상담 및 데모 시연 신청이 제한될 수 있습니다.</p>

        <p style="margin-top: 1rem; font-size: 0.82rem; color: var(--color-text-muted);">
          ※ 개인정보 처리위탁(Formspree), 국외 이전 및 권리 행사 등 상세 내용은 <a href="/privacy/" target="_blank" style="color: var(--accent-cyan); text-decoration: underline;">개인정보처리방침 전문</a>에서 확인하실 수 있습니다.
        </p>
      </div>
    `;
    modalBackdrop.classList.add('active');
  }

  function closeModal() {
    if (modalBackdrop) modalBackdrop.classList.remove('active');
  }

  if (viewPrivacyInline) {
    viewPrivacyInline.addEventListener('click', (e) => {
      e.preventDefault();
      openPrivacyModal();
    });
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }
}

/* 4. Formspree Contact Form Submission & Validation (Phase 3-4) */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitFormBtn');
  const formSuccessCard = document.getElementById('formSuccessCard');
  const formStatusAlert = document.getElementById('formStatusAlert');
  const resetFormBtn = document.getElementById('resetFormBtn');

  if (!contactForm) return;

  // 입력 필드 참조
  const nameInput = document.getElementById('clientName');
  const phoneInput = document.getElementById('clientPhone');
  const emailInput = document.getElementById('clientEmail');
  const companyInput = document.getElementById('companyName');
  const statusSelect = document.getElementById('newspaperStatus');
  const timelineSelect = document.getElementById('timeline');
  const serviceSelect = document.getElementById('neededService');
  const messageInput = document.getElementById('projectScope');
  const privacyCheck = document.getElementById('privacyAgree');
  const inquiryTypeHidden = document.getElementById('inquiryTypeHidden');
  const selectedPlanHidden = document.getElementById('selectedPlanHidden');

  // 에러 메시지 초기화 함수
  function clearErrors() {
    const errorContainers = contactForm.querySelectorAll('.form-error-msg');
    errorContainers.forEach(el => {
      el.textContent = '';
      el.style.display = 'none';
    });
    const errorInputs = contactForm.querySelectorAll('.input-error');
    errorInputs.forEach(el => el.classList.remove('input-error'));
    if (formStatusAlert) {
      formStatusAlert.style.display = 'none';
      formStatusAlert.className = 'form-status-alert';
    }
  }

  // 필드 에러 표시 함수
  function setFieldError(inputEl, errorElId, message) {
    if (inputEl) inputEl.classList.add('input-error');
    const errEl = document.getElementById(errorElId);
    if (errEl) {
      errEl.textContent = message;
      errEl.style.display = 'block';
    }
  }

  // 실시간 입력 시 에러 해제
  const allInputs = [nameInput, phoneInput, emailInput, statusSelect, timelineSelect, serviceSelect, privacyCheck];
  allInputs.forEach(inp => {
    if (!inp) return;
    inp.addEventListener('input', () => {
      inp.classList.remove('input-error');
      const errEl = document.getElementById(inp.id + 'Error');
      if (errEl) errEl.style.display = 'none';
    });
    inp.addEventListener('change', () => {
      inp.classList.remove('input-error');
      const errEl = document.getElementById(inp.id + 'Error');
      if (errEl) errEl.style.display = 'none';
    });
  });

  // 전화번호 입력 서식 편의 (숫자와 하이픈 자동 포맷팅 및 정리)
  if (phoneInput) {
    phoneInput.addEventListener('blur', () => {
      let val = phoneInput.value.replace(/[^0-9-]/g, '').trim();
      phoneInput.value = val;
    });
  }

  // 폼 제출 이벤트
  let isSubmitting = false;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    clearErrors();

    const name = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const company = companyInput ? companyInput.value.trim() : '';
    const newspaperStatus = statusSelect ? statusSelect.value : '';
    const timeline = timelineSelect ? timelineSelect.value : '';
    const neededService = serviceSelect ? serviceSelect.value : '';
    const message = messageInput ? messageInput.value.trim() : '';
    const privacyAgreed = privacyCheck ? privacyCheck.checked : false;
    const inquiryType = inquiryTypeHidden ? inquiryTypeHidden.value : '신문사 솔루션 상담';
    const selectedPlan = selectedPlanHidden ? selectedPlanHidden.value : '기본 상담';

    let hasError = false;
    let firstErrorElement = null;

    // 1. 이름 검증 (필수, 2자 이상)
    if (!name || name.length < 2) {
      setFieldError(nameInput, 'clientNameError', '신청자 성함을 2자 이상 입력해 주세요.');
      hasError = true;
      if (!firstErrorElement) firstErrorElement = nameInput;
    }

    // 2. 연락처 검증 (필수, 한국 유선/무선 번호 허용: 9~12자리 숫자)
    const phoneDigits = phone.replace(/[^0-9]/g, '');
    if (!phone) {
      setFieldError(phoneInput, 'clientPhoneError', '연락 가능한 전화번호를 입력해 주세요.');
      hasError = true;
      if (!firstErrorElement) firstErrorElement = phoneInput;
    } else if (phoneDigits.length < 9 || phoneDigits.length > 12) {
      setFieldError(phoneInput, 'clientPhoneError', '지역번호 또는 휴대폰 번호를 포함한 9~11자리 번호를 입력해 주세요.');
      hasError = true;
      if (!firstErrorElement) firstErrorElement = phoneInput;
    }

    // 3. 이메일 검증 (선택 입력: 입력 시에만 형식 검사)
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setFieldError(emailInput, 'clientEmailError', '올바른 이메일 주소(example@domain.com)를 입력해 주세요.');
        hasError = true;
        if (!firstErrorElement) firstErrorElement = emailInput;
      }
    }

    // 4. 신문사 운영 상태 (필수)
    if (!newspaperStatus) {
      setFieldError(statusSelect, 'newspaperStatusError', '현재 신문사 운영 상태를 선택해 주세요.');
      hasError = true;
      if (!firstErrorElement) firstErrorElement = statusSelect;
    }

    // 5. 도입 희망 시기 (필수)
    if (!timeline) {
      setFieldError(timelineSelect, 'timelineError', '도입 희망 시기를 선택해 주세요.');
      hasError = true;
      if (!firstErrorElement) firstErrorElement = timelineSelect;
    }

    // 6. 필요한 서비스 (필수)
    if (!neededService) {
      setFieldError(serviceSelect, 'neededServiceError', '필요한 서비스를 선택해 주세요.');
      hasError = true;
      if (!firstErrorElement) firstErrorElement = serviceSelect;
    }

    // 7. 개인정보 수집 및 이용 동의 (필수)
    if (!privacyAgreed) {
      setFieldError(privacyCheck, 'privacyAgreeError', '개인정보 수집 및 이용에 동의하셔야 상담 신청이 가능합니다.');
      hasError = true;
      if (!firstErrorElement) firstErrorElement = privacyCheck;
    }

    if (hasError) {
      if (firstErrorElement) {
        firstErrorElement.focus();
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // 전송 시작 UI 처리
    isSubmitting = true;
    submitBtn.disabled = true;
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    if (btnText) btnText.style.display = 'none';
    if (btnLoading) btnLoading.style.display = 'inline-flex';

    // Formspree 전송용 페이로드 구성
    const payload = {
      _subject: `[신문사 솔루션 상담] ${name}님 - ${neededService} (${newspaperStatus})`,
      name: name,
      phone: phone,
      email: email || '미입력',
      company: company || '미입력',
      newspaperStatus: newspaperStatus,
      neededService: neededService,
      timeline: timeline,
      inquiryType: inquiryType,
      selectedPlan: selectedPlan,
      message: message || '추가 내용 없음',
      privacyAgreed: '동의',
      submittedAt: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
    };

    try {
      const response = await fetch(CONTACT_CONFIG.endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        // 성공: 폼 숨기고 성공 안내 카드 노출
        contactForm.style.display = 'none';
        if (formSuccessCard) {
          formSuccessCard.style.display = 'block';
          formSuccessCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        showToast('상담 신청이 정상적으로 접수되었습니다. 내용을 확인한 후 연락드리겠습니다.', 'success');
      } else {
        const errData = await response.json().catch(() => ({}));
        const errMsg = (errData && errData.errors && errData.errors.map(e => e.message).join(', ')) || `오류 코드: ${response.status}`;
        throw new Error(errMsg);
      }
    } catch (error) {
      console.error('Contact submission error:', error);
      if (formStatusAlert) {
        formStatusAlert.style.display = 'block';
        formStatusAlert.className = 'form-status-alert error';
        formStatusAlert.innerHTML = `
          <strong><i class="fa-solid fa-triangle-exclamation"></i> 접수 중 일시적인 통신 오류가 발생했습니다.</strong>
          <p>작성하신 내용은 모두 안전하게 보존되어 있습니다. 잠시 후 [무료 도입 상담 신청하기] 버튼을 다시 눌러주시거나, 직통 번호(<strong>010-9354-7929</strong>)로 문의해 주시기 바랍니다.</p>
        `;
        formStatusAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      showToast('문의 전송 중 일시적인 오류가 발생했습니다. 작성 내용은 보존되었습니다.', 'error');
    } finally {
      isSubmitting = false;
      submitBtn.disabled = false;
      if (btnText) btnText.style.display = 'inline-flex';
      if (btnLoading) btnLoading.style.display = 'none';
    }
  });

  // 추가 문의 작성 버튼 클릭 시 폼 재표시
  if (resetFormBtn) {
    resetFormBtn.addEventListener('click', () => {
      contactForm.reset();
      clearErrors();
      if (formSuccessCard) formSuccessCard.style.display = 'none';
      contactForm.style.display = 'block';
      contactForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
}

/* 5. Toast Message Utility */
function showToast(message, type = 'info') {
  const toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;

  let iconClass = 'fa-solid fa-bell icon-accent';
  if (type === 'success') iconClass = 'fa-solid fa-circle-check';
  else if (type === 'error') iconClass = 'fa-solid fa-triangle-exclamation';
  else if (type === 'warning') iconClass = 'fa-solid fa-circle-exclamation';

  toast.innerHTML = '<i class="' + iconClass + '"></i> <span>' + message + '</span>';

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 4500);
}

/* 6. Image Lightbox for Showcase Screenshots */
function initLightbox() {
  const lightbox = document.getElementById('imageLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const clickableMockups = document.querySelectorAll('.mockup-screen-container[data-src]');

  if (!lightbox || !lightboxImg) return;

  function openLightbox(src, title) {
    lightboxImg.src = src;
    lightboxImg.alt = title || '실제 화면 확대 보기';
    if (lightboxTitle) {
      lightboxTitle.innerHTML = '<i class="fa-solid fa-image"></i> ' + (title || '실제 화면 확대 보기');
    }
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  clickableMockups.forEach(mockup => {
    mockup.addEventListener('click', () => {
      const src = mockup.getAttribute('data-src');
      const title = mockup.getAttribute('data-title');
      if (src) openLightbox(src, title);
    });
  });

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* Toast Message Utility */
function showToast(message, type = 'info') {
  const toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;

  let iconClass = 'fa-solid fa-bell icon-accent';
  if (type === 'success') iconClass = 'fa-solid fa-circle-check';
  else if (type === 'error') iconClass = 'fa-solid fa-triangle-exclamation';
  else if (type === 'warning') iconClass = 'fa-solid fa-circle-exclamation';

  toast.innerHTML = '<i class="' + iconClass + '"></i> <span>' + message + '</span>';

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 4500);
}

/* 3. Image Lightbox for Showcase Screenshots */
function initLightbox() {
  const lightbox = document.getElementById('imageLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const clickableMockups = document.querySelectorAll('.mockup-screen-container[data-src]');

  if (!lightbox || !lightboxImg) return;

  function openLightbox(src, title) {
    lightboxImg.src = src;
    lightboxImg.alt = title || '스크린샷 원본';
    lightboxImg.classList.remove('zoomed');
    if (lightboxTitle) lightboxTitle.textContent = title || '실제 화면 확대 보기 (클릭 시 100% 확대)';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      lightboxImg.src = '';
      lightboxImg.classList.remove('zoomed');
    }, 200);
  }

  if (lightboxImg) {
    lightboxImg.addEventListener('click', (e) => {
      e.stopPropagation();
      lightboxImg.classList.toggle('zoomed');
      if (lightboxTitle) {
        lightboxTitle.textContent = lightboxImg.classList.contains('zoomed')
          ? '원본 1:1 확대 뷰 (클릭 시 기본 크기로 복귀)'
          : '실제 화면 확대 보기 (클릭 시 100% 확대)';
      }
    });
  }

  clickableMockups.forEach(container => {
    container.addEventListener('click', () => {
      const src = container.getAttribute('data-src');
      const title = container.getAttribute('data-title');
      const innerImg = container.querySelector('img');

      // 실제 이미지 파일이 아직 등록되지 않아 placeholder가 표시된 경우
      if (innerImg && innerImg.style.display === 'none') {
        showToast(`🔒 ${title} 상세 화면은 언론사 보안 지침에 따라 1:1 온라인 원격 데모로 시연해 드립니다.`, 'info');
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
          const inquiryTypeSelect = document.getElementById('inquiryType');
          if (inquiryTypeSelect) inquiryTypeSelect.value = '온라인 데모 신청';
        }
        return;
      }

      const activeSrc = (innerImg && (innerImg.currentSrc || innerImg.src)) || container.getAttribute('data-src');
      if (activeSrc) openLightbox(activeSrc, title);
    });
  });

  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-body')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

