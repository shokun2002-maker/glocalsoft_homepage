/**
 * GLOCALSOFT OFFICIAL WEBSITE INTERACTION & LOGIC
 * Features: Multi-language (i18n), Counter animation, Interactive Estimate Calculator,
 * Tech stack filter, Portfolio modal detail, Service popup modals, Form validation & Toast.
 */

/**
 * ==========================================
 * GLOCALSOFT CONTACT SYSTEM CONFIGURATION
 * ==========================================
 * [보안 원칙] 비밀키(Secret Key)는 절대로 프론트엔드 코드에 노출하지 않습니다.
 * 
 * [연동 가이드]
 * 1) REST Endpoint 방식 (Formspree 활성화 완료: GlocalSoft Contact)
 *    - mode: 'endpoint'
 *    - endpointUrl: 'https://formspree.io/f/xwllaken'
 * 2) EmailJS 방식
 *    - mode: 'emailjs'
 *    - emailjs: { publicKey: '...', serviceId: '...', templateId: '...' }
 */
const CONTACT_CONFIG = {
  mode: 'endpoint', // 'endpoint' | 'emailjs' | 'none'
  endpointUrl: 'https://formspree.io/f/xwllaken', // Formspree 공식 엔드포인트
  emailjs: {
    publicKey: '',
    serviceId: '',
    templateId: ''
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCounters();
  initTechStack();
  initPortfolioFilter();
  initEstimateCalculator();
  initModals();
  initContactForm();
  initI18n();
});

/* ==========================================
   1. NAVBAR & SCROLL SPY
   ========================================== */
function initNavbar() {
  const navbar = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');

  // Sticky navbar shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll spy active link update
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile menu toggle & backdrop
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

    // Close mobile menu on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });
  }
}

/* ==========================================
   2. COUNTER-UP ANIMATION
   ========================================== */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const duration = 1500; // ms
          const step = Math.ceil(target / (duration / 20));
          let current = 0;

          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              counter.innerText = target;
              clearInterval(timer);
            } else {
              counter.innerText = current;
            }
          }, 20);
        });
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) observer.observe(heroStats);
}

/* ==========================================
   3. TECH STACK SHOWCASE
   ========================================== */
const techData = [
  { name: 'React / Next.js', category: 'frontend', icon: 'fa-brands fa-react', desc: 'SSR & 최신 프론트엔드 아키텍처' },
  { name: 'TypeScript', category: 'frontend', icon: 'fa-solid fa-code', desc: '타입 안정성 보장 컴포넌트 개발' },
  { name: 'Tailwind / CSS3', category: 'frontend', icon: 'fa-brands fa-css3-alt', desc: '반응형 고성능 UI 시스템 디자인' },
  { name: 'Node.js / Express', category: 'backend', icon: 'fa-brands fa-node-js', desc: '비동기 대용량 이벤트 처리 서버' },
  { name: 'Java / Spring Boot', category: 'backend', icon: 'fa-brands fa-java', desc: '엔터프라이즈 레벨 표준 프레임워크' },
  { name: 'Python / Fast API', category: 'backend', icon: 'fa-brands fa-python', desc: 'AI 모델 연동 고성능 REST API' },
  { name: 'OpenAI / Claude API', category: 'ai', icon: 'fa-solid fa-microchip', desc: 'LLM 튜닝 & 프롬프트 엔지니어링' },
  { name: 'PyTorch / TensorFlow', category: 'ai', icon: 'fa-solid fa-brain', desc: '딥러닝 머신러닝 맞춤 모델 구축' },
  { name: 'Pinecone / Milvus', category: 'ai', icon: 'fa-solid fa-database', desc: 'RAG 기반 벡터 데이터베이스 인덱싱' },
  { name: 'AWS / GCP / Azure', category: 'cloud', icon: 'fa-brands fa-aws', desc: '클라우드 인프라 아키텍처 인프라 구축' },
  { name: 'Docker / Kubernetes', category: 'cloud', icon: 'fa-brands fa-docker', desc: '컨테이너 오케스트레이션 무장애 환경' },
  { name: 'PostgreSQL / Redis', category: 'cloud', icon: 'fa-solid fa-server', desc: '고성능 관계형 & 캐싱 메모리 DB' }
];

