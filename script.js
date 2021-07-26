
const form = document.getElementById('form')
const errorSpan = document.getElementById('error')
const addressOutput = document.getElementById('ip-address')
const locationOutput = document.getElementById('location')
const timezoneOutput = document.getElementById('timezone')
const ispOutput = document.getElementById('isp')
const API_KEY = 'at_v5Ufra0qW5czbJti9FnNFGk6kvbgX'
const API_URL = `https://geo.ipify.org/api/v1`
const URL = `${API_URL}?apiKey=${API_KEY}`

let map = L.map('map', {
    center: [0, 0],
    zoom: 13,
    zoomControl: false
})

form.addEventListener('submit', (e) => {
    e.preventDefault()
    let inputVal = form[0].value
    errorSpan.classList.remove('show')
    checkInput(inputVal)
})

const getData = async (url) => {
    try {
        const res = await fetch(url)
        const data = await res.json()
        if (res.status === 200 && data) {
            showData(data)
        } else {
            errorHandle()
        }
        
    } catch (error) {
        errorHandle()
    }
    
}
document.addEventListener('load', getData(URL))

const showData = (data) => {
    let latRes = data.location.lat
    let lngRes = data.location.lng
    let cityRes = data.location.city || 'Unknown'
    let regionRes = data.location.region || data.location.country
    let postalRes = data.location.postalCode || data.location.country
    let location = [cityRes, regionRes, postalRes]
    addressOutput.innerText = data.ip
    locationOutput.innerText = location.join(',')
    timezoneOutput.innerText = 'UTC ' + data.location.timezone
    ispOutput.innerText = data.isp

    mapInit(latRes, lngRes)
}
function mapInit(lat, lng) {
    map.setView(L.latLng(lat, lng))
    let marker = L.icon({
        iconUrl: './images/icon-location.svg',
        iconSize: [46, 56]
    });

    L.marker([lat, lng], {icon: marker}).addTo(map);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
}

function checkInput(inp) {
    let regIp = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(\.(?!$)|$)){4}$/
    let regDomain = /\b((?=[a-z0-9-]{1,63}\.)(xn--)?[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,63}\b/

    if(inp.match(regIp)) {
        const URL_CUSTOM_IP = `${API_URL}?apiKey=${API_KEY}&ipAddress=${inp}`
        getData(URL_CUSTOM_IP)
    } else if(inp.match(regDomain)) {
        const URL_CUSTOM_DOMAIN = `${API_URL}?apiKey=${API_KEY}&domain=${inp}`
        getData(URL_CUSTOM_DOMAIN)
    } else if(inp === ''){
        getData(URL)
    } else {
        errorSpan.classList.add('show')
        getData(URL)
    }
}

function errorHandle() {
    let errorMessage = 'No Data'
    addressOutput.innerText = errorMessage
    locationOutput.innerText = errorMessage
    timezoneOutput.innerText = errorMessage
    ispOutput.innerText = errorMessage
    errorSpan.classList.add('show')
    mapInit(0, 0)
}