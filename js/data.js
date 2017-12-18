Qyllium = window.Qyllium || {}
Qyllium.data = {

  /**
   * Organise tasks, events, and notes
   * @param {Object} arr - Journal
   */
  parse(arr) {
    let tasks = []
    let events = []
    let notes = []

    for (let i = 0, l = arr.length; i < l; i++) {
      if (arr[i].c === 'task') tasks.push(arr[i])
      else if (arr[i].c === 'event') events.push(arr[i])
      else if (arr[i].c === 'note') notes.push(arr[i])
    }

    Qyllium.tasks = tasks
    Qyllium.events = events
    Qyllium.notes = notes
  },

  /**
   * Count tasks
   * @returns {number} Number of tasks
   */
  countTasks() {
    return Qyllium.tasks.length
  },

  /**
   * Count events
   * @returns {number} Number of events
   */
  countEvents() {
    return Qyllium.events.length
  },

  /**
   * Count notes
   * @returns {number} Number of notes
   */
  countNotes() {
    return Qyllium.notes.length
  },

  /**
   * Count items in the journal
   * @returns {number} Number of items
   */
  countItems() {
    return Qyllium.data.countTasks() + Qyllium.data.countEvents() + Qyllium.data.countNotes()
  },

  /**
   * Get items by date
   * @param {Object} arr - Array
   * @param {Object=} d - Date
   * @returns {Object} Items
   */
  getItemsByDate(arr, d = new Date()) {
    let ent = []

    for (let i = 0, l = arr.length; i < l; i++) {
      let a = Qyllium.time.convert(Qyllium.time.parse(arr[i].s))

      a.getFullYear() === d.getFullYear()
      && a.getMonth() === d.getMonth()
      && a.getDate() === d.getDate()
      && ent.push(arr[i])
    }

    return ent
  },

  /**
   * Get pending tasks
   * @returns {Object} Pending tasks
   */
  getPendingTasks() {
    let ent = []

    for (let i = 0, l = Qyllium.tasks.length; i < l; i++) {
      if (!Qyllium.tasks[i].d) {
        ent.push(Qyllium.tasks[i])
      }
    }

    return ent
  },

  /**
   * Get completed tasks
   * @returns {Object} Completed tasks
   */
  getCompletedTasks() {
    let ent = []

    for (let i = 0, l = Qyllium.tasks.length; i < l; i++) {
      if (Qyllium.tasks[i].d) {
        ent.push(Qyllium.tasks[i])
      }
    }

    return ent
  },

  /**
   * Get past events
   * @returns {Object} Past events
   */
  getPastEvents() {
    let ent = []

    for (let i = 0, l = Qyllium.events.length; i < l; i++) {
      if (Qyllium.time.convert(Qyllium.time.parse(Qyllium.events[i].d)).getTime() < new Date().getTime()) {
        ent.push(Qyllium.events[i])
      }
    }

    return ent
  },

  /**
   * Get upcoming events
   * @returns {Object} Upcoming events
   */
  getFutureEvents() {
    let ent = []

    for (let i = 0, l = Qyllium.events.length; i < l; i++) {
      if (Qyllium.time.convert(Qyllium.time.parse(Qyllium.events[i].d)).getTime() > new Date().getTime()) {
        ent.push(Qyllium.events[i])
      }
    }

    return ent
  }
}
