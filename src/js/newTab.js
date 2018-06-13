import View from './newTab/View';
import dayjs from 'dayjs';
import country_list from 'country-list';
import countryByLifeExpectancy from '../../lifeData/country-by-life-expectancy.json';
import { $ } from '../js/helpers/helper';
import Model from './newTab/Model';

// import Unsplash, { toJson } from 'unsplash-js';
// import UnsplashHandler from './main/UnsplashHandler';

const view = new View();
const model = new Model();
class App {
  constructor($el) {
    this.$el = $el;

    // model
    //   .getSyncStorageByKeys([`country`, `birth`])
    //   .then(data => {
    //     const { country, birth } = data;
    //     if (country && birth) {
    //       this.country = country;
    //       this.birth = birth;
    //       this.showTimePage();
    //     } else {
    //       this.showCountryPage();
    //     }
    //   });

    this.showCountryPage();
  }

  showBirthPage() {
    view.renderTemplate('birth');
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
      model.setSyncStorage({ birth: birthInputValue });
      this.showTimePage();
    }
  }

  showTimePage() {
    view.renderTemplate(`time`, {
      country: this.country,
      birth: this.birth,
    });
  }

  showCountryPage() {
    this.getCountryByAPI();
    view.renderTemplate('country');
    this.elem_detectedCountry = $('detectedCountry');
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
    model
      .setSyncStorage({ country: this.country })
      .then(() => {
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
    view.renderTemplate('pickCountry', {
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
    model
      .setSyncStorage({ country: countrySelectValue })
      .then(() => {
        console.log('--------');
        console.log(`set country ${countrySelectValue}`);
        console.log('--------');
      });
    this.showBirthPage();
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
}

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
