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

    arr.map(e => {
      if (e.c === 'task') tasks.push(e)
      else if (e.c === 'event') events.push(e)
      else if (e.c === 'note') notes.push(e)
    })

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

    arr.map(e => {
      let a = Qyllium.time.convert(Qyllium.time.parse(e.s))

      a.getFullYear() === d.getFullYear()
      && a.getMonth() === d.getMonth()
      && a.getDate() === d.getDate()
      && ent.push(e)
    })

    return ent
  },

  /**
   * Get pending tasks
   * @returns {Object} Pending tasks
   */
  getPendingTasks() {
    let ent = []
    Qyllium.tasks.map(e => !e.d && ent.push(e))
    return ent
  },

  /**
   * Get completed tasks
   * @returns {Object} Completed tasks
   */
  getCompletedTasks() {
    let ent = []
    Qyllium.tasks.map(e => e.d && ent.push(e))
    return ent
  },

  /**
   * Get past events
   * @returns {Object} Past events
   */
  getPastEvents() {
    let ent = []

    Qyllium.events.map(e => {
      if (Qyllium.time.convert(Qyllium.time.parse(e.d)).getTime() < new Date().getTime()) {
        ent.push(e)
      }
    })

    return ent
  },

  /**
   * Get upcoming events
   * @returns {Object} Upcoming events
   */
  getFutureEvents() {
    let ent = []

    Qyllium.events.map(e => {
      if (Qyllium.time.convert(Qyllium.time.parse(e.d)).getTime() > new Date().getTime()) {
        ent.push(e)
      }
    })

    return ent
  }
}
