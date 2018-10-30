let background = chrome.extension.getBackgroundPage();

function init_checkbox(name) {
	let e = document.getElementById(name);
	e.checked = background.localStorage[name]==1;
	e.addEventListener("change", (e) => {
		background.localStorage[name] = e.target.checked?1:0;
	});
}


document.addEventListener('DOMContentLoaded', function () {
	const manifest = chrome.runtime.getManifest();
	document.getElementById('current_version').innerHTML = '<b>Версия: v'+manifest.version+'</b>';

	let filter = document.getElementById('filter');
	filter.value = background.localStorage.filter;
	
	let button_apply = document.getElementById('button_apply');
	button_apply.addEventListener('click',()=>{
		background.localStorage.filter = filter.value;
		background.makeFilter();
	});
	
});

