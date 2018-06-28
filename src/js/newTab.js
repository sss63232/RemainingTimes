import 'normalize.css';
import '../css/newTab.scss';
import config from './helpers/config.js';
import View from './newTab/View';
import countryByLifeExpectancy from '../../lifeData/country-by-life-expectancy.json';
import { getId, getClass } from '../js/helpers/helper';

import Model from './newTab/Model';
import constData from '../js/helpers/constData';

// import Unsplash, { toJson } from 'unsplash-js';
// import UnsplashHandler from './main/UnsplashHandler';

const view = new View();
const model = new Model();
class App {
  constructor(elem) {
    this.elem = elem;

    // this.showBirthPage();
    // this.showDetectedCountryPage();
    // this.showPickCountryPage();

    if (config.cleanStart) {
      model.clearSyncStorage().then(() => {
        this.start();
      });
    } else {
      this.start();
    }
  }

  start() {
    model
      .getSyncStorageByKeys([`country`, `birth`])
      .then(syncData => {
        console.log('---------');
        console.log(syncData);
        console.log('---------');
        const { country, birth } = syncData;
        if (country && birth) {
          this.country = country;
          this.birth = birth;
          this.showFinalPage();
        } else {
          this.showDetectedCountryPage();
        }
      });
  }

  /**
   * 用來對有 id 的 Element addEventListener 用的，
   * lister 固定名稱是 `on_${eventType}_${id}`
   *
   * @param {string} id
   * @param {string} eventType
   * @memberof App
   */
  listenId(id, eventType) {
    getId(id).addEventListener(
      eventType,
      this[`on_${eventType}_${id}`].bind(this)
    );
  }

  listenClass(className, eventType) {
    [...getClass].addEventListener(
      eventType,
      this[`on_${eventType}_${className}`].bind(this)
    );
  }

  showFinalPage() {
    const lifeExpectancy = countryByLifeExpectancy.find(
      elem => elem.country === this.country
    ).expectancy;
    const oneYearMS = 365 * 24 * 60 * 60 * 1000;
    const ts_birth = new Date(this.birth).getTime();
    const ts_death = ts_birth + lifeExpectancy * oneYearMS;

    const updateRestOfMyLife = () => {
      const ts_now = new Date().getTime();
      const remainingMS = ts_death - ts_now;
      let remainingYearsSplit = (remainingMS / oneYearMS)
        .toFixed(8)
        .split(`.`);

      const remainingPercent = (
        (remainingMS / (ts_death - ts_birth)) *
        100
      ).toFixed(8);

      view.renderTemplate(`final`, {
        integer: remainingYearsSplit[0],
        fraction: remainingYearsSplit[1],
        remainingPercent,
      });

      // requestAnimationFrame(updateRestOfMyLife);
    };

    requestAnimationFrame(updateRestOfMyLife);
  }

  showBirthPage() {
    view.renderTemplate('birth', {});

    this.listenId(`submitBirth`, `click`);

    const titles = getClass('title');
    [...titles].forEach(title =>
      title.addEventListener('click', e => {
        const type = e.currentTarget.dataset.dropType;
        view.renderModal({
          modalTitle: type,
          list: constData.list[type],
        });
        const dropList = getClass('dropList')[0];
        dropList.addEventListener('click', e => {
          getId('modal').classList.add('hide');
          const value = e.target.textContent;
          const dropType = e.currentTarget.dataset.dropType;
          this[dropType] = value;
          title.textContent = value;
          title.dataset.dateValue = value;
        });
      })
    );
  }

  on_click_submitBirth(e) {
    e.preventDefault();

    // TODO: 生日沒有輸入的檢查
    const dropValueObj = {};

    [...getClass(`title`)].forEach(title => {
      const dropType = title.dataset.dropType;
      const dateValue = title.dataset.dateValue;
      if (dateValue === undefined) {
        alert('no value');
      } else {
        const isTypeMonth = dropType === `month`;
        dropValueObj[dropType] = isTypeMonth
          ? constData.list.month.findIndex(
              elem => elem === dateValue
            ) + 1
          : dateValue;
      }
    });

    const { year, month, day } = dropValueObj;
    const birthdayValue = `${year}/${month}/${day}`;
    if (birthdayValue) {
      this.birth = birthdayValue;
      model
        .setSyncStorage({
          birth: birthdayValue,
        })
        .then(() => {
          console.log('---------');
          console.log(`set ${birthdayValue} success`);
          console.log('---------');
        });
      this.showFinalPage();
    }
  }

  showDetectedCountryPage() {
    this.getCountryByAPI();
    view.renderTemplate('country');
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
    getId(`detectedCountry`).textContent = countryName;

    this.listenId(`detectedCountryYes`, `click`);
    this.listenId(`detectedCountryNo`, `click`);
  }

  on_click_detectedCountryYes(e) {
    e.preventDefault();
    model
      .setSyncStorage({
        country: this.country,
      })
      .then(() => {
        console.log('---------');
        console.log(`setgetId{this.country} success`);
        console.log('---------');
        this.showBirthPage();
      });
  }

  on_click_detectedCountryNo(e) {
    e.preventDefault();
    this.showPickCountryPage();
  }

  showPickCountryPage() {
    const countries = countryByLifeExpectancy
      .map(elem => elem.country)
      .sort();
    view.renderTemplate('pickCountry', {});
    this.listenId(`submitCountry`, `click`);

    const titles = getClass('title');
    [...titles].forEach(title =>
      title.addEventListener('click', e => {
        const type = e.currentTarget.dataset.dropType;
        view.renderModal({
          modalTitle: type,
          list: countries,
        });
        const dropList = getClass('dropList')[0];
        dropList.addEventListener('click', e => {
          getId('modal').classList.add('hide');
          const value = e.target.textContent;
          const dropType = e.currentTarget.dataset.dropType;
          this[dropType] = value;
          title.textContent = value;
          title.dataset.dateValue = value;
        });
      })
    );
  }

  on_click_submitCountry(e) {
    e.preventDefault();

    // TODO: 國家沒有輸入的檢查
    const dropValueObj = (() => {
      let obj = {};
      [...getClass(`title`)].forEach(title => {
        const dropType = title.dataset.dropType;
        const dateValue = title.dataset.dateValue;
        obj[dropType] = dateValue;
      });
      return obj;
    })();
    console.log('---------');
    console.log(dropValueObj);
    console.log('---------');

    const countrySelectValue = dropValueObj.country;
    this.country = countrySelectValue;
    model
      .setSyncStorage({
        country: countrySelectValue,
      })
      .then(() => {
        console.log('--------');
        console.log(`set countrygetId{countrySelectValue}`);
        console.log('--------');
      });
    this.showBirthPage();
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

window.app = new App(getId('app'));
