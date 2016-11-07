$(document).ready(function(){

  var $search = $('#search');
  var $year  = $('#year');
  var $movies = $('#movies');
  var $movieItem = $('#movies li');
  var $mainContent = $('.main-content');
  var $singleMovieWrapper = $('.single-movie-wrapper');

  var movieData = {};

  $('form').submit(function(e){
    e.preventDefault();

    $('body').css('background','#f6f7f7');
    $singleMovieWrapper.css('display','none');
    $singleMovieWrapper.text("");

    var omdbURL = "http://www.omdbapi.com/?";
    var omdbOptions = {
      s : $search.val(),
      y : $year.val(),
    }
    function displayMovies(data){

      movieData = data.Search;

      if(movieData){
          $movies.html(createMovieListHTML());
          $('#movies li').each(function(){
            $(this).click(function(){
              var imdbID = $('p',this).text();
              displaySingleMovie(imdbID);
            });
          });
      }else{
        $movies.html("<li class='no-movies'><i class='material-icons icon-help'>help_outline</i>No movies found that match: " + $search.val() + ".</li>");
      }

    }
    $.getJSON(omdbURL,omdbOptions,displayMovies);
  });

  function displaySingleMovie(id){
    $movies.html("");
    var singleMovie = {};

    $.each(movieData,function(i,movie){
      if(movie.imdbID === id){
        singleMovie = movie;
        return false;
      }
    });

    var omdbURL = "http://www.omdbapi.com/?";
    var omdbOptions = {
      t : singleMovie.Title,
      y : singleMovie.Year,
      plot : "full"
    }

    $.getJSON(omdbURL,omdbOptions,function(data){
      $singleMovieWrapper.load("single-movie.html",function(){
        console.log(data);

        $('body').css('background-color','#4c4c4c');
        $('.single-movie-wrapper').css('display','block');

        $('.single-movie-title').text(data.Title);
        $('.single-movie-imdb-rating').text("IMDB Rating : " + data.imdbRating);
        $('.single-movie-poster').attr('src',data.Poster);
        $('.single-movie-plot').text(data.Plot);
        $('.single-movie-imdb-link').attr('href','http://www.imdb.com/title/' + data.imdbID + '/');
        //create handler for going back to movies list
        $('#back-link').click(function(){
          $singleMovieWrapper.html("");
          $('body').css('background-color','#f6f7f7');
          $('.single-movie-wrapper').css('display','none');
          $movies.html(createMovieListHTML());

          $('#movies li').each(function(){
            $(this).click(function(){
              var imdbID = $('p',this).text();
              displaySingleMovie(imdbID);
            });
          });

        });

      });
    });

  }

  function createMovieListHTML(){
    var movieListHTML = "<ul>";
    $.each(movieData,function(i,movie){
      movieListHTML += '<li>';
      movieListHTML += '<div class="poster-wrap">';
      if(this.Poster === "N/A"){
          movieListHTML += '<i class="material-icons poster-placeholder">crop_original</i>';
      }else{
          movieListHTML += '<img class="movie-poster" src="' + this.Poster + '">';
      }
      movieListHTML += '</div>';
      movieListHTML += '<span class="movie-title">' + this.Title + '</span>';
      movieListHTML += '<span class="movie-year">' + this.Year + '</span>';
      movieListHTML += '<p style="display:none;">' + this.imdbID + '</p>';
      movieListHTML += '</li>';
    });
    movieListHTML += '</ul>';
    return movieListHTML;
  }

});