function initTechStack() {
  const techGrid = document.getElementById('techGrid');
  const tabBtns = document.querySelectorAll('.tech-tab-btn');

  function renderTech(category = 'all') {
    if (!techGrid) return;
    techGrid.innerHTML = '';

    const filtered = category === 'all' 
      ? techData 
      : techData.filter(item => item.category === category);

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'tech-card';
      card.innerHTML = `
        <div class="tech-icon"><i class="${item.icon}"></i></div>
        <div class="tech-info">
          <h4>${item.name}</h4>
          <span>${item.desc}</span>
        </div>
      `;
      techGrid.appendChild(card);
    });
  }

  renderTech('all');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-tech');
      renderTech(cat);
    });
  });
}

/* ==========================================
   4. PORTFOLIO FILTER
   ========================================== */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioCards.forEach(card => {
        const categoryStr = card.getAttribute('data-category');
        if (filterValue === 'all' || categoryStr.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================
   5. REAL-TIME ESTIMATE CALCULATOR
   ========================================== */
function initEstimateCalculator() {
  const calcContainer = document.getElementById('calculator');
  if (!calcContainer) return;

  const projectTypeInputs = document.querySelectorAll('input[name="projectType"]');
  const featureCheckboxes = document.querySelectorAll('#featureOptions input[type="checkbox"]');
  const timelineInputs = document.querySelectorAll('input[name="timeline"]');
  const totalPriceEl = document.getElementById('calcTotalPrice');
  const totalDurationEl = document.getElementById('calcTotalDuration');
  const applyCalcBtn = document.getElementById('applyCalcBtn');

  // Base pricing matrix (KRW)
  const basePrices = {
    web: 8000000,
    app: 12000000,
    ai: 15000000,
    enterprise: 25000000
  };

  const featurePrices = {
    auth: 1500000,
    payment: 2500000,
    admin: 3000000,
    ai: 5000000,
    i18n: 2000000,
    push: 1500000
  };

  const timelineModifiers = {
    fast: { costMod: 0.95, durationMod: 0.7, text: '약 4주 ~ 6주' },
    standard: { costMod: 1.0, durationMod: 1.0, text: '약 8주 ~ 10주' },
    deep: { costMod: 1.35, durationMod: 1.5, text: '약 12주 ~ 16주' }
  };

  function updateEstimate() {
    let pType = 'web';
    projectTypeInputs.forEach(i => {
      if (i.checked) pType = i.value;
      i.closest('.calc-option').classList.toggle('active', i.checked);
    });

    let selectedFeaturesCost = 0;
    featureCheckboxes.forEach(cb => {
      const parentLabel = cb.closest('.checkbox-option');
      if (cb.checked) {
        parentLabel.classList.add('active');
        selectedFeaturesCost += (featurePrices[cb.value] || 0);
      } else {
        parentLabel.classList.remove('active');
      }
    });

    let tVal = 'standard';
    timelineInputs.forEach(t => {
      if (t.checked) tVal = t.value;
      t.closest('.calc-option').classList.toggle('active', t.checked);
    });

    const baseCost = basePrices[pType] || 8000000;
    const rawTotal = (baseCost + selectedFeaturesCost) * timelineModifiers[tVal].costMod;

    const minPrice = Math.round(rawTotal * 0.9 / 100000) * 100000;
    const maxPrice = Math.round(rawTotal * 1.25 / 100000) * 100000;

    totalPriceEl.innerText = `₩${minPrice.toLocaleString()} ~ ₩${maxPrice.toLocaleString()}`;
    totalDurationEl.innerText = timelineModifiers[tVal].text;
  }

  // Event Listeners for controls
  projectTypeInputs.forEach(i => i.addEventListener('change', updateEstimate));
  featureCheckboxes.forEach(c => c.addEventListener('change', updateEstimate));
  timelineInputs.forEach(t => t.addEventListener('change', updateEstimate));

  // Initial Calculation
  updateEstimate();

  // Transfer calculation result to contact form
  if (applyCalcBtn) {
    applyCalcBtn.addEventListener('click', () => {
      const pScopeField = document.getElementById('projectScope');
      const inquiryTypeField = document.getElementById('inquiryType');

      let pType = 'web';
      projectTypeInputs.forEach(i => { if (i.checked) pType = i.value; });

      if (inquiryTypeField) {
        if (pType === 'web' || pType === 'app') inquiryTypeField.value = 'web-app';
        else if (pType === 'ai') inquiryTypeField.value = 'ai';
        else if (pType === 'enterprise') inquiryTypeField.value = 'enterprise';
      }

      if (pScopeField) {
        pScopeField.value = `[견적 계산기 산출 내역]\n- 예상 견적: ${totalPriceEl.innerText}\n- 예상 소요 기간: ${totalDurationEl.innerText}\n\n추가 요구사항: `;
      }

      // Smooth scroll to contact
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }

      showToast('견적 계산 결과가 문의 폼에 자동 입력되었습니다!');
    });
  }
}

/* ==========================================
   6. MODAL DIALOGS
   ========================================== */
const serviceModalDetails = {
  'web-app': {
    title: '맞춤형 웹 & 앱 개발 상세',
    body: `
      <p>글로컬소프트는 단 한 줄의 고품질 코드도 허투루 작성하지 않습니다. 확장성이 보장된 리액트/넥스트JS 기반 웹사이트 및 플러터/네이티브 스마트폰 앱을 구축합니다.</p>
      <h4>주요 특징</h4>
      <ul>
        <li>• SEO 100점 구현 & 빠른 초기 로딩 라이트하우스 스코어</li>
        <li>• PWA(Progressive Web App) 및 크로스플랫폼 모바일 어플리케이션</li>
        <li>• 반응형 브레이크포인트 디자인 시스템 완벽 준수</li>
      </ul>
    `
  },
  'ai-data': {
    title: 'AI & 데이터 솔루션 상세',
    body: `
      <p>단순한 API 호출을 넘어, 사내 기밀 문서를 안전하게 학습시킨 Retrieval-Augmented Generation(RAG) 엔진 및 예측 ML 파이프라인을 커스텀 구축합니다.</p>
      <h4>주요 특징</h4>
      <ul>
        <li>• 보안 보장형 On-Premise 또는 Private Cloud LLM 인프라</li>
        <li>• 벡터 데이터베이스(Vector DB) 지식 베이스 구축</li>
        <li>• 실시간 비즈니스 데이터 자동 시각화 및 인사이트 도출</li>
      </ul>
    `
  },
  'cloud-devops': {
    title: '클라우드 & DevOps 아키텍처 상세',
    body: `
      <p>무장애 99.99% 가동률을 자랑하는 클라우드 인프라 환경을 설계합니다. 테라폼을 활용한 IaC(Infrastructure as Code)와 자동화된 CI/CD 빌드를 제공합니다.</p>
      <h4>주요 특징</h4>
      <ul>
        <li>• AWS/GCP 멀티 클라우드 오토스케일링</li>
        <li>• 쿠버네티스(K8s) 마이크로서비스 격리 관리</li>
        <li>• 24/7 실시간 부하 모니터링 및 자동 롤백 시스템</li>
      </ul>
    `
  },
  'si-enterprise': {
    title: '엔터프라이즈 SI & ERP 상세',
    body: `
      <p>기존 레거시 시스템을 신속하게 분해하고 최신 API 서비스 메시 아키텍처로 안전하게 전환하여 디지털 혁신을 주도합니다.</p>
      <h4>주요 특징</h4>
      <ul>
        <li>• 금융급 보안 파이프라인 및 OAuth2/JWT 인증</li>
        <li>• 대용량 트래픽 동시 접속 분산 처리</li>
        <li>• 이종 DB간 무손실 자동 데이터 동기화 파이프라인</li>
      </ul>
    `
  },
  'ui-ux': {
    title: 'UI/UX 디자인 & 브랜드 경험 상세',
    body: `
      <p>사용자 행태 분석 기반의 직관적 인터페이스와 감각적인 인터랙션을 통해 브랜드 인지도를 높이고 고객 전환율(CVR)을 끌어올립니다.</p>
      <h4>주요 특징</h4>
      <ul>
        <li>• 피그마(Figma) 반응형 컴포넌트 디자인 시스템 딜리버리</li>
        <li>• 사용자 여정(User Journey Map) & 프로토타입 검증</li>
        <li>• 마이크로 애니메이션을 통한 압도적 몰입감 제공</li>
      </ul>
    `
  },
  'consulting': {
    title: '기술 컨설팅 & 유지보수 상세',
    body: `
      <p>서비스 런칭 이후에도 전문 전담 엔지니어가 지속적인 기술 지원, 패치, 성능 최적화 및 긴급 장애 모니터링을 책임집니다.</p>
      <h4>주요 특징</h4>
      <ul>
        <li>• 24/7 SLA 전담 기술 지원 체계</li>
        <li>• 취약점 정기 점검 및 보안 커스텀 패치</li>
        <li>• 정기 성능 가속 코드 리팩토링 보고서 제출</li>
      </ul>
    `
  },
  'coding-edu': {
    title: '코딩 교육 & IT 인재 양성 상세',
    body: `
      <p>글로컬소프트는 이론 중심 교육을 넘어 실무에 즉시 투입 가능한 엔지니어 양성을 목표로 맞춤형 코딩 교육 및 멘토링 프로그램을 제공합니다.</p>
      <h4>주요 커리큘럼 & 특징</h4>
      <ul>
        <li>• 초·중·고 SW 교육 및 대학/기업 맞춤형 산학 연수 파트너십</li>
        <li>• 파이썬, AI/머신러닝, 웹/앱 풀스택 실무 커리큘럼</li>
        <li>• 1:1 현직 개발자 멘토링 & 라이브 코드 리뷰</li>
      </ul>
    `
  }
};

const projectModalDetails = {
  'proj1': {
    title: 'Nexa Analytics - 차세대 엔터프라이즈 AI 분석 대시보드',
    body: `
      <p>글로벌 빅데이터 및 AI 솔루션 전문기업 (주)넥사테크놀로지와 진행한 엔터프라이즈 프로젝트입니다. 실시간 수억 건의 데이터 스트림을 시각화하고 LLM 기반 AI 분석 보고서를 자동 생성합니다.</p>
      <h4>프로젝트 성과</h4>
      <ul>
        <li>• 데이터 가공 처리 속도 350% 상승</li>
        <li>• 보고서 자동 생성으로 주당 20시간 업무 절감</li>
        <li>• 적용 기술: React, Python FastAPI, PyTorch, Vector DB, AWS EKS</li>
      </ul>
    `
  },
  'proj2': {
    title: 'PayGlobal - 차세대 글로벌 자산 관리 핀테크 앱',
    body: `
      <p>글로벌페이 파트너스와 협업하여 구축한 하이브리드 금융 핀테크 모바일 어플리케이션입니다. 전자서명 및 금융 보안 기준을 100% 만족시켰습니다.</p>
      <h4>프로젝트 성과</h4>
      <ul>
        <li>• 런칭 6개월 만에 120만 다운로드 기록</li>
        <li>• 무장애 가동률 99.99% 달성</li>
        <li>• 적용 기술: Flutter, Node.js Microservices, Redis, Spring Cloud</li>
      </ul>
    `
  },
  'proj3': {
    title: 'MediConnect - EMR 원격 진료 & 스마트 헬스케어 플랫폼',
    body: `
      <p>메디플로우 헬스케어의 원격 상담 및 전자 처방전 발급 플랫폼입니다. HIPAA 및 개인정보 보호법 엄격 준수 아키텍처로 구현되었습니다.</p>
      <h4>프로젝트 성과</h4>
      <ul>
        <li>• 의료기관 300곳 연동 달성</li>
        <li>• 1:1 종단간 암호화 화상 진료 제공</li>
        <li>• 적용 기술: Next.js, WebRTC, Docker, PostgreSQL</li>
      </ul>
    `
  }
};

function initModals() {
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalContentBody = document.getElementById('modalContentBody');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const serviceModalBtns = document.querySelectorAll('.service-modal-btn');
  const portDetailBtns = document.querySelectorAll('.port-detail-btn');
  const privacyModalBtn = document.getElementById('privacyModalBtn');

  function openModal(title, htmlContent) {
    if (!modalBackdrop || !modalContentBody) return;
    modalContentBody.innerHTML = `<h2>${title}</h2>${htmlContent}`;
    modalBackdrop.classList.add('active');
  }

  function closeModal() {
    if (modalBackdrop) modalBackdrop.classList.remove('active');
  }

  serviceModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modalKey = btn.getAttribute('data-modal');
      const detail = serviceModalDetails[modalKey];
      if (detail) {
        openModal(detail.title, detail.body);
      }
    });
  });

  portDetailBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const projKey = btn.getAttribute('data-project');
      const detail = projectModalDetails[projKey];
      if (detail) {
        openModal(detail.title, detail.body);
      }
    });
  });

  function openPrivacyModal() {
    openModal(
      '개인정보 수집 및 이용 안내',
      `
      <div class="privacy-modal-detail">
        <p>주식회사 글로컬소프트(이하 '회사')는 고객님의 개인정보를 소중하게 생각하며 「개인정보 보호법」 및 관계 법령을 준수합니다.</p>
        
        <h4>1. 개인정보의 수집 및 이용 목적</h4>
        <p>고객 문의 접수, 본인 확인, 서비스 견적 산출 및 맞춤 상담 서비스 제공, 상담 결과 회신</p>
        
        <h4>2. 수집하는 개인정보 항목</h4>
        <ul>
          <li>• 필수항목: 성함(담당자명), 이메일 주소, 연락처(휴대전화), 문의 내용</li>
          <li>• 선택항목: 회사/기관명, 관심 서비스 분야</li>
        </ul>

        <h4>3. 개인정보의 보유 및 이용 기간</h4>
        <p>문의 처리 및 상담 이력 관리를 위해 접수일로부터 <strong>1년간</strong> 보관 후 지체 없이 안전하게 파기합니다. (고객의 파기 요청 시 즉시 파기)</p>

        <h4>4. 동의 거부 권리 및 불이익 안내</h4>
        <p>귀하는 개인정보 수집 및 이용 동의를 거부할 권리가 있습니다. 단, 필수항목 수집에 동의하지 않으실 경우 무료 상담 및 견적 안내 접수가 제한될 수 있습니다.</p>
      </div>
      `
    );
  }

  if (privacyModalBtn) {
    privacyModalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openPrivacyModal();
    });
  }

  const viewPrivacyInline = document.getElementById('viewPrivacyInline');
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

