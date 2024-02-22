// The Esserializer code was copied and adapted from the original copyrighted work, MIT licensed, by cshao.
// All credit goes to him. See: https://www.npmjs.com/package/esserializer

class User {
  private idNum: string;
  private name: string;
  private readonly _location: { province: string|null; city: string|null };

  constructor(id: string, name: string) {
    this.idNum = id;
    this.name = name;

    this._location = {
      province: null,
      city: null
    };

    Object.defineProperties(this, {
      location: {
        enumerable: true,
        configurable: false,
        get: () => {
          return this._location.province + ' : ' + this._location.city;
        },
        set: (loc) => {
          const locArr = loc.split('_');
          this._location.province = locArr[0];
          this._location.city = locArr[1];
        }
      },
      displayName: {
        enumerable: true,
        configurable: false,
        value: this.idNum + '_' + this.name
      },
      displayObject: {
        enumerable: true,
        configurable: false,
        value: {
          identity: this.idNum,
          nickname: this.name
        }
      }
    });
  }
}

export default User;
