var global = window;

var forEach = function(o, fn) {
    Object.keys(o).forEach(function(key) {
        fn(o[key], key);
    })
}

var stringifyQuery = function(o) {
    var arr = [];
    forEach(o, function(value, key) {
        if (value != null) {
            if (typeof value === 'object') {
                value = JSON.stringify(value);
            }
            arr.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
        }
    });
    return arr.join('&');
};


module.exports = function(opt, data, callback) {
    // console.log(arguments)
    if (typeof opt === 'string') {
        opt = {
            url: opt
        }
    }

    if (arguments.length === 2) {
        callback = data;
        data = opt.data;
    }

    var url = opt.url;
    var method = opt.method || 'get';
    var headers = opt.headers || {};

    xhr = global.ActiveXObject ? new global.ActiveXObject("Microsoft.XMLHTTP") : new global.XMLHttpRequest();        
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            // Support local file
            if (xhr.status > 399 && xhr.status < 600) {
                callback("Could not load: " + url + ", status = " + xhr.status);
            } else {
                callback(null, JSON.parse(xhr.responseText));
            }
        }
    };

    var serializedData = data ? typeof data === 'string' ? data : stringifyQuery(data) : null;
    
    var currentUrl = url;
    if (method.toUpperCase() === 'GET') {
        currentUrl += (currentUrl.indexOf('?') === -1 ? '?' : '&') + '_=' + Math.random();
        if (serializedData) {
            currentUrl += '&' + serializedData;
        }
        serializedData = null;
    } else { // post put
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    xhr.open(method, currentUrl, true);

    forEach(headers, function(value, key) {
        xhr.setRequestHeader(key, value);
    });

    xhr.send(serializedData);

    return xhr;
};