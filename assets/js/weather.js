// ┬ ┬┌─┐┌─┐┌┬┐┬ ┬┌─┐┬─┐
// │││├┤ ├─┤ │ ├─┤├┤ ├┬┘
// └┴┘└─┘┴ ┴ ┴ ┴ ┴└─┘┴└─
// Functions to setup Weather widget.

const iconElement = document.querySelector('.weatherIcon');
const tempElement = document.querySelector('.weatherValue p');

const weather = {};
weather.temperature = {
	unit: 'celsius',
};

var tempUnit = CONFIG.weatherUnit;

const KELVIN = 273.15;
const key = `${CONFIG.weatherKey}`;
setPosition();

function setPosition(position) {
	if (!CONFIG.trackLocation || !navigator.geolocation) {
		if (CONFIG.trackLocation) {
			console.error('Geolocation not available');
		}
		getWeather(CONFIG.defaultLatitude, CONFIG.defaultLongitude);
		return;
	}
	navigator.geolocation.getCurrentPosition(
		pos => {
			getWeather(pos.coords.latitude.toFixed(3), pos.coords.longitude.toFixed(3));
		},
		err => {
			console.error(err);
			getWeather(CONFIG.defaultLatitude, CONFIG.defaultLongitude);
		}
	);
}

iconLut = {
	"night": {
		"skc": "nf-weather-night_clear",
		"few": "nf-md-weather_night_partly_cloudy",
		"sct": "nf-md-weather_night_partly_cloudy",
		"bkn": "nf-weather-cloudy",
		"ovc": "nf-md-weather_cloudy",
		"sn": "nf-weather-snowy",

		"ra_sn": "nf-md-weather_snowy_rainy",
		"raip": "nf-md-weather_hail",
		"fzra": "nf-md-weather_snowy_rainy",
		"ra_fzra": "nf-md-weather_snowy_rainy",
		"fzra_sn": "nf-md-weather_snowy_rainy",
		"ip": "nf-md-weather_hail",
		"snip": "nf-weather-snow",

		"minus_ra": "nf-weather-night_rain_mix",
		"ra": "nf-weather-night_rain",
		"shra": "nf-weather-rain",
		"tsra": "nf-weather-night_thunderstorm",

		"scttsra": "nf-weather-night_thunderstorm",
		"hi_tsra": "nf-weather-night_thunderstorm",
		"fc": "nf-md-weather_tornado",
		"tor": "nf-md-weather_tornado",

		"hur_warn": "nf-weather-hurricane_warning",
		"hur_watch": "nf-md-weather_hurricane",
		"ts_warn": "nf-weather-gale_warning",
		"ts_watch": "nf-md-weather_hurricane",
		"ts_nowarn": "nf-weather-storm_warning",

		"wind_skc": "nf-weather-night_cloudy_windy",
		"wind_few": "nf-weather-night_cloudy_windy",
		"wind_sct": "nf-weather-night_cloudy_windy",
		"wind_bkn": "nf-weather-night_cloudy_windy",
		"wind_ovc": "nf-weather-cloudy_windy",

		"du": "nf-weather-dust",
		"fu": "nf-weather-smoke",
		"hz": "nf-md-weather_fog",
		"hot": "nf-weather-hot",
		"cold": "nf-weather-snowflake_cold",
		"blizzard": "nf-md-weather_snowy_heavy",
		"fg": "nf-weather-night_fog",
	},
	"day": {
		"skc": "nf-weather-day_sunny",
		"few": "nf-md-weather_partly_cloudy",
		"sct": "nf-md-weather_partly_cloudy",
		"bkn": "nf-weather-cloudy",
		"ovc": "nf-md-weather_cloudy",
		"sn": "nf-weather-snowy",

		"ra_sn": "nf-md-weather_snowy_rainy",
		"raip": "nf-md-weather_hail",
		"fzra": "nf-md-weather_snowy_rainy",
		"ra_fzra": "nf-md-weather_snowy_rainy",
		"fzra_sn": "nf-md-weather_snowy_rainy",
		"ip": "nf-md-weather_hail",
		"snip": "nf-weather-snow",

		"minus_ra": "nf-weather-day_rain_mix",
		"ra": "nf-weather-day_rain",
		"shra": "nf-weather-rain",
		"tsra": "nf-weather-day_thunderstorm",

		"scttsra": "nf-weather-day_thunderstorm",
		"hi_tsra": "nf-weather-day_thunderstorm",
		"fc": "nf-md-weather_tornado",
		"tor": "nf-md-weather_tornado",

		"hur_warn": "nf-weather-hurricane_warning",
		"hur_watch": "nf-md-weather_hurricane",
		"ts_warn": "nf-weather-gale_warning",
		"ts_watch": "nf-md-weather_hurricane",
		"ts_nowarn": "nf-weather-storm_warning",

		"wind_skc": "nf-weather-day_light_wind",
		"wind_few": "nf-weather-day_cloudy_windy",
		"wind_sct": "nf-weather-day_cloudy_windy",
		"wind_bkn": "nf-weather-day_cloudy_windy",
		"wind_ovc": "nf-weather-cloudy_windy",

		"du": "nf-weather-dust",
		"fu": "nf-weather-smoke",
		"hz": "nf-md-weather_fog",
		"hot": "nf-weather-hot",
		"cold": "nf-weather-snowflake_cold",
		"blizzard": "nf-md-weather_snowy_heavy",
		"fg": "nf-weather-day_fog",
	},

	"few": "02",
	"sct": "02",
	"bkn": "04",
	"ovc": "04",
	"fg": "04",
	"shra": "10",
	"hi_shwrs": "10",
	"fzrara": "10",
	"ra1": "10",
	"ra": "10",
	"tsra": "11",
	"hi_tsra": "11",

	"ip": "13",
	"mix": "13",
	"raip": "13",
	"rasn": "13",
	"sn": "13",

	"wind": "50",
	"smoke": "50",
	"nsvrtsra": "50",
	"dust": "50",
	"mist": "50",
}

function getWeather(latitude, longitude) {
	let api = `https://api.weather.gov/points/${latitude},${longitude}`
	fetch(api)
		.then(res => res.json())
		.then(data => fetch(data.properties.forecast))
		.then(res => res.json())
		.then(data => {
			let period = data.properties.periods[0];
			let fahrenheit = period.temperature;

			weather.temperature.value = tempUnit == 'C' ? (fahrenheit - 32) * 5 / 9 : fahrenheit;

			let iconSplit = String(period.icon).replace("https://api.weather.gov/icons/land/", "").split('/')
			let day_night = iconSplit[0]
			let icon_id = iconSplit[1].split('?')[0].split(".")[0]
			weather.iconId = iconLut[day_night][icon_id];
			weather.description = period.shortForecast;

			displayWeather();
		});
}

function displayWeather() {
	iconElement.innerHTML = `<i class="nf ${weather.iconId}" aria-label="${weather.description}" title="${weather.description}"/>`;
	tempElement.innerHTML = `${weather.temperature.value.toFixed(0)}°<span class="darkfg">${tempUnit}</span>`;
}
