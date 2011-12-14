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

    // Extend Jquery for easy initializations
    $.fn.init_viz = function(data, selected, sel_callback, change_callback, opts) {
        // Populate line chart dropdown
        select = $(this);
        $.each(crime_fields, function(i, e) {
            option = $('<option></option>').html(e.label).attr('value', e.col);
            if(sel_callback(e, selected))
                option.attr('selected', 'selected');
            select.append(option);
        });

        // Wire change event
        select.change(function() {
            change_callback(data, $(this).find(':selected'), opts);
        });

        select.trigger('change');
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
        draw_map(data, crime_fields[0]);
    });
    */

    // Use global data (saves development time)
    $('#chart_select').init_viz(data, crime_fields,
        function(e, sel) { return $.inArray(e, sel) != -1; },
        function(data, selected, opts) {
            draw_chart(data, selected.map(function(i, e) {
                return { label: $(e).text(), col: $(e).val() }
            }), opts);
        }
    );

    $('#map_select').init_viz(data, crime_fields[0],
        function(e, sel) { return e == sel; },
        function(data, selected, opts) {
            sel = $(selected[0]);
            draw_map(data, { label: sel.text(), col: sel.val() }, opts);
        }
    );

    function draw_chart(data, fields, opts) {
        // Chart options
        var options = $.extend({
            'title': 'Adjusted Gross Income per Capita versus Number of Crimes',
            'hAxis': {
                'title': 'Adjusted Gross Income per Capita',
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
        var cols = [['number', 'Adjusted Gross Income per Capita']];
        $.each(fields, function(i, f) { cols.push(['number', f.label]) });

        var rows = $.map(data.results.bindings, function(e) {
            row = [parseInt(e.agi.value) / parseInt(e.population.value)];
            $.each(fields, function(i, f) { row.push(parseInt(e[f.col].value)) });
            return [row];
        });

        // Sort rows appropriately
        rows.sort(function(a, b) {
            return ((a[0] < b[0]) ? -1 : ((a[0] > b[0]) ? 1 : 0));
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
