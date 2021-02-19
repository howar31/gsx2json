const forOwn = require('lodash/forOwn')
const get = require('lodash/get')
const groupBy = require('lodash/groupBy')
const keys = require('lodash/keys')
const sortBy = require('lodash/sortBy')

const _ = {
  forOwn,
  get,
  groupBy,
  keys,
  sortBy, 
}

/* 
 * @param {Object} config - the raw config needs to be regulated
 * @param {string} options.id - sheet id of google spreadsheet 
 * @param {string} options.sheet - index of spreadsheet
 * @param {boolean} options.useIntegers - convert integer to string or not
 * @param {boolean} options.showRows - show rows in result or not
 * @param {boolean} options.showColumns - show columns in result or not
 */
module.exports = function (config, options) {
  const rows = _.get(config, 'rows', [])
  
  // The config for section3 need to be regulated
  if (options.section === '3') {
    
    // The `groupedByName` object will be like:
    // {
    //   "award1": [ {..}, {..} ]
    // }
    const groupedByName = _.groupBy(rows, award => award['award.zh-tw'])
 
    // The `groupedRecords` object will be like:
    // {
    //   "award1": {
    //     "2017": [ {...} ]
    //   },
    // }
    let groupedRecords = {}

    // The `awardYears` object will be like:
    // {
    //   "award1": [ "2019", "2018" ]  // list years in descending order
    // }
    let awardYears = {}
    _.forOwn(groupedByName, (value, key) => {
      groupedRecords[key] = _.groupBy(value, record => record.date.split('/')[0])
      awardYears[key] = _.sortBy(_.keys(groupedRecords[key])).reverse()
    })
    
    let allYears = []
    _.forOwn(awardYears, (value) => {
      allYears = [ ...allYears, ...value ] 
    })
    allYears = _.sortBy(allYears)

    return {
      groupedRecords,
      awardYears,
      yearInterval: {
        min: allYears[0],
        max: allYears.pop(),
      },
      total: rows.length,
    }
  }

  return config 
}
