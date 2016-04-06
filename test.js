var dotest = require ('dotest');
var app = require ('./');

// Setup
// $ NODE_APP_IFACE=eth0 npm test
var vnstat = app ();


dotest.add ('getConfig', function (test) {
  vnstat.getConfig (function (err, data) {
    test (err)
      .isObject ('fail', 'data', data)
      .isNotEmpty ('fail', 'data.DatabaseDir', data && data.DatabaseDir)
      .isNotEmpty ('fail', 'data.Interface', data && data.Interface)
      .done ();
  })
});

dotest.add ('getStats iface', function (test) {
  vnstat.getStats (process.env.NODE_APP_IFACE || 'eth0', function (err, data) {
    var days = data && data.traffic && data.traffic.days;
    var rx = days && days [0] && days [0] .rx;

    test (err)
      .isObject ('fail', 'data', data)
      .isString ('fail', 'data.id', data && data.id)
      .isObject ('fail', 'data.traffic', data && data.traffic)
      .isArray ('fail', 'data.traffic.days', days)
      .isObject ('fail', 'data.traffic.days[0]', days && days [0])
      .isNumber ('fail', 'data.traffic.days[0].rx', rx)
      .done ();
  });
});

dotest.add ('getStats all', function (test) {
  vnstat.getStats (function (err, data) {
    test (err)
      .isArray ('fail', 'data', data)
      .done ();
  });
});

dotest.add ('getStats error', function (test) {
  vnstat.getStats ('unreal-iface', function (err) {
    test ()
      .isError ('fail', 'err', err)
      .isExactly ('fail', 'err.message', 'invalid interface')
      .done ();
  });
});


// Start the tests
dotest.run ();
