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

export const molly = {
  email: 'molly@books.com',
  password: 'mollymember',
};

export const anna = {
  email: 'anna@books.com',
  password: 'annaadmin',
};

export const nobby = {
  email: 'nobby@books.com',
  password: 'nobbynobody',
};

export async function login(request: any, member: any): Promise<string|undefined> {
  let accessToken;
  await request.post('/api/v0/login')
    .send(member)
    .expect(200)
    .then((res: any) => {
      accessToken = res.body.accessToken;
    });
  return accessToken;
}

export async function asMolly(request: any): Promise<string|undefined> {
  return login(request, molly);
}

export async function asAnna(request: any): Promise<string|undefined> {
  return login(request, anna);
}

export async function asNobby(request: any): Promise<string|undefined> {
  return login(request, nobby);
}
