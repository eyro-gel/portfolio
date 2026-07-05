'use strict';

// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }


// sidebar toggle (mobile)
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");
if (sidebar && sidebarBtn) {
  sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });
}


// testimonials modal (optional — only wires up if present)
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

if (modalContainer && overlay) {
  const modalImg = document.querySelector("[data-modal-img]");
  const modalTitle = document.querySelector("[data-modal-title]");
  const modalText = document.querySelector("[data-modal-text]");

  const testimonialsModalFunc = function () {
    modalContainer.classList.toggle("active");
    overlay.classList.toggle("active");
  }

  for (let i = 0; i < testimonialsItem.length; i++) {
    testimonialsItem[i].addEventListener("click", function () {
      modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
      modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
      modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
      modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;
      testimonialsModalFunc();
    });
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener("click", testimonialsModalFunc);
  overlay.addEventListener("click", testimonialsModalFunc);
}


// custom select + portfolio filter
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
}

if (select) {
  select.addEventListener("click", function () { elementToggleFunc(this); });
}

for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    if (selectValue) selectValue.innerText = this.innerText;
    if (select) elementToggleFunc(select);
    filterFunc(selectedValue);
  });
}

let lastClickedBtn = filterBtn[0];
for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    if (selectValue) selectValue.innerText = this.innerText;
    filterFunc(selectedValue);
    if (lastClickedBtn) lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
}

// default the portfolio to the first category on load (the "All" tab was removed)
if (filterBtn.length) { filterFunc(filterBtn[0].innerText.toLowerCase()); }


// contact form validation
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
}


// ---------- Contact form -> Make (Integromat) webhook ----------
(function () {
  // 1) In Make, add a "Webhooks > Custom webhook" module, copy its address,
  //    and paste it between the quotes below. That's the only change needed.
  const MAKE_WEBHOOK_URL = "https://hook.us2.make.com/qbb1tjhct7ami2ijfxnv9b2w5dwe1t6q";

  const contactForm = document.querySelector("[data-form]");
  if (!contactForm) return;
  const submitBtn = contactForm.querySelector("[data-form-btn]");
  const btnLabel = submitBtn ? submitBtn.querySelector("span") : null;
  const defaultLabel = btnLabel ? btnLabel.textContent : "Send Message";

  const status = document.createElement("p");
  status.className = "form-status";
  contactForm.appendChild(status);
  const setStatus = function (msg, type) {
    status.textContent = msg || "";
    status.dataset.type = type || "";
  };

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!MAKE_WEBHOOK_URL) {
      setStatus("Form isn't connected yet — add your Make webhook URL in assets/js/script.js.", "error");
      return;
    }
    if (!contactForm.checkValidity()) { contactForm.reportValidity(); return; }

    const body = new URLSearchParams();
    body.append("fullname", contactForm.fullname.value.trim());
    body.append("email", contactForm.email.value.trim());
    body.append("message", contactForm.message.value.trim());
    body.append("source", "builtbyaero portfolio");
    body.append("submittedAt", new Date().toISOString());

    if (submitBtn) submitBtn.setAttribute("disabled", "");
    if (btnLabel) btnLabel.textContent = "Sending...";
    setStatus("", "");

    // form-encoded body keeps this a "simple" CORS request (no preflight);
    // no-cors lets it reach Make even if the webhook returns no CORS headers.
    fetch(MAKE_WEBHOOK_URL, { method: "POST", mode: "no-cors", body: body })
      .then(function () {
        setStatus("Thanks! Your message has been sent.", "success");
        contactForm.reset();
        if (submitBtn) submitBtn.setAttribute("disabled", "");
      })
      .catch(function () {
        setStatus("Something went wrong. Please email me directly instead.", "error");
        if (submitBtn) submitBtn.removeAttribute("disabled");
      })
      .finally(function () {
        if (btnLabel) btnLabel.textContent = defaultLabel;
      });
  });
})();


