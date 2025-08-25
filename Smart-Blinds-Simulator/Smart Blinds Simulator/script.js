function triangularMembership(x, a, b, c) {
    if (x <= a || x >= c) {
        return 0;
    } else if (x > a && x <= b) {
        return (x - a) / (b - a); 
    } else if (x > b && x < c) {
        return (c - x) / (c - b); 
    }
    return 0;
}

const config = {
    apiKey: "8f93555202be45a5bb3154836242209",
    location: "Philippines",
    url: `http://api.weatherapi.com/v1/forecast.json?key=8f93555202be45a5bb3154836242209&q=Philippines&days=1&aqi=no&alerts=no`,
    functions: {
        adjustBlinds(value) {
            const blinds = document.querySelectorAll('.blind');
            const blindValue = document.getElementById('blinds-position');
            blindValue.textContent = `Blinds position: ${value.toFixed(2)}% open`;

            blinds.forEach(blind => {
                const newHeight = (value / 100) * 100;
                blind.style.height = newHeight + 'px';
            });
        },

        /////pag yung ambient light ay papatak ng 0 to 30 it means low, yung blinds ay naka bukas kase hindi naman maliwanag
        ///// pero pag pumalo ng 40 pataas it means mid, bubukas yung blinds pero ilang percent kase medyo maliwanag lang naman
        fuzzyLight(ambientLight) {
            const low = triangularMembership(ambientLight, 0, 30, 60);
            const mid = triangularMembership(ambientLight, 40, 60, 80);
            const high = triangularMembership(ambientLight, 60, 80, 100);
            return { low, mid, high };
        },
        ////// pag yung temparature ay papatak ng 0 to 30 it means low, yung blinds ay naka bukas kase hindi naman mainit
        /////pero pag pumalo ng 35 pataas it means mid, bubukas yung blinds pero ilang percent kase medyo mainit lang naman
        fuzzyTemperature(temperature) {
            const low = triangularMembership(temperature, 0, 15, 25);
            const mid = triangularMembership(temperature, 15, 25, 35);
            const high = triangularMembership(temperature, 25, 35, 45);
            return { low, mid, high };
        },

        computeBlindsPosition(ambientLight, temperature) {
            const light = this.fuzzyLight(ambientLight);
            const temp = this.fuzzyTemperature(temperature);

            const rule1 = Math.min(light.low, temp.low);
            const rule2 = Math.min(light.mid, temp.mid);
            const rule3 = Math.min(light.high, temp.high);

            const totalWeight = rule1 + rule2 + rule3;
            const position = (rule1 * 95 + rule2 * 55 + rule3 * 5) / (totalWeight || 1);

            return {
                position: Math.max(0, Math.min(100, position)),
                classification: ambientLight >= 80 ? 'Very High Light' :
                    ambientLight < 20 ? 'Low Light' :
                    ambientLight < 60 ? 'Mid Light' : 'High Light'
            };
        }
    }
};

fetch(config.url)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Weather API Data:', data);

        const temperature = data.current.temp_c;
        const cloudCover = data.current.cloud;

        const ambientLight = 100 - cloudCover;

        document.getElementById('temperature-display').textContent = `Temperature: ${temperature}°C`;
        document.getElementById('ambient-light-display').textContent = `Ambient Light: ${ambientLight}%`;

        console.log(`Temperature: ${temperature}°C, Cloud Cover: ${cloudCover}%`);

        const blindsPosition = config.functions.computeBlindsPosition(ambientLight, temperature);

        config.functions.adjustBlinds(blindsPosition.position);
        console.log(`Blinds Position: ${blindsPosition.position.toFixed(2)}%, Classification: ${blindsPosition.classification}`);

        const slider = document.getElementById('blinds-slider');
        slider.value = blindsPosition.position;

        slider.addEventListener('input', (event) => {
            const value = parseFloat(event.target.value);
            config.functions.adjustBlinds(value);
        });
    })
    .catch(error => console.error('Error:', error));
