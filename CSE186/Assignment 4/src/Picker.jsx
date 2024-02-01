import React from 'react';
import './Picker.css';

/**
 * Picker component.
 */
class Picker extends React.Component {
  // https://www.geeksforgeeks.org/reactjs-setstate/
  // https://chat.openai.com/
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator
  // https://www.w3schools.com/js/default.asp

  state = {
      referenceDate: new Date(),
      selectedDate: new Date().getDate(),
      selectedMonth: new Date().getMonth(),
      selectedYear: new Date().getFullYear(),
      contentOfCurrMonth: []
  }

  componentDidMount() { // https://www.geeksforgeeks.org/reactjs-componentdidmount-method/
    this.loadDays();
  }

  // Loads the dates of the calendar and stores into state variable 'contentofCurrMonth'
  loadDays() {
    this.year = this.state.referenceDate.getFullYear();
    this.month = this.state.referenceDate.getMonth();
    const contentOfCurrMonth = [];
    // add days for previous month
    const previousMonthnum = (this.month === 0) ? 11 : this.month - 1;
    let daysInPrevMonth = new Date(this.year, previousMonthnum + 1, 0).getDate();
    for (let i = new Date(this.year, this.month, 1).getDay() - 1; i >= 0; i--) {
      contentOfCurrMonth[i] = daysInPrevMonth--;
    }
    for (let i = 0; i < new Date(this.year, this.month + 1, 0).getDate(); i++) { // add days for current month
      contentOfCurrMonth[new Date(this.year, this.month, 1).getDay() + i] = i + 1;
    }
    let daysInNextMonth = 1; // add days for next month
    for (let i = new Date(this.year, this.month, 1).getDay() + new Date(this.year, this.month + 1, 0).getDate(); i < 42; i++) {
      contentOfCurrMonth[i] = daysInNextMonth++;
    }
    this.setState({
      contentOfCurrMonth
    });
  }

  PrevClick = () => { // previous button is clicked function
    const {referenceDate} = this.state;
    const previousMonthDays = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - 1);
    this.setState({ referenceDate: previousMonthDays}, this.loadDays);
  }

  NextClick = () => { // when next button is clicked function
    const {referenceDate} = this.state;
    const nextMonthDays = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1);
    this.setState({ referenceDate: nextMonthDays}, this.loadDays);
  }

  HeaderClick = () => { // when header is clicked function
    const resetter = new Date();
    this.setState({
      referenceDate: resetter,
      selectedDate: resetter.getDate(),
      selectedMonth: resetter.getMonth(),
      selectedYear: resetter.getFullYear()},
      this.loadDays);
  }

  //function sets state of selected date. variable 'date' passed in is a Date() object 
  setDate(date) {
    this.setState({
      referenceDate: new Date(date.getFullYear(), date.getMonth()),
      selectedDate: date.getDate(),
      selectedMonth: date.getMonth(),
      selectedYear: date.getFullYear()}, this.loadDays);
    this.render;
  }

  /**
   * @return {boolean} a <div> containing the picker
   */
  checkifValid(event){
    const input = event.target.value;
    // https://www.regexlib.com/RETester.aspx?regexp_id=3529&AspxAutoDetectCookieSupport=1
    // TA Jose helped with RegExp
    const temp = RegExp('^(?!0?2/3)(?!0?2/29/.{3}[13579])(?!0?2/29/.{2}[02468][26])'+
    '(?!0?2/29/.{2}[13579][048])(?!(0?[469]|11)/31)(?!0?2/29/[13579][01345789]0{2})'+
    '(?!0?2/29/[02468][1235679]0{2})(0?[1-9]|1[012])/(0?[1-9]|[12][0-9]|3[01])/([0-9]{4})$', 'g'); 
    let extractedTextArray = input.match(temp);
    let isValid = (extractedTextArray!=null) ? false: true;
    //CHECK
    if(extractedTextArray != null){
      const extractedTextParsed = extractedTextArray[0].split("/");
      let newinput = 
        new Date(parseInt(extractedTextParsed[2], 10),
        parseInt(extractedTextParsed[0] - 1, 10),
        parseInt(extractedTextParsed[1],10));
        this.setState({inputDate: newinput});
    }
    return isValid;
  }

  /**
   * @return {object} a <div> containing the picker
   */
  render() {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const { contentOfCurrMonth, referenceDate } = this.state;
    this.MonthNames =
      ['January', 'February', 'March',
        'April', 'May', 'June', 'July',
        'August', 'September', 'October',
        'November', 'December'];
    const weeks = [];
    let headerText = this.MonthNames[this.month] + " " + this.year;
    let counter = 0;
    for (let week = 0; week < 6; week++) {
      const cells = [];
      for (let day = 0; day < 7; day++) {
        const shownDateNum = contentOfCurrMonth[counter];
        const daysInMonth = new Date(this.year, this.month + 1, 0).getDate();
        const checkifPrevMonth = (day < new Date(this.year, this.month, 1).getDay() && week === 0); // day < first day of curr month && first week is being loaded
        const checkifNextMonth = counter >= new Date(this.year, this.month, 1).getDay() + daysInMonth; // counter < firstday of current month + total # of days in next month // chatgpt
        const checkIfToday = (
          (shownDateNum === this.state.selectedDate) &&
          (this.month === this.state.selectedMonth) &&
          (this.year === this.state.selectedYear)
        );
        const id = (checkIfToday && !checkifPrevMonth && !checkifNextMonth) ? 'today' : `d${counter}`;
        const cellClasses = `td ${checkifPrevMonth ? 'prevMonth' : ''} ${checkifNextMonth ? 'nextMonth' : ''}`;
    
        cells.push(
          <td key={id} id={id} className={cellClasses}
            onClick={() => {
              if (checkifPrevMonth) {
                if(this.month-1<0){
                this.setState({
                  referenceDate: new Date(referenceDate.getFullYear(), referenceDate.getMonth() - 1),
                  selectedDate: shownDateNum, selectedMonth: 11, selectedYear: this.year-1}, this.loadDays);
                } else {
                  this.setState({
                    referenceDate: new Date(referenceDate.getFullYear(), referenceDate.getMonth() - 1),
                    selectedDate: shownDateNum, selectedMonth: this.month - 1,selectedYear: this.year}, this.loadDays);
                }
              } else if (checkifNextMonth) {
                if(this.month+1>11){
                  this.setState({
                    referenceDate: new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1),
                    selectedDate: shownDateNum, selectedMonth: 0, selectedYear: this.year+1}, this.loadDays);
                } else {
                  this.setState({
                    referenceDate: new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1),
                    selectedDate: shownDateNum, selectedMonth: this.month + 1, selectedYear: this.year}, this.loadDays);
                }
              } else {
                this.setState({ selectedDate: shownDateNum, selectedMonth: this.month, selectedYear: this.year });
              }
          }}>
            {shownDateNum}
          </td>
        );
        counter++;
      }
      weeks.push(
        <tr key={week}>{cells}</tr>
      );
    }

    return (
      <div id="picker">
        <div id = 'top'>
          <button id="prev" className="buttonprev" onClick={this.PrevClick}>
            &#xab;
          </button>
          <div id = 'top2'>
            <header id="display" onClick={this.HeaderClick}>{headerText}</header>
          </div>
          <button id="next" className="buttonnext" onClick={this.NextClick}>
            &#xbb;
          </button>
        </div>

        <table id="table">
          <thead>
            <tr id="daynames">
              {daysOfWeek.map((day) => (
                <th key={day} id={day} className="th">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{weeks}</tbody>
        </table>
      </div>
    );
  }
}

export default Picker;
