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

})();