const axios = require('axios')
//lodash
const get = require('lodash/get')

const _ = {
  get,
}

/*
 * @typedef {Object} responseObj
 * @property {array} rows - containing each row of data as an object
 * @property {array} columns - containing the names of each column
 */

/*
 * This function converts google spreadsheet data to config 
 *
 * @param {string} options.id - sheet id of google spreadsheet 
 * @param {string} options.sheet - index of spreadsheet
 * @param {bool} options.useIntegers - convert integer to string or not
 * @param {bool} options.showRows - show rows in result or not
 * @param {bool} options.showColumns - show columns in result or not
 * @returns {responseObj}
 */
module.exports = function (options) {
  const defaultOptions = {
    sheet: 1,
    query: '',
    useIntegers: false,
    showRows: true,
    showColumns: false,
  }

  const { 
    id, 
    query,
    sheet, 
    showColumns,
    showRows, 
    useIntegers,
  } = Object.assign({}, defaultOptions, options)
  
  const url = 'https://spreadsheets.google.com/feeds/list/' + id + '/' + sheet + '/public/values?alt=json'

  return axios.get(url)
    .then(res => {
      const data = _.get(res, 'data')
      const responseObj = {}
      const rows = []
      const columns = {}
      if (data && data.feed && data.feed.entry) {
        for (let i = 0; i < data.feed.entry.length; i++) {
          const entry = data.feed.entry[i]
          const keys = Object.keys(entry)
          let queried = false
          let newRow = {}
          for (let j = 0; j < keys.length; j++) {
            const gsxCheck = keys[j].indexOf('gsx$')
            if (gsxCheck > -1) {
              const key = keys[j]
              const name = key.substring(4)
              const content = entry[key]
              let value = content.$t
              if (value.toLowerCase().indexOf(query.toLowerCase()) > -1) {
                queried = true
              }
              if (useIntegers === true && !isNaN(value)) {
                value = Number(value)
              }
              newRow[name] = value
              if (queried === true) {
                if (!Object.prototype.hasOwnProperty.call(columns, name))
                  columns[name] = []
                columns[name].push(value)
              } else {
                columns[name].push(value)
              }
            }
          }
          if (queried === true) {
            rows.push(newRow)
          }
        }
      }
      if (showColumns === true) {
        responseObj['columns'] = columns
      }
      if (showRows === true) {
        responseObj['rows'] = rows
      }
      return responseObj
    })
    .catch((err) => {
      console.error('error:', err)
    })
}
