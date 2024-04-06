
import {SessionUser} from '../types';
import { pool } from '../db';
import {Credentials, Authenticated, User} from '.';
import { Jwt } from 'jsonwebtoken';

export class AuthService {
  public async login(credentials: Credentials): Promise<Authenticated | null>  {
    const email = credentials.email;
    const password = credentials.password;

    const query = {
      text: `SELECT id, data->>'name' as name FROM member WHERE data->>'email' = $1 AND data->>'pwhash' = crypt($2, data->>'pwhash')`,
      values: [email, password],
    };

    const result = await pool.query(query);
    if (result.rows.length === 0) {
      return null; //return 401
    }
    const id = result.rows[0].id;
    const name = result.rows[0].name;

    return {
      id: id,
      name: name
    };
  }

  public async make_new_member(email: string, password: string, name: string): Promise<{id: string, name: String}| null>{

    const query = {
      text: `INSERT INTO member (NULL, $1)`, //how to make new id for member?
      values: [
        {email: email,
          password: password,
          name: name,
          roles: ["member"]
        }
      ],
    };
    const result = await pool.query(query);

    return {id: result.rows[0].uuid, name: name} 

  }

  public async check(authHeader?: string, scopes?: string[]): Promise<SessionUser | null>{ //check the role of a user given id and name
    return null
  
    //   if (authHeader == undefined){
  //     return null; //no login
  //   }
  //   const id= authHeader.id;
  //   const name = authHeader.name;
  //   const query = {
  //     text: `select data->>'roles' as roles from member where id = $1 AND data->>'name' = $2`,
  //     values: [id, name],
  //   };
   
  //   const result = await pool.query(query);
    
  //   if (scopes != result.rows[0].roles){
  //     return null; //return 403 forbidden
  //   }
  //   //reutrn id and name


  //   return null;//todo
  // }
}
 

