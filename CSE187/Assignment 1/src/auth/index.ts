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

import { UUID } from "crypto"

export interface User {
  id: UUID,
  email: string,
  name: string,
  roles: string[]
}

export interface Credentials {
  email: string,
  password: string
}

export interface Authenticated {
  id: UUID
}
