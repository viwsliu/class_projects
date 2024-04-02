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
import * as bcrypt from "bcrypt";

import {SessionUser} from '../types/express';
import {Credentials, Authenticated, User} from '.';

import users from '../../data/users.json';

export class AuthService {
  public async login(credentials: Credentials): Promise<Authenticated|undefined>  {
    const user = users.find((user) => { 
      return user.email === credentials.email && 
        bcrypt.compareSync(credentials.password, user.password);
    });
    if (user) {
      const accessToken = jwt.sign(
        {email: user.email, name: user.name, roles: user.roles}, 
        `${process.env.MASTER_SECRET}`, {
          expiresIn: '30m',
          algorithm: 'HS256'
        });
      return {name: user.name, accessToken: accessToken};
    } else {
      return undefined;
    }
  }

  public async check(authHeader?: string, scopes?: string[]): Promise<SessionUser>  {
    return new Promise((resolve, reject) => {
      if (!authHeader) {
        reject(new Error("Unauthorised"));
      }
      else {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, 
          `${process.env.MASTER_SECRET}`, 
          (err: jwt.VerifyErrors | null, decoded?: object | string) => 
          {
            const user = decoded as User
            if (err) {
              reject(err);
            } else if (scopes){
              for (const scope of scopes) {
                if (!user.roles || !user.roles.includes(scope)) {
                  reject(new Error("Unauthorised"));
                }
              }
            }
            resolve({email: user.email, name: user.name});
          });
      }
    });
  }
}
