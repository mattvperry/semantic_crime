// Team Chalupa
// Web Science Fall 2011
// Matt Perry and Josh Steiner
// Semantic Government data visualized

// Enumerate crime data fields
var crime_fields = [
    { label: 'Violent Crimes', col: 'violent_crime' },
    { label: 'Murders and Non-Negligent Manslaughters', col: 'murder_manslaughter' },
    { label: 'Forcible Rapes', col: 'rape' },
    { label: 'Robberies', col: 'robbery' },
    { label: 'Aggravated Assaults', col: 'assault' },
    { label: 'Property Crimes', col: 'property_crime' },
    { label: 'Burglaries', col: 'burglary' },
    { label: 'Larceny Thefts', col: 'larceny' },
    { label: 'Motor Vehicle Thefts', col: 'motor_vehicle' },
    { label: 'Arson', col: 'arson' }
];

// Load google visualization packages
google.load('visualization', '1', {'packages': ['geomap', 'corechart']});

// Set Google callback
google.setOnLoadCallback(function() {
    // Extend Jquery with Google viz
    $.fn.google_viz = function(type, cols, rows, options) {
        // Create google data table
        var data = new google.visualization.DataTable();
        $.each(cols, function(i, e) { data.addColumn(e[0], e[1]) });
        data.addRows(rows);
        // Display viz
        new google.visualization[type](this[0]).draw(data, options);
    };

    // Query logd for data
    /*
    var sparql_proxy = 'http://logd.tw.rpi.edu/sparql';
    var params = {
        'output': 'json',
        'query-uri': 'http://perrym5.github.com/semantic_crime/query.rq' //window.location.href + 'query.rq';
    };
    $.getJSON(sparql_proxy, params, function(data) {
        draw_chart(data, crime_fields);
        draw_map(data, {label: 'Violent Crimes', col: 'violent_crime'});
    });
    */

    // Use global data (saves development time)
    draw_chart(data, crime_fields);
    draw_map(data, crime_fields[0]);

    function draw_chart(data, fields, opts) {
        // Chart options
        var options = $.extend({
            'title': 'Average Gross Income versus Number of Crimes',
            'hAxis': {
                'title': 'Average Gross Income',
                'logScale': true
            },
            'vAxis': {
                'title': 'Number of Crimes',
                'logScale': true
            },
            'strictFirstColumnType': true,
            'width': 900,
            'height': 550
        }, opts);

        // Create data table
        var cols = [['number', 'Average Gross Income']];
        $.each(fields, function(i, f) { cols.push(['number', f.label]) });

        var rows = $.map(data.results.bindings, function(e) {
            row = [parseInt(e.agi.value)];
            $.each(fields, function(i, f) { row.push(parseInt(e[f.col].value)) });
            return [row];
        });

        // Display chart
        var viz = $('#chart_canvas').google_viz('LineChart', cols, rows, options);
    };

    function draw_map(data, field, opts) {
        // Map options
        var options = $.extend({
            'region': 'US',
            'dataMode': 'regions',
            'width': 900,
            'height': 550
        }, opts);

        // Create data table
        var cols = [['string', 'State'], ['number', field.label]]
        var rows = $.map(data.results.bindings, function(e) {
            return [['US-' + e.state_abbrv.value, parseInt(e[field.col].value)]];
        });

        // Display map
        var viz = $('#map_canvas').google_viz('GeoMap', cols, rows, options);
    };
});
