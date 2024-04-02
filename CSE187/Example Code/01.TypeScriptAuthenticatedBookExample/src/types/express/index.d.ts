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

export type SessionUser = {
  email: string,
  name: string
}

declare global {
  namespace Express {
    export interface Request {
      user?: SessionUser;
    }
  }
}
