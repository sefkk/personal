(function () {
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    document.querySelectorAll(".false-start-faq-item").forEach(function (details) {
        var summary = details.querySelector("summary");
        var answer = details.querySelector(".false-start-faq-answer");
        if (!summary || !answer) return;

        summary.addEventListener("click", function (e) {
            if (!details.open) return;
            if (reduceMotion.matches) return;
            if (details.classList.contains("is-closing")) {
                e.preventDefault();
                return;
            }

            e.preventDefault();

            var fallbackTimer;

            function finish() {
                clearTimeout(fallbackTimer);
                answer.removeEventListener("transitionend", onTransitionEnd);
                details.classList.remove("is-closing");
                details.open = false;
            }

            function onTransitionEnd(ev) {
                if (ev.target !== answer) return;
                if (ev.propertyName !== "grid-template-rows") return;
                finish();
            }

            details.classList.add("is-closing");
            answer.addEventListener("transitionend", onTransitionEnd);
            fallbackTimer = setTimeout(function () {
                if (details.classList.contains("is-closing")) finish();
            }, 400);
        });
    });
})();
