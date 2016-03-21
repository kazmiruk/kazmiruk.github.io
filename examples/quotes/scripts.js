jQuery(document).ready(function() {
    getQuote();
    jQuery('button#newQuote').click(getQuote);
});

var getQuote = function() {
    jQuery.ajax({
        headers: {
            "X-Mashape-Key": "OivH71yd3tmshl9YKzFH7BTzBVRQp1RaKLajsnafgL2aPsfP9V",
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        url: 'https://andruxnet-random-famous-quotes.p.mashape.com/cat=',
        success: function(response) {
            var r = JSON.parse(response),
                tweet = r.quote + " " + r.author;

            jQuery('#quote').text('"' + r.quote + '"');
            jQuery('#author').text(r.author);
            jQuery('#tweet').attr('href', 'https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=' + encodeURIComponent(tweet));
        }
    });
}