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

let tempUnit = CONFIG.weatherUnit;

const KELVIN = 273.15;
const key = `${CONFIG.weatherKey}`;
setPosition();

function setPosition() {
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

function getWeather(latitude, longitude) {
	let api = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,is_day`
	fetch("assets/wmo_table.json")
		.then(r => r.json())
		.then(wmo_table => {
			fetch(api)
				.then(r => r.json())
				.then(data => {
					console.log(data.current)
					let degC = data.current.temperature_2m;
					weather.temperature.value = tempUnit == 'F' ? (degC * 9 / 5 + 32) : degC;

					let wmo_ent = wmo_table[data.current.weather_code][data.current.is_day == 1 ? "day" : "night"];
					weather.iconId = wmo_ent.image;
					weather.description = wmo_ent.description

					displayWeather();

				});
		});
}

function displayWeather() {
	// iconElement.innerHTML = `<i class="nf ${weather.iconId}" aria-label="${weather.description}" title="${weather.description}"/>`;
	iconElement.innerHTML = `<img src="${weather.iconId}" title="${weather.description}"/>`
	tempElement.innerHTML = `${weather.temperature.value.toFixed(0)}°<span class="darkfg">${tempUnit}</span>`;
}
