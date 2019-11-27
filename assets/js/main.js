$(document ).ready(function() {

    var searchButton = $("#search-button");
    
    searchButton.click(getQuery);

});

function getQuery() {
    // Salvo ciò che l'utente scrive
    var input = $("#search-bar").val();
    console.log(input);

    // Genero i Film
    $.ajax({
        url: "https://api.themoviedb.org/3/search/movie",
        method: "GET",
        data: {
            api_key: "daf0e1b68af772b020502bc8b1195126",
            query: input,
            language: "it_IT",
        },
        success: function(data) {
            console.log(data.results);
            
            // Salvo il numero di risultati
            var listMovies = data.results;
            generateMOV(listMovies);
            
            if (listMovies.length > 0){
                inputReset()
            }
        },
        error: function (error){
            console.log("Error" + error); 
        }, 
    });

    // Genero le Serie TV
    $.ajax({
        url: "https://api.themoviedb.org/3/search/tv",
        method: "GET",
        data: {
            api_key: "daf0e1b68af772b020502bc8b1195126",
            query: input,
            language: "it_IT"
        },
        success: function(data) {
            console.log(data.results);
            
            // Salvo il numero di risultati
            var listTvSeries = data.results;
            generateTV(listTvSeries);

            if (listTvSeries.length > 0){
                inputReset()
            }
        },
        error: function (error){
            console.log("Error" + error); 
        }, 
    });
}; // Fine funzione Click BTN // Fine DocReady

// Funzione Reset Input
function inputReset() {
    $("#search-bar").val("");
};

// Funzione per stampa lista film
function generateMOV(listMovies) {

    // Seleziono la source di Handlebars e la compilo
    var source = $("#movieDetails").html();
    var template = Handlebars.compile(source);
    var context, html;

    // URL base locandine Film
    var posterBaseURL = "http://image.tmdb.org/t/p/w342/";
    
    // Selezione il div dove appendere handlebars
    var target = $("#movieList").html("");
    // target.html("");


    // Ciclo i risultati e li mostro
    for (var i = 0; i < listMovies.length; i++) {
        // Ci tiriamo l'i esimo movie 
        var movie = listMovies[i];

        // Arrotondo il voto
        var voteRounded = Math.ceil(movie.vote_average / 2);

        // Associo i miei campi a quelli dell'API
        var context = {
            urlImg: function () {
                if(movie.poster_path){
                    return posterBaseURL + movie.poster_path
                } else return "assets/img/coming_soon_poster.jpg"
            },
            title: movie.title,
            originalTitle: movie.original_title,
            language: movie.original_language,
            vote: genStar(voteRounded),
            dataRilascio: movie.release_date,
        }

        var html = template(context);
        // Inserisco i risultati nel mio HTML
        target.append(html);
    }
}; // Fine print(movies)

// Funzione per stampa lista Serie Tv
function generateTV(listTvSeries) {

    // Seleziono la source di Handlebars e la compilo
    var source = $("#TvSeriesDetails").html();
    var template = Handlebars.compile(source);
    var context, html;

    // URL base locandine Serie TV
    var posterBaseURL = "http://image.tmdb.org/t/p/w342/";

    // Selezione il div dove appendere handlebars
    var target = $("#tvSeriesList").html("");
    // target.html("");

    // Ciclo i risultati e li mostro
    for (var i = 0; i < listTvSeries.length; i++) {
        // Ci tiriamo l'i esimo movie 
        var tvSeries = listTvSeries[i];

        // Arrotondo il voto
        var voteRounded = Math.ceil(tvSeries.vote_average / 2);

        // Associo i miei campi a quelli dell'API
        var context = {
            urlImg: function () {
                if(tvSeries.poster_path){
                    return posterBaseURL + tvSeries.poster_path
                } else return "assets/img/coming_soon_poster.jpg"
            },
            title: tvSeries.name,
            originalName: tvSeries.original_name,
            language: tvSeries.original_language,
            vote: genStar(voteRounded),
            dataRilascio: tvSeries.first_air_date,
        }

        var html = template(context);
        // Inserisco i risultati nel mio HTML
        target.append(html);
    }
}; // Fine print(movies)


// Funzione per mettere le stelle
function genStar(voteRounded) {

    // Genero html delle stelle vuoto
    var htmlStars = "";
    // Creo un ciclo per stampare le stelle
    for(var j = 1; j <= 5; j++) {
        if(j <= voteRounded) { // Se il contatore è minore del numero di stelle che devono essere piene allora ->
        // Genero una stella piena
        htmlStars += "<i class='fas fa-star'></i>";
        } else {
        // Altrimenti genero una stella vuota
        htmlStars += "<i class='far fa-star'></i>";
        }
    }
    return htmlStars + " " + voteRounded + "/5";
}
