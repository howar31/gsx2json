const assign = require('lodash/assign')
const errors = require('@twreporter/errors').default
const { Storage } = require('@google-cloud/storage')

const _ = {
  assign,
}

class GcsStrategy {
  constructor(bucketName) {
    this.bucketName = bucketName
    const storage = new Storage()
    this.bucket = storage.bucket(this.bucketName) 
    this.upload = this.upload.bind(this)
  }

  getPublicUrl(filePath) {
    return `https://${this.bucketName}/${filePath}` 
  }

  /* 
   * @param {string} fileName - the destination file name 
   * @param {string} contents - the content of the file 
   * @param {object} options - the options set for the file
   */
  async upload(fileName, contents, options) {
    const defaultOptions = {
      destination: fileName,
      gzip: true,
      resumable: false,
      metadata: {
        cacheControl: 'public, max-age=300',
      },
    }
    const uploadOptions = _.assign({}, defaultOptions, options)
    try {
      const file = this.bucket.file(fileName)
      await file.save(contents, uploadOptions)
      return this.getPublicUrl(fileName)
    } catch(error) {
      throw errors.helpers.wrap(
        error,
        'GoogleAPIsError',
        'failed to save file to gcs',
        {
          method: 'bucket.upload',
          bucket: this.bucketName, 
          file: fileName,
        } 
      )
    }
  }
}

module.exports = GcsStrategy
