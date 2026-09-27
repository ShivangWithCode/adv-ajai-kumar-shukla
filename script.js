/**
 * ============================================================================
 * CHAMBER OF ADV. AJAI KUMAR SHUKLA | ADVOCATE, HIGH COURT LUCKNOW
 * Pure Vanilla JavaScript (Zero External Dependencies)
 * Handles: BCI Rule 36 Modal, WhatsApp Lead Engine, Mobile Navigation & FAQs
 * ============================================================================
 */

(function () {
  'use strict';

  // 0. Automatic HTTPS Redirection for live domains
  if (window.location.protocol === 'http:' &&
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1') {
    window.location.replace('https:' + window.location.href.substring(window.location.protocol.length));
    return;
  }

  // Chamber constants
  const CHAMBER_PHONE = '918004721000';
  const BCI_STORAGE_KEY = 'bci_rule36_disclaimer_accepted';

  // DOM Elements
  const disclaimerModal = document.getElementById('disclaimerModal');
  const acceptBtn = document.getElementById('acceptBtn');
  const declineBtn = document.getElementById('declineBtn');
  const reopenDisclaimerBtn = document.getElementById('reopenDisclaimerBtn');
  const reopenDisclaimerBtn2 = document.getElementById('reopenDisclaimerBtn2');

  const siteHeader = document.getElementById('siteHeader');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const consultationForm = document.getElementById('consultationForm');
  const formSuccessMessage = document.getElementById('formSuccessMessage');

  /* --------------------------------------------------------------------------
     1. BCI RULE 36 DISCLAIMER MODAL LOGIC
     -------------------------------------------------------------------------- */

  function openDisclaimerModal() {
    if (!disclaimerModal) return;
    disclaimerModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Focus primary accept button for accessibility
    setTimeout(() => {
      if (acceptBtn) acceptBtn.focus();
    }, 150);
  }

  function closeDisclaimerModal() {
    if (!disclaimerModal) return;
    disclaimerModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function initDisclaimerModal() {
    const hasAccepted = localStorage.getItem(BCI_STORAGE_KEY);

    if (hasAccepted !== 'true') {
      // Small delay on initial visit for smooth visual entrance
      setTimeout(openDisclaimerModal, 200);
    }

    // Accept action
    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        try {
          localStorage.setItem(BCI_STORAGE_KEY, 'true');
        } catch (e) {
          console.warn('LocalStorage unavailable:', e);
        }
        closeDisclaimerModal();
      });
    }

    // Decline action
    if (declineBtn) {
      declineBtn.addEventListener('click', function () {
        const confirmExit = window.confirm(
          'In compliance with Bar Council of India Rule 36, you cannot browse this chamber portal without acknowledging that you are seeking legal information voluntarily.\n\nClick OK to leave the website or Cancel to review the legal disclosure.'
        );
        if (confirmExit) {
          window.location.href = 'https://www.google.com';
        }
      });
    }

    // Reopen modal triggers in footer
    if (reopenDisclaimerBtn) {
      reopenDisclaimerBtn.addEventListener('click', openDisclaimerModal);
    }
    if (reopenDisclaimerBtn2) {
      reopenDisclaimerBtn2.addEventListener('click', openDisclaimerModal);
    }

    // Close on Escape key if user has previously accepted
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && disclaimerModal.classList.contains('active')) {
        const hasAccepted = localStorage.getItem(BCI_STORAGE_KEY);
        if (hasAccepted === 'true') {
          closeDisclaimerModal();
        }
      }
    });
  }

  /* --------------------------------------------------------------------------
     2. STICKY HEADER SCROLL ELEVATION
     -------------------------------------------------------------------------- */
  function initHeaderScroll() {
    if (!siteHeader) return;

    let ticking = false;

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          if (window.scrollY > 40) {
            siteHeader.classList.add('scrolled');
          } else {
            siteHeader.classList.remove('scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* --------------------------------------------------------------------------
     3. MOBILE NAVIGATION DRAWER
     -------------------------------------------------------------------------- */
  function initMobileNav() {
    if (!mobileMenuBtn || !mobileNav) return;

    function toggleNav() {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      mobileMenuBtn.classList.toggle('is-active', !isExpanded);

      if (isExpanded) {
        mobileNav.setAttribute('hidden', '');
      } else {
        mobileNav.removeAttribute('hidden');
      }
    }

    function closeNav() {
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      mobileMenuBtn.classList.remove('is-active');
      mobileNav.setAttribute('hidden', '');
    }

    mobileMenuBtn.addEventListener('click', toggleNav);

    // Close mobile nav when clicking any link inside
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', closeNav);
    });

    // Close mobile nav if user clicks outside
    document.addEventListener('click', function (e) {
      if (!mobileNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        closeNav();
      }
    });
  }

  /* --------------------------------------------------------------------------
     4. CONSULTATION FORM & WHATSAPP LEAD GENERATOR
     -------------------------------------------------------------------------- */
  function initConsultationForm() {
    if (!consultationForm) return;

    const nameInput = document.getElementById('clientName');
    const phoneInput = document.getElementById('clientPhone');
    const categorySelect = document.getElementById('caseCategory');
    const notesInput = document.getElementById('caseNotes');
    const consentInput = document.getElementById('clientConsent');

    const nameError = document.getElementById('nameError');
    const phoneError = document.getElementById('phoneError');
    const categoryError = document.getElementById('categoryError');
    const notesError = document.getElementById('notesError');

    // Real-time input clearing
    [nameInput, phoneInput, categorySelect, notesInput].forEach(field => {
      if (!field) return;
      field.addEventListener('input', () => {
        field.classList.remove('is-invalid');
      });
    });

    consultationForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let isValid = true;

      // Validate Name
      const nameVal = nameInput.value.trim();
      if (!nameVal || nameVal.length < 3) {
        nameInput.classList.add('is-invalid');
        if (nameError) nameError.classList.add('is-visible');
        isValid = false;
      } else {
        nameInput.classList.remove('is-invalid');
        if (nameError) nameError.classList.remove('is-visible');
      }

      // Validate Phone (10-digit Indian standard)
      const phoneVal = phoneInput.value.trim().replace(/\D/g, '');
      if (!phoneVal || phoneVal.length < 10) {
        phoneInput.classList.add('is-invalid');
        if (phoneError) phoneError.classList.add('is-visible');
        isValid = false;
      } else {
        phoneInput.classList.remove('is-invalid');
        if (phoneError) phoneError.classList.remove('is-visible');
      }

      // Validate Category
      const catVal = categorySelect.value;
      if (!catVal) {
        categorySelect.classList.add('is-invalid');
        if (categoryError) categoryError.classList.add('is-visible');
        isValid = false;
      } else {
        categorySelect.classList.remove('is-invalid');
        if (categoryError) categoryError.classList.remove('is-visible');
      }

      // Validate Notes
      const notesVal = notesInput.value.trim();
      if (!notesVal || notesVal.length < 10) {
        notesInput.classList.add('is-invalid');
        if (notesError) notesError.classList.add('is-visible');
        isValid = false;
      } else {
        notesInput.classList.remove('is-invalid');
        if (notesError) notesError.classList.remove('is-visible');
      }

      // Validate Consent
      if (consentInput && !consentInput.checked) {
        alert('Please confirm your voluntary request under BCI Rule 36 before submitting.');
        isValid = false;
      }

      if (!isValid) {
        return;
      }

      // Construct Professional WhatsApp Brief
      const whatsappMessage = 
        `*LEGAL CONSULTATION REQUEST*\n` +
        `*To:* Chamber of Adv. Ajai Kumar Shukla\n` +
        `(Advocate, High Court Lucknow | Former Member - Disciplinary Committee, Bar Council of UP)\n` +
        `----------------------------------------\n` +
        `*Client Name / प्रार्थी:* ${nameVal}\n` +
        `*Contact Number:* +91 ${phoneVal}\n` +
        `*Matter Category:* ${catVal}\n` +
        `*Brief Case Facts:*\n${notesVal}\n` +
        `----------------------------------------\n` +
        `*BCI Rule 36 Declaration:* This consultation is requested voluntarily for legal awareness and professional advice.\n` +
        `*Sent via:* Official Chamber Web Portal (High Court Lucknow)`;

      // Target WhatsApp URL
      const whatsappUrl = `https://wa.me/${CHAMBER_PHONE}?text=${encodeURIComponent(whatsappMessage)}`;

      // Show immediate UI feedback
      if (formSuccessMessage) {
        formSuccessMessage.removeAttribute('hidden');
      }

      // Open WhatsApp in a new tab
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

      // Reset form after short delay
      setTimeout(() => {
        consultationForm.reset();
        setTimeout(() => {
          if (formSuccessMessage) {
            formSuccessMessage.setAttribute('hidden', '');
          }
        }, 5000);
      }, 800);
    });
  }

  /* --------------------------------------------------------------------------
     5. INITIALIZE ON DOM READY
     -------------------------------------------------------------------------- */
  function init() {
    initDisclaimerModal();
    initHeaderScroll();
    initMobileNav();
    initConsultationForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
