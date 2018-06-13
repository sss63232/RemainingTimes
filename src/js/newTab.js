import Handlebars from './3rd/handlebars';
// import Handlebars from 'handlebars';

import dayjs from 'dayjs';
import country_list from 'country-list';
import lifeData from './life.json';
import countryByLifeExpectancy from '../../lifeData/country-by-life-expectancy.json';

// import Unsplash, { toJson } from 'unsplash-js';
// import UnsplashHandler from './main/UnsplashHandler';
console.log('--------');
console.log(Handlebars);
console.log('--------');
const $ = document.getElementById.bind(document);
const $$ = document.querySelectorAll.bind(document);

class App {
  constructor($el) {
    this.$el = $el;

    this.load();

    if (this.country) {
      this.renderAgeLoop();
    } else {
      this.showCountryPage();
    }
  }

  load() {
    const { dateOfBirth, country } = localStorage;
    if (dateOfBirth && country) {
      this.country = country;
      this.birth = new Date(parseInt(dateOfBirth));
    }
  }

  save() {
    if (this.birth)
      localStorage.dateOfBirth = this.birth.getTime();
  }

  submit(e) {
    e.preventDefault();

    var input = this.$$('input')[0];
    if (!input.valueAsDate) return;

    this.birth = input.valueAsDate;
    this.save();
    this.renderAgeLoop();
  }

  showBirthPage() {
    this.render('birth');
    $(`submitBirth`).addEventListener(
      `click`,
      this.procSubmitBirth.bind(this)
    );

    // for test
    $(`birthInput`).value = `1993-01-01`;
  }

  procSubmitBirth(e) {
    e.preventDefault();

    const birthInputValue = $(`birthInput`).value;
    if (birthInputValue) {
      this.birth = birthInputValue;
      this.setChromeSync({ birth: birthInputValue }, () => {
        console.log('---------');
        console.log(`set ${birthInputValue} success`);
        console.log('---------');
      });
      this.showTimePage();
    }
  }

  showTimePage() {
    this.render(`time`, {
      country: this.country,
      birth: this.birth,
    });
  }

  showCountryPage() {
    this.getCountryByAPI();
    this.render('country');
    this.elem_detectedCountry = $('detectedCountry');
  }

  render(templateName, data) {
    this.html(this.view(templateName)(data));
  }

  showDetectedCountryText(countryName) {
    this.country = countryName;
    this.elem_detectedCountry.textContent = countryName;
    $(`country-yes`).addEventListener(
      `click`,
      this.procCountryYes.bind(this)
    );
    $(`country-no`).addEventListener(
      `click`,
      this.procCountryNo.bind(this)
    );
  }

  procCountryYes(e) {
    e.preventDefault();
    this.setChromeSync({ country: this.country }, () => {
      console.log('---------');
      console.log(`set ${this.country} success`);
      console.log('---------');
      this.showBirthPage();
    });
  }

  procCountryNo(e) {
    e.preventDefault();
    this.showPickCountryPage();
  }

  showPickCountryPage() {
    this.render('pickCountry', {
      countries: countryByLifeExpectancy
        .map(elem => elem.country)
        .sort(),
    });
    $(`submitCountry`).addEventListener(
      `click`,
      this.procSubmitCountry.bind(this)
    );
  }

  procSubmitCountry(e) {
    e.preventDefault();
    const countrySelectValue = $(`countrySelect`).value;
    this.country = countrySelectValue;
    this.setChromeSync({ countrySelectValue }, () => {
      console.log('--------');
      console.log(`set country ${countrySelectValue}`);
      console.log('--------');
    });
    this.showBirthPage();
  }

  setChromeSync(value, callback) {
    chrome.storage.sync.set(value, callback);
  }

  getChromeSync(key, callback) {
    chrome.storage.sync.get(key, callback);
  }

  getCountryByNavigator() {
    navigator.geolocation.getCurrentPosition(data => {
      const { latitude, longitude } = data.coords;
      const latlng = `${latitude},${longitude}`;
      fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng}`
      )
        .then(res => res.json())
        .then(json => {
          const results = json.results;
          const countryLongName =
            results[results.length - 1].formatted_address;
          this.showDetectedCountryText(countryLongName);
        })
        .catch(error => {
          console.log('--------');
          console.log(
            `getCountryByNavigator() error`,
            error
          );
          console.log('--------');
          this.showPickCountryPage();
        });
    });
  }

  getCountryByAPI() {
    fetch(`http://ip-api.com/json`)
      .then(data => data.json())
      .then(json => {
        this.showDetectedCountryText(json.country);
      })
      .catch(error => {
        console.log('---------');
        console.log(`getCountryByAPI() error`, error);
        console.log('---------');
        this.getCountryByNavigator();
      });
  }

  renderAgeLoop() {
    this.interval = setInterval(
      this.renderAge.bind(this),
      100
    );
  }

  renderAge() {
    var now = new Date();
    var duration = now - this.birth;
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
