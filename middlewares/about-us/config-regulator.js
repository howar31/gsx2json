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

module.exports = function (req, res, next) {
  const sheet = req.query.sheet || '1'
  let config = _.get(req.config, 'rows', [])

  req.sheet = `section${parseInt(sheet, 10) + 1}`

  // The config for section3 need to be regulated
  if (req.sheet === 'section3') {
    
    // The `groupedByName` object will be like:
    // {
    //   "award1": [ {..}, {..} ]
    // }
    const groupedByName = _.groupBy(config, award => award['award.zh-tw'])
 
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

    config = {
      groupedRecords,
      awardYears,
      yearInterval: {
        min: allYears[0],
        max: allYears.pop(),
      },
      total: config.length,
    }
  }

  req.config = Object.assign({}, config)
  
  next()
}
