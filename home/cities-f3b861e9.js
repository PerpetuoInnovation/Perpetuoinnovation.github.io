function loopCities(t) {
	var n = cities[t],
		i = cities[t + 1];
	$(".currentCity h2").html(n["short"]), $(".currentCity p").html(n.name), $(".cityShortContainer").append('<li class="nextCity cityShort"><h2>' + i["short"] + "</h2></li>"), $(".cityLongContainer").append('<li class="nextCity cityLong"><p>' + i.name + "</p></li>"), setTimeout(function() {
		$(".currentCity").css({
			top: "-90px"
		}), $(".nextCity").css({
			top: "0px"
		})
	}, 500), setTimeout(function() {
		$(".currentCity").remove(), $(".nextCity").removeClass("nextCity").addClass("currentCity")
	}, 800), delete cities[t], cities.push(n), setTimeout(function() {
		loopCities(t + 1)
	}, 2e3)
}
var cities = [{
	name: "Málaga, Spain",
	"short": "말라가"
}, {
	name: "Chennai, India",
	"short": "첸나이"
}, {
	name: "Del City, OK",
	"short": "델시티"
}, {
	name: "Cologne, Germany",
	"short": "쾰른"
}, {
	name: "Sydney, Australia",
	"short": "시드니"
}, {
	name: "Toronto, Canada",
	"short": "토론토"
}, {
	name: "London, UK",
	"short": "런던"
}, {
	name: "Albany, NY",
	"short": "알바니"
}];
$(document).ready(function() {
	$(".currentCity h2").html(cities[0]["short"]), $(".currentCity p").html(cities[0].name), $(".cityShortContainer").append('<li class="nextCity cityShort"><h2>' + cities[1]["short"] + "</h2></li>"), $(".cityLongContainer").append('<li class="nextCity cityLong"><p>' + cities[1].name + "</p></li>"), setTimeout(function() {
		loopCities(0)
	}, 600)
});