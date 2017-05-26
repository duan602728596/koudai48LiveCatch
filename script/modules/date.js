/* 时间戳转换 */
const buwei = number => number < 10 ? `0${ number }` : `${ number }`;

function date(time) {
  const date = time ? new Date(time) : new Date();    //获取一个时间对象

  const _1 = date.getFullYear();  // 获取完整的年份(4位,1970)
  const _2 = date.getMonth();     // 获取月份(0-11,0代表1月,用的时候记得加上1)
  const _3 = date.getDate();      // 获取日(1-31)
  const _4 = date.getTime();      // 获取时间(从1970.1.1开始的毫秒数)
  const _5 = date.getHours();     // 获取小时数(0-23)
  const _6 = date.getMinutes();   // 获取分钟数(0-59)
  const _7 = date.getSeconds();   // 获取秒数(0-59)

  return `${ buwei(_1) }-${ buwei(_2 + 1) }-${ buwei(_3) }_${ buwei(_5) }:${ buwei(_6) }:${ buwei(_7) }`;
}

module.exports = date;