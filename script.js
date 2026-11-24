const pages = document.querySelectorAll(".page");
const navigationLinks = document.querySelectorAll(".navlinks [data-page]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const pageTitles = {
  home: "DEMIR.CO | Commercial Interiors",
  about: "About | DEMIR.CO",
  services: "Services | DEMIR.CO",
  projects: "Projects | DEMIR.CO",
  projectdetail: "Featured Project | DEMIR.CO",
  process: "Process | DEMIR.CO",
  contact: "Contact | DEMIR.CO",
};

function showPage(pageId, { updateHistory = false, scrollToTop = true } = {}) {
  const activePage = document.getElementById(pageId);

  if (!activePage || !activePage.classList.contains("page")) {
    return false;
  }

  pages.forEach((page) => {
    const isActive = page === activePage;
    page.classList.toggle("active", isActive);
    page.hidden = !isActive;
  });

  navigationLinks.forEach((link) => {
    if (link.dataset.page === pageId) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  if (updateHistory && window.location.hash !== `#${pageId}`) {
    window.history.pushState(null, "", `#${pageId}`);
  }

  if (scrollToTop) {
    window.scrollTo({
      top: 0,
      behavior: reducedMotion.matches ? "auto" : "smooth",
    });
  }

  document.title = pageTitles[pageId] || pageTitles.home;
  activePage.setAttribute("tabindex", "-1");

  return true;
}

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  const link = event.target.closest("a[data-page]");
  if (!link || !showPage(link.dataset.page, { updateHistory: true })) {
    return;
  }

  event.preventDefault();
});

function showPageFromLocation() {
  const requestedPage = window.location.hash.slice(1) || "home";
  if (!showPage(requestedPage)) {
    window.history.replaceState(null, "", "#home");
    showPage("home");
  }
}

window.addEventListener("hashchange", showPageFromLocation);
window.addEventListener("popstate", showPageFromLocation);

showPageFromLocation();

const preloader = document.querySelector(".preloader");
const preloaderStartedAt = performance.now();

function finishLoading() {
  const minimumDuration = reducedMotion.matches ? 0 : 500;
  const remainingDuration = Math.max(
    0,
    minimumDuration - (performance.now() - preloaderStartedAt),
  );

  window.setTimeout(() => {
    preloader.classList.add("is-hidden");
    window.setTimeout(() => {
      document.body.classList.remove("is-loading");
      preloader.remove();
    }, reducedMotion.matches ? 0 : 500);
  }, remainingDuration);
}

if (document.readyState === "complete") {
  finishLoading();
} else {
  window.addEventListener("load", finishLoading, { once: true });
}

const enquiryForm = document.querySelector(".form");
const formStatus = enquiryForm.querySelector(".form-status");

enquiryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus.textContent = "Enquiry details validated. Connect this form to an email or CRM service to receive submissions.";
});
