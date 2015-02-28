var dataService = (function () {

	var pageCache = [];

	function getPage(url, callback) {

		var cached = pageCache[url];

		if (cached) {
			callback(cached);
			return;
		}

		var xhr = new XMLHttpRequest();
		xhr.open("GET", url, true);
		xhr.setRequestHeader("X-Content-Only", "1");
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {
				var page = { url: url, content: xhr.responseText, title: xhr.getResponseHeader("X-Title"), next: xhr.getResponseHeader("X-Next"), prev: xhr.getResponseHeader("X-Prev") };
				pageCache[url] = page;
				callback(page);
			}
		};

		xhr.send();
	}

	return {
		getPage: getPage,
	}

})();
/// <reference path="dataService.js" />

(function () {

	var nav = document.getElementById("nav"),
		burger = document.getElementById("burger"),
		main = document.getElementsByTagName("main")[0],
		hero = document.getElementById("hero");

	function openMenu() {

		if (location.pathname === "/")
			return;

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

	function onBodyClick(e) {

		if (e.target.tagName !== "A")
			return;

		var href = e.target.getAttribute("href");

		if (location.pathname === href) {
			e.preventDefault();
			return;
		}

		if (e.target.id === burger.id) {
			onBurgerClick(e);
		}
		else if (e.target.nextElementSibling) {
			expandMenuParent(e);
		}
		else if (href.indexOf("://") === -1) {
			onLinkClick(e, href);
		}
	}

	function expandMenuParent(e) {
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

	function onLinkClick(e, url) {
		e.preventDefault();
		e.target.setAttribute("data-spinner", "true");

		history.pushState(null, null, url);
		replaceContent(url, e.target);

		// Close all other active menu items
		var active = nav.getElementsByClassName("active");
		for (var a = 0; a < active.length; a++) {
			active[a].removeAttribute("class");
		}

		e.target.className = "active";
	}

	function replaceContent(url, target) {
		dataService.getPage(url, function (page) {

			main.style.opacity = 0;
			toggleHero(page.url);
			target && target.removeAttribute("data-spinner");

			if (burger.offsetLeft > 0 || burger.offsetTop > 0) { // If small screen
				burger.nextElementSibling.style.visibility = "";
			}

			setTimeout(function () {
				main.innerHTML = page.content;
				document.title = page.title;
				setFlipAheadLinks(page.next, page.prev);

				main.style.opacity = 1;
			}, 200);
		});
	}

	function onBurgerClick(e) {
		e.preventDefault();
		var ul = e.target.nextElementSibling;
		var visible = ul.style.visibility;
		ul.style.visibility = visible === "" ? "visible" : "";
	}

	function setFlipAheadLinks(next, prev) {
		var nextLink = document.head.querySelector("link[rel=next]");
		var prevLink = document.head.querySelector("link[rel=prev]");

		setLink(nextLink, next, "next");
		setLink(prevLink, prev, "prev");

		function setLink(link, href, rel) {
			if (href) {
				link = link || createLink(rel, href);
				link.href = href;
			}
			else if (link) {
				link.parentNode.removeChild(link);
			}
		}

		function createLink(rel, href) {
			var link = document.createElement("link");
			link.rel = rel;
			link.href = href;
			return document.head.appendChild(link);
		}
	}

	function toggleHero(href) {
		var showHero = (!href && location.pathname === "/") || href === "/";
		hero.className = showHero ? "" : "hide";
	}

	document.body.addEventListener("click", onBodyClick, false);

	window.addEventListener("popstate", function (e) {
		replaceContent(location.pathname);
	});

	if (window.requestAnimationFrame)
		window.requestAnimationFrame(openMenu)
	else
		window.addEventListener("load", openMenu, false);

})();
(function () {

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
	catch (e) { /* Not IE9+ on desktop */}

})();