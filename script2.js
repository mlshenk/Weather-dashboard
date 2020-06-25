
var cityName = "";
var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=Seattle&units=imperial&appid=2acfaadbcdceb6ac258c5d746dd4e2a2";
var currentDate = moment().format("M/DD/YYYY");
var cityArray = JSON.parse(localStorage.getItem("cityData")) || [];


//Populate page when opened
if (cityArray.length > 0) {
    renderData(cityArray[cityArray.length -1])
} else {
    renderData("Seattle")
}

//Search history sidebar
renderSearchHistory();

//Searching for a different city
function renderData(cityName) {

    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=2acfaadbcdceb6ac258c5d746dd4e2a2";

    $("#currentStats").show();
    $("#forecastStats").show();

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        var temp = response.list[0].main.temp;
        var humidity = response.list[0].main.humidity;
        var wind = response.list[3].wind.speed;
        var lat = response.city.coord.lat;
        var lon = response.city.coord.lon;
        var queryURLuvi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&appid=2acfaadbcdceb6ac258c5d746dd4e2a2";

        //Incorporate UVI
        $.ajax({
            url: queryURLuvi,
            method: "GET"
        }).then(function (response) {
            var uvi = response.current.uvi
            $("div.uvi").text("UV Index: " + uvi);
            console.log(uvi)
        
        //UV Index Danger Level
        if (uvi < 2) {
            $("div.uvi").attr("style", "background-color:green; color:white")
        } if (uvi >2 && uvi<5) {
            $("div.uvi").attr("style", "background-color:yellow")
        } if (uvi > 5) {
            $("div.uvi").attr("style", "background-color:red; color:white")
        }
        })

        //Display current stats
        $("div.city").html("<h2>" + response.city.name + "</h2>");
        $("div.city").append("<h2>" + currentDate + "</h2>")
        $("div.temp").text("Temperature: " + temp + " °F");
        $("div.humidity").text("Humidity: " + humidity + "%");
        $("div.wind").text("Wind: " + wind + " mph");

        //5 day forecast
        for (i = 0; i < 6; i++) {
            $("#day" + [i]).text((moment().add(i, 'days').format("M/" + "DD" + "/YYYY")));
            var imgToAttach = response.list[i].weather[0].icon;
            $("#day" + [i] + "Img").attr("src", "http://openweathermap.org/img/wn/" + imgToAttach + ".png")
            $("#day" + [i] + "temp").text(response.list[i].main.temp + "°F");
            $("#day" + [i] + "humid").text("Humidity: " + response.list[i].main.humidity + "%");
        }
    });
}

//Search history sidebar
function renderSearchHistory() {
    $("#cityList").empty();

    for (let i = 0; i < cityArray.length; i++) {
        var newLi = $("<li>");

        newLi.addClass("list-group-item");
        newLi.attr("id", ("city" + [i]))
        newLi.text(cityArray[i]);

        $("#cityList").append(newLi)
        $("#city" + [i]).on("click", function (event) {
            
            var citySearch = (cityArray[i])
            renderData(citySearch)
        });
    }
}

//Event listener
$("#searchBtn").on("click", function (event) {

    event.preventDefault();

    var citySearch = $("#citySearch").val().trim();
    if (cityArray.indexOf(citySearch) === -1) {
        cityArray.push(citySearch)
    }
    if (cityArray.length > 5) {
        cityArray.shift()
    }

    localStorage.setItem("cityData", JSON.stringify(cityArray))
    renderSearchHistory();
    renderData(citySearch);
})