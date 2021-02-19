const GcsStrategy = require('../../storages/gcs-strategy')

/*
 * This function uploads config to gcs 
 *
 * @param {Object} config - config which will be uploaded
 * @param {string} options.section - section index of about-us page 
 * @param {string} options.branch - git branch (one of `master`, `staging`, `release`) 
 *
 */
module.exports = async function (config, options) {
  const { section, branch } = options
  const publicBucket = 'about-us.twreporter.org'
  const fileName = `section${section}.${branch}.json`
  const storage = new GcsStrategy(publicBucket) 
  try {
    const publicUrl = await storage.upload(
      fileName, 
      JSON.stringify(config)
    )
    console.log('upload succeeded.')
    console.log('publicUrl:', publicUrl) 
  } catch (error) {
    console.error('error occurs when uploading file to gcs.')
    console.error('error:', error)
  }
}
