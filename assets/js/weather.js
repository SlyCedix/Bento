// ┬ ┬┌─┐┌─┐┌┬┐┬ ┬┌─┐┬─┐
// │││├┤ ├─┤ │ ├─┤├┤ ├┬┘
// └┴┘└─┘┴ ┴ ┴ ┴ ┴└─┘┴└─
// Functions to setup Weather widget.

const iconElement = document.querySelector('.weatherIcon');
const tempElement = document.querySelector('.weatherValue p');
const descElement = document.querySelector('.weatherDescription p');

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
	"skc": 		"01",
	"few": 		"02",
	"sct": 		"02",
	"bkn": 		"04",
	"ovc": 		"04",
	"fg":  		"04",
	"shra": 	"10",
	"hi_shwrs": "10",
	"fzrara": 	"10",
	"ra1": 		"10",
	"ra": 		"10",
	"tsra":		"11",
	"hi_tsra":	"11",

	"ip":		"13",
	"mix":		"13",
	"raip":		"13",
	"rasn":		"13",
	"sn":		"13",

	"wind":		"50",
	"smoke":	"50",
	"nsvrtsra":	"50",
	"dust":		"50",
	"mist":		"50",
}

function getWeather(latitude, longitude) {
	let api = `https://api.weather.gov/points/${latitude},${longitude}`
	fetch(api)
		.then( res => res.json())
		.then( data => fetch(data.properties.forecast))
		.then( res => res.json())
		.then( data => {
			let period = data.properties.periods[0];
			let fahrenheit = period.temperature;

			weather.temperature.value = tempUnit == 'C' ? (fahrenheit - 32) * 5 / 9 : fahrenheit;
			weather.description = period.shortForecast
			
			let iconSplit = String(period.icon).replace("https://api.weather.gov/icons/land/", "").split('/')
			let dayNight = iconSplit[0] == "day" ? "d" : "n"
			let iconName = iconSplit[1].split('?')[0].split(".")[0]
			weather.iconId = iconLut[iconName] + dayNight;

			displayWeather();
		});
}

function displayWeather() {
	iconElement.innerHTML = `<img src="${CONFIG.assetPrefix}assets/icons/${CONFIG.weatherIcons}/${weather.iconId}.png"/>`;
	tempElement.innerHTML = `${weather.temperature.value.toFixed(0)}°<span class="darkfg">${tempUnit}</span>`;
	descElement.innerHTML = weather.description;
}
