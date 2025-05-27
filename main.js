async function fetchJson(url) {
    const response = await fetch(url);
    const obj = await response.json();
    return obj;
  }


async function getDashboardData(query) {
   const destinationPromise = fetchJson(`http://localhost:3333/destinations?search=${query}`)
   const weatherPromise =  fetchJson(`http://localhost:3333/weathers?search=${query}`)
   const airportPromise =  fetchJson(`http://localhost:3333/airports?search=${query}`)


   const results = [destinationPromise, weatherPromise, airportPromise]

   console.log(results)


   const [destinationResults, weatherResults, airportResults] = await Promise.allSettled(results)
   console.log([destinationResults, weatherResults, airportResults])


   const data = {}

   if(destinationResults.status === 'rejected'){
    console.error('Errore nel fetch di destination, errore: ' , destinationResults.reason)
    data.city = null
    data.country = null
   }else{
    const destination = destinationResults.value[0]
        data.city = destination ? destination.name : null
        data.country = destination ? destination.country : null
   }

   if(weatherResults.status === 'rejected'){
    console.error('Errore nel fetch di weather, errore: ', weatherResults.reason)
    data.temperature = null
    data.weather = null
   }else {
    const weather = weatherResults.value[0]
    data.temperature = weather ? weather.temperature : null
    data.weather = weather ? weather.weather_description : null
   }

   if(airportResults.status === 'rejected'){
    console.error('Errore nel fetch di airports, errore: ', airportResults.reason)
    data.airport = null
   }else{
    const airport = airportResults.value[0]
    data.airport = airport ? airport.name : null
   }



   return data
}

getDashboardData('dubai')
    .then(data => {
        let frase = ""
        console.log('Dasboard data:', data);
        if(data.city  != null &&  data.country != null){
            frase += `${data.city} is in ${data.country}.\n`
        }
        if(data.temperature != null && data.weather != null){
            frase += `Today there are ${data.temperature} degrees and the weather is ${data.weather}.\n`
        }
        if(data.airport != null){
            frase += `The main airport is ${data.airport}.\n`
        }
        console.log(frase)
    })
    .catch(error => console.error(error));


 
/* getDashboardData('london')
    .then(data => {
        console.log('Dasboard data:', data);
        console.log(
            `${data.city} is in ${data.country}.\n` +
            `Today there are ${data.temperature} degrees and the weather is ${data.weather}.\n`+
            `The main airport is ${data.airport}.\n`
        );
    })
    .catch(error => console.error(error)); */