class IndexController {
  constructor() {

  }

  index(req, res, next) {
    res.success({
      message: 'API is up and running'
    });
  }
}

module.exports = new IndexController;
