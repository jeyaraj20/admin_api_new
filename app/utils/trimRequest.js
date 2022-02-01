function trimStringProperties(obj) {
  if (obj !== null && typeof obj === "object") {
    for (var prop in obj) {
      if (typeof obj[prop] === "object") {
        return trimStringProperties(obj[prop]);
      }
      if (typeof obj[prop] === "string") {
        obj[prop] = obj[prop].trim();
      }
    }
  }
}

var all = async function (req, res, next) {
  if (req.payload) {
    trimStringProperties(req.payload);
  }
  if (req.params) {
    trimStringProperties(req.params);
  }
  if (req.query) {
    trimStringProperties(req.query);
  }
  return req;
};

module.exports = {
  all
};
