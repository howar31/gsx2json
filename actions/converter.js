const axios = require('axios')
//dotenv
require('dotenv').config()
//lodash
const get = require('lodash/get')
const forEach = require('lodash/forEach')
const reduce = require('lodash/reduce')

const _ = {
  get,
  forEach,
  reduce,
}

const API_KEY = process.env.API_KEY

/*
 * @typedef {Object} responseObj
 * @property {array} rows - containing each row of data as an object
 */

/*
 * This function converts google spreadsheet data to config 
 *
 * @param {string} options.id - id of google spreadsheet 
 * @param {string} options.sheetName - target sheet name
 * @returns {responseObj}
 */
module.exports = function (options) {
  const defaultOptions = {
    sheetName: 'test',
  }

  const { 
    id, 
    sheetName, 
  } = Object.assign({}, defaultOptions, options)
  
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/'${sheetName}'?alt=json&key=${API_KEY}`

  return axios.get(encodeURI(url))
    .then(res => {
      const datas = _.get(res, 'data.values')
      const titles = datas[0]
      const dataByRow = []
      _.forEach(datas, (data, index) => {
        if (index === 0) {
	  return
	}
        const row = _.reduce(data, (result, value, key) => {
	  const title = titles[key]
	  result[title] = value
	  return result
	}, {})
        dataByRow.push(row)
      })

      return { rows: dataByRow }
    })
    .catch((err) => {
      console.error('error:', err)
    })
}
