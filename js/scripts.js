var apiKey = '?api_key=fec8b5ab27b292a68294261bb21b04a5';
var npUrl = 'movie/now_playing';
var popUrl = 'movie/popular';
var trUrl = 'movie/top_rated';
var upUrl = 'movie/upcoming';
var genreList = 'genre/movie/list';
var genreObject;
var npObject;
var popObject;
var trObject;
var upObject;
var videoObject;
// Base URL for all calls
var apiBaseUrl = 'http://api.themoviedb.org/3/';
// Base URL for images
// after the / comes the width e.g. imageBaseUrl + 'w300' + poster_path
var imageBaseUrl = 'http://image.tmdb.org/t/p/';
// query string including API Key


$.getJSON(apiBaseUrl + npUrl + apiKey, function(npData){
    npObject = npData;
});

$.getJSON(apiBaseUrl + popUrl + apiKey, function(popData){  
    popObject = popData;
});

$.getJSON(apiBaseUrl + trUrl + apiKey, function(trData){  
    trObject = trData;
});

$.getJSON(apiBaseUrl + upUrl + apiKey, function(upData){  
    upObject = upData;
});

$.getJSON(apiBaseUrl + upUrl + apiKey, function(upData){  
    upObject = upData;
});


$(document).ready(function(){

    $.getJSON(apiBaseUrl + genreList + apiKey, function(genreData){  
        genreObject = genreData;
        var dd1HTML = '<option></option>';
        for (var i = 0; i < genreData.genres.length; i++) {
            dd1HTML += '<option value="' + genreData.genres[i].id + '">' + genreData.genres[i].name + '</option>';
        }
        $('#listGenre').html(dd1HTML);
        $('#listGenre').change(function(){
            createIdGrid(this.value);
        });
    });

    $('#sortOptions').change(function(){
        if(this.value == 'np'){
            var data = npObject;
        }else if(this.value == 'late'){
            var data = lateObject;
        }else if(this.value == 'pop'){
            var data = popObject;
        }else if(this.value == 'tr'){
            var data = trObject;
        }else if(this.value == 'up'){
            var data = upObject;
        }
        populateGrid(data);
    });

    function genreID(idArr){
        var genreHTML = '';
        for (var j = 0; j < 2; j++) {   
            for (var i = 0; i < genreObject.genres.length; i++) {
                if(idArr[j] == genreObject.genres[i].id){
                    genreHTML += ('<div>' + genreObject.genres[i].name + '</div>');
                }
            }
        }
        return genreHTML;
    }

    function populateGrid(data){
        var newHTML = '';
            for (var i = 0; i < data.results.length; i++) {
                var idNum = '';
                for (var j = 0; j < data.results[i].genre_ids.length; j++) {
                        idNum += ' ' + data.results[i].genre_ids[j];
                    }
                newHTML += '<div class="col' + (idNum + '">');
                    newHTML +=  data.results[i].title;
                    var BDUrl = imageBaseUrl + 'w300' + data.results[i].backdrop_path;
                    var posterUrl = imageBaseUrl + 'w300' + data.results[i].poster_path;
                    newHTML += '<a href="#modal" class="thumbnail" id="' + data.results[i].id + '" title="' + data.results[i].title + '" bd="' + BDUrl + '"><img src="' + posterUrl + '"></a>';
                    var genreIdNum = data.results[i].genre_ids;
                    newHTML += genreID(genreIdNum); 
                newHTML += '</div>';
            }

            $('.poster-grid').html(newHTML);
            $('.thumbnail').click(function(event){
                createRemodal(this.id, this.title, this.attributes[4].value);
            });
    }

    function createIdGrid(ID){
        $.getJSON(apiBaseUrl + 'genre/' + ID + '/movies' + apiKey, function(genreIdData){
            populateGrid(genreIdData);
        });
    }

    function createRemodal(ID, title, backDrop){

        $.getJSON(apiBaseUrl + 'movie/' + ID + '/videos' + apiKey, function(videoIdData){
             populateVidModal(videoIdData.results, title, backDrop);
        });

        $.getJSON(apiBaseUrl + 'movie/' + ID + '/similar' + apiKey, function(similarData){
            $('#similar').click(function(event){
                populateGrid(similarData);
            });
        });

        $.getJSON(apiBaseUrl + 'movie/' + ID + '/reviews' + apiKey, function(reviewsData){
            $('#reviews').click(function(event){
                populateReviews(reviewsData);
            })
        });

        $.getJSON(apiBaseUrl + 'movie/' + ID + '/images' + apiKey, function(imagesData){
            $('#images').click(function(event){
                populateImgBtns(imagesData);
            })
        });

        $.getJSON(apiBaseUrl + 'movie/' + ID + apiKey, function(imdbData){
            $('#IMDB').click(function(event){
                location.href = "http://www.imdb.com/title/" + imdbData.imdb_id + "/?ref_=nv_sr_1";
            })
        });
    }

    function populateImgBtns(data){
        var newHTML = '';
        var vidID = data.id;
        if (data.backdrops && data.posters) {
            newHTML += '<button id="backdrops" class="moreImages">See More BackDrops?</button><button id="posters" class="moreImages">See More Posters?</button>';
        }else if(data.backdrops && !data.posters){
            newHTML += '<button id="backdrops" class="moreImages">See More BackDrops?</button>';
        }else if(!data.backdrops && data.posters){
            newHTML += '<button id="posters" class="moreImages">See More Posters?</button>';
        }else{
            return alert('There are no more images at this time!');
        }
        $('.poster-grid').html(newHTML);
        $('.moreImages').click(function(){
            populateImages(data, this.id);
        });
    }

    function populateImages(data, imageArr){
        var newHTML = '';
        for(prop in data){
            if(prop == imageArr){
                var arr = data[prop];
            }
        }
        if(imageArr == "posters"){
            newHTML += '<button id="backdrops" class="toggleImages">See BackDrops?</button>';
        }else if(imageArr == "backdrops"){
            newHTML += '<button id="posters" class="toggleImages">See Posters?</button>';
        }
        for (var i = 0; i < arr.length; i++) {
                newHTML += '<div class="col">';
                    var imageUrl = imageBaseUrl + 'w300' + arr[i].file_path;
                    newHTML += '<a href="#modal" class="thumbnail"><img src="' + imageUrl + '"></a>';
                newHTML += '</div>';
        }
        $('.poster-grid').html(newHTML);
        $('.thumbnail').click(function(){
            ('.vid-title').html('<img src="' + imageUrl + '"></a>');
        });
        $('.toggleImages').click(function(){
            populateImages(data, this.id);
        });
    }

    function populateReviews(data){
        var newHTML = '';
        var vidID = data.id;
        if(data.results.length > 0){
            for (var i = 0; i < data.results.length; i++) {
                newHTML += '<div class="col ' + vidID + '">';
                    newHTML +=  '<a href="' + data.results[i].url + '">Review By: ' + data.results[i].author + '</a>';
                    newHTML += '<div class="review-content">' + data.results[i].content + '</div>';
                newHTML += '</div>';
            }
            $('.poster-grid').html(newHTML);
        }else{
            alert('Sorry, there are no reviews at this time!');
        }
    }

    function populateVidModal(videoArr, title, backDrop){
        var newVidHTML = '';
        var vidTitleHTML = '<h1>' + title + '</h1>';
        var vidName = '<h3>' + videoArr[0].name + '</h3>';
        // var backDropImage = '<img src="' + backDrop + '">';
        var nextVidOption = '';
        for (var i = 0; i < videoArr.length; i++) {
            if(videoArr[i] == videoArr[0]){
                newVidHTML += vidName + '<iframe src="https://www.youtube.com/embed/' + videoArr[0].key + '" frameborder="0" allowfullscreen></iframe>';
            }else{
                nextVidOption += '<button id="' + videoArr[i].id + '" class="another" name="' + videoArr[i].name + '" width="50%">Watch Another? Trailer:' + (i + 1) + '</button>';  
            }
        }
        $('.videoBD').html('<img src="' + backDrop + '">');
        $('.vidButtons').html(nextVidOption);
        $('.video').html(newVidHTML);
        $('.vid-title').html(vidTitleHTML);

        $('.another').click(function(event){
            nextVideo(this.id, videoArr, this.name);
        });
    }

    function nextVideo(id, arr, name){
        var newVidHTML = '';
        var vidName = '<h3>' + name + '</h3>';
        var nextVidOption = '';
        for (var i = 0; i < arr.length; i++) {
            if(id == arr[i].id){
                newVidHTML += vidName + '<iframe src="https://www.youtube.com/embed/' + arr[i].key + '" frameborder="0" allowfullscreen></iframe>';
            }else{
                nextVidOption += '<button id="' + arr[i].id + '"class="another" name="' + arr[i].name + '" width="50%"> Watch Another? Trailer: ' + (i + 1) + '</button>';
            }
        }
        $('.video').html(newVidHTML);
        $('.vidButtons').html(nextVidOption);

        $('.another').click(function(event){
            nextVideo(this.id, arr, this.name);
        });
    }  

    $('#reset').click(function(event){
        event.preventDefault();
        $('.poster-grid').empty();
    }); 

});

