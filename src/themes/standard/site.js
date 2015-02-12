(function () {

	var active = document.querySelector("nav .active");

	if (active) {
		while (active.parentNode.parentNode.tagName == "UL") {
			active = active.parentNode.parentNode;

			if (active.previousElementSibling)
				active.previousElementSibling.className = "open";
		}
	}

	document.querySelector("nav > ul").addEventListener("click", function (e) {
		var submenu = e.target.nextElementSibling;
		if (e.target.tagName === "A" && submenu) {
			e.preventDefault();
			e.target.className = e.target.className === "" ? "open" : "";
		}
	}, false);

	window.addEventListener('load', function (e) {
		if (!window.applicationCache)
			return;

		window.applicationCache.addEventListener('updateready', function (e) {
			if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
				// Browser downloaded a new app cache.
				//if (confirm('A new version of this site is available. Load it?')) {
					window.location.reload();
				//}
			}
		}, false);

	}, false);

})();