import { it, expect } from 'vitest';
import { render, screen, fireEvent} from '@testing-library/react';
import App from '../App';
import Picker from '../Picker';

// https://github.com/testing-library/react-testing-library#basic-example
// TA Jose
it('renders', () => {
  render(<App />);
  expect(screen.getByText('CSE186 Assignment 4')).toBeInTheDocument();
});

let dateHolder = new Date();
let MonthNames =
['January', 'February', 'March',
  'April', 'May', 'June', 'July',
  'August', 'September', 'October',
  'November', 'December'];

it('renders', async () => {
  render(<App />);
  expect(screen.getByText(`${MonthNames[dateHolder.getMonth()]} ${dateHolder.getFullYear()}`)).toBeInTheDocument();
  const element = screen.getByText(`${dateHolder.getDate()}`);
  expect(element.id === 'today')
});

it('1 next', () => {
  render(<Picker />);
  const button = screen.getByText('»');
  expect(button.id === 'next')
  fireEvent.click(button);
  let year = dateHolder.getFullYear();
  let temp = dateHolder.getMonth()+1;
  if (temp < 0){
    temp = 12+temp;
    year--;
  } else if (temp>11) {
    temp = temp-11;
    year++;
  }
  expect(screen.getByText(`${MonthNames[temp]} ${year}`)).toBeInTheDocument();
});

it('2 prev', () => {
  render(<Picker />);
  const button = screen.getByText('«');
  fireEvent.click(button);
  fireEvent.click(button);
  expect(button.id === 'prev');
  let temp = dateHolder.getMonth()-2;
  let year = dateHolder.getFullYear();
  if (temp < 0){
    temp = 12+temp;
    year--;
  } else if (temp>11) {
    temp = temp-11;
    year++
  }
  expect(screen.getByText(`${MonthNames[temp]} ${year}`)).toBeInTheDocument();
});

it('next 5, reset, prev 10', () => {
  render(<Picker />);
  // Next 5
  const button1 = screen.getByText('»');
  for (let i =0; i<5; i++){
    fireEvent.click(button1);
  }
  let temp = dateHolder.getMonth()+5;
  let year = dateHolder.getFullYear();
  if (temp < 0){
    temp = 12+temp;
    year--;
  } else if (temp>11) {
    temp = temp-11;
    year++
  }
  expect(screen.getByText(`${MonthNames[temp]} ${year}`)).toBeInTheDocument();
  //reset
  const resetbutton = screen.getByText(`${MonthNames[temp]} ${year}`);
  fireEvent.click(resetbutton);
  expect(screen.getByText(`${MonthNames[dateHolder.getMonth()]} ${dateHolder.getFullYear()}`)).toBeInTheDocument();
  expect(resetbutton.id === 'display');
  // prev 10
  temp = dateHolder.getMonth()-10;
  year = dateHolder.getFullYear();
  if (temp < 0){
    temp = 12+temp;
    year--;
  } else if (temp>11) {
    temp = temp-11;
    year++
  }
  const button2 = screen.getByText('«');
  for (let i =0; i<10; i++){
    fireEvent.click(button2);
  }
  expect(screen.getByText(`${MonthNames[temp]} ${year}`)).toBeInTheDocument();
});

it('back 17', async () => {
  render(<Picker />)
  // back 17
  const button = screen.getByText('«');
  for (let i = 0; i<17; i++){
    fireEvent.click(button);
  }
  //click on 30 of prevmonth twice
  const prevMonthText = await screen.findAllByText('30');
  const correctDay = prevMonthText.filter((day) => {
    return day.classList.contains('prevMonth');
  });
  expect(correctDay.length).toBe(1);
  fireEvent.click(correctDay[0]);
  fireEvent.click(correctDay[0]);

  const nextMonthText = await screen.findAllByText('5');
  const correctDay2 = nextMonthText.filter((day) => {
    return day.classList.contains('nextMonth');
  });
  expect(correctDay2.length).toBe(1);
  fireEvent.click(correctDay2[0]);
  fireEvent.click(correctDay2[0]);

  const currmonthdate = await screen.findAllByText('28');
  const correctDay3 = currmonthdate.filter((day) => {
    return day.classList.contains('td');
  });
  expect(correctDay3.length).toBe(1);
  fireEvent.click(correctDay3[0]);
});

it('reset check id', () => {
  render(<Picker />)
  const resetbutton = screen.getByText(`${MonthNames[dateHolder.getMonth()]} ${dateHolder.getFullYear()}`);
  fireEvent.click(resetbutton);
  expect(screen.getByText(`${MonthNames[dateHolder.getMonth()]} ${dateHolder.getFullYear()}`)).toBeInTheDocument();
  expect(resetbutton.id === 'display');
});