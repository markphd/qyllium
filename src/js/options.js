Qyllium = window.Qyllium || {}
Qyllium.options = {

  /**
   * Update settings
   */
  update() {
    localStorage.setItem('qyllium', JSON.stringify(user))
    Qyllium.clear()
    Qyllium.init()
  },

  /**
   * Set background colour
   * @param {string} c - Colour
   */
  setBG(c) {
    user.config.ui.bg = c
    Qyllium.options.update()
  },

  /**
   * Set text colour
   * @param {string} c - Colour
   */
  setColour(c) {
    user.config.ui.colour = c
    Qyllium.options.update()
  },

  /**
   * Set calendrical system
   * @param {string} c - Calendrical system
   */
  setCalendar(c) {
    if (contains(c, 'aequirys gregorian')) {
      user.config.system.calendar = c
      Qyllium.options.update()
    }
  },

  /**
   * Set time format
   * @param {string} f - Time format
   */
  setTimeFormat(f) {
    if (contains(f, '24 12')) {
      user.config.system.timeFormat = f
      Qyllium.options.update()
    }
  }
}
