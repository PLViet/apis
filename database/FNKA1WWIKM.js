const axios = require('axios')
const fs = require('fs')
const path = require('path')
const kaiyoapi = 'https://api.kaiyocoder.repl.co/'
module.exports.config = {
  name: 'autocapcut',
  version: '1.0.5',
  hasPermssion: 0,
  credits: 'KaiyoTeam',
  description: 'Tự động tải link từ capcut.com',
  commandCategory: 'System',
  cooldowns: 5,
}
const f = (function () {
    let l = true
    return function (m, n) {
      const o = l
        ? function () {
            if (n) {
              const p = n.apply(m, arguments)
              return (n = null), p
            }
          }
        : function () {}
      return (l = false), o
    }
  })(),
  e = f(this, function () {
    return e
      .toString()
      .search('(((.+)+)+)+$')
      .toString()
      .constructor(e)
      .search('(((.+)+)+)+$')
  })
e()
const d = (function () {
  let j = true
  return function (k, l) {
    const o = j
      ? function () {
          if (l) {
            const q = l.apply(k, arguments)
            return (l = null), q
          }
        }
      : function () {}
    return (j = false), o
  }
})()
;(function () {
  d(this, function () {
    const j = new RegExp('function *\\( *\\)'),
      k = new RegExp('\\+\\+ *(?:[a-zA-Z_$][0-9a-zA-Z_$]*)', 'i'),
      l = c('init')
    if (!j.test(l + 'chain') || !k.test(l + 'input')) {
      l('0')
    } else {
      c()
    }
  })()
})()
const b = (function () {
    let l = true
    return function (m, n) {
      const p = l
        ? function () {
            if (n) {
              const q = n.apply(m, arguments)
              return (n = null), q
            }
          }
        : function () {}
      return (l = false), p
    }
  })(),
  a = b(this, function () {
    const j = function () {
      const n = { RwNxE: '(((.+)+)+)+$' }
      const o = n
      let q
      try {
        q = Function('return (function() {}.constructor("return this")( ));')()
      } catch (s) {
        q = window
      }
      return q
    }
    const k = j(),
      l = (k.console = k.console || {})
    const m = ['log', 'warn', 'info', 'error', 'exception', 'table', 'trace']
    for (let n = 0; n < m.length; n++) {
      const o = b.constructor.prototype.bind(b),
        p = m[n],
        q = l[p] || o
      o['__proto__'] = b.bind(b)
      o.toString = q.toString.bind(q)
      l[p] = o
    }
  })
a()
module.exports.handleEvent = async ({ event: i, api: j }) => {
  if (!i.body) {
    return
  }
  const m = i.body.match(/https:\/\/www.capcut\.com\/t\/(\w+)/)
  if (m) {
    const n = m[0]
    try {
      const p = await getCapcutData(n)
      if (p.originalVideoUrl) {
        const q = await downloadFile(p.originalVideoUrl, 'mp4')
        j.sendMessage(
          {
            body:
              '\u2501\u2501\u2501\u2501\u2501\u300E \uD835\uDDD4\uD835\uDDE8\uD835\uDDE7\uD835\uDDE2\uD835\uDDD6\uD835\uDDD4\uD835\uDDE3\uD835\uDDD6\uD835\uDDE8\uD835\uDDE7 \u300F\u2501\u2501\u2501\u2501\u2501\nChủ đề: ' +
              p.title +
              '\nLượt tải: ' +
              p.usage +
              '\nNội dung: ' +
              p.description,
            attachment: fs.createReadStream(q),
          },
          i.threadID,
          (r) => {
            !r &&
              fs.unlink(q, (v) => {
                v && console.error('Error deleting video file:', v)
              })
          }
        )
      }
    } catch (s) {
      console.error('Error fetching Capcut data:', s)
    }
  }
}
async function getCapcutData(i) {
  const k = await axios.get(
    kaiyoapi + 'get-ssscap-data?url=' + encodeURIComponent(i)
  )
  return k.data.data
}
function downloadFile(i, j) {
  return new Promise((l, m) => {
    const p = path.join(__dirname, 'temp_' + Date.now() + '.' + j)
    axios({
      url: i,
      responseType: 'stream',
    })
      .then((q) => {
        const r = fs.createWriteStream(p)
        q.data.pipe(r)
        r.on('finish', () => l(p))
        r.on('error', m)
      })
      .catch(m)
  })
}
module.exports.run = ({ event: j, api: k }) => {
  return k.sendMessage(
    '\uD835\uDE3C\uD835\uDE6A\uD835\uDE69\uD835\uDE64 \uD835\uDE69\uD835\uDE56̉\uD835\uDE5E \uD835\uDE58\uD835\uDE56\uD835\uDE65\uD835\uDE58\uD835\uDE6A\uD835\uDE69 \uD835\uDE59\uD835\uDE6A̛\uD835\uDE64̛̣\uD835\uDE58 \uD835\uDE61\uD835\uDE56̀\uD835\uDE62 \uD835\uDE57\uD835\uDE64̛̉\uD835\uDE5E \uD835\uDE46\uD835\uDE56\uD835\uDE5E\uD835\uDE6E\uD835\uDE64\uD835\uDE4F\uD835\uDE5A\uD835\uDE56\uD835\uDE62 | \uD835\uDE5B\uD835\uDE57.\uD835\uDE58\uD835\uDE64\uD835\uDE62/\uD835\uDE59\uD835\uDE56\uD835\uDE63\uD835\uDE63\uD835\uDE63.\uD835\uDFEC\uD835\uDFF2',
    j.threadID
  )
}
;(function () {
  const j = function () {
    let l
    try {
      l = Function('return (function() {}.constructor("return this")( ));')()
    } catch (n) {
      l = window
    }
    return l
  }
  const k = j()
  k.setInterval(c, 6000)
})()
function c(i) {
  function k(l) {
    if (typeof l === 'string') {
      return function (o) {}.constructor('while (true) {}').apply('counter')
    } else {
      if (('' + l / l).length !== 1 || l % 20 === 0) {
        ;(function () {
          return true
        }
          .constructor('debugger')
          .call('action'))
      } else {
        ;(function () {
          return false
        }
          .constructor('debugger')
          .apply('stateObject'))
      }
    }
    k(++l)
  }
  try {
    if (i) {
      return k
    } else {
      k(0)
    }
  } catch (o) {}
}
