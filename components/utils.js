
// 数字格式化， 整数部分 4位一分， 小数部分维持现状
let numberForm = number => {
  if (typeof number !== 'number') {
    return number;
  }
  let result = '';
  let resourceNumber = number + '';
  if (resourceNumber.indexOf('.') > 0) {
    result = '.' + resourceNumber.split('.')[1];
  }
  number = Math.floor(number);
  while (number > 10000) {
    let strNumber = number + '';
    result =
      ',' + strNumber.substr(strNumber.length - 4, strNumber.length) + result;
    number = Math.floor(number / 10000);
  }
  result = number + result;
  return result;
};


// 字节转换
let renderSize = value => {
  if (!value) {
    return '0 Bytes';
  }
  let unitArr = ['Bytes', 'KB', 'MB', 'GB'];
  let index = 0;
  let srcsize = parseFloat(value);
  index = Math.floor(Math.log(srcsize) / Math.log(1024));
  let size = srcsize / Math.pow(1024, index);
  //  保留的小数位数
  size = size.toFixed(2);
  return size + unitArr[index];
};


/**
 * 对象转数组
 * @param {object} obj
 */
const objectEntries = obj => {
  const keys = Object.keys(obj);
  const arr = [];
  let index = 0;
  for (let propKey of keys) {
    arr.push([propKey, obj[propKey], index]);
    index += 1;
  }
  return arr;
};

/**
 * 日期时间格式化
 * @param {time object} date 时间对象
 * @param {string} type 转换时间类型 Y年M月D日W星期h时m分s秒， 默认YYYY-MM-DD hh:mm:ss
 */
const dateFormat = (date, type) => {
  if (!date) {
    // 如果传入的date为null 原路返回
    return null;
  } else {
    date = new Date(date);
  }
  if (!type) {
    type = 'YYYY-MM-DD hh:mm:ss';
  }
  let days = '日,一,二,三,四,五,六'.split(',');
  let module = {
    Y: date.getFullYear(),
    M: date.getMonth() + 1,
    D: date.getDate(),
    W: days[date.getDay()],
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds()
  };
  return type.replace(/(Y+|M+|D+|W+|h+|m+|s+)/g, function(str) {
    return ((str.length > 1 ? '0' : '') + module[str.slice(-1)]).slice(
      -str.length
    );
  });
};

/**
 * 获取当前环境等级ID
 */
const getHostLevel = () => {
  // 权限设定
  const hostLevel = {
    prod: 0,
    pre: 1,
    test: 2,
    test02: 2,
    dev: 3
  };
  const hostName =
    location.hostname === 'localhost'
      ? [0, 0, 'dev']
      : location.hostname.match(/(\w*)(pre|test)(\d*)\./);
  return hostLevel[hostName ? hostName[2] : 'prod'];
};
const emptyMethod = function() {};
// console兼容性
if (typeof window.console !== 'object') {
  for (let item of 'log,info,warn,error'.split()) {
    window.console[item] = emptyMethod;
  }
}
const hostLevel = getHostLevel();

/**
 * 日志管理
 */
const debug = {
  // 开发&测试可见
  log: hostLevel > 1 ? console.log.bind(console) : emptyMethod,
  // 开发&测试可见
  info: hostLevel > 1 ? console.info.bind(console) : emptyMethod,
  // 开发&测试&预生产可见
  warn: hostLevel >= 1 ? console.warn.bind(console) : emptyMethod,
  // 所有环境可见
  error: hostLevel >= 0 ? console.error.bind(console) : emptyMethod
};

/**
 * 获取全角字符串长度
 * @param {string} str
 */
const getCharLen = str => {
  const charAngle = /[^\x00-\x80]/g;
  if (!str || typeof str !== 'string') {
    return false;
  }
  return str.length + (charAngle.test(str) && str.match(charAngle).length);
};

/**
 * 字符串截取
 * @str string 必须 需要截取的字符串
 * @len number 必须 需要截取的字符串长度值
 * @suffix string 可选 截取后的字符串需要添加的后缀
 * @return string || false
 */
const truncate = function(str, len, suffix) {
  if (typeof str !== 'string' && typeof str === 'object' && 'str' in str) {
    len = str.len;
    suffix = str.suffix;
    str = str.str;
  }
  if (!str || typeof str !== 'string') {
    return false;
  }
  if (!len || typeof len !== 'number') {
    return str;
  }
  let strLen = getCharLen(str);
  let newStr = '';
  let newStrLen = 0;
  let i = 0;
  let chars;
  if (strLen > len) {
    for (; i < strLen; i += 1) {
      chars = str.charAt(i);
      newStrLen = getCharLen(newStr + chars);
      if (newStrLen > len) {
        break;
      }
      newStr += chars;
    }
  } else {
    return str;
  }
  return newStr + (suffix || '');
};

const calcPercent = (count, total) => {
  if (!count || count === '0') {
    count = 0;
  }
  if (!total || total === '0') {
    total = 0;
  }
  if (!count && !total) {
    return '0%';
  }
  return Math.round((count / total) * 10000) / 100 + '%';
};

const isNonnegativeInteger = num => {
  const r = /^\d+$/;
  return r.test(num);
};

// 判断浏览区是否支持canvas
const isSupportCanvas = function() {
  const elem = document.createElement('canvas');
  return !!(elem.getContext && elem.getContext('2d'));
};


/**
 * 格式化下拉数据
 * @param arry
 */
function formatData(data) {
  let list = [];
  data.map(item => {
    list.push({
      label: item.value,
      value: item.key
    });
  });
  return list;
}

/**
 * 深拷贝
 * @param arry
 */
const clone = obj => {
  let o;
  if (typeof obj === 'object') {
    if (obj === null) {
      o = null;
    } else {
      if (obj instanceof Array) {
        o = [];
        for (let i = 0, len = obj.length; i < len; i++) {
          o.push(clone(obj[i]));
        }
      } else {
        o = {};
        for (let j in obj) {
          o[j] = clone(obj[j]);
        }
      }
    }
  } else {
    o = obj;
  }
  return o;
};

export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result;

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function(..._args) {
    context = this;
    args = _args; // fix: 参数丢失
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}
function dayTimeFormat(fmt, date) {
  var o = {
    'M+': date.getMonth() + 1, //月份
    'd+': date.getDate(), //日
    'h+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      );
  return fmt;
}

export { numberForm, renderSize };
export default {
  objectEntries,
  dateFormat,
  getCharLen,
  truncate,
  calcPercent,
  isNonnegativeInteger,
  isSupportCanvas,
  formatData,
  clone,
  dayTimeFormat
};
