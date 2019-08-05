import { Service } from 'egg';

/**
 * user service
 */
export default class UserService extends Service {
  /**
   * get user list
   * @param {number} pageNumber - page number
   * @param {number} pageSize - page size
   * @returns {any} user list
   */
  public async index(pageNumber: number, pageSize: number): Promise<any> {
    return this.ctx.proxy.user.index(pageNumber, pageSize);
  }

  /**
   * create user
   * @param {IUser} model - user model
   * @returns {any} user detail
   */
  public async create(model: IUser): Promise<any> {
    return this.ctx.proxy.user.create(model);
  }

  /**
   * get user detail by id
   * @param {number} id - user id
   * @param {boolean} privateInfo - show private user info
   * @returns {any} user detail
   */
  public async show(id: number, privateInfo?: boolean): Promise<any> {
    return this.ctx.proxy.user.show(id, privateInfo || null);
  }

  /**
   * update user
   * @param {number} id - user id
   * @param {IUser} model - user model
   * @returns {any} user detail
   */
  public async update(id: number, model: IUser): Promise<any> {
    return this.ctx.proxy.user.update(id, model);
  }

  /**
   * delete user by id
   * @param {number} id - user id
   * @returns {any} user detail
   */
  public async destroy(id: number): Promise<any> {
    return this.ctx.proxy.user.destroy(id);
  }
}