// page navigation
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    const target = this.innerHTML.toLowerCase();
    for (let j = 0; j < pages.length; j++) {
      if (target === pages[j].dataset.page) {
        pages[j].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[j].classList.remove("active");
      }
    }
    for (let k = 0; k < navigationLinks.length; k++) {
      navigationLinks[k].classList.toggle("active", navigationLinks[k] === this);
    }
  });
}


// ---------- Portfolio: website (data-url) / carousel (data-gallery) / video (data-video) / image ----------
(function () {
  const projectItems = document.querySelectorAll(".project-item");
  if (!projectItems.length) return;

  const lb = document.createElement("div");
  lb.className = "lightbox";
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-modal", "true");
  lb.innerHTML =
    '<button class="lightbox-close" aria-label="Close">\u00d7</button>' +
    '<button class="lightbox-nav lightbox-prev" aria-label="Previous slide">\u2039</button>' +
    '<button class="lightbox-nav lightbox-next" aria-label="Next slide">\u203a</button>' +
    '<figure class="lightbox-figure">' +
      '<div class="lightbox-media"></div>' +
      '<figcaption class="lightbox-caption"></figcaption>' +
      '<div class="lightbox-dots"></div>' +
    "</figure>";
  document.body.appendChild(lb);

  const media = lb.querySelector(".lightbox-media");
  const cap   = lb.querySelector(".lightbox-caption");
  const dots  = lb.querySelector(".lightbox-dots");
  const btnClose = lb.querySelector(".lightbox-close");
  const btnPrev  = lb.querySelector(".lightbox-prev");
  const btnNext  = lb.querySelector(".lightbox-next");

  let gallery = [];
  let index = 0;
  let baseCaption = "";

  const clearMedia = function () {
    const v = media.querySelector("video");
    if (v) { v.pause(); v.removeAttribute("src"); v.load(); }
    media.innerHTML = "";
  };

  const setImage = function (src, alt) {
    clearMedia();
    const img = document.createElement("img");
    img.src = src; img.alt = alt || "";
    media.appendChild(img);
  };

  const renderGallery = function () {
    const total = gallery.length;
    setImage(gallery[index], baseCaption);
    cap.textContent = total > 1 ? baseCaption + "  ·  " + (index + 1) + "/" + total : baseCaption;
    dots.querySelectorAll("button").forEach(function (d, i) {
      d.classList.toggle("active", i === index);
    });
  };

  const buildDots = function (total) {
    dots.innerHTML = "";
    if (total <= 1) return;
    for (let i = 0; i < total; i++) {
      const d = document.createElement("button");
      d.type = "button";
      d.setAttribute("aria-label", "Go to slide " + (i + 1));
      d.addEventListener("click", function () { index = i; renderGallery(); });
      dots.appendChild(d);
    }
  };

  const open = function () {
    lb.classList.add("active");
    document.body.style.overflow = "hidden";
  };
  const close = function () {
    lb.classList.remove("active");
    document.body.style.overflow = "";
    clearMedia();
  };

  const openImage = function (src, alt, caption) {
    lb.classList.remove("has-nav");
    gallery = []; baseCaption = caption || "";
    buildDots(0);
    setImage(src, alt);
    cap.textContent = baseCaption;
    open();
  };
  const openGallery = function (list, caption) {
    gallery = list; index = 0; baseCaption = caption || "";
    lb.classList.toggle("has-nav", gallery.length > 1);
    buildDots(gallery.length);
    renderGallery();
    open();
  };
  const openVideo = function (src, caption) {
    lb.classList.remove("has-nav");
    gallery = []; baseCaption = caption || "";
    buildDots(0);
    clearMedia();
    const v = document.createElement("video");
    v.src = src; v.controls = true; v.autoplay = true; v.playsInline = true;
    v.setAttribute("playsinline", "");
    media.appendChild(v);
    cap.textContent = baseCaption;
    open();
    const p = v.play(); if (p && p.catch) p.catch(function () {});
  };

  const nextSlide = function () { if (gallery.length > 1) { index = (index + 1) % gallery.length; renderGallery(); } };
  const prevSlide = function () { if (gallery.length > 1) { index = (index - 1 + gallery.length) % gallery.length; renderGallery(); } };

  btnClose.addEventListener("click", close);
  btnNext.addEventListener("click", nextSlide);
  btnPrev.addEventListener("click", prevSlide);
  lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("active")) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowRight") nextSlide();
    else if (e.key === "ArrowLeft") prevSlide();
  });

  // swipe on touch devices
  let tx = 0;
  lb.addEventListener("touchstart", function (e) { tx = e.changedTouches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 45) { if (dx < 0) nextSlide(); else prevSlide(); }
  }, { passive: true });

  // wire up each project card + badges
  projectItems.forEach(function (item) {
    const url = item.dataset.url;
    const galleryAttr = item.dataset.gallery;
    const video = item.dataset.video;
    const fig = item.querySelector(".project-img");
    const title = item.querySelector(".project-title");
    const caption = title ? title.textContent : "";

    if (url) item.setAttribute("data-external", "");
    if (fig && galleryAttr) {
      const n = galleryAttr.split(",").length;
      const badge = document.createElement("span");
      badge.className = "project-badge";
      badge.innerHTML = '<ion-icon name="albums-outline"></ion-icon>' + n;
      fig.appendChild(badge);
    }
    if (fig && video) {
      const badge = document.createElement("span");
      badge.className = "project-badge project-badge--play";
      badge.innerHTML = '<ion-icon name="play"></ion-icon>';
      fig.appendChild(badge);
    }

    const link = item.querySelector("a");
    if (!link) return;
    link.addEventListener("click", function (e) {
      e.preventDefault();
      if (url) {
        window.open(url, "_blank", "noopener");
      } else if (galleryAttr) {
        openGallery(galleryAttr.split(",").map(function (s) { return s.trim(); }), caption);
      } else if (video) {
        openVideo(video, caption);
      } else {
        const img = item.querySelector(".project-img img");
        openImage(img ? img.src : "", img ? img.alt : "", caption);
      }
    });
  });
})();


