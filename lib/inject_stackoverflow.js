
function checkPage() {
	let m = location.href.match(/^https:\/\/stackoverflow\.com\/search\?q=([a-zA-Z0-9-]+)/);
	if (!m) return;
	const search_str = m[1];
	chrome.runtime.sendMessage({
		type: "checkStackOverflow",
		search_str: search_str,
	}, function(data) {
		if (data.need_redirect) {
			let a = document.querySelector('div.search-result > div.summary > div.result-link > h3 > a.question-hyperlink');
			if (!a) return console.log("[ComfortSearh] Can't find search result!");
			location.href = a.href;
		}
	});	
}
checkPage();



