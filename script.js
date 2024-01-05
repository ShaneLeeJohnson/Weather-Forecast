const searchForm = document.querySelector('#search-form');
const cityInput = document.querySelector('#city');

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const cityName = cityInput.value;

    const getCurrentWeather = async () => {
        try {
            const res = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=c146dbb949e3984d88cf4996c851d1ec`);
            const data = await res.json();
            const lat = data[0].lat;
            const lon = data[0].lon;
            console.log(data);
            console.log(lat, lon);

            const res2 = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=c146dbb949e3984d88cf4996c851d1ec`);
            const data2 = await res2.json();
            console.log(data2);
        } catch (e) {
            console.log('Error!!!', e);
        }
    }

    getCurrentWeather();

})



