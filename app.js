const cityInput = document.getElementById("city");
const submit = document.getElementById("submit");
const cityName = document.getElementById("cityName")

const getWeather = (city) => {
    cityName.innerHTML = city;

    fetch(`https://goweather.xyz/weather/${city}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json()
        })
        .then((data) => {
            const emoji = getWeatherEmoji(data.description);
            const tempColor = getTempColor(data.temperature);

            document.getElementById("current-temp").innerHTML = `<span style="color:${tempColor}">${data.temperature || "N/A"}</span>`;
            document.getElementById("current-desc").innerHTML = `${emoji} ${data.description || "N/A"}`;
            document.getElementById("current-wind").innerHTML = data.wind || "N/A";

            if (Array.isArray(data.forecast)) {
                if (data.forecast[0]) {
                    document.getElementById("day1-temp").innerHTML = data.forecast[0].temperature || "N/A";
                    document.getElementById("day1-wind").innerHTML = data.forecast[0].wind || "N/A";
                }

                if (data.forecast[1]) {
                    document.getElementById("day2-temp").innerHTML = data.forecast[1].temperature || "N/A";
                    document.getElementById("day2-wind").innerHTML = data.forecast[1].wind || "N/A";
                }

                if (data.forecast[2]) {
                    document.getElementById("day3-temp").innerHTML = data.forecast[2].temperature || "N/A";
                    document.getElementById("day3-wind").innerHTML = data.forecast[2].wind || "N/A";
                }
            }
        })
        .catch((error) => {
            console.log("❌ Error fetching weather data:", error);
            alert("Could not load weather data. Please try again later");
        })

}
submit.addEventListener("click", (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city !== "") {
        getWeather(city);
    }
    else {
        alert("Please enter a city name.");
    }
})

getWeather("Kathmandu");


//Others city weather info

const otherCities = ["Dhading", "Chitwan", "Dharan", "Gorkha"];
const tableBody = document.getElementById("other-places-body");

const loadOtherCititesWeather = () => {
    otherCities.forEach((city) => {
        fetch(`https://goweather.xyz/weather/${city}`)
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fecth data");
                return response.json();
            })
            .then((data) => {

                const emoji = getWeatherEmoji(data.description);
                const tempColor = getTempColor(data.temperature);

                const row = document.createElement("tr");

                row.innerHTML = `
                    <th scope="row" class="text-start">${city}</th>
                    <td>${emoji} ${data.description || "N/A"}</td>
                    <td>${data.forecast?.[0]?.temperature || "N/A"}</td>
                    <td><span style="color:${tempColor}">${data.temperature || "N/A"}</td>
                    <td>${data.wind || "N/A"}</td>
                `;

                tableBody.appendChild(row);
            })
            .catch((error) => {
                console.log(`❌ Failed to load data for ${city}:`, error);

            })
    })
}

loadOtherCititesWeather();

//emoji
function getWeatherEmoji(desc){
    desc = desc.toLowerCase();
    if(desc.includes("sun")) return "☀️";
    if(desc.includes("rain")) return "🌧️";
    if(desc.includes("cloud")) return "☁️";
    if(desc.includes("storm")) return "⛈️";
    if(desc.includes("snow")) return "❄";
    if(desc.includes("wind")) return "💨";
    return "🌡️";
}

function getTempColor(tempStr){
    const temp = parseInt(tempStr);
    if(isNaN(temp)) return "black";
    if(temp < 10) return "blue";
    if(temp < 25) return "orange";
    return "red";
}