// ---------- Contact popup modal ----------
(function () {
  const modal = document.querySelector("[data-contact-modal]");
  if (!modal) return;
  const openers = document.querySelectorAll("[data-contact-open]");
  const closers = modal.querySelectorAll("[data-contact-close]");

  const open = function () { modal.classList.add("active"); document.body.style.overflow = "hidden"; };
  const close = function () { modal.classList.remove("active"); document.body.style.overflow = ""; };

  openers.forEach(function (btn) { btn.addEventListener("click", open); });
  closers.forEach(function (btn) { btn.addEventListener("click", close); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("active")) close();
  });
})();


// ---------- Testimonials: "Read more" when a quote is clipped ----------
(function () {
  const items = document.querySelectorAll("[data-testimonials-item]");
  if (!items.length) return;

  const addButtons = function () {
    items.forEach(function (item) {
      const textEl = item.querySelector(".testimonials-text");
      if (!textEl || item.querySelector(".testimonials-readmore")) return;
      if (textEl.scrollHeight > textEl.clientHeight + 2) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "testimonials-readmore";
        btn.textContent = "Read more";
        // click bubbles up to the card, which already opens the testimonial modal
        textEl.insertAdjacentElement("afterend", btn);
      }
    });
  };

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(addButtons);
  } else {
    window.addEventListener("load", addButtons);
  }
  // re-check on resize (clamping changes with column width)
  let t;
  window.addEventListener("resize", function () {
    clearTimeout(t);
    t = setTimeout(function () {
      document.querySelectorAll(".testimonials-readmore").forEach(function (b) { b.remove(); });
      addButtons();
    }, 200);
  });
})();
