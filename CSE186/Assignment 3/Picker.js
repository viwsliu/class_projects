/**
 * CSE186 Assignment 3 - Advanced
 */
class Picker {
  /**
   * Create a date picker
   * @param {string} containerId id of a node the Picker will be a child of
   */
  constructor(containerId) {
    // Cite Sources:
    // https://www.w3schools.com/js/
    // Secret Sauce from Prof.
    // TA Jose, James Zehui
    this.containerId = containerId;
    if (this.containerId === null) {
      return;
    }
    this.date = new Date();
    this.days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    this.monthnum = this.date.getMonth();
    this.fulldatetoday = [this.date.getDate(),
      this.date.getMonth(),
      this.date.getFullYear()]; // holds d/m/y of saved 'today'
    this.year= this.date.getFullYear();
    this.monthsArray =
      ['January', 'February', 'March',
        'April', 'May', 'June', 'July',
        'August', 'September', 'October',
        'November', 'December'];
    this.monthsArraydates = [{
      0: '31', 1: '28', 2: '31', 3: '30',
      4: '31', 5: '30', 6: '31', 7: '31',
      8: '30', 9: '31', 10: '30', 11: '31'}];
    // https://chat.openai.com/ for lines 32-36 and all other lines identical to them
    if ((((this.year % 4 === 0) &&
     (this.year % 100 !== 0)) ||
     (this.year % 400 === 0))===true) {
      this.monthsArraydates[0][1]=29;
    } else {
      this.monthsArraydates[0][1]=28;
    }
    this.storage;
    // loop to create html
    const root = document.getElementById(this.containerId);
    const header = document.createElement('header');
    header.id = 'display';
    header.className = 'header';
    header.textContent = '{{display}}';
    header.addEventListener('click', () => {
      this.reset();
    });
    if (root != null) {
      root.appendChild(header);
    }
    const table = document.createElement('table');
    table.id = 'table';
    table.className = 'tableclass';
    const tableRow = document.createElement('tr');
    for (let i = 1; i < 8; i++) {
      const tableheader = document.createElement('th');
      tableheader.id = 'H'+i+1;
      tableheader.textContent = this.days[i-1];
      tableRow.appendChild(tableheader);
    }
    table.appendChild(tableRow);
    let tempcounter = 0;
    for (let i = 0; i < 6; i++) {
      const week = document.createElement('tr');
      for (let j = 0; j < 7; j++) {
        const cellday = document.createElement('td');
        cellday.id = 'd'+tempcounter;
        cellday.className = 'hover';

        cellday.addEventListener('click', () => {
          this.todaychange(cellday.id);
        });
        cellday.textContent = '{{' + 'd' + tempcounter + '}}';
        week.appendChild(cellday);
        tempcounter++;
      }
      table.appendChild(week);
    }
    if (root != null) {
      root.appendChild(table);
      this.fullcalendar();
    }
  }
  /**
   * resets the calendar after clicking on month at top
   */
  reset() {
    this.date = new Date();
    this.days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    this.monthnum = this.date.getMonth();
    this.year= this.date.getFullYear();
    if ((((this.year % 4 === 0) &&
    (this.year % 100 !== 0)) ||
    (this.year % 400 === 0))===true) {
      this.monthsArraydates[0][1]=29;
    } else {
      this.monthsArraydates[0][1]=28;
    }
    this.fulldatetoday[this.date.getDate(), this.date.getMonth(),
    this.date.getFullYear()];
    this.fullcalendar();
  }
  /**
   * creates calendar for every month and initial
   */
  fullcalendar() {
    const check = document.getElementById('today');
    if ((check) && (this.monthnum != this.fulldatetoday[1])) {
      document.getElementById('today').id = this.storage;
    }
    if (!(check) && (this.monthnum === this.fulldatetoday[1]) &&
      (this.monthnum === this.fulldatetoday[2])) {
      document.getElementById(this.storage).id = 'today';
    }
    if ((((this.year % 4 === 0) &&
    (this.year % 100 !== 0)) ||
    (this.year % 400 === 0))===true) {
      this.monthsArraydates[0][1]=29;
    } else {
      this.monthsArraydates[0][1]=28;
    }
    const month = this.monthsArray[this.monthnum];

    document.getElementById('display').innerHTML = month + ' ' + this.year;
    const firstDayOfMonth = new Date(this.year, this.monthnum, 1);
    const day = firstDayOfMonth.toString()[0]+
      firstDayOfMonth.toString()[1]+
      firstDayOfMonth.toString()[2];
    let offset = this.days.indexOf(day);
    let counter = 1;
    let nextmonth = false;

    for (let i=0; i<42; i++) {
      const Reg ='d'+i;
      if (offset>0) {
        let tempMonthNumPrior;
        const tempmonthnum = this.monthnum;
        if ((tempmonthnum-1)<0) {
          tempMonthNumPrior = 11;
        } else {
          tempMonthNumPrior = this.monthnum-1;
        }
        const priordatenum = (this.monthsArraydates[0][tempMonthNumPrior]);
        document.getElementById(Reg).innerHTML= priordatenum-offset+1;
        document.getElementById(Reg).classList.add('prevmonth');
        offset-=1;
        continue;
      } else if (counter>(this.monthsArraydates[0][this.monthnum])) {
        counter=1;
        nextmonth = true;
        document.getElementById(Reg).classList.add('nextmonth');
        document.getElementById(Reg).innerHTML= counter;
      } else {
        if (((counter === this.fulldatetoday[0]) &&
            (this.monthnum === this.fulldatetoday[1]) &&
            (this.year===this.fulldatetoday[2]))) {
          document.getElementById(Reg).innerHTML= counter;
          document.getElementById(Reg).id = 'today';
          this.storage = Reg;
        } else {
          if (nextmonth === true) {
            document.getElementById(Reg).classList.add('nextmonth');
          } else {
            if (document.getElementById(Reg).classList.contains('nextmonth')) {
              document.getElementById(Reg).classList.remove('nextmonth');
            }
            if (document.getElementById(Reg).classList.contains('prevmonth')) {
              document.getElementById(Reg).classList.remove('prevmonth');
            }
          }
          document.getElementById(Reg).innerHTML= counter;
        }
      }
      counter++;
    }
  }

