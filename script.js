/* Tech Studio Solutions – site behaviour (vanilla JS, no dependencies) */
(function () {
  "use strict";
  var COMPANY_EMAIL = "sales@techstudiosolutions.com";

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

  // Enquiry form -> mailto (no backend). Never claims the message was sent.
  var status = document.getElementById("form-status");
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
    var subject = "Website Enquiry: " + data.get("service") + " – " + data.get("name");
    var body =
      "Name: " + data.get("name") + "\n" +
      "Company: " + (data.get("company") || "-") + "\n" +
      "Email: " + data.get("email") + "\n" +
      "Phone: " + data.get("phone") + "\n" +
      "Service Required: " + data.get("service") + "\n\n" +
      "Message:\n" + data.get("message");
    window.location.href = "mailto:" + COMPANY_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    status.className = "form-status info";
    status.innerHTML = "Your email app should now open with the enquiry ready — please press <strong>Send</strong> there to deliver it. If nothing opened, email us at <a href=\"mailto:" + COMPANY_EMAIL + "\">" + COMPANY_EMAIL + "</a> or use WhatsApp.";
  });
  form.querySelectorAll("input, select, textarea").forEach(function (el) {
    el.addEventListener("input", function () { el.classList.remove("invalid"); });
  });
})();
