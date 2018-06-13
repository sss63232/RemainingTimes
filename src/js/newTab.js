import Handlebars from './3rd/handlebars';
import country_list from 'country-list';
import lifeData from './life.json';

// import Unsplash, { toJson } from 'unsplash-js';
// import UnsplashHandler from './main/UnsplashHandler';

const $ = document.getElementById.bind(document);
const $$ = document.querySelectorAll.bind(document);
class App {
  constructor($el) {
    this.$el = $el;
    this.load();

    // this.$el.addEventListener(
    //   `submit`,
    //   this.submit.bind(this)
    // );

    if (this.country) {
      this.renderAgeLoop();
    } else {
      this.renderCountry();
    }
  }

  load() {
    const { dateOfBirth, country } = localStorage;
    if (dateOfBirth && country) {
      this.country = country;
      this.dateOfBirth = new Date(parseInt(dateOfBirth));
    }
  }

  save() {
    if (this.dateOfBirth)
      localStorage.dateOfBirth = this.dateOfBirth.getTime();
  }

  setChromeSync(value, callback) {
    chrome.storage.sync.set(value, callback);
  }

  getChromeSync()

  submit(e) {
    e.preventDefault();

    var input = this.$$('input')[0];
    if (!input.valueAsDate) return;

    this.dateOfBirth = input.valueAsDate;
    this.save();
    this.renderAgeLoop();
  }

  renderChoose() {
    this.html(this.view('dob')());
  }

  renderCountry() {
    this.html(this.view('country')());
    this.elem_detectedCountry = $('detectedCountry');
    this.getCountryByAPI();
  }

  showDetectedCountry(countryName) {
    this.country = countryName;
    this.elem_detectedCountry.textContent = countryName;
    $(`country-yes`).addEventListener(
      `click`,
      this.procCountryYes
    );
    $(`country-no`).addEventListener(
      `click`,
      this.procCountryNo
    );
  }

  procCountryYes(e) {
    e.preventDefault();
    console.log('--------');
    console.log(e);
    console.log('--------');
  }

  procCountryNo(e) {
    e.preventDefault();
    console.log('--------');
    console.log(e);
    console.log('--------');
  }

  getCountryByNavigator() {
    navigator.geolocation.getCurrentPosition(data => {
      const { latitude, longitude } = data.coords;
      let latlng = `${latitude},${longitude}`;
      fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng}`
      )
        .then(res => res.json())
        .then(json => {
          const results = json.results;
          const countryLongName =
            results[results.length - 1].formatted_address;
          this.showDetectedCountry(countryLongName);
        });
    });
  }

  getCountryByAPI() {
    fetch(`http://ip-api.com/json`)
      .then(data => data.json())
      .then(json => {
        this.showDetectedCountry(json.country);
      })
      .catch(error => {
        console.log('---------');
        console.log(error);
        console.log('---------');
        this.getCountryByNavigator();
      });
  }

  replaceTextContent(element, txt) {
    element.textContent = txt;
  }

  renderAgeLoop() {
    this.interval = setInterval(
      this.renderAge.bind(this),
      100
    );
  }

  renderAge() {
    var now = new Date();
    var duration = now - this.dateOfBirth;
    var years = duration / 31556900000;

    var majorMinor = years
      .toFixed(9)
      .toString()
      .split('.');

    requestAnimationFrame(
      function() {
        this.html(
          this.view('age')({
            year: majorMinor[0],
            milliseconds: majorMinor[1],
          })
        );
      }.bind(this)
    );
  }

  $$(sel) {
    return this.$el.querySelectorAll(sel);
  }

  html(html) {
    this.$el.innerHTML = html;
  }

  view(name) {
    var $ = document.getElementById.bind(document);
    var $el = $(name + '-template');
    return Handlebars.compile($el.innerHTML);
  }
}

// const countries = country_list();
// console.log(lifeData.filter(data => data.country === `Iceland`));

let location;

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

window.app = new App($('app'));
