export default class Model {
  constructor() {}

  setSyncStorage(obj_value) {
    return new Promise((res, rej) =>
      chrome.storage.sync.set(obj_value, () => res())
    );
  }

  getSyncStorageByKey(key, callback) {
    chrome.storage.sync.get(key, callback);
  }

  getSyncStorageByKeys(Array_keys) {
    return new Promise((res, rej) => {
      chrome.storage.sync.get(Array_keys, data => {
        res(data);
      });
    });
  }
}
