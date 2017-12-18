Qyllium = window.Qyllium || {}
Qyllium.console = {
  history: [],

  commands: [
    'set', 'import', 'export', 'invert', 'edit'
  ],

  /**
   * Parse command
   * @param {string} i - Input
   */
  parse(i) {
    let k = Qyllium.console.commands.indexOf(i.split(' ')[0].toLowerCase())

    if (k != -1) {
      switch (k) {
        case 0:
          Qyllium.console.set(i);
          break;
        case 1:
          Qyllium.console.importUser(i);
          break;
        case 2:
          Qyllium.console.exportUser();
          break;
        case 3:
          Qyllium.console.invert();
          break;
      }
    } else {
      if (i === '') return

      if (i.split(' ')[0] === '+') {
        Qyllium.console.addTask(i)
      } else if (i.indexOf('@') !== -1) {
        Qyllium.console.addEvent(i)
      } else {
        Qyllium.console.addNote(i)
      }
    }
  },

  /**
   * Import user data
   */
  importUser() {
    let path = dialog.showOpenDialog({properties: ['openFile']})

		if (!path) return

    let string = ''

		try {
			string = fs.readFileSync(path[0], 'utf-8')
		} catch (e) {
			console.log('Error while loading file')
		}

    localStorage.setItem('qyllium', string)
    user = JSON.parse(localStorage.getItem('qyllium'))

		Qyllium.refresh()
  },

  /**
   * Export user data
   */
  exportUser() {
    let data = JSON.stringify(JSON.parse(localStorage.getItem('qyllium')))

    dialog.showSaveDialog((fileName) => {
      if (fileName === undefined) return
      fs.writeFile(fileName, data, (err) => {
        if (err) {
          alert (`An error occured creating the file ${err.message}`)
          return
        }
      })
    })
  },

  /**
   * Add a note
   * @param {string} i - Input
   */
  addNote(i) {
    let str = i.split(' ')
    let start = Qyllium.time.toHex(new Date())
    let tags = []
    let note = i
    let signifier = ''

    if (['!', '*'].indexOf(str[0]) !== -1) {
      signifier = str[1]
      note = i.slice(2)
    }

    user.journal.push({
      c: 'note',
      s: start,
      t: note
    })

    Qyllium.options.update()
  },

  /**
   * Add a task
   * @param {string} i - Input
   */
  addTask(i) {
    let str = i.split(' ')
    let start = Qyllium.time.toHex(new Date())
    let tags = []
    let note = i.slice(2)
    let signifier = ''

    if (['!', '*'].indexOf(str[1]) !== -1) {
      signifier = str[1]
      note = i.slice(4)
    }

    let hash = s => {
      let regexp = /\B\#\w\w+\b/g
      let result = s.match(regexp)

      if (result) {
        tags.push(result)
      } else {
        return false
      }
    }

    hash(i)

    user.journal.push({
      c: 'task',
      s: start,
      g: signifier,
      d: false,
      t: note
    })

    Qyllium.options.update()
  },

  /**
   * Add an event
   * @param {string} i - Input
   */
  addEvent(i) {
    let str = i.split(' ')
    let at = i.indexOf('@')
    let tags = []
    let note = i.slice(0, at)
    let signifier = ''

    if (['!', '*'].indexOf(str[1]) !== -1) {
      signifier = str[1]
      note = i.slice(0, at)
    }

    let hash = s => {
      let result = s.match(/\B\#\w\w+\b/g)

      if (result) {
        tags.push(result)
      } else {
        return false
      }
    }

    hash(i)

    user.journal.push({
      c: 'event',
      s: Qyllium.time.toHex(new Date()),
      g: signifier,
      d: Qyllium.time.parseDateTime(i.slice(at + 2)),
      t: note
    })

    Qyllium.options.update()
  },

  /**
   * Set a config attribute
   * @param {string} i - Input
   */
  set(i) {
    let c = i.split(' ')
    let a = c[1].toLowerCase()

    if (a === 'background' || a === 'bg') {
      Qyllium.options.setBG(c[2])
    } else if (a === 'color' || a === 'colour' || a === 'text') {
      Qyllium.options.setColour(c[2])
    } else if (a === 'cal' || a === 'calendar') {
      Qyllium.options.setCalendar(c[2])
    } else if (a === 'timeformat' || a === 'time') {
      Qyllium.options.setTimeFormat(c[2])
    } else if (a === 'dateformat' || a === 'date') {
      Qyllium.options.setDateFormat(c[2])
    } else return
  },

  /**
   * Invert interface colours
   */
  invert() {
    let bg = user.config.ui.bg
    let c = user.config.ui.colour

    user.config.ui.bg = c
    user.config.ui.colour = bg

    Qyllium.options.update()
  }
}