  /**
   * changes calendar month next or prev
   * @param {boolean} next determines of button pressed was next
   * @param {boolean} prev determines of button pressed was prev
   */
  change(next, prev) {
    if (next === true) {
      this.monthnum++;
      if (this.monthnum>11) {
        this.monthnum=0;
        this.year++;
      }
      if ((((this.year % 4 === 0) && (this.year % 100 !== 0)) ||
      (this.year % 400 === 0))===true) {
        this.monthsArraydates[0][1]=29;
      }
      const month = this.monthsArray[this.monthnum];
      document.getElementById('display').innerHTML = month + ' ' + this.year;
    }
    if (prev === true) {
      this.monthnum--;
      if (this.monthnum<0) {
        this.monthnum = 11;
        this.year--;
      }
      if ((((this.year % 4 === 0) &&
      (this.year % 100 !== 0)) ||
      (this.year % 400 === 0))===true) {
        this.monthsArraydates[0][1]=29;
      } else {
        this.monthsArraydates[0][1]=28;
      }
      const month = this.monthsArray[this.monthnum];
      document.getElementById('display').innerHTML = month + ' ' + this.year;
    }
    this.fullcalendar();
  }
  /**
  * Change highlight of "today" and which date is 'today'
  * @param {string} Passedid of a node to select as 'today'
  */
  todaychange(Passedid) {
    if (Passedid != 'today') {
      document.getElementById('today').id = this.storage;
      this.storage = Passedid;
      this.fulldatetoday[0] =
      document.getElementById(Passedid).innerHTML; // ?????
      this.fulldatetoday[1] = this.monthnum;
      this.fulldatetoday[2] = this.year;
      document.getElementById(Passedid).id = 'today';
      this.fullcalendar();
    }
  }
}
// To satisfy linter rules
new Picker();
