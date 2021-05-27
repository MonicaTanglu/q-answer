// 格式化时间
const formatTime = (date, splitString = '/') => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return (
    [year, month, day].map(formatDay).join(splitString) +
    ' ' + [hour, minute, second].map(formatDay).join(':')
  );
};

const trim = (v) => {
  v = v.toString()
  return v.replace(/\s+/g, '')
}
// 格式化数字
const formatDay = (n) => {
  n = n.toString();
  return n[1] ? n : '0' + n;
};

// 分割日期
const splitDate = (date, splitString = '-') => {
  let arr = date.split(splitString);
  let year = Number(arr[0]),
    month = Number(arr[1]),
    day = Number(arr[2]);
  return {
    year,
    month,
    day,
  };
};



const getCurrentUser = () => wx.getStorageSync('user');

const getCurrentToken = () =>
  (getCurrentUser() || {}).token || wx.getStorageSync('token');

const REGEXP = /^1\d{10}$/;

// 判断是否为手机号码
const isMobilePhoneNumber = (number) => {
  return REGEXP.test(number);
};
const isIdCard = (value) => {
  return /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value)
}

/**
 * 防抖函数，返回函数连续调用时，空闲时间必须大于或等于 `wait`，`func` 才会执行
 *
 * @param {function} func  回调函数
 * @param {number} wait  间隔的时间
 * @param {boolean} immediate  是否立即调用函数
 * @return {function}  返回调用函数
 */
const debounce = (func, wait = 500, immediate = true) => {
  let timer, context, args;

  // 延迟执行函数
  const later = () =>
    setTimeout(() => {
      timer = null;
      if (!immediate) {
        func.apply(context, args);
        context = args = null;
      }
    }, wait);

  return function (...params) {
    if (!timer) {
      timer = later();
      // 如果是立即执行，调用函数；否则缓存参数和调用上下文
      if (immediate) {
        func.apply(this, params);
      } else {
        context = this;
        args = params;
      }
    } else {
      clearTimeout(timer);
      timer = later();
    }
  };
};

module.exports = {
  getCurrentUser,
  getCurrentToken,
  formatTime,
  splitDate,
  formatDay,
  isMobilePhoneNumber,
  debounce,
  isIdCard,
  trim
};