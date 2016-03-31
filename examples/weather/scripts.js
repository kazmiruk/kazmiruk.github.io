jQuery.load(function() {
    var storage = {};
    var q = undefined;

    var _setIcon = function(weather) {
        var weatherL = weather.toLowerCase();

        if (!(weatherL in ['drizzle', 'clouds', 'rain', 'snow', 'thunderstom', 'clear'])) {
            weatherL = "clouds";
        }

        jQuery('#content > img').attr('src', "img/" + weatherL + ".svg")
            .attr('title', weather);
    };

    var _drawWeather = function(data) {
        storage = data;
        storage.main.ftemp = Math.round((storage.main.temp * 9)/5 + 32);

        _setIcon(storage.weather[0].main);

        jQuery('#content > h3').text(storage.name + ", " + storage.sys.country);
        jQuery('#temp > span').html(storage.main.temp);
        jQuery('#ftemp > span').html(storage.main.ftemp);

        jQuery('#content').show();
        jQuery('#preloader').hide();
    };

    var _getWeater = function(q, callback) {
        jQuery.ajax({
            url: "http://api.openweathermap.org/data/2.5/weather?q=" + q + "&units=metric&APPID=061f24cf3cde2f60644a8240302983f2"
        }).done(callback);
    };

    var updateWeather = function() {
        if (q === undefined) {
            jQuery.ajax({
                url: "http://ip-api.com/json"
            }).done(function (data) {
                q = data.country + "," + data.city;
                _getWeater(q, _drawWeather);
            });
        } else {
            _getWeater(q, _drawWeather);
        }
    };

    jQuery('#temp, #ftemp > a').click(function() {
        jQuery('#temp').toggle();
        jQuery('#ftemp').toggle();
    });

    updateWeather();
    setInterval(function() {
        q = undefined;
    }, 60 * 60 * 1000);
    setInterval(updateWeather, 60000);
});
