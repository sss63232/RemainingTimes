// import Unsplash, { toJson } from 'unsplash-js';

export default class UnsplashHandler {
  constructor() {}

  static unsplashInstance;
  static randomPhotos;

  static createInstance() {
    this.unsplashInstance = new Unsplash({
      applicationId: 'de67f1ba6f631670eedefff4c31bc09c840310d39a12d6785c1eb0f06fb7146f',
      secret: '6e563cd7a8569dca86a605c7266e668d12c820a4568ca9eea254ff379df3004b',
      callbackURL: 'urn:ietf:wg:oauth:2.0:oob',
    });
  }

  static getRandomPhoto() {
    if (!this.unsplashInstance) {
      this.createInstance();
    }

    return new Promise((res, rej) => {
      this.unsplashInstance.photos
        .getRandomPhoto()
        .then(toJson)
        .then(json => {
          this.randomPhotos = json;
          res();
        })
        .catch(reason => rej(reason));
    });
  }

  static getRandomPhotoUrlBySize(size) {
    return this.randomPhotos.urls[size];
  }
}
