import { it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

let dateHolder = new Date();
let MonthNames =
['January', 'February', 'March',
  'April', 'May', 'June', 'July',
  'August', 'September', 'October',
  'November', 'December'];

// https://github.com/testing-library/react-testing-library#basic-example
// TA Jose

it('renders', () => {
  render(<App />);
  expect(screen.getByText(`${MonthNames[dateHolder.getMonth()]} ${dateHolder.getFullYear()}`)).toBeInTheDocument();
});

it('next 5, reset, prev 10, changedate to 01/10/1000', () => {
  render(<App />);
  const button1 = screen.getByText('»');
  for (let i =0; i<5; i++){
    fireEvent.click(button1);
  }
  expect(screen.getByText(`${MonthNames[dateHolder.getMonth()+5]} ${dateHolder.getFullYear()}`)).toBeInTheDocument();
  const resetbutton = screen.getByText(`${MonthNames[dateHolder.getMonth()+5]} ${dateHolder.getFullYear()}`);
  fireEvent.click(resetbutton);
  expect(screen.getByText(`${MonthNames[dateHolder.getMonth()]} ${dateHolder.getFullYear()}`)).toBeInTheDocument();
  const button2 = screen.getByText('«');
  for (let i =0; i<10; i++){
    fireEvent.click(button2);
  }
  let temp = dateHolder.getMonth()-10;
  if (temp < 0){
    temp = 12+temp;
  } else if (temp>11) {
    temp = temp-11;
  }
  expect(screen.getByText(`${MonthNames[temp]} ${dateHolder.getFullYear()-1}`)).toBeInTheDocument();
  const textbox = screen.getByPlaceholderText('MM/DD/YYYY');
  fireEvent.change(textbox, { target: { value: '01/10/1000' } });
  const setbutton = screen.getByText('Set');
  fireEvent.click(setbutton);
  expect(screen.getByText('January 1000')).toBeInTheDocument();
});

it('fills textbox with 12/10/9999', () => {
  render(<App />);
  const textbox = screen.getByPlaceholderText('MM/DD/YYYY');
  fireEvent.change(textbox, { target: { value: '12/10/9999' } });
  const setbutton = screen.getByText('Set');
  fireEvent.click(setbutton);
  expect(screen.getByText('December 9999')).toBeInTheDocument();
});

it('Feb on leap year', () => {
  render(<App />);
  const textbox = screen.getByPlaceholderText('MM/DD/YYYY');
  fireEvent.change(textbox, { target: { value: '02/29/2024' } });
  const setbutton = screen.getByText('Set');
  fireEvent.click(setbutton);
  expect(screen.getByText('February 2024')).toBeInTheDocument();
});

it('checkifValid', () => {
  render(<App />);
  const textbox = screen.getByPlaceholderText('MM/DD/YYYY');
  fireEvent.change(textbox, { target: { value: '02/29' } });
  const setbutton = screen.getByText('Set');
  fireEvent.click(setbutton);
  expect(screen.getByText(`${MonthNames[dateHolder.getMonth()]} ${dateHolder.getFullYear()}`)).toBeInTheDocument();
});