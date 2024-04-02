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

/**
 * International Standard Book Number, 10 or 13 digit
 * @pattern ^(97(8|9))?\d{9}(\d|X)$
 * @example "9783161484100"
 */
export type ISBN = string;

export interface Book {
  isbn: ISBN;
  title: string;
  author: string;
  publisher: string;
}
