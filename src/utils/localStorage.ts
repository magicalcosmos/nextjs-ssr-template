import { LOGIN } from './dict';
class LocalStorage {
  /**
   * 设置 localstorage
   * @param kv
   */
  set(Obj: any) {
    window.localStorage.setItem(Obj.key, Obj.value);
  }
  /**
   * 根据key获取 localstorage
   * @param key
   */
  get(key: string): string {
    return window.localStorage.getItem(key) || '';
  }
  /**
   * 从localStorage里获取token 若URL带有access_token，则使用
   */
  getToken(): string {
    const params = new URLSearchParams(window.location.href.split('?')[1]);
    const access_token = params.get('access_token');
    if (access_token) {
      const tokenObject = {
        key: LOGIN.TOKEN,
        value: access_token.toString()
      };
      this.set(tokenObject);
    }
    return this.get(LOGIN.TOKEN);
  }
  remove(key: string): void {
    window.localStorage.removeItem(key);
  }
  /**
   * 同步从localStorage里获取token
   */
  getTokenSync(): any {
    var that = this;
    return new Promise((resolve, reject) => {
      const token = that.getToken();
      if (token || window.location.href.indexOf('/login') !== -1) {
        resolve(token);
      } else {
        reject(false);
      }
    });
  }
  /**
   * 从localStorage里获取lang
   */
  getLang(): string {
    return this.get(LOGIN.LANG.replace('_', '-'));
  }
}
const localStorage = new LocalStorage();
export default localStorage;
