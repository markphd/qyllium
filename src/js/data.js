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
  getPendingTasks(arr = Qyllium.tasks) {
    let ent = []
    arr.map(e => !e.d && ent.push(e))
    return ent
  },

  /**
   * Get completed tasks
   * @returns {Object} Completed tasks
   */
  getCompletedTasks(arr = Qyllium.tasks) {
    let ent = []
    arr.map(e => e.d && ent.push(e))
    return ent
  },

  /**
   * Get past events
   * @returns {Object} Past events
   */
  getPastEvents(arr = Qyllium.events) {
    let ent = []

    arr.map(e => {
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
  getFutureEvents(arr = Qyllium.events) {
    let ent = []

    arr.map(e => {
      if (Qyllium.time.convert(Qyllium.time.parse(e.d)).getTime() > new Date().getTime()) {
        ent.push(e)
      }
    })

    return ent
  },

  /**
   * Extract hashtags from entry
   * @param {string} s - Entry
   * @return {Object[]} - Hashtags
   */
  getHashtags(s) {
    if (!s.includes('#')) return
    return s.match(/\B\#\w\w+\b/g)
  },

  listTags(ent) {
    let tags = []

    ent.map(e => {
      if (e.h !== undefined) {
        !isEmpty(e.h) && e.h.map(i => {
          tags.indexOf(i) === -1 && tags.push(i)
        })
      }
    })

    return tags
  },

  /**
   * Get items by tag
   * @param {string} tag - Tag
   * @return {Object[]} Items under tag
   */
  getItemsByTag(tag, ent) {
    let items = []

    ent.map(e => {
      if (e.h !== undefined) {
        !isEmpty(e.h) &&
        e.h.map(i => i === tag && items.push(e))
      }
    })

    return items
  }
}
