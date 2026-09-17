/* ===========================================================================
 * fic_app — restore pinch-to-zoom (accessibility, WCAG 1.4.4)
 *
 * Frappe's desk template (frappe/www/app.html) hardcodes:
 *   width=device-width, initial-scale=1.0, maximum-scale=1.0,
 *   minimum-scale=1.0, user-scalable=no, minimal-ui
 *
 * Disabling zoom prevents low-vision users from enlarging text. We rewrite the
 * tag while <head> is still being parsed, so it takes effect before first
 * layout. Upstream files are left untouched.
 * =========================================================================== */
(function () {
	var CONTENT = "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, minimal-ui";

	function fixViewport() {
		var meta = document.querySelector('meta[name="viewport"]');
		if (meta) {
			// update in place: creating a second viewport tag is unreliable
			if (meta.getAttribute("content") !== CONTENT) meta.setAttribute("content", CONTENT);
		}
	}

	fixViewport();
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", fixViewport, { once: true });
	}
})();

/* ===========================================================================
 * fic_app — stop the link-preview popover from firing on phones
 *
 * frappe.ui.LinkPreview binds `mouseover` on a[data-doctype] and on Link
 * fields, then builds a popover. A touch screen synthesises `mouseover` on
 * tap, so on a phone:
 *   1. tapping any document link suddenly showed the preview card,
 *   2. the card was positioned off-screen to the left (RTL), and
 *   3. it added ~1200px of horizontal overflow, sliding the page sideways.
 *
 * A phone has no hover, so the popover has no purpose. The desk checks
 * frappe.boot.link_preview_doctypes inside setup_popover_control() and
 * returns early when it is empty, so emptying it removes the popover at the
 * source (no card, no API call, no layout damage). mobile.css hides the
 * popover as a second line of defence.
 * =========================================================================== */
(function () {
	var MQ = "(max-width: 767px)";

	function disableLinkPreview() {
		try {
			if (
				window.frappe &&
				frappe.boot &&
				Array.isArray(frappe.boot.link_preview_doctypes) &&
				frappe.boot.link_preview_doctypes.length
			) {
				frappe.boot.link_preview_doctypes = [];
			}
		} catch (e) {
			/* never let this break the desk */
		}
	}

	if (!window.matchMedia || !window.matchMedia(MQ).matches) return;

	disableLinkPreview();
	// frappe.boot may be injected after this file, so keep trying briefly
	var tries = 0;
	var iv = setInterval(function () {
		disableLinkPreview();
		if (++tries > 40) clearInterval(iv);
	}, 50);
	document.addEventListener("DOMContentLoaded", disableLinkPreview);
	window.addEventListener("load", disableLinkPreview);
})();
