/* Tech Studio Solutions – site behaviour (vanilla JS, no dependencies) */
(function () {
  "use strict";
  var COMPANY_EMAIL = "sales@techstudiosolutions.com";
  // Web3Forms access key (from web3forms.com) – enquiries are emailed to the address it was created for
  var WEB3FORMS_KEY = "37f25c34-1533-4d63-a37a-2cfb67894f27";

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");

  // Sticky header shadow
  function onScroll() { header.classList.toggle("scrolled", window.scrollY > 10); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu
  function closeMenu() { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); toggle.setAttribute("aria-label", "Open menu"); }
  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeMenu); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });

  // Active nav link while scrolling
  var links = Array.prototype.slice.call(document.querySelectorAll('.primary-nav ul a'));
  var sectionMap = { digital: "services", why: "about", industries: "about" };
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = sectionMap[entry.target.id] || entry.target.id;
        links.forEach(function (l) { l.classList.toggle("active", l.getAttribute("href") === "#" + id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id]").forEach(function (s) { spy.observe(s); });

    // Scroll reveal
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("visible"); revealer.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + "ms";
      revealer.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("visible"); });
  }

  // "Learn More" / "Request Quote" links pre-select the service in the form
  var form = document.getElementById("enquiry-form");
  var select = document.getElementById("service-select");
  var message = document.getElementById("message-field");
  document.querySelectorAll("[data-service], [data-subject]").forEach(function (el) {
    el.addEventListener("click", function () {
      var service = el.getAttribute("data-service");
      var detail = el.getAttribute("data-detail");
      if (service) {
        for (var i = 0; i < select.options.length; i++) {
          if (select.options[i].text === service) { select.selectedIndex = i; break; }
        }
      } else if (el.getAttribute("data-subject")) {
        select.value = "";
      }
      if (detail && !message.value) {
        message.value = "I would like a quotation for: " + detail + ".\nQuantity / requirements: ";
      } else if (service && !message.value) {
        message.value = "I would like more information about " + service + ".\n";
      }
      setTimeout(function () { (select.value ? message : select).focus({ preventScroll: true }); }, 600);
    });
  });

  // Enquiry form -> Web3Forms (emails the enquiry, no backend needed)
  var status = document.getElementById("form-status");
  var submitBtn = form.querySelector('button[type="submit"]');
  var btnHTML = submitBtn.innerHTML;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var data = new FormData(form);
    var missing = [];
    ["name", "email", "phone", "service", "message"].forEach(function (field) {
      var input = form.elements[field];
      var val = String(data.get(field) || "").trim();
      var bad = !val || (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val));
      input.classList.toggle("invalid", bad);
      if (bad) missing.push(input);
    });
    if (missing.length) {
      status.className = "form-status error";
      status.textContent = "Please complete the highlighted fields with valid details.";
      missing[0].focus();
      return;
    }
    if (form.elements.botcheck && form.elements.botcheck.checked) return; // spam bot

    var payload = {
      access_key: WEB3FORMS_KEY,
      subject: "Website Enquiry: " + data.get("service") + " – " + data.get("name"),
      from_name: "Tech Studio Website",
      replyto: data.get("email"),
      name: data.get("name"),
      company: data.get("company") || "-",
      email: data.get("email"),
      phone: data.get("phone"),
      service: data.get("service"),
      message: data.get("message")
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    status.className = "form-status";
    status.textContent = "";

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(function (res) { return res.json(); })
      .then(function (json) {
        if (!json.success) throw new Error(json.message || "Failed");
        form.reset();
        status.className = "form-status success";
        status.textContent = "Thank you! Your enquiry has been submitted successfully. Our team will contact you shortly.";
      })
      .catch(function () {
        status.className = "form-status error";
        status.innerHTML = "Sorry, something went wrong. Please try again or email us at <a href=\"mailto:" + COMPANY_EMAIL + "\">" + COMPANY_EMAIL + "</a>.";
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.innerHTML = btnHTML;
      });
  });
  form.querySelectorAll("input, select, textarea").forEach(function (el) {
    el.addEventListener("input", function () { el.classList.remove("invalid"); });
  });
})();
