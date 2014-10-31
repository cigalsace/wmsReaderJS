function getParamsURL(url) {
    var variables = url.split('&');
    var params = {};
    for (i in variables) {
        v = variables[i].split('=');
        params[v[0]] = decodeURIComponent(v[1]);
    }
    return params;
}

function urlConstruct(csw_url, config) {
	if (csw_url.indexOf('?') != -1) {
		if (csw_url.charAt(csw_url.length-1) == '?') {
			var url = csw_url;
		} else {
			//var url = csw_url+'&';
			return url;
		}
	} else {
		var url = csw_url+'?';
	}
    url += 'service=' + config['service'] + '&';
    url += 'version=' + config['version'] + '&';
    url += 'request=' + config['request'] + '&';
    console.log(url);
    return url;
}

