
// import * as jwt from "jsonwebtoken";
import {SessionUser} from '../types';
import { pool } from '../db';
import {Credentials, Authenticated, User} from '.';

export class AuthService {
  public async login(credentials: Credentials): Promise<Authenticated|undefined>  {
    const email = credentials.email;
    const password = credentials.password;

    const query = {
      text: `SELECT id, data->>'name' as name FROM member WHERE data->>'email' = $1 AND data->>'pwhash' = crypt($2, data->>'pwhash')`,
      values: [email, password],
    };

    const result = await pool.query(query);
    if (result.rows.length === 0) {
      return undefined; //return 401
    }
    const id = result.rows[0].id;
    const name = result.rows[0].name;
    return {id,name};
  }

  public async check(authHeader?: string, scopes?: string[]): Promise<SessionUser>{ //check the role of a user?
    const email = credentials.email;
    const password = credentials.password;
    const query = {
      text: `select data->>'roles' as roles from member where data->>'email' = $1 AND data->>'pwhash' = crypt($2, data->>'pwhash')`,
      values: [email, password],
    };

    const result = await pool.query(query);
    //reutrn id and name
  }

  


}
 

