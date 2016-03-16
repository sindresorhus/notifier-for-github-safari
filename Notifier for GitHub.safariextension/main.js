(function () {
	'use strict';

	var currentBadge = '';

	function render(badgeText, title) {
		currentBadge = badgeText;

		safari.extension.toolbarItems.forEach(function (el) {
			el.badge = badgeText;
			el.toolTip = title;
			el.disabled = badgeText === false;
		});
	}

	function update() {
		gitHubNotifCount(function (count) {
			if (count !== false) {
				render(count, 'Notifier for GitHub');
			} else {
				render(false, 'You have to be connected to the internet and logged into GitHub');
			}
		});
	}

	var UPDATE_INTERVAL = 1000 * 30;

	safari.application.addEventListener('command', function (e) {
		if (e.command === 'open-notifications') {
			var win = safari.application.activeBrowserWindow;
			var url = 'https://github.com/notifications';

            var newTab = safari.application.activeBrowserWindow.openTab();
            newTab.url = url;
            newTab.activate();
		}
	});

	// update the status on new windows
	safari.application.addEventListener('open', function () {
		// timeout to prevent the badge to be rendered in the center
		// seems like it has some kind of a race-issue
		setTimeout(function () {
			render(currentBadge, 'Notifier for GitHub'); // show the cached result while loading
		}, 0);

		update();
	}, true);

	setInterval(update, UPDATE_INTERVAL);

	update();
})();
