//check one item in search result
function check_item(item, a) {
	chrome.runtime.sendMessage({
		type: "checkURL",
		href: a.href,
	}, function(data) {
		if (data.url) {
			a.href = data.url;
		}
		if (data.color) {
			item.style.backgroundColor = data.color;
		}
		if (data.hide) {
			item.style.display = 'none';
		}
	});	
}

let stop_timer = false;
let timer_id;
let cnt = 0;
function parsePage() {
	cnt++;
	if (cnt>20) { clearInterval(timer_id); timer_id = setInterval(parsePage, 200); }
	else if (cnt>40) { clearInterval(timer_id); timer_id = setInterval(parsePage, 1000); }
	else if (cnt>50) { clearInterval(timer_id); }
	let q = [...document.querySelectorAll('div.g')].filter(n => n.querySelector('.rc > .r > a > h3'));
	console.log('q=',q.length);
	for(let i=0;i<q.length;i++) {
		let div = q[i];
		if (div.cs_checked_item) continue;
		let a = div.querySelector('.rc > .r > a');
		check_item(div, a);
		div.cs_checked_item = true;
	}
	if (stop_timer) clearInterval(timer_id);
}
timer_id = setInterval(parsePage, 100);

document.addEventListener('DOMContentLoaded', function () {
	stop_timer = true;
});


