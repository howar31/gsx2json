module.exports = function (req, res, next) {
  const config = req.config
  return res.status(200).json(config)
}