/* ==========================================
   7. CONTACT FORM SUBMISSION (안전 접수 파이프라인)
   ========================================== */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitFormBtn');

  if (!contactForm) return;

  let isSubmitting = false;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 중복 제출 방지
    if (isSubmitting) return;

    const clientNameInput = document.getElementById('clientName');
    const companyNameInput = document.getElementById('companyName');
    const clientEmailInput = document.getElementById('clientEmail');
    const clientPhoneInput = document.getElementById('clientPhone');
    const inquiryTypeInput = document.getElementById('inquiryType');
    const projectScopeInput = document.getElementById('projectScope');
    const privacyAgreeInput = document.getElementById('privacyAgree');

    const name = clientNameInput ? clientNameInput.value.trim() : '';
    const company = companyNameInput ? companyNameInput.value.trim() : '';
    const email = clientEmailInput ? clientEmailInput.value.trim() : '';
    const phone = clientPhoneInput ? clientPhoneInput.value.trim() : '';
    const inquiryType = inquiryTypeInput ? inquiryTypeInput.value : '';
    const scope = projectScopeInput ? projectScopeInput.value.trim() : '';
    const privacyAgreed = privacyAgreeInput ? privacyAgreeInput.checked : false;

    // 1. 필수 입력값 검증 (Client-side Validation)
    if (name.length < 2) {
      showToast('담당자 성함을 2자 이상 입력해 주세요.', 'warning');
      if (clientNameInput) clientNameInput.focus();
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
      showToast('문의 및 요구사항 내용을 최소 5자 이상 작성해 주세요.', 'warning');
      if (projectScopeInput) projectScopeInput.focus();
      return;
    }

    if (!privacyAgreed) {
      showToast('개인정보 수집 및 이용에 동의하셔야 상담 신청이 가능합니다.', 'warning');
      if (privacyAgreeInput) privacyAgreeInput.focus();
      return;
    }

    // 제출 진행 상태 활성화
    isSubmitting = true;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 접수 처리 중...';
    }

    const inquiryTypeText = (inquiryTypeInput && inquiryTypeInput.selectedIndex >= 0)
      ? inquiryTypeInput.options[inquiryTypeInput.selectedIndex].text
      : inquiryType;

    // Formspree 전송용 페이로드 (불필요한 민감정보나 비밀키 일체 미포함)
    const payload = {
      _subject: `[글로컬소프트 상담 신청] ${name} (${company || '개인/미기재'})`,
      name: name,
      company: company || '미기재',
      email: email,
      phone: phone,
      inquiryType: inquiryTypeText,
      message: scope,
      submittedAt: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
    };

    try {
      // 2. 외부 서비스 연결 여부 확인 및 안전한 전송
      if (CONTACT_CONFIG.mode === 'endpoint' && CONTACT_CONFIG.endpointUrl) {
        const response = await fetch(CONTACT_CONFIG.endpointUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          // 서버 정상 처리 확인 시에만 폼 리셋 및 성공 안내
          contactForm.reset();
          showToast('🎉 무료 상담 요청이 정상 접수되었습니다! 담당자가 신속히 확인 후 연락드리겠습니다.', 'success');
        } else {
          const errData = await response.json().catch(() => ({}));
          const errMsg = (errData && errData.errors && errData.errors.map(e => e.message).join(', ')) || `상태코드: ${response.status}`;
          throw new Error(errMsg);
        }
      } else if (CONTACT_CONFIG.mode === 'emailjs' && CONTACT_CONFIG.emailjs.publicKey) {
        if (window.emailjs) {
          await window.emailjs.send(
            CONTACT_CONFIG.emailjs.serviceId,
            CONTACT_CONFIG.emailjs.templateId,
            payload,
            CONTACT_CONFIG.emailjs.publicKey
          );
          contactForm.reset();
          showToast('🎉 무료 상담 요청이 정상 접수되었습니다!', 'success');
        } else {
          throw new Error('EmailJS SDK가 로드되지 않았습니다.');
        }
      } else {
        // [외부 서비스 미연동 안전 모드]
        // 거짓 성공(Mock)을 표시하지 않고, 작성 내용을 보존한 상태로 유선/이메일 직통 접수를 정직하게 안내
        await new Promise(resolve => setTimeout(resolve, 600));
        showToast('⚠️ 온라인 접수 연동 준비 중입니다. 긴급 상담은 전화(010-9354-7929) 또는 이메일(shokun2002@naver.com)로 연락해 주세요. (작성 내용은 보존되었습니다)', 'warning');
      }
    } catch (error) {
      console.error('Contact submission error:', error);
      // 전송 실패 시: 오류 안내 및 입력 내용 보존 (contactForm.reset 미호출)
      showToast('❌ 문의 전송 중 오류가 발생했습니다. 잠시 후 다시 시도하시거나 이메일(shokun2002@naver.com)로 문의 바랍니다. (작성 내용은 보존되었습니다)', 'error');
    } finally {
      isSubmitting = false;
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-check-circle"></i> 무료 상담 요청 제출하기';
      }
    }
  });
}

