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
			var visible = ul.style.visibility;
			ul.style.visibility = visible === "" ? "visible" : "";
		});
	}

	function replaceContent(url, target) {

		var cached = pageCache[url];

		if (cached) {
			changeContent(cached);
			afterMenuItemClicked();
			return;
		}

		target && target.setAttribute("data-spinner", "true");

		var xhr = new XMLHttpRequest();
		xhr.open("GET", url, true);
		xhr.setRequestHeader("X-Content-Only", "1");
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {
				var page = { url: url, content: xhr.responseText, title: xhr.getResponseHeader("X-Title") };
				changeContent(page);
				pageCache[url] = page;
				target && target.removeAttribute("data-spinner");
				afterMenuItemClicked();
			}
		};

		xhr.send();
	}

	function afterMenuItemClicked() {
		if (burger.offsetLeft > 0 || burger.offsetTop > 0) { // If small screen
			burger.nextElementSibling.style.visibility = "";
		}

		scrollTo(0, 0);
	}

	function changeContent(page) {
		main.innerHTML = page.content;
		document.title = page.title;
	}

	function initPushState() {

		if (!history || !history.pushState)
			return;

		window.addEventListener("popstate", function (e) {
			replaceContent(location.pathname);
		});
	}

	function initPinnedSite() {
		try {
			if (window.external.msIsSiteMode()) {
				ext = window.external;
				ext.msSiteModeCreateJumpList("Navigation");

				var mainItems = document.querySelectorAll("#nav > ul > li > a");

				for (var i = mainItems.length - 1; i > -1; i--) {
					var link = mainItems[i];
					ext.msSiteModeAddJumpListItem(link.innerHTML, link.href, "/themes/standard/favicon/favicon.ico");
				}
			}
		}
		catch (e) { }
	}

	var cb = function () {
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = css;
		var head = document.getElementsByTagName('head')[0];
		head.parentNode.insertBefore(link, head);
	};

	var raf = requestAnimationFrame || mozRequestAnimationFrame || webkitRequestAnimationFrame || msRequestAnimationFrame;

	if (raf) raf(cb);
	else window.addEventListener('load', cb);

	initMenu();
	openMenu();
	initPushState();
	initPinnedSite();

})();