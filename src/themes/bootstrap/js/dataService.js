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