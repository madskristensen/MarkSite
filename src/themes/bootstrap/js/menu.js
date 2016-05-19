/// <reference path="dataService.js" />

(function () {

	var main = document.getElementById("main");

	function onBodyClick(e) {

		var href = e.target.getAttribute("href");

		if (e.target.tagName !== "A" || href.indexOf("#") === 0)
			return;

		if (location.pathname === href) {
			e.preventDefault();
			return;
		}

		if (href.indexOf("://") === -1) {
			onLocalLinkClick(e, href);
		}
	}

	function onLocalLinkClick(e, url) {
		e.preventDefault();

		history.pushState("pushed", null, url);
		replaceContent(url, e.target);
	}

	// todo:  need a progress indicator
	function replaceContent(url, target) {
		dataService.getPage(url, function (page) {
			$('#main').hide();

			setTimeout(function () {
				main.innerHTML = page.content;
				document.title = page.title;
				setFlipAheadLinks(page.next, page.prev);

				$('#main').fadeIn(200);
			}, 1);
		});
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

	document.body.addEventListener("click", onBodyClick, false);

	window.addEventListener("popstate", function (e) {
		if (e.state === "pushed")
			replaceContent(location.pathname);
	});

})();