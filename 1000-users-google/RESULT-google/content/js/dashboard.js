/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 91.47605726509791, "KoPercent": 8.52394273490209};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7456392957051177, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8461538461538461, 500, 1500, "HTTP Request-3"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request-16"], "isController": false}, {"data": [0.834319526627219, 500, 1500, "HTTP Request-2"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "HTTP Request-15"], "isController": false}, {"data": [0.8806706114398422, 500, 1500, "HTTP Request-5"], "isController": false}, {"data": [0.8905325443786982, 500, 1500, "HTTP Request-14"], "isController": false}, {"data": [0.9861932938856016, 500, 1500, "HTTP Request-4"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request-13"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request-19"], "isController": false}, {"data": [0.44871794871794873, 500, 1500, "HTTP Request-1"], "isController": false}, {"data": [0.8925049309664694, 500, 1500, "HTTP Request-18"], "isController": false}, {"data": [0.006903353057199211, 500, 1500, "HTTP Request-0"], "isController": false}, {"data": [0.8944773175542406, 500, 1500, "HTTP Request-17"], "isController": false}, {"data": [0.8865877712031558, 500, 1500, "HTTP Request-12"], "isController": false}, {"data": [0.883629191321499, 500, 1500, "HTTP Request-11"], "isController": false}, {"data": [0.9980276134122288, 500, 1500, "HTTP Request-10"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request-21"], "isController": false}, {"data": [0.8806706114398422, 500, 1500, "HTTP Request-20"], "isController": false}, {"data": [0.995069033530572, 500, 1500, "HTTP Request-7"], "isController": false}, {"data": [0.001, 500, 1500, "HTTP Request"], "isController": false}, {"data": [0.8796844181459567, 500, 1500, "HTTP Request-6"], "isController": false}, {"data": [0.9053254437869822, 500, 1500, "HTTP Request-9"], "isController": false}, {"data": [0.878698224852071, 500, 1500, "HTTP Request-8"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 12154, 1036, 8.52394273490209, 1634.8472107948, 49, 24518, 394.0, 5868.5, 12105.25, 15836.350000000002, 390.00128353228087, 4095.0660592951804, 225.2856736739507], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["HTTP Request-3", 507, 0, 0.0, 456.8027613412229, 105, 3846, 435.0, 557.2, 583.1999999999999, 1104.760000000002, 34.590980418912466, 84.4246509773487, 6.620929845807464], "isController": false}, {"data": ["HTTP Request-16", 507, 0, 0.0, 59.587771203155846, 49, 209, 53.0, 73.0, 108.59999999999997, 157.4400000000001, 39.14151161892998, 38.91216682428781, 13.034429162163207], "isController": false}, {"data": ["HTTP Request-2", 507, 0, 0.0, 493.82248520710016, 263, 3786, 442.0, 585.8, 816.5999999999977, 2808.3200000000134, 33.25462416371507, 77.65362892316017, 13.15246365850059], "isController": false}, {"data": ["HTTP Request-15", 507, 0, 0.0, 417.5996055226827, 261, 615, 419.0, 542.0, 559.0, 594.84, 37.83582089552239, 92.34433302238806, 7.242012593283582], "isController": false}, {"data": ["HTTP Request-5", 507, 0, 0.0, 433.4043392504931, 265, 1803, 429.0, 543.4, 562.0, 823.7600000000009, 37.68115942028986, 87.99397877183203, 14.90319293478261], "isController": false}, {"data": ["HTTP Request-14", 507, 0, 0.0, 417.49506903353097, 257, 627, 421.0, 535.2, 553.0, 590.9200000000001, 38.134637081609625, 89.05096782154945, 15.082546892628807], "isController": false}, {"data": ["HTTP Request-4", 507, 0, 0.0, 104.13017751479296, 49, 3372, 57.0, 114.19999999999999, 233.0, 835.6800000000009, 36.17294520547945, 35.9609943546661, 12.045873354559076], "isController": false}, {"data": ["HTTP Request-13", 507, 0, 0.0, 60.9723865877712, 49, 166, 53.0, 84.0, 108.59999999999997, 129.92000000000002, 39.360298113500505, 39.12967136674171, 13.10728677412468], "isController": false}, {"data": ["HTTP Request-19", 507, 0, 0.0, 58.37278106508875, 49, 174, 52.0, 77.0, 101.99999999999983, 138.0, 38.722981745971126, 38.49608927480333, 12.895055444703276], "isController": false}, {"data": ["HTTP Request-1", 507, 0, 0.0, 1949.901380670611, 165, 15394, 1273.0, 3908.0, 4611.999999999998, 14641.920000000126, 30.46508833072948, 30.28658195379161, 10.145112422635501], "isController": false}, {"data": ["HTTP Request-18", 507, 0, 0.0, 419.0138067061146, 138, 620, 421.0, 538.2, 550.5999999999999, 580.0, 37.65037873162038, 91.89151439272985, 7.206517804099213], "isController": false}, {"data": ["HTTP Request-0", 507, 0, 0.0, 6163.384615384621, 795, 15879, 5738.0, 8838.8, 15551.399999999998, 15822.04, 26.832495369145278, 65.48979558084149, 5.135907316750464], "isController": false}, {"data": ["HTTP Request-17", 507, 0, 0.0, 423.29585798816555, 100, 627, 423.0, 537.0, 554.0, 569.6000000000001, 38.15185491760102, 89.09212976898186, 15.08935668127775], "isController": false}, {"data": ["HTTP Request-12", 507, 0, 0.0, 423.3688362919135, 227, 5020, 410.0, 537.0, 552.0, 577.76, 38.18346136466335, 93.19140742675854, 7.308553151830095], "isController": false}, {"data": ["HTTP Request-11", 507, 0, 0.0, 419.3589743589745, 261, 617, 421.0, 537.0, 555.0, 586.76, 38.25260298777727, 89.32931214161763, 15.129203330126755], "isController": false}, {"data": ["HTTP Request-10", 507, 0, 0.0, 64.11439842209067, 49, 1158, 55.0, 76.0, 97.19999999999993, 134.76000000000005, 39.114334207684, 38.88514865568585, 13.02537887189477], "isController": false}, {"data": ["HTTP Request-21", 507, 507, 100.0, 419.3175542406315, 262, 623, 422.0, 541.2, 553.0, 588.2000000000002, 37.98891053499176, 88.70986625206054, 15.024910904952796], "isController": false}, {"data": ["HTTP Request-20", 507, 0, 0.0, 419.3175542406315, 262, 623, 422.0, 541.2, 553.0, 588.2000000000002, 37.98891053499176, 88.70986625206054, 15.024910904952796], "isController": false}, {"data": ["HTTP Request-7", 507, 0, 0.0, 72.57790927021696, 49, 1453, 55.0, 97.0, 110.59999999999997, 729.6400000000086, 38.97002305918524, 38.74168308032283, 12.977322132013835], "isController": false}, {"data": ["HTTP Request", 1000, 529, 52.9, 12498.929000000006, 1025, 24518, 12681.0, 16161.3, 19071.649999999994, 21799.66, 32.089336713410134, 3400.091949738071, 114.0929159279434], "isController": false}, {"data": ["HTTP Request-6", 507, 0, 0.0, 419.19921104536513, 182, 628, 417.0, 539.0, 557.0, 582.9200000000001, 38.037362142696374, 92.8367393230925, 7.280588847625478], "isController": false}, {"data": ["HTTP Request-9", 507, 0, 0.0, 413.1400394477314, 262, 623, 408.0, 526.2, 554.0, 584.44, 38.20648078372268, 93.2466324415976, 7.31295921250942], "isController": false}, {"data": ["HTTP Request-8", 507, 0, 0.0, 430.29191321499036, 261, 1891, 424.0, 537.0, 556.5999999999999, 642.7200000000007, 38.05734874643447, 88.87129255179403, 15.051978752251914], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.google.com.ua:443 failed to respond", 5, 0.4826254826254826, 0.041138719763040975], "isController": false}, {"data": ["Non HTTP response code: java.io.IOException/Non HTTP response message: Exceeded maximum number of redirects: 20", 1014, 97.87644787644787, 8.342932367944709], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 17, 1.640926640926641, 0.1398716471943393], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 12154, 1036, "Non HTTP response code: java.io.IOException/Non HTTP response message: Exceeded maximum number of redirects: 20", 1014, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 17, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.google.com.ua:443 failed to respond", 5, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["HTTP Request-21", 507, 507, "Non HTTP response code: java.io.IOException/Non HTTP response message: Exceeded maximum number of redirects: 20", 507, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["HTTP Request", 1000, 529, "Non HTTP response code: java.io.IOException/Non HTTP response message: Exceeded maximum number of redirects: 20", 507, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 17, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.google.com.ua:443 failed to respond", 5, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
