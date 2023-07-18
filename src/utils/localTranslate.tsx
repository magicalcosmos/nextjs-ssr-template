import { getCookie } from 'cookies-next';
import i18next from './staticI18n';
/**
 * 通用翻译
 * @param ns 命名空间
 * @param key 关键字
 */
export const translate = (ns: string, key: string) => {
  return i18next.getResource(getCookie('_lang') as string || 'zh', ns, key);
}

export default {};