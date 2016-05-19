(function () {

	try {
		if (window.external.msIsSiteMode()) {
			ext = window.external;
			ext.msSiteModeCreateJumpList("Navigation");

			var mainItems = document.querySelectorAll("#nav > ul > li > a");

			for (var i = mainItems.length - 1; i > -1; i--) {
				var link = mainItems[i];
				ext.msSiteModeAddJumpListItem(link.innerHTML, link.href, "/themes/bootstrap/favicon/favicon.ico");
			}
		}
	}
	catch (e) { /* Not IE9+ on desktop */}

})();