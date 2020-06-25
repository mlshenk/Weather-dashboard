$(document).ready(function () {

    console.log("localstorage list" + cityList);
  var cityArray = JSON.parse(localStorage.getItem("cityList")) || [];


//Populate page when opened
if (cityArray.length > 0) {
    renderData(cityArray[cityArray.length -1])
} else {
    renderData("Seattle")
}
    var currentDate = moment().format("LL");
    //var cityList = JSON.parse(localStorage.getItem("cityList")) || [];

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
    function renderSearchHistory() {
        $("#cityList").empty();

        for (let i = 0; i < cityList.length; i++) {
            var newLi = $("<li>");

            newLi.addClass("list-group-item");
            newLi.attr("id", ("city" + [i]))
            newLi.text(cityList[i]);

            $("#cityList").append(newLi)
            $("#city" + [i]).on("click", function (event) {

                var citySearch = (cityList[i])
                renderData(citySearch)
            });
        }
    }

    //Event listener active
    $("#searchBtn").on("click", function (event) {

        event.preventDefault();

        var citySearch = $("#citySearch").val().trim();
        if (cityList.indexOf(citySearch) === -1) {
            cityList.push(citySearch)
        }
        if (cityList.length > 5) {
            cityList.shift();
        }

        localStorage.setItem("cityList", JSON.stringify(cityList))
        renderSearchHistory();
        renderData(citySearch);

    });
})