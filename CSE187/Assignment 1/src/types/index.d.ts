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

// pattern:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}
export type UUID = string

export type SessionUser = {
  id: UUID,
  name: string
}

declare global {
  namespace Express {
    export interface Request {
      user?: SessionUser;
    }
  }
}
