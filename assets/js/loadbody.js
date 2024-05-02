async function loadBody() {
    document.body.innerHTML = `
<button id="themeButton">
	<i id="themeIcon" data-lucide="moon"></i>
</button>
<div class="container">
	<!-- Clock and Greetings  -->

	<div class="timeBlock">
		<div class="date">
			<div id="month"></div>
			<div id="day"></div>
			<div class="weatherIcon"></div>
			<div class="weatherValue">
				<p>- °<span class="g">c</span></p>
			</div>
		</div>
		<div class="clock">
			<div id="hour"></div>
			<div id="separator"></div>
			<div id="minutes"></div>
		</div>
		<div id="greetings"></div>
		<div class="search">
		</div>
	</div>

	<div class="linksBlock" id="linksBlock">
		<div class="linksBlockLeft" id="linksBlockLeft"></div>
		<div class="linksBlockRight" id="linksBlockRight"></div>
	</div>
</div>
    `;


	await loadScript("https://unpkg.com/lucide@latest");

    await loadScript(`${CONFIG.assetsPath}/js/layout.js`);
    await loadScript(`${CONFIG.assetsPath}/js/theme.js`);
    await loadScript(`${CONFIG.assetsPath}/js/time.js`);
    await loadScript(`${CONFIG.assetsPath}/js/greeting.js`);
    await loadScript(`${CONFIG.assetsPath}/js/weather.js`);
    await loadScript(`${CONFIG.assetsPath}/js/searchbox.js`);
    
    await loadScript(`${CONFIG.assetsPath}/js/buttons.js`);
    await loadScript(`${CONFIG.assetsPath}/js/lists.js`);

    lucide.createIcons();
}

function loadScript(scriptName) {
	return new Promise((resolve, reject) => {
		let script = document.createElement('script');
		script.type = 'text/javascript';
		script.async = true;
		script.src = scriptName;

		script.onload = () => {
			console.log(`Loaded: ${scriptName}`);
			resolve(scriptName);
		}

		script.onerror = () => {
			console.log(`Error loading: ${scriptName}`);
			reject(scriptName);
		}

		document.head.appendChild(script);
	});
}