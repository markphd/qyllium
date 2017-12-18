/**
 * Qyllium
 * A notes app
 *
 * @author Josh Avanier
 * @version 0.1.0
 * @license MIT
 */

var win = require('electron').remote.getCurrentWindow()

var Qyllium = {

  config: {},
  tasks: [],
  events: [],
  notes: [],
  expanded: false,

  /**
   * List items
   * @param {Object[]} arr - Array
   * @param {string} con - Container
   */
  list(arr, con) {
    for (let i = arr.length - 1; i >= 0; i--) {
      let li = document.createElement('li')

      if (arr[i].c === 'task') {
        Qyllium.item.addTask(arr[i], con)
      } else if (arr[i].c === 'event') {
        Qyllium.item.addEvent(arr[i], con)
      } else if (arr[i].c === 'note') {
        Qyllium.item.addNote(arr[i], con)
      }
    }
  },

  item: {

    /**
     * Add task
     * @param {Object} itm - Task
     * @param {string} con - Container
     */
    addTask(itm, con) {
      let li = document.createElement('li')
      let del = document.createElement('button')
      let task = itm.d ? document.createElement('s') : document.createElement('span')

      li.className = 'mt3 pt3 bt c-pt'
      task.innerHTML = itm.t

      del.className = 'dib ml2 rf pv1 ph3 bg-cl on fwb'
      del.style.color = Qyllium.config.ui.colour
      del.innerHTML = '\u00D7'
      li.setAttribute('onclick', `Qyllium.item.doneTask('${itm.s}')`)
      del.setAttribute('onclick', `Qyllium.item.remove('${itm.s}')`)

      li.appendChild(task)
      li.appendChild(del)

      document.getElementById(con).appendChild(li)
    },

    /**
     * Add event
     * @param {Object} itm - Event
     * @param {string} con - Container
     */
    addEvent(itm, con) {
      let li = document.createElement('li')
      let dt = document.createElement('span')
      let ev = document.createElement('span')
      let del = document.createElement('button')
      let months = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(' ')
      let date = Qyllium.time.convert(Qyllium.time.parse(itm.d))
      let today = new Date()

      let minutes = `0${date.getMinutes()}`.substr(-2)
      let hours = `0${date.getHours()}`.substr(-2)

      li.className = 'mt3 pt3 bt'
      dt.className = 'mr2 fwb'
      dt.innerHTML = (today.getFullYear() === date.getFullYear() && today.getMonth() === date.getMonth() && today.getDate() === date.getDate()) ? `${hours}:${minutes}` : `${months[date.getMonth()]} ${date.getDate()}`
      ev.innerHTML = itm.t

      del.className = 'dib ml2 rf pv1 ph3 bg-cl on fwb'
      del.style.color = Qyllium.config.ui.colour
      del.innerHTML = '\u00D7'
      del.setAttribute('onclick', `Qyllium.item.remove('${itm.s}')`)

      li.appendChild(dt)
      li.appendChild(ev)
      li.appendChild(del)

      document.getElementById(con).appendChild(li)
    },

    /**
     * Add note
     * @param {Object} itm - Note
     * @param {string} con - Container
     */
    addNote(itm, con) {
      let li = document.createElement('li')
      let note = document.createElement('span')
      let del = document.createElement('button')

      li.className = 'mt3 pt3 bt'
      note.innerHTML = itm.t

      del.className = 'dib ml2 rf pv1 ph3 bg-cl on fwb'
      del.style.color = Qyllium.config.ui.colour
      del.innerHTML = '\u00D7'
      del.setAttribute('onclick', `Qyllium.item.remove('${itm.s}')`)

      li.appendChild(note)
      li.appendChild(del)

      document.getElementById(con).appendChild(li)
    },

    doneTask(id) {
      for (let i = 0, l = user.journal.length; i < l; i++) {
        if (user.journal[i].s === id) {
          user.journal[i].d = user.journal[i].d ? false : true
          Qyllium.options.update()
          Qyllium.refresh()
          return
        }
      }
    },

    remove(id) {
      for (let i = 0, l = user.journal.length; i < l; i++) {
        if (user.journal[i].s === id) {
          user.journal.splice(i, 1)
          Qyllium.options.update()
          Qyllium.refresh()
          return
        }
      }
    }
  },

  dateNav() {
    let start = Qyllium.time.convert(
      Qyllium.time.parse(user.journal[0].s)
    )
    let end = Qyllium.time.convert(
      Qyllium.time.parse(user.journal[user.journal.length - 1].s)
    )
    let dates = Qyllium.time.listDates(start, end).reverse()
    let months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ')

    for (let i = 0, l = dates.length; i < l; i++) {
      let dt = dates[i]

      if (Qyllium.data.getItemsByDate(user.journal, dt).length !== 0) {
        let li = document.createElement('li')
        li.className = 'mt3 pt3 bt'
        li.innerHTML = `${months[dt.getMonth()]} ${dt.getDate()}`
        // li.setAttribute('onclick', `Qyllium.dateView('${dt}')`)
        document.getElementById('dateNav').appendChild(li)
      }
    }
  },

  dateView(date) {
    let ent = Qyllium.data.getItemsByDate(user.journal, date)

    document.getElementById('dateView').innerHTML = `${date.getMonth()} ${date.getDate()}`
    document.getElementById('dateList').innerHTML = ''

    for (let i = 0, l = ent.length; i < l; i++) {
      let li = document.createElement('li')
      li.className = 'mt3 pt3 bt'
      li.innerHTML = ent[i].t
      document.getElementById('dateList').appendChild(li)
    }
  },

  /**
   * Open a tab
   */
  tab(s, g, t, v = false) {
    let x = document.getElementsByClassName(g)
    let b = document.getElementsByClassName(t)

    for (let i = 0, l = x.length; i < l; i++) {
      x[i].style.display = 'none'
    }

    for (let i = 0, l = b.length; i < l; i++) {
      b[i].className = v ? `db mb3 ${t} on bg-cl o5 mr3` : `pv1 ${t} on bg-cl o5 mr3`
    }

    document.getElementById(s).style.display = 'block'
    document.getElementById(`b-${s}`).className = v ? `db mb3 ${t} on bg-cl of mr3` : `pv1 ${t} on bg-cl of mr3`

    document.getElementById('console').focus()
  },

  refresh() {
    Qyllium.clear()
    Qyllium.init()
  },

  clear() {
    let el = 'todayAll todayTasks todayEvents todayNotes pendingTaskList completedTaskList upcomingEvents pastEvents noteList'.split(' ')

    for (let i = 0, l = el.length; i < l; i++) {
      document.getElementById(el[i]).innerHTML = ''
    }
  },

  init() {
    try {
      JSON.parse(localStorage.getItem('qyllium'))

      if (localStorage.hasOwnProperty('qyllium')) {
        user = JSON.parse(localStorage.getItem('qyllium'))
      } else {
        localStorage.setItem('qyllium', JSON.stringify(user))
      }
    } catch(e) {
      return
    }

    Qyllium.config = user.config

    document.getElementById('app').style.backgroundColor = Qyllium.config.ui.bg
    document.getElementById('app').style.color = Qyllium.config.ui.colour

    let detailsDisplay = ''

    if (!Qyllium.expanded) {
      win.setSize(300, 500)
      detailsDisplay = 'none'
    } else {
      win.setSize(800, 500)
      detailsDisplay = 'inline-block'
    }

    document.getElementById('details').style.display = detailsDisplay

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        e.preventDefault()

        if (!Qyllium.expanded) {
          win.setSize(800, 500)
          Qyllium.expanded = true
          document.getElementById('details').style.display = 'inline-block'
        } else {
          win.setSize(300, 500)
          Qyllium.expanded = false
          document.getElementById('details').style.display = 'none'
        }

        con.focus()
      }
    })

    let con = document.getElementById('console')

    document.getElementById('cmd').addEventListener('submit', function() {
      Qyllium.console.parse(con.value)
      con.value = ''
      con.focus()
    })

    if (user.journal.length === 0) return
    else Qyllium.data.parse(user.journal)

    Qyllium.list(Qyllium.data.getItemsByDate(user.journal, new Date()), 'todayAll')
    Qyllium.list(Qyllium.data.getItemsByDate(Qyllium.tasks, new Date()), 'todayTasks')
    Qyllium.list(Qyllium.data.getItemsByDate(Qyllium.events, new Date()), 'todayEvents')
    Qyllium.list(Qyllium.data.getItemsByDate(Qyllium.notes, new Date()), 'todayNotes')

    // Qyllium.dateNav()
    // Qyllium.dateView(new Date())

    Qyllium.list(Qyllium.data.getPendingTasks(), 'pendingTaskList')
    Qyllium.list(Qyllium.data.getCompletedTasks(), 'completedTaskList')

    Qyllium.list(Qyllium.data.getFutureEvents(), 'upcomingEvents')
    Qyllium.list(Qyllium.data.getPastEvents(), 'pastEvents')

    Qyllium.list(Qyllium.notes, 'noteList')
  }
}
