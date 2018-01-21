const Aequirys = require('aequirys')

Qyllium = window.Qyllium || {}
Qyllium.time = {

  /**
   * Convert hexadecimal to decimal
   * @param {string} s - Hexadecimal string
   * @returns {number} Decimal conversion
   */
  parse(s) {
    return parseInt(s, 16)
  },

  /**
   * Convert to hexadecimal format
   * @param {number} t - Unix time
   */
  toHex(t) {
    return (new Date(t.getFullYear(), t.getMonth(), t.getDate(), t.getHours(), t.getMinutes(), t.getSeconds()).getTime() / 1E3).toString(16)
  },

  /**
   * Convert Unix time
   * @param {number} t - Unix time
   * @returns {Object} Date
   */
  convert(t) {
    return new Date(t * 1E3)
  },

  /**
   * Convert Unix time into a timestamp
   * @param {number} t - Unix time
   * @returns {string} Timestamp
   */
  stamp(t) {
    const d = Qyllium.time.convert(t)
    const f = Qyllium.config.system.timeFormat

    if (f === '24') {
      const h = `0${d.getHours()}`
      const m = `0${d.getMinutes()}`
      const s = `0${d.getSeconds()}`

      return `${h.substr(-2)}:${m.substr(-2)}:${s.substr(-2)}`
    } else if (f === '12') {
      return Qyllium.time.twelveHours(d)
    }
  },

  /**
   * Convert to 12-hour time
   * @param {Object} d - Date and time
   * @returns {string} 12-hour format
   */
  twelveHours(d) {
    let h = d.getHours()
    let m = d.getMinutes()
    let s = d.getSeconds()
    const x = h >= 12 ? 'PM' : 'AM'

    h = h % 12
    h = h ? h : 12
    h = (`0${h}`).slice(-2)
    m = (`0${m}`).slice(-2)
    s = (`0${s}`).slice(-2)

    return `${h}:${m}:${s} ${x}`
  },

  /**
   * Convert Unix time into date
   * @param {number} t - Unix time
   * @returns {string} year, month, day
   */
  date(t) {
    const a = Qyllium.time.convert(t)
    return `${a.getFullYear()}${a.getMonth()}${a.getDate()}`
  },

  /**
   * Display a date
   * @param {number} t - Unix time
   */
  displayDate(t) {
    const a = Qyllium.time.convert(t)
    const f = Qyllium.config.system.calendar

    if (f === 'gregorian') {
      return `${a.getFullYear()} ${a.getMonth() + 1} ${a.getDate()}`
    } else if (f === 'aequirys') {
      return Aequirys.display(Aequirys.convert(a))
    }
  },

  /**
   * Calculate elapsed time
   * @param {number} t - Unix time
   * @returns {string} Elapsed time
   */
  timeago(t) {
    const m = Math.abs(Math.floor((((new Date()) - t) / 1E3) / 60))
    if (m === 0) return 'less than a minute ago'
    if (m === 1) return 'a minute ago'
    if (m < 59) return `${m} minutes ago`
    if (m < 1440) return `${Math.floor(m / 60)} hours ago`
    if (m < 2880) return 'yesterday'
    if (m < 86400) return `${Math.floor(m / 1440)} days ago`
    if (m < 1051199) return `${Math.floor(m / 43200)} months ago`
    return `over ${Math.floor(m / 525960)} years ago`
  },

  /**
   * List dates
   * @param {Object} start - Start date
   * @param {Object} end - End date
   * @returns {Object[]} List of dates
   */
  listDates(start, end) {
    Date.prototype.addDays = function(days) {
      let date = new Date(this.valueOf())
      date.setDate(date.getDate() + days)
      return date
    }

    const interval = 1
    let list = []
    let current = new Date(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0)

    while (current <= end) {
      list.push(new Date(current))
      current = Date.prototype.addDays.call(current, 1)
    }

     return list
  },

  /**
   * Parse date and time
   * @param {string} string - Input string
   * @returns {Object} Date and time
   */
  parseDateTime(string) {
    Date.prototype.addDays = function(days) {
      const date = new Date(this.valueOf())
      date.setDate(date.getDate() + days)
      return date
    }

    const str = string.split(' ')
    const daysFull = 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(' ')
    const daysAbb = 'Sun Mon Tue Wed Thu Fri Sat'.split(' ')
    let date = new Date()
    let datetime

    let checkForTime = _ => {
      for (let i = 0, l = str.length; i < l; i++) {
        if (str[i].includes(':')) {
          return str[i]
        }
      }
    }

    let checkForDay = _ => {
      for (let i = 0, l = str.length; i < l; i++) {
        if (daysFull.includes(str[i]) || daysAbb.includes(str[i])) {
          return str[i]
        }
      }
    }

    let dayIndex = checkForDay()
    let time = checkForTime()

    if (dayIndex !== undefined) {
      let index = daysFull.includes(dayIndex) ? daysFull.indexOf(dayIndex) : daysAbb.indexOf(dayIndex)

      if (string.split(' ')[index - 1] === 'next') index += 7

      date = new Date(Date.parse(Date.prototype.addDays.call(new Date(), Math.abs(new Date().getDay() - index))))
    } else {
      if (string.includes('today')) {
        date = new Date()
      } else if (string.includes('tomorrow')) {
        date = new Date(Date.parse(Date.prototype.addDays.call(new Date(), 1)))
        time = checkForTime()
      } else {
        return Qyllium.time.toHex(new Date(Date.parse(string)))
      }
    }

    time += ` ${date.getFullYear()} ${date.getMonth() + 1} ${date.getDate()}`
    datetime = Date.parse(time)

    return Qyllium.time.toHex(new Date(datetime))
  }
}
