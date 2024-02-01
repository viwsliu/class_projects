/*
 * Copyright (C) 2018-2023 David C. Harrison. All right reserved.
 *
 * You may not use, distribute, publish, or modify this code without
 * the express written permission of the copyright holder.
 */

import { test, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from '../App';

/*
 * Should be using at least 10 Material UI Components
 */
test('Using Material UI', async () => {
  render(<App />);
  const elements = document.querySelectorAll('[class^=Mui]');
  expect(elements.length > 10).toBe(true);
});
