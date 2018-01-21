/**
 * Qyllium
 * A notes app
 *
 * @author Josh Avanier
 * @version 0.1.0
 * @license MIT
 */

const win = require('electron').remote.getCurrentWindow()

var Qyllium = {

  config: {},
  tasks: [],
  events: [],
  notes: [],
  expanded: false,

  toggleView() {
    if (!Qyllium.expanded) {
      win.setSize(800, 500)
      Qyllium.expanded = true
      document.getElementById('details').style.display = 'inline-block'
    } else {
      win.setSize(300, 500)
      Qyllium.expanded = false
      document.getElementById('details').style.display = 'none'
    }

    localStorage.setItem('qylliumMode', Qyllium.expanded)
  },

  /**
   * List items
   * @param {Object[]} arr - Array
   * @param {string} con - Container
   */
  list(arr, con) {
    for (let i = arr.length - 1; i >= 0; i--) {
      const li = document.createElement('li')

      if (arr[i].c === 'task') {
        Qyllium.item.addTask(arr[i], con)
      } else if (arr[i].c === 'event') {
        Qyllium.item.addEvent(arr[i], con)
      } else if (arr[i].c === 'note') {
        Qyllium.item.addNote(arr[i], con)
      }
    }
  },

  view(mode, tag) {
    let ent = []

    if (mode === 'task') {
      ent = Qyllium.tasks
    } else if (mode === 'event') {
      ent = Qyllium.events
    } else if (mode === 'note') {
      ent = Qyllium.notes
    } else return

    const list = Qyllium.data.getItemsByTag(tag, ent)

    if (mode === 'task') {
      clear('pendingTaskList')
      clear('completedTaskList')

      Qyllium.list(Qyllium.data.getPendingTasks(list), 'pendingTaskList')
      Qyllium.list(Qyllium.data.getCompletedTasks(list), 'completedTaskList')
    } else if (mode === 'event') {
      clear('upcomingEvents')
      clear('pastEvents')

      Qyllium.list(Qyllium.data.getFutureEvents(list), 'upcomingEvents')
      Qyllium.list(Qyllium.data.getPastEvents(list), 'pastEvents')
    } else if (mode === 'note') {
      clear('noteList')

      Qyllium.list(list, 'noteList')
    } else return
  },

  item: {

    /**
     * Add task
     * @param {Object} itm - Task
     * @param {string} con - Container
     */
    addTask(itm, con) {
      const li = document.createElement('li')
      const del = document.createElement('button')
      const task = itm.d ? document.createElement('s') : document.createElement('span')

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
      const li = document.createElement('li')
      const dt = document.createElement('span')
      const ev = document.createElement('span')
      const del = document.createElement('button')
      const months = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(' ')
      const date = Qyllium.time.convert(Qyllium.time.parse(itm.d))
      const today = new Date()

      const minutes = `0${date.getMinutes()}`.substr(-2)
      const hours = `0${date.getHours()}`.substr(-2)

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
      const li = document.createElement('li')
      const note = document.createElement('span')
      const del = document.createElement('button')

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

    /**
     * Set a task as done
     * @param {number} id - Task ID
     */
    doneTask(id) {
      user.journal.map(e => {
        if (e.s === id) {
          e.d = e.d ? false : true
          Qyllium.options.update()
          Qyllium.refresh()
          return
        }
      })
    },

    remove(id) {
      user.journal.map((e, i) => {
        if (e.s === id) {
          user.journal.splice(i, 1)
          Qyllium.options.update()
          Qyllium.refresh()
          return
        }
      })
    }
  },

  dateNav() {
    const start = Qyllium.time.convert(
      Qyllium.time.parse(user.journal[0].s)
    )
    const end = Qyllium.time.convert(
      Qyllium.time.parse(user.journal.slice(-1)[0].s)
    )
    const dates = Qyllium.time.listDates(start, end).reverse()
    const months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ')

    dates.map(e => {
      if (Qyllium.data.getItemsByDate(user.journal, e).length !== 0) {
        const li = document.createElement('li')
        li.className = 'mt3 pt3 bt'
        li.innerHTML = `${months[e.getMonth()]} ${e.getDate()}`
        // li.setAttribute('onclick', `Qyllium.dateView('${e}')`)
        document.getElementById('dateNav').appendChild(li)
      }
    })
  },

  dateView(date) {
    const ent = Qyllium.data.getItemsByDate(user.journal, date)

    document.getElementById('dateView').innerHTML = `${date.getMonth()} ${date.getDate()}`
    document.getElementById('dateList').innerHTML = ''

    ent.map(e => {
      const li = document.createElement('li')
      li.className = 'mt3 pt3 bt'
      li.innerHTML = e.t
      document.getElementById('dateList').appendChild(li)
    })
  },

  hashNav(mode, ent, con) {
    const tags = Qyllium.data.listTags(ent)

    tags.map(e => {
      const li = document.createElement('li')
      const a = create('a')
      li.className = 'mt3 pt3 bt'
      a.className = 'p1 hvn c-pt'
      a.style.backgroundColor = Qyllium.config.ui.colour
      a.style.color = Qyllium.config.ui.bg
      a.innerHTML = e
      a.setAttribute('onclick', `Qyllium.view('${mode}', '${e}')`)
      li.appendChild(a)
      document.getElementById(con).appendChild(li)
    })
  },

  /**
   * Open a tab
   */
  tab(s, g, t, v = false) {
    const x = document.getElementsByClassName(g)
    const b = document.getElementsByClassName(t)

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
    'todayAll todayTasks todayEvents todayNotes pendingTaskList completedTaskList taskTags upcomingEvents pastEvents eventTags noteList noteTags'.split(' ').map(e => document.getElementById(e).innerHTML = '')
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

    try {
      JSON.parse(localStorage.getItem('qylliumMode'))

      if (localStorage.hasOwnProperty('qylliumMode')) {
        Qyllium.expanded = JSON.parse(localStorage.getItem('qylliumMode'))
      } else {
        localStorage.setItem('qylliumMode', false)
      }
    } catch(e) {
      return
    }

    if (!Qyllium.expanded) {
      win.setSize(300, 500)
      document.getElementById('details').style.display = 'none'
    } else {
      win.setSize(800, 500)
      document.getElementById('details').style.display = 'inline-block'
    }

    if (user.journal.length === 0) return
    else Qyllium.data.parse(user.journal)

    const today = new Date()

    Qyllium.list(Qyllium.data.getItemsByDate(user.journal, today), 'todayAll')
    Qyllium.list(Qyllium.data.getItemsByDate(Qyllium.tasks, today), 'todayTasks')
    Qyllium.list(Qyllium.data.getItemsByDate(Qyllium.events, today), 'todayEvents')
    Qyllium.list(Qyllium.data.getItemsByDate(Qyllium.notes, today), 'todayNotes')

    Qyllium.hashNav('task', Qyllium.tasks, 'taskTags')
    Qyllium.hashNav('event', Qyllium.events, 'eventTags')
    Qyllium.hashNav('note', Qyllium.notes, 'noteTags')

    Qyllium.list(Qyllium.data.getPendingTasks(), 'pendingTaskList')
    Qyllium.list(Qyllium.data.getCompletedTasks(), 'completedTaskList')

    Qyllium.list(Qyllium.data.getFutureEvents(), 'upcomingEvents')
    Qyllium.list(Qyllium.data.getPastEvents(), 'pastEvents')

    Qyllium.list(Qyllium.notes, 'noteList')
  }
}

const con = document.getElementById('console')
document.getElementById('cmd').addEventListener('submit', function() {
  Qyllium.console.parse(con.value)
  con.value = ''
  con.focus()
})

document.addEventListener('keydown', function(e) {
  if (e.key === 'Tab') {
    e.preventDefault()
    Qyllium.toggleView()
    document.getElementById('console').focus()
  }
})
