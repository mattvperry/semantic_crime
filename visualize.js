// Team Chalupa
// Web Science Fall 2011
// Matt Perry and Josh Steiner
// Semantic Government data visualized

// Load google visualization packages
google.load('visualization', '1', {'packages': ['geomap']});

// Set Google callback
google.setOnLoadCallback(function() {
    var sparql_proxy = 'http://logd.tw.rpi.edu/sparql';
    var params = {
        'output': 'json',
        'query-uri': 'http://perrym5.github.com/semantic_crime/query.rq' //window.location.href + 'query.rq';
    };
    $.getJSON(sparql_proxy, params, function(data) {
        draw_map(data, 'violent_crime');
    });

    function draw_map(data, column, opts) {
        // Map options
        var options = $.extend({
            'region': 'US',
            'dataMode': 'regions',
            'width': 900,
            'height': 550
        }, opts);

        // Create google data table
        var google_data = new google.visualization.DataTable();
        google_data.addColumn('string', 'State');
        google_data.addColumn('number', column);

        // Populate google data table
        $.each(data.results.bindings, function(i, e) {
            var state = 'US-' + e.state_abbrv.value;
            var value = parseInt(e[column].value);
            google_data.addRow([state, value]);
        });

        // Display map
        var viz = $('#map_canvas');
        new google.visualization.GeoMap(viz[0]).draw(google_data, options);
    };
});
