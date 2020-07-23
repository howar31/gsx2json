const GcsStrategy = require('../../storages/gcs-strategy')

module.exports = async function (req, res, next) {
  const publicBucket = 'about-us.twreporter.org'
  const config = req.config
  const storage = new GcsStrategy(publicBucket)
  
  try {
    const publicUrl = await storage.upload(`${req.sheet}.json`, JSON.stringify(config))
    const rtn = {
      status: 'success',
      publicUrl
    }
    res.status(200).json(rtn)
  } catch (error) {
    const rtn = {
      status: 'fail',
      error 
    }
    console.error('error:', error)
    res.status(500).json(rtn)
  }
}
