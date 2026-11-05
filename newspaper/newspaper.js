/**
 * GLOCALSOFT NEWSPAPER SAAS LANDING INTERACTION & CONTACT PIPELINE
 */

const CONTACT_CONFIG = {
  mode: 'endpoint',
  endpointUrl: 'https://formspree.io/f/xwllaken'
};

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initPricingSelection();
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

/* 2. Pricing Plan Selection & Form Auto-fill */
function initPricingSelection() {
  const planButtons = document.querySelectorAll('.select-plan-btn');
  const selectedPlanInput = document.getElementById('selectedPlan');

  planButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetPlan = btn.getAttribute('data-plan');
      if (selectedPlanInput && targetPlan) {
        for (let i = 0; i < selectedPlanInput.options.length; i++) {
          if (selectedPlanInput.options[i].value.includes(targetPlan)) {
            selectedPlanInput.selectedIndex = i;
            break;
          }
        }
        // 시각적 피드백 효과 부여
        selectedPlanInput.classList.add('input-highlight-pulse');
        setTimeout(() => {
          selectedPlanInput.classList.remove('input-highlight-pulse');
        }, 1600);
      }
    });
  });
}

/* 2. Modal Dialogs */
function initModals() {
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalContentBody = document.getElementById('modalContentBody');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const viewPrivacyInline = document.getElementById('viewPrivacyInline');
  const privacyModalBtn = document.getElementById('privacyModalBtn');

  function openPrivacyModal() {
    if (!modalBackdrop || !modalContentBody) return;
    modalContentBody.innerHTML = `
      <h2>개인정보 수집 및 이용 안내</h2>
      <div class="privacy-modal-detail">
        <p>글로컬소프트(이하 '회사')는 고객님의 개인정보를 소중하게 생각하며 「개인정보 보호법」 및 관계 법령을 준수합니다.</p>
        
        <h4>1. 개인정보의 수집 및 이용 목적</h4>
        <p>신문사 솔루션 도입 문의 접수, 본인 확인, 서비스 견적 산출 및 맞춤 데모 상담 제공, 상담 결과 회신</p>
        
        <h4>2. 수집하는 개인정보 항목</h4>
        <ul>
          <li>• 필수항목: 담당자 성함, 신문사 / 기관명, 이메일 주소, 연락처, 현재 운영 상황 및 문의 내용</li>
          <li>• 선택항목: 도입 희망 요금제, 상담 희망 유형</li>
        </ul>

        <h4>3. 개인정보의 보유 및 이용 기간</h4>
        <p>문의 처리 및 상담 이력 관리를 위해 접수일로부터 <strong>1년간</strong> 보관 후 지체 없이 안전하게 파기합니다. (고객의 파기 요청 시 즉시 파기)</p>

        <h4>4. 동의 거부 권리 및 불이익 안내</h4>
        <p>귀하는 개인정보 수집 및 이용 동의를 거부할 권리가 있습니다. 단, 필수항목 수집에 동의하지 않으실 경우 무료 상담 및 데모 시연 신청이 제한될 수 있습니다.</p>

        <p style="margin-top: 1rem; font-size: 0.82rem; color: var(--color-text-muted);">
          ※ 개인정보 처리위탁, 국외 이전 및 권리 행사 등 상세 내용은 <a href="/privacy/" target="_blank" style="color: var(--accent-cyan); text-decoration: underline;">개인정보처리방침 전문</a>에서 확인하실 수 있습니다.
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

  if (privacyModalBtn) {
    privacyModalBtn.addEventListener('click', (e) => {
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

/* 3. Formspree Contact & Demo Submission */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitFormBtn');

  if (!contactForm) return;

  let isSubmitting = false;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    const clientNameInput = document.getElementById('clientName');
    const companyNameInput = document.getElementById('companyName');
    const clientEmailInput = document.getElementById('clientEmail');
    const clientPhoneInput = document.getElementById('clientPhone');
    const selectedPlanInput = document.getElementById('selectedPlan');
    const inquiryTypeInput = document.getElementById('inquiryType');
    const projectScopeInput = document.getElementById('projectScope');
    const privacyAgreeInput = document.getElementById('privacyAgree');

    const name = clientNameInput ? clientNameInput.value.trim() : '';
    const company = companyNameInput ? companyNameInput.value.trim() : '';
    const email = clientEmailInput ? clientEmailInput.value.trim() : '';
    const phone = clientPhoneInput ? clientPhoneInput.value.trim() : '';
    const selectedPlan = selectedPlanInput ? selectedPlanInput.value : '상담 후 결정';
    const inquiryType = inquiryTypeInput ? inquiryTypeInput.value : '';
    const scope = projectScopeInput ? projectScopeInput.value.trim() : '';
    const privacyAgreed = privacyAgreeInput ? privacyAgreeInput.checked : false;

    // 1. 필수 입력값 검증
    if (name.length < 2) {
      showToast('담당자 성함을 2자 이상 입력해 주세요.', 'warning');
      if (clientNameInput) clientNameInput.focus();
      return;
    }

    if (company.length < 2) {
      showToast('신문사 또는 언론사명을 입력해 주세요.', 'warning');
      if (companyNameInput) companyNameInput.focus();
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('올바른 이메일 주소(example@domain.com)를 입력해 주세요.', 'warning');
      if (clientEmailInput) clientEmailInput.focus();
      return;
    }

    const phoneClean = phone.replace(/[^0-9]/g, '');
    if (phoneClean.length < 9 || phoneClean.length > 12) {
      showToast('연락처는 9~11자리의 올바른 번호를 입력해 주세요.', 'warning');
      if (clientPhoneInput) clientPhoneInput.focus();
      return;
    }

    if (scope.length < 5) {
      showToast('운영 상황 및 문의 내용을 최소 5자 이상 작성해 주세요.', 'warning');
      if (projectScopeInput) projectScopeInput.focus();
      return;
    }

    if (!privacyAgreed) {
      showToast('개인정보 수집 및 이용에 동의하셔야 상담 신청이 가능합니다.', 'warning');
      if (privacyAgreeInput) privacyAgreeInput.focus();
      return;
    }

    // 전송 상태 활성화
    isSubmitting = true;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 접수 처리 중...';
    }

    const inquiryTypeText = (inquiryTypeInput && inquiryTypeInput.selectedIndex >= 0)
      ? inquiryTypeInput.options[inquiryTypeInput.selectedIndex].text
      : inquiryType;

    // 요금제 약칭 추출 (예: "STARTER", "AI PRO", "ENTERPRISE", "상담 후 결정")
    const planShort = selectedPlan.split(' ')[0] || '기본상담';

    const payload = {
      _subject: `[신문사 SaaS - ${planShort} / ${inquiryTypeText}] ${company} (${name}님)`,
      selectedPlan: selectedPlan,
      inquiryType: inquiryTypeText,
      name: name,
      company: company,
      email: email,
      phone: phone,
      message: scope,
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
        contactForm.reset();
        showToast('🎉 신문사 SaaS 상담 및 시연 신청이 접수되었습니다! 담당자가 신속히 연락드리겠습니다.', 'success');
      } else {
        const errData = await response.json().catch(() => ({}));
        const errMsg = (errData && errData.errors && errData.errors.map(e => e.message).join(', ')) || `상태코드: ${response.status}`;
        throw new Error(errMsg);
      }
    } catch (error) {
      console.error('Contact submission error:', error);
      showToast('❌ 문의 전송 중 오류가 발생했습니다. 잠시 후 다시 시도하시거나 010-9354-7929로 직접 연락 부탁드립니다. (작성 내용은 보존되었습니다)', 'error');
    } finally {
      isSubmitting = false;
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-check-circle"></i> 무료 상담 & 시연 요청 제출하기';
      }
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

