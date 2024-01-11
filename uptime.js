uptime()
const axios = require('axios')
function uptime() {
  setInterval(async () => {
    axios.get("https://xuantruongdev.id.vn")
  }, 1 * 1000 * 5)
}
