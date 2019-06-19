const BaseTransformer = require('./BaseTransformer');

class UserTransformer extends BaseTransformer {


  constructor(req, data) {
    const availableIncludes = ['usage'];
    super(req, data, availableIncludes);
  }

  /**
   * transformer user
   *
   * @param  {[type]} user [description]
   * @return {[type]}      [description]
   */
  transform() {
    const user = this.data;

    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      status: user.status,
      is_verified: user.status == 2
    }
  }

  /**
   * ?include=?usage
   *
   * @param  {[type]} user [description]
   * @return {[type]}      [description]
   */
  async includeUsage(user, req) {
    return this.transformItem({
      used: req.projects,
      total: req.projectsAllowed,
      remaining: req.projectsAllowed - req.projects
    });
  }

}

module.exports = UserTransformer;
