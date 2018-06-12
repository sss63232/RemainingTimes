import '../css/options.css';
import App from './main/App';
import country_list from 'country-list';
import lifeData from './life.json';

// import Unsplash, { toJson } from 'unsplash-js';
// import UnsplashHandler from './main/UnsplashHandler';

// console.log(lifeData.filter(data => data.country === `Iceland`));

const countries = country_list();

let location;
navigator.geolocation.getCurrentPosition(data => {
  const { latitude, longitude } = data.coords;
  const latlng = `${latitude},${longitude}`;
  fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng}`)
    .then(res => res.json())
    .then(json => {
      const a = getCountry(json.results);
      console.log('--------');
      console.log(a);
      console.log('--------');
    });
});

//https://developers.google.com/maps/documentation/geocoding/intro?csw=1
function getCountry(results) {
  for (var i = 0; i < results[0].address_components.length; i++) {
    var shortname = results[0].address_components[i].short_name;
    var longname = results[0].address_components[i].long_name;
    var type = results[0].address_components[i].types;
    if (type.indexOf('country') != -1) {
      if (!isNullOrWhitespace(shortname)) {
        return shortname;
      } else {
        return longname;
      }
    }
  }
}

function isNullOrWhitespace(text) {
  if (text == null) {
    return true;
  }
  return text.replace(/\s/gi, '').length < 1;
}

// fetch(`http://ip-api.com/json`)
//   .then(data => data.json())
//   .then(json => {
//     console.log('--------');
//     console.log(json);
//     console.log('--------');
//   })
//   .catch(error => {
//     console.log('--------');
//     console.log(error);
//     console.log('--------');
//   });

// const unsplashInstance = new Unsplash({
//   applicationId: 'de67f1ba6f631670eedefff4c31bc09c840310d39a12d6785c1eb0f06fb7146f',
//   secret: '6e563cd7a8569dca86a605c7266e668d12c820a4568ca9eea254ff379df3004b',
//   callbackURL: 'urn:ietf:wg:oauth:2.0:oob',
// });

let innerW = window.innerWidth;
let innerH = window.innerHeight;

// unsplashInstance.photos
//   .getRandomPhoto({
//     width: innerW,
//     height: innerH,
//     query: `spring`,
//     featured: true,
//   })
//   .then(toJson)
//   .then(json => {
//     let style = document.getElementsByTagName('body')[0].style;
//     style.backgroundImage = `url('${json.urls.custom}')`;
//   });

const $ = document.getElementById.bind(document);
const $$ = document.querySelectorAll.bind(document);

window.app = new App($('app'));
