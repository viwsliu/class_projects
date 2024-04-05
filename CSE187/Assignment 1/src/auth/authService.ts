/*
#######################################################################
#
# Copyright (C) 2022-2024 David C. Harrison. All right reserved.
#
# You may not use, distribute, publish, or modify this code without
# the express written permission of the copyright holder.
#
#######################################################################
*/

import * as jwt from "jsonwebtoken";
import { pool } from '../db';
import {Credentials, Authenticated, User} from '.';

export class AuthService {
  public async login(credentials: Credentials): Promise<Authenticated|undefined>  {
    const email = credentials.email;
    const password = credentials.password;

    const query = {
      text: `SELECT COUNT(*) AS count FROM member WHERE data->>'email' = $1 AND data->>'pwhash' = crypt($2, data->>'pwhash')`,
      values: [email, password],
    };
    const result = await pool.query(query);
    const count = parseInt(result.rows[0]?.count);
    if (result.rows.length === 0) {
      return undefined; // User not found or invalid credentials
    }
    const id = result.rows[0].id;
    return {id};
  }

  public async check(headerauth, scope): Promise<Authenticated>{
    //asdf
    
  }


}

  

/* we are given Credentials: 
    email: string,
    password: string

  and must return a JWT:
    MemberID




*/
  

