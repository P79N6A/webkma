const method = {
    get: "GET",
    post: "POST",
    put: "PUT"
};

let request = function (method, params, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            // console.log(xhr);
            if (xhr.status >= 200 && xhr.status < 400) {
                callback(JSON.parse(xhr.responseText));
            }
            else {
                callback(new Error("Response Error"));
            }
        }
    };

    xhr.open(method, params.url, true);

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    // Set Custom Headers
    xhr.setRequestHeader("session_id", "50ff2f01-28c0-48c6-81cd-efaae11c2d48");

    // note: In Internet Explorer, the timeout property may be set only after calling the open()
    // method and before calling the send() method.
    // xhr.timeout = 5000;// 5 seconds for timeout

    let data = params.data;
    if (typeof (data) == "object") data = JSON.stringify(data);
    xhr.send(data);
}

module.exports = {
    get: (options, callback) => { request(method.get, options, callback) },
    post: (options, callback) => { request(method.post, options, callback) },
    put: (options, callback) => { request(method.put, options, callback) }
}