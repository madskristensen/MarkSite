(function () {

	var nav = document.getElementById("nav");

	function openMenu() {

		var active = nav.getElementsByClassName("active");

		if (active.length === 0)
			return;
		
		var li = active[0].parentNode;

		do {

			if (li.tagName === "LI" && li.childElementCount === 2)
				li.className = "open";

			li = li.parentNode;

		} while (li.parentNode !== nav);
	}

	function initMenu() {
		nav.querySelector("ul").addEventListener("click", function (e) {
			var submenu = e.target.nextElementSibling;

			if (e.target.tagName === "A" && submenu) {
				e.preventDefault();
				e.target.parentNode.className = e.target.parentNode.className === "" ? "open" : "";

				// Close all other open menu items
				var open = nav.getElementsByClassName("open");
				for (var i = 0; i < open.length; i++) {
					if (e.target.parentNode !== open[i])
						open[i].removeAttribute("class")
				}
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
		//initAppCache();

	}, false);

})();