/* Toast Message Utility (다양한 타입 지원) */
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

/* ==========================================
   8. MULTI-LANGUAGE (i18n KR/EN) TOGGLE
   ========================================== */
const dictionary = {
  ko: {
    nav_home: '홈',
    nav_about: '회사소개',
    nav_services: '서비스',
    nav_tech: '기술스택',
    nav_calculator: '견적계산기',
    nav_contact: '문의하기',
    nav_cta: '상담 신청',
    hero_badge: '전남에서 펼쳐지는 IT 혁신',
    hero_title: '농촌형 소도시에서도<br><span class="gradient-text">IT 기술은 꽃필 수 있습니다</span>',
    hero_subtitle: '여러분의 아이디어를 현실로 구현해 드립니다',
    hero_btn_services: '<i class="fa-solid fa-layer-group"></i> 서비스 둘러보기',
    hero_btn_contact: '<i class="fa-regular fa-paper-plane"></i> 상담 신청',
    stat_experience: '지역언론 기자 실무 경력',
    stat_experience_sub: '대표자 취재·보도 실무 노하우',
    stat_domain: '미디어·신문사 도메인 전문성',
    stat_domain_sub: '지역 언론 운영 프로세스 최적화',
    stat_tech: '인터넷신문 & 단체 SaaS 혁신',
    stat_tech_sub: 'AI 취재노트 & CMS 기술 연동',
    about_subtitle: 'OUR MISSION & VISION',
    about_title: '지방과 소도시도 미래 기술의 중심이 될 수 있습니다',
    about_desc: '글로컬소프트는 10여 년간 지역신문 기자로 현장을 누빈 대표자의 언론·미디어 도메인 실무 노하우를 바탕으로 설립된 기술 혁신 기업입니다. 공간적 한계에 갇히지 않고, 인터넷신문사와 소규모 기업·사회단체가 미래 AI 기술을 손쉽게 활용할 수 있도록 맞춤형 B2B SaaS와 실무 솔루션을 제공합니다.',
    val1_title: 'Local & Media Domain',
    val1_desc: '10여 년 지역 언론 취재·보도 실무 경험을 바탕으로, 지역 사회와 중소 언론사 및 단체가 미래 디지털 혁신에서 소외되지 않도록 돕습니다.',
    val2_title: 'Global Standard',
    val2_desc: '수도권과의 격차를 없애는 차세대 웹, 앱, AI 기술력으로 세계적 기준에 부합하는 솔루션을 개발합니다.',
    val3_title: 'Edu & Talent Hub',
    val3_desc: '지역 청소년, 청년, 기업을 위한 실무 중심 코딩 교육으로 지역 인재가 미래 기술 주역으로 성장하도록 양성합니다.',
    val4_title: 'Coexistence & Future',
    val4_desc: '농축수산 및 지역 특화 산업의 스마트 디지털 전환(DX)을 이끌며 지역 사회와 함께 지속 가능한 내일을 만듭니다.',
    services_subtitle: 'OUR CORE SERVICES',
    services_title: '지역의 가능성을 기술로 완성하는 핵심 서비스',
    services_desc: '실무 코딩 교육부터 맞춤형 웹/앱 개발, AI 솔루션, 지역 산업 스마트 연동까지 전담 엔지니어가 밀착 지원합니다.',
    srv7_title: '코딩 교육 & IT 인재 양성',
    srv7_desc: '초·중·고 및 대학교, 기업 맞춤형 커리큘럼 기반의 파이썬, AI, 웹/앱 개발 실무 멘토링 프로그램 제공.',
    btn_learn_more: '상세보기 <i class="fa-solid fa-arrow-right"></i>',
    tech_subtitle: 'TECHNOLOGY STACK',
    tech_title: '최첨단 기술 생태계 및 노하우',
    tech_desc: '검증된 최신 프레임워크와 견고한 클라우드 아키텍처를 도입합니다.',
    tech_tab_all: '전체',
    tech_tab_fe: '프론트엔드',
    tech_tab_be: '백엔드',
    tech_tab_ai: 'AI & ML',
    tech_tab_cloud: 'DevOps / Cloud',
    calc_subtitle: 'INSTANT ESTIMATE CALCULATOR',
    calc_title: '스마트 실시간 프로젝트 견적 계산기',
    calc_desc: '필요한 개발 항목과 기능을 선택하시면 예상 소요 기간과 대략적인 개발 비용을 즉시 산출합니다.',
    calc_step1_title: '개발 프로젝트 유형',
    calc_step2_title: '필요 주요 기능 선택 (중복 가능)',
    calc_step3_title: '목표 개발 기간 / 완성도',
    contact_subtitle: 'GET IN TOUCH',
    contact_title: '비즈니스의 혁신,<br>지금 바로 시작하세요',
    contact_desc: '아이디어 단계의 구상부터 엔터프라이즈 시스템 구축까지 글로컬소프트의 기술 전문가들이 친절하게 안내해 드립니다.'
  },
  en: {
    nav_home: 'Home',
    nav_about: 'About',
    nav_services: 'Services',
    nav_tech: 'Tech Stack',
    nav_calculator: 'Calculator',
    nav_contact: 'Contact',
    nav_cta: 'Get Started',
    hero_badge: 'Regional IT & AI Innovation',
    hero_title: 'Even in Rural Small Cities,<br><span class="gradient-text">IT Innovation Can Blossom</span>',
    hero_subtitle: 'Turning Your Ideas into Reality',
    hero_btn_services: '<i class="fa-solid fa-layer-group"></i> View Services',
    hero_btn_contact: '<i class="fa-regular fa-paper-plane"></i> Get in Touch',
    stat_experience: 'Local Journalism Experience',
    stat_experience_sub: 'Founder Field Reporting & Media Know-how',
    stat_domain: 'Media & Newsroom Expertise',
    stat_domain_sub: 'Optimized Workflow for Local Press',
    stat_tech: 'Newsroom & SaaS Innovation',
    stat_tech_sub: 'AI Reporter Note & CMS Integration',
    about_subtitle: 'OUR MISSION & VISION',
    about_title: 'Even Rural Regions Can Become Centers of Future Tech',
    about_desc: 'Built upon our founder\'s 10+ years of investigative reporting and newspaper publishing expertise, Glocalsoft breaks regional boundaries with specialized B2B SaaS and AI platforms tailored for local media and community organizations.',
    val1_title: 'Local & Media Domain',
    val1_desc: 'Harnessing over 10 years of newsroom experience to ensure local press and community organizations thrive in the AI era.',
    val2_title: 'Global Standard',
    val2_desc: 'Delivering enterprise-grade web, app, and AI architectures equal to global top tier standards.',
    val3_title: 'Edu & Talent Hub',
    val3_desc: 'Fostering the next generation of tech talent through 1-on-1 practical coding bootcamps and mentoring.',
    val4_title: 'Coexistence & Future',
    val4_desc: 'Driving smart digital transformation (DX) for local industries and agriculture to build a sustainable future.',
    services_subtitle: 'OUR CORE SERVICES',
    services_title: 'Core Services Empowering Regional Potential',
    services_desc: 'From coding bootcamps to custom web/app development, AI integration, and smart regional systems.',
    srv7_title: 'Coding Education & IT Training',
    srv7_desc: 'Custom coding bootcamps and IT training programs tailored for schools, universities, and enterprise teams.',
    btn_learn_more: 'Learn More <i class="fa-solid fa-arrow-right"></i>',
    tech_subtitle: 'TECHNOLOGY STACK',
    tech_title: 'Our Modern Technology Ecosystem',
    tech_desc: 'Leveraging battle-tested frameworks and robust cloud native infrastructures.',
    tech_tab_all: 'All',
    tech_tab_fe: 'Frontend',
    tech_tab_be: 'Backend',
    tech_tab_ai: 'AI & ML',
    tech_tab_cloud: 'DevOps / Cloud',
    calc_subtitle: 'INSTANT ESTIMATE CALCULATOR',
    calc_title: 'Smart Real-time Project Estimator',
    calc_desc: 'Select your project scope and features to get instant estimates on cost and timeline.',
    calc_step1_title: 'Project Category',
    calc_step2_title: 'Key Features Required',
    calc_step3_title: 'Target Delivery Speed',
    contact_subtitle: 'GET IN TOUCH',
    contact_title: 'Accelerate Your Digital Innovation Today',
    contact_desc: 'From concept design to enterprise system deployment, our expert engineers are here to guide you.'
  }
};

function initI18n() {
  const langBtn = document.getElementById('langToggleBtn');
  const currentLangLabel = document.getElementById('currentLangLabel');
  let currentLang = 'ko';

  if (!langBtn) return;

  langBtn.addEventListener('click', () => {
    currentLang = currentLang === 'ko' ? 'en' : 'ko';
    if (currentLangLabel) currentLangLabel.innerText = currentLang === 'ko' ? 'EN' : 'KR';

    const transables = document.querySelectorAll('[data-i18n]');
    transables.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dictionary[currentLang] && dictionary[currentLang][key]) {
        el.innerHTML = dictionary[currentLang][key];
      }
    });

    showToast(`언어가 ${currentLang === 'ko' ? '한국어' : 'English'}로 변경되었습니다.`);
  });
}
