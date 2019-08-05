import { Controller } from 'egg';

/**
 * user controller
 */
export default class UserController extends Controller {
  /**
   * get user list
   */
  public async index() {
    const { pageNum, sizeSize } = this.ctx.query;
    return this.ctx.service.user.index(pageNum, sizeSize);
  }

  /**
   * create user
   */
  public async create() {
    const { model } = this.ctx.request.body;
    return this.ctx.service.user.create(model);
  }

  /**
   * update user
   */
  public async update() {
    const { id } = this.ctx.params;
    const { model } = this.ctx.request.body;
    return this.ctx.service.user.update(id, model);
  }

  /**
   * get user detail by user id
   */
  public async show() {
    const { id } = this.ctx.params;
    return this.ctx.service.user.show(id);
  }

  /**
   * delete user by id
   */
  public async destroy() {
    const { id } = this.ctx.params;
    return this.ctx.service.user.destroy(id);
  }
}
