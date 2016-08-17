/**
 * Created by vadis on 01.08.16.
 */
$(document).ready(function () {
    var posts = Data.getPosts();

    /* Start Handlebars */
    var postsListRaw = $('#posts-json-template').html();
    var postsListTemplate = Handlebars.compile(postsListRaw);

    var postsTableRaw = $('#posts-table-template').html();
    var postsTableTemplate = Handlebars.compile(postsTableRaw);

    /* Handlebars' helpers */
    Handlebars.registerHelper('json', function (array) {
        return JSON.stringify(array, null, '\t');
    });

    Handlebars.registerHelper('table', function (array, values) {
        var string = '<ul>';

        var length = array.length;
        for (var i = 0; i < length; i++) {
            var cssClass = (i%2)? 'odd' : 'even';
            if (i == length - 1) {
                cssClass += ' last';
            }

            string = string + '<li class = "' + cssClass + '" >' + '<p>' + values.fn(array[i]) + '</p>' + '</li>';
        }

        return string + '</ul>';
    });

    /* Handlebars' output */
    var postsResult = postsListTemplate({posts: posts});
    $('.posts-json').html('<pre>' + postsResult + '</pre>');

    var postsForRender = (postsTableTemplate({posts: posts}));
    $('.posts-table').html(postsForRender);
});