/* fic_app — white-label branding patch.
 *
 * The About dialog builds its app list from `frappe.utils.change_log.get_versions()`,
 * which returns each app's raw `app_title` hook. That value never passes through
 * `__()`, so translations cannot reach it — hence this small, targeted patch.
 *
 * NOTE: the "© Frappe Technologies" attribution is deliberately left untouched.
 * It is a licence/attribution notice, not product branding.
 */
frappe.provide("fic_app");

fic_app.BRAND = {
	from: /ERPNext/gi,
	to: "ERP-FIC",
};

fic_app.rebrand_node = function (el) {
	if (!el) return;
	el.querySelectorAll(".app-version").forEach((node) => {
		if (fic_app.BRAND.from.test(node.innerHTML)) {
			fic_app.BRAND.from.lastIndex = 0;
			node.innerHTML = node.innerHTML.replace(fic_app.BRAND.from, fic_app.BRAND.to);
		}
		fic_app.BRAND.from.lastIndex = 0;
	});
};

fic_app.patch_about_dialog = function () {
	if (!frappe.ui || !frappe.ui.misc || !frappe.ui.misc.about) return;
	if (frappe.ui.misc.about.__fic_patched) return;

	const original = frappe.ui.misc.about;
	const patched = function (...args) {
		const rv = original.apply(this, args);

		const attach = () => {
			const wrap = document.getElementById("about-app-versions");
			if (!wrap) return false;
			fic_app.rebrand_node(wrap);
			if (!wrap.__fic_observed) {
				wrap.__fic_observed = true;
				new MutationObserver(() => fic_app.rebrand_node(wrap)).observe(wrap, {
					childList: true,
					subtree: true,
					characterData: true,
				});
			}
			return true;
		};

		// the dialog body exists right away, the versions arrive asynchronously
		if (!attach()) {
			let tries = 0;
			const timer = setInterval(() => {
				if (attach() || ++tries > 40) clearInterval(timer);
			}, 200);
		}
		return rv;
	};
	patched.__fic_patched = true;
	frappe.ui.misc.about = patched;
};

$(document).ready(() => {
	if (!window.frappe || !frappe.session || frappe.session.user === "Guest") return;
	fic_app.patch_about_dialog();
});
