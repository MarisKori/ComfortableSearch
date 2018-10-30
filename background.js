

const FILTER_EXAMPLE = { //not used, just an example
	'//qaru.site/questions/': {
		regexp: '^https?://qaru\\.site/questions/\\d+/([a-z0-9-]+).*$',
		newurl: 'https://stackoverflow.com/search\?q=$1',
	},
	'stackoverflow.com': {
		color: 'green',
	},
}

let FILTER = {};

function makeFilter() { //parse config string and make filter structure
	FILTER = {};
	const lines = localStorage.filter.replace("\r","").split("\n");
	lines.forEach(line=>{
		if (line == '' || line[0] == '!' || line[0] == '#') return;
		let data = line.split(';');
		if (data.length < 2) return console.log('Invalid line:',line);
		const action = data[0];
		let rec = FILTER[data[1]] || {};
		//rec.action = data[0];
		rec.search = data[1];
		if ((action == 'replace' || action=='replace_fn') && data[2] && data[3]) {
			rec.regexp = data[2];
			rec.newurl = data[3];
		}
		if (action == 'color' && data[2]) rec.color = data[2];
		if (action == 'hide') {
			rec.hide = true;
		}
		FILTER[rec.search] = rec;
	});
}

function loadFilterDefault() {
	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			localStorage.filter = xhr.responseText;
			makeFilter();
		}
	};
	xhr.open("GET", '/config.default.csv');
	xhr.send();
}

//init filter
if (localStorage.filter) makeFilter();
else loadFilterDefault();




let db_stackoverflow = {};


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type == "checkURL") {
		let response = {};
		let url = request.href;
		for(let k in FILTER) {
			if (url.indexOf(k) == -1) continue;
			let f = FILTER[k];
			console.log('found=',k);
			if (f.regexp && f.newurl) {
				let r = RegExp(f.regexp);
				//console.log('r=',r);
				let m = url.match(r);
				if (m) {
					let newurl = f.newurl;
					//if (f.action == 'replace_fn') {
						if (newurl.indexOf('$fnHex') > -1) newurl = newurl.replace('$fnHex', parseInt(m[1],16));
						//if (newurl.indexOf('$fnBin') > -1) newurl = newurl.replace('$fnHex', parseInt(m[1],16));
					//}
					response.url = url.replace(r,newurl);
					if (f.newurl.indexOf('//stackoverflow.com/search') > -1) {
						db_stackoverflow[m[1]] = true;
					}
				}
			}
			if (f.color) response.color = f.color;
			if (f.hide) response.hide = true;
		}
		sendResponse(response);
    } else if (request.type == "checkStackOverflow") {
		let response = {};
		let rec = db_stackoverflow[request.search_str];
		if (rec) {
			response.need_redirect = true;
		}
		sendResponse(response);
	}
});



