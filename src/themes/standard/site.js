(function () {

	var nav = document.getElementById("nav"),
		burger = document.getElementById("burger"),
		main = document.getElementsByTagName("main")[0],
		pageCache = [];

	function openMenu() {

		var active = nav.getElementsByClassName("active");

		if (active.length === 0)
			return;

		var li = active[0].parentNode;

		do {

			if (li.tagName === "LI" && li.childElementCount === 2) {
				li.className = "open";
			}

			li = li.parentNode;

		} while (li.parentNode !== nav);
	}

	function initMenu() {
		document.body.addEventListener("click", function (e) {

			if (e.target.tagName !== "A")
				return;

			var href = e.target.getAttribute("href");

			if (e.target.nextElementSibling) {
				e.preventDefault();

				var parent = e.target.parentNode;

				if (parent.tagName !== "LI")
					return;

				parent.className = parent.className === "" ? "open" : "";

				// Close all other open menu items
				var open = nav.getElementsByClassName("open");
				for (var i = 0; i < open.length; i++) {
					if (parent !== open[i])
						open[i].removeAttribute("class");
				}
			}
			else if (href.indexOf("://") === -1 && history && history.pushState) {
				e.preventDefault();
				
				replaceContent(href, e.target);
				history.pushState(null, null, href);

				if (burger.offsetLeft > 0 || burger.offsetTop > 0) {
					burger.nextElementSibling.style.display = "";
				}

				// Close all other open menu items
				var active = nav.getElementsByClassName("active");
				for (var a = 0; a < active.length; a++) {
					active[a].removeAttribute("class");
				}

				e.target.className = "active";
			}
			
		}, false);

		burger.addEventListener("click", function (e) {
			e.preventDefault();
			var ul = e.target.nextElementSibling;
			var display = ul.style.display;
			ul.style.display = display === "" ? "block" : "";
		});
	}

	function replaceContent(url, target) {

		var cached = pageCache.filter(function (p) { return p.url === url; });

		if (cached.length === 1) {
			changeContent(cached[0]);
			return;
		}

		target.setAttribute("data-spinner", "true");

		var xhr = new XMLHttpRequest();
		xhr.open("GET", url, true);
		xhr.setRequestHeader("X-Content-Only", "1");
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {
				var page = { url: url, content: xhr.responseText, title: xhr.getResponseHeader("X-Title") };
				changeContent(page);
				pageCache.push(page);
				target.removeAttribute("data-spinner");
			}
		};

		xhr.send();
	}

	function changeContent(page) {
		main.innerHTML = page.content;
		document.title = page.title;
	}

	function initPushState() {

		if (!history && !history.pushState)
			return;

		window.addEventListener("popstate", function (e) {
			replaceContent(location.pathname);
		});
	}

	//function initAppCache() {
	//	if (!window.applicationCache)
	//		return;

	//	window.applicationCache.addEventListener('updateready', function (e) {
	//		if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
	//			// Browser downloaded a new app cache.
	//			//if (confirm('A new version of this site is available. Load it?')) {
	//			window.location.reload();
	//			//}
	//		}
	//	}, false);
	//}

	window.addEventListener('load', function (e) {

		initMenu();
		openMenu();
		initPushState();
		//initAppCache();

	}, false);

})();