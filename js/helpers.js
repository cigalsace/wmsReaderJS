//$(document).ready(function() {

// var query = window.location.search.substring(1);
function getParamsURL(url) {
    var variables = url.split('&');
    var params = {};
    for (i in variables) {
        v = variables[i].split('=');
        params[v[0]] = decodeURIComponent(v[1]);
        //console.log(v[0] + ' - '+ decodeURIComponent(v[1]));
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
    /*
    for (item in config) {
        if (item != 'url' && config[item] != '') {
            url += item + '=' + config[item] + '&';
        }
    }
    */
    //console.log(url.replace(/(\s+)?.$/, ''));
    console.log(url);
    return url;
}

//http://www.cigalsace.org/geonetwork-private/srv/fre/csw-geocatalogue?elementsetname=full&maxrecords=10&startposition=1&version=2.0.2&service=CSW&request=GetRecords&constraintlanguage=CQL_TEXT&postencoding=XML&resulttype=results&outputschema=http://www.isotc211.org/2005/gmd&typenames=gmd:MD_Metadata&constraint_language_version=1.0.0&"

/* A garder
function min_max(array, type='min') {
    m = false;
    for (a in array) {
        if (m === false) { m = array[a]; }
        if (type=='max') {
            if (array[a] > m) { m = array[a]; }
        } else {
            if (array[a] < m) { m = array[a]; }
        }
    }
    return m;
}

function compare(a,b) {
    if (a.nb < b.nb)
        return 1;
    if (a.nb > b.nb)
        return -1;
    return 0;
}
*/

//});
