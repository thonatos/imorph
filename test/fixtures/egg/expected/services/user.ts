import { Service } from 'egg';

/**
 * user service
 */
export default class UserService extends Service {
  /**
   * get user detail by user id
   */
  public async getUserById(id: number): Promise<any> {

    return this.ctx.proxy.user.getUserById(id);

  }

  /**
   * get user detail by user name
   */
  public async getUserByName(name: string, privateInfo?: boolean): Promise<any> {

    return this.ctx.proxy.user.getUserByName(name, privateInfo || null);

  }
}