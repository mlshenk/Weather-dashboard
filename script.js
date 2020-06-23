$(document).ready(function () {

    var cityList = JSON.parse(window.localStorage.getItem("cityList")) || [];
    console.log("localstorage list" + cityList);
    if (cityList.length > 0) {
        weatherInfo(cityList[cityList.length - 1]);
    }
    else {
        weatherInfo("Seattle");
    }

    var currentDate = moment().format("LL");
    //var cityArray = JSON.parse(localStorage.getItem("cityData")) || [];

    //on click of search button show weather info 
    $("#searchBtn").on("click", function () {
        event.preventDefault();
        console.log("Clicked Search button ");

        var cityName = $("#citySearch").val();

        weatherInfo(cityName);

    });
    //renderSearchHistory();
    //function renderData(cityName){
    function weatherInfo(cityName) {

        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=815e5063321676b02692a275fe9908bc";
        console.log(queryURL);
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            // console.log(queryURL);

            //Clearing old data 
            $(".card-title").empty();
            //Save city name in local storage 

            var temp = response.list[0].main.temp;
            var tempHigh = response.list[0].main.temp_max;
            var tempLow = response.list[0].main.temp_min;
            var humidity = response.list[0].main.humidity;
            var wind = response.list[3].wind.speed;
            var windDirection = response.list[3].wind.deg;
            var altimeter = response.list[0].main.pressure;
            var currConditions = response.list[0].weather[0].description;
            var lat = response.city.coord.lat;
            var lon = response.city.coord.lon;

            console.log(response.list[1].weather[0].icon);
            var queryURLuvi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&appid=815e5063321676b02692a275fe9908bc";

            //incorporate UVI
            $.ajax({
                url: queryURLuvi,
                method: "GET"
            }).then(function (responseData) {
                // console.log(response.current.uvi)
                var uvi = responseData.current.uvi
                $("div.uvi").text("UVI: " + uvi);
            });

            //display current weather
            $("div.city").html("<h2>" + response.city.name + "</h2>");
            $("div.city").append("<h4>" + currentDate + "</h4>")
            $("div.temp").text("Current Temperature: " + temp + " °F");
            $("div.high").text("High: " + tempHigh + " °F");
            $("div.low").text("Low: " + tempLow + " °F");
            $("div.humidity").text("Humidity: " + humidity + "%");
            $("div.wind").text(`Wind: ${windDirection} deg @ ${wind} kts`);
            $("div.QNH").text(`Pressure: ${altimeter} QNH`);
            $("div.currentConditions").text(`Current conditions in ${cityName}: ${currConditions}`);




            // 5 Forecast weather boxes below
            for (i = 0; i < 6; i++) {
                $("#day" + [i]).append((moment().add(i, 'days').format("ddd " + "MM/" + "DD" + "/YY")));
                var imgToAttach = response.list[i].weather[0].icon;
                $("#day" + [i] + "Img").attr("src", "http://openweathermap.org/img/wn/" + imgToAttach + ".png")
                $("#day" + [i] + "temp").text(response.list[i].main.temp + "°F");
                $("#day" + [i] + "humid").text("Humidity: " + response.list[i].main.humidity + "%");
            }
        });
    }

    function cityList() {
        var highscores = JSON.parse(window.localStorage.getItem("cityList")) || [];
        highscores.forEach(function (score) {
            // create li tag for each high score
            var liTag = document.createElement("li");
            liTag.textContent = score.initials + " - " + score.score;
            // display on page
            var olEl = document.getElementById("scoreList");
            olEl.appendChild(liTag);
        });
    }

    showFinalScore();

    function clearHighScores() {
        window.localStorage.removeItem("highScoreList");
        window.location.reload();
    }    // either get scores from localstorage or set to empty array

});
