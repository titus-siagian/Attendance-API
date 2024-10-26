export default class Helper {
  static convertTime(time: number): string {
    const hours = ('0' + Math.floor(time / 60)).slice(-2);
    const minute = ('0' + (time % 60)).slice(-2);
    return `${hours}:${minute}`;
  }

  static makeRandChar(length: number): string {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  static convertProblem(data: string): string {
    const problems = [
      {
        state: 'A1',
        text: 'Handphone Bermasalah',
      },
      {
        state: 'A2',
        text: 'Tidak bisa login',
      },
      {
        state: 'A3',
        text: 'Aplikasi Bermasalah',
      },
      {
        state: 'A4',
        text: 'Lupa Clock In/Out',
      },
      {
        state: 'A5',
        text: 'Hari Libur/Cuti/Sakit',
      },
      {
        state: 'A6',
        text: 'Ganti Jadwal',
      },
    ];

    const find = problems.find((x) => x.state == data);

    return find ? find.text : '';
  }

  static setWithExpiry(key: string, value: string, ttl: number): void {
    const now = new Date();

    // `item` is an object which contains the original value
    // as well as the time when it's supposed to expire
    const item = {
      value: value,
      expiry: now.getTime() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
  }

  static getWithExpiry(key: string): string | null {
    const itemStr = localStorage.getItem(key);
    // if the item doesn't exist, return null
    if (!itemStr) {
      return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date();
    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
      // If the item is expired, delete the item from storage
      // and return null
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  }
}
