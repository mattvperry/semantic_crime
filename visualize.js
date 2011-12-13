// Load google visualization packages
google.load('visualization', '1', {'packages': ['geomap']});

// Set google callback
google.setOnLoadCallback(function() {
    var sparql_proxy = 'http://logd.tw.rpi.edu/sparql?';
    var query_location = window.location.href + 'query.rq';
    var params = $.param({'output': 'gvds', 'query-uri': query_location});
    var query_url = sparql_proxy + params;
    var query = new google.visualization.Query(query_url);
    query.send(function(response) {
        alert(response);
    });
});
