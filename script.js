var cityName = "";
var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=Seattle&units=imperial&appid=815e5063321676b02692a275fe9908bc";
var currentDate = moment().format("dddd MMMM Do YYYY");
var cityList = JSON.parse(localStorage.getItem("cityInfo")) || [];


// Will display most recent search city on site refresh
if (cityList.length > 0) {
    showData(cityList[cityList.length - 1])
} else {
    showData("Seattle")
}

showSearchHistory();

// Check weather of new city
function showData(cityName) {

    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=815e5063321676b02692a275fe9908bc";

    $("#currentStats").show();
    $("#forecastStats").show();

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        var temp = response.list[0].main.temp;
        var tempHigh = response.list[0].main.temp_max;
        var tempLow = response.list[0].main.temp_min;
        var humidity = response.list[0].main.humidity;
        var wind = response.list[3].wind.speed;
        var windDirection = response.list[3].wind.deg;
        var altimeterQNH = response.list[0].main.pressure;
        var pressure = (response.list[0].main.pressure) * 0.029530;
        var inchesMB = pressure.toFixed(2);
        var currConditions = response.list[0].weather[0].description;
        var lat = response.city.coord.lat;
        var lon = response.city.coord.lon;
        var queryURLuvi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&appid=815e5063321676b02692a275fe9908bc";

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
            } if (uvi > 2 && uvi < 5) {
                $("div.uvi").attr("style", "background-color:yellow")
            } if (uvi > 5) {
                $("div.uvi").attr("style", "background-color:red; color:white")
            }
        })

        //Display current stats
        $("div.city").html("<h2>" + response.city.name + "</h2>");
        $("div.city").append("<h4>" + currentDate + "</h4>")
        $("div.temp").text("Current Temperature: " + temp + " °F");
        $("div.high").text("High: " + tempHigh + " °F");
        $("div.low").text("Low: " + tempLow + " °F");
        $("div.humidity").text("Humidity: " + humidity + "%");
        $("div.wind").text(`Wind: ${windDirection} deg @ ${wind} kts`);
        $("div.QNH").text(`Barometric pressure (metric): ${altimeterQNH} QNH`);
        $("div.pressure-inches").text(`Barometric pressure (US): ${inchesMB} inches`);
        $("div.currentConditions").text(`Current conditions in ${cityName}: ${currConditions}`);


        // Future forecast
        for (i = 0; i < 6; i++) {
            $("#day" + [i]).text((moment().add(i, 'days').format("M/" + "DD" + "/YYYY")));
            var imgToAttach = response.list[i].weather[0].icon;
            $("#day" + [i] + "Img").attr("src", "http://openweathermap.org/img/wn/" + imgToAttach + ".png")
            $("#day" + [i] + "temp").text(response.list[i].main.temp + "°F");
            $("#day" + [i] + "humidity").text("Humidity: " + response.list[i].main.humidity + "%");
        }
    });
}

//Search history sidebar
function showSearchHistory() {
    $("#cityList").empty();

    for (let i = 0; i < cityList.length; i++) {
        var newLi = $("<li>");

        newLi.addClass("list-group-item");
        newLi.attr("id", ("city" + [i]))
        newLi.text(cityList[i]);

        $("#cityList").append(newLi)
        $("#city" + [i]).on("click", function (event) {

            var citySearch = (cityList[i])
            showData(citySearch)
        });
    }
}

// onclick event listener
$("#searchBtn").on("click", function (event) {

    event.preventDefault();

    var citySearch = $("#citySearch").val().trim();
    if (cityList.indexOf(citySearch) === -1) {
        cityList.push(citySearch)
    }
    if (cityList.length > 5) {
        cityList.shift()
    }

    localStorage.setItem("cityInfo", JSON.stringify(cityList))
    showSearchHistory();
    showData(citySearch);
})