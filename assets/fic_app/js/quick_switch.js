/* fic_app — corner quick switcher: dark/light theme + EN/AR language.
 *
 * Loaded on every desk page through the `app_include_js` hook in hooks.py.
 * Two one-click toggles, fixed to the bottom corner of the desk.
 */
frappe.provide("fic_app");

const FIC_SUN = `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`;
const FIC_MOON = `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>`;

fic_app.QuickSwitcher = class QuickSwitcher {
	constructor() {
		this.busy = false;
		this.make();
		this.bind();
		this.render();
	}

	make() {
		this.$wrapper = $(`
			<div id="fic-quick-switch" class="fic-qs" role="group"
				aria-label="${__("Display and language")}">
				<button type="button" class="fic-qs-btn" data-action="theme"></button>
				<button type="button" class="fic-qs-btn fic-qs-btn--lang" data-action="language"></button>
			</div>
		`).appendTo(document.body);
		this.$theme = this.$wrapper.find('[data-action="theme"]');
		this.$lang = this.$wrapper.find('[data-action="language"]');
	}

	bind() {
		this.$theme.on("click", () => this.toggle_theme());
		this.$lang.on("click", () => this.toggle_language());
	}

	/* ---------------------------------------------------------------- state */

	get theme_mode() {
		// "light" | "dark" | "automatic"
		return document.documentElement.getAttribute("data-theme-mode") || "light";
	}

	get is_dark() {
		if (this.theme_mode === "automatic") {
			return window.matchMedia("(prefers-color-scheme: dark)").matches;
		}
		return this.theme_mode === "dark";
	}

	get language() {
		return (document.documentElement.lang || "en").split("-")[0].toLowerCase();
	}

	render() {
		this.$theme
			.html(this.is_dark ? FIC_SUN : FIC_MOON)
			.attr("title", this.is_dark ? __("Light mode") : __("Dark mode"))
			.attr("aria-label", this.is_dark ? __("Switch to light mode") : __("Switch to dark mode"));

		this.$lang
			.text(this.language === "ar" ? "EN" : "ع")
			.attr("title", this.language === "ar" ? __("Switch to English") : __("التبديل إلى العربية"))
			.attr("aria-label", this.language === "ar" ? "Switch to English" : "Switch to Arabic");
	}

	/* --------------------------------------------------------------- actions */

	async toggle_theme() {
		if (this.busy) return;
		const next = this.is_dark ? "light" : "dark";

		// Apply instantly (what Frappe's own theme switcher does) ...
		document.documentElement.setAttribute("data-theme-mode", next);
		if (frappe.ui && frappe.ui.set_theme) {
			frappe.ui.set_theme(next);
		} else {
			document.documentElement.setAttribute("data-theme", next);
		}
		this.render();

		// ... then persist it on the user, exactly like the built-in switcher.
		try {
			await frappe.xcall("frappe.core.doctype.user.user.switch_theme", {
				theme: next === "dark" ? "Dark" : "Light",
			});
			frappe.show_alert(
				{ message: next === "dark" ? __("Dark mode") : __("Light mode"), indicator: "green" },
				3
			);
		} catch (e) {
			frappe.show_alert({ message: __("Could not save the theme"), indicator: "red" }, 5);
			// Put the UI back where it was so it never lies about the saved state.
			document.documentElement.setAttribute("data-theme-mode", this.is_dark ? "light" : "dark");
			if (frappe.ui && frappe.ui.set_theme) frappe.ui.set_theme();
			this.render();
		}
	}

	async toggle_language() {
		if (this.busy) return;
		const next = this.language === "ar" ? "en" : "ar";

		this.busy = true;
		this.$lang.addClass("fic-qs-busy");
		try {
			await frappe.xcall("fic_app.api.set_my_language", { language: next });
			// A full reload is required so the desk re-fetches its translations
			// and the document direction (rtl/ltr) is re-applied server-side.
			window.location.reload();
		} catch (e) {
			this.busy = false;
			this.$lang.removeClass("fic-qs-busy");
			frappe.show_alert({ message: __("Could not switch the language"), indicator: "red" }, 5);
		}
	}
};

$(document).ready(() => {
	if (!window.frappe || !frappe.session || frappe.session.user === "Guest") return;
	if (document.getElementById("fic-quick-switch")) return;
	fic_app.quick_switcher = new fic_app.QuickSwitcher();
});
