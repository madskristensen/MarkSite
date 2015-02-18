(function () {

	function openMenu() {

		var active = document.querySelector("nav .active");

		if (!active)// || (active.offsetWidth === 0 && active.offsetHeight === 0)) // Only if visible
			return;

		while (active.parentNode.parentNode.tagName === "UL") {
			active = active.parentNode.parentNode;

			var sibling = active.previousElementSibling;

			if (sibling)
				sibling.parentNode.className = "open";
		}
	}

	function initMenu() {
		document.querySelector("nav > ul").addEventListener("click", function (e) {
			var submenu = e.target.nextElementSibling;

			if (e.target.tagName === "A" && submenu) {
				e.preventDefault();

				var open = document.querySelectorAll(".open");
				for (var i = 0; i < open.length; i++) {
					open[i].removeAttribute("class")
				}

				e.target.parentNode.className = e.target.parentNode.className === "" ? "open" : "";
			}

		}, false);

		document.getElementById("burger").addEventListener("click", function (e) {
			e.preventDefault();
			var ul = e.target.nextElementSibling;
			var display = ul.style.display;
			ul.style.display = display === "" ? "block" : "";
		});
	}

	function initAppCache() {
		if (!window.applicationCache)
			return;

		window.applicationCache.addEventListener('updateready', function (e) {
			if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
				// Browser downloaded a new app cache.
				//if (confirm('A new version of this site is available. Load it?')) {
				window.location.reload();
				//}
			}
		}, false);
	}

	window.addEventListener('load', function (e) {

		initMenu();
		openMenu();
		initAppCache();

	}, false);

})();