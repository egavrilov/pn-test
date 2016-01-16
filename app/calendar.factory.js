(function () {
  "use strict";

  angular.module('PubNative')
    .factory('Calendar', function () {
      var factory = {};
      var date = new Date();
      var cachedMonths = {};

      factory.currentMonth = date.getMonth();
      factory.currentYear = date.getFullYear();

      factory.getMonth = function (year, month) {
        month = month || factory.currentMonth;
        year = year || factory.currentYear;
        var monthKey = getMonthKey(year, month);

        if (!cachedMonths[monthKey]) {
          cachedMonths[monthKey] = getDays(year, month);
          console.log(cachedMonths[monthKey]);
        }

        return cachedMonths[monthKey];
      };

      function getDays(year, month) {
        var currentMonthDays = calcDaysCount(year, month);
        var startDay = currentMonthDays[0].weekday;
        var lastDay = currentMonthDays.slice(-1)[0].weekday;

        if (month === factory.currentMonth && year === factory.currentYear) {
          var whiteHoles = calcWhiteHoles(startDay, lastDay);
          Array.prototype.unshift.apply(currentMonthDays, whiteHoles.prev);
          Array.prototype.push.apply(currentMonthDays, whiteHoles.next);
        }

        return currentMonthDays;
      }

      function calcDaysCount(year, month) {
        var lastDay = new Date(year, month + 1, 0);
        var daysArr = [];

        for (var i = lastDay.getDate(); i > 0; i--) {
          var dateObject = new Date(year, month, i);
          daysArr[i - 1] = {
            year: year,
            month: month,
            dayNum: i,
            weekday: dateObject.getDay()
          };
        }

        return daysArr;
      }

      function getMonthKey(year, month) {
        return [year, month].join('');
      }

      function calcWhiteHoles(startDay, lastDay) {
        var prevMonthIndex = factory.currentMonth - 1;
        var nextMonthIndex = factory.currentMonth + 1;
        var prevYear, nextYear, prevMonth, nextMonth;

        if (factory.currentMonth === 0) {
          prevMonthIndex = 11;
          prevYear = factory.currentYear - 1;
        }

        if (factory.currentMonth === 11) {
          nextMonthIndex = 0;
          nextYear = factory.currentYear + 1;
        }

        prevMonth = factory.getMonth(prevYear || factory.currentYear, prevMonthIndex).slice(-startDay).map(disableDay);
        nextMonth = factory.getMonth(nextYear || factory.currentYear, nextMonthIndex).slice(0, 6 - lastDay).map(disableDay);

        return {
          prev: prevMonth,
          next: nextMonth
        }
      }

      function disableDay(day) {
        day.disabled = true;
        return day;
      }

      return factory;
    });
}());