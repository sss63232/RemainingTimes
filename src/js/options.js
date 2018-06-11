import '../css/options.css';
import App from './main/App';
import Handlebars from './3rd/handlebars';
import Unsplash, { toJson } from 'unsplash-js';
// import UnsplashHandler from './main/UnsplashHandler';

const unsplashInstance = new Unsplash({
  applicationId:
    'de67f1ba6f631670eedefff4c31bc09c840310d39a12d6785c1eb0f06fb7146f',
  secret: '6e563cd7a8569dca86a605c7266e668d12c820a4568ca9eea254ff379df3004b',
  callbackURL: 'urn:ietf:wg:oauth:2.0:oob',
});

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
