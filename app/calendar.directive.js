(function () {
  "use strict";

  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  angular.module('PubNative')
    .directive('calendar', function () {
      return {
        templateUrl: 'CalendarTemplate',
        controller: ['Calendar', CalendarController],
        controllerAs: 'calendar',
        bindToController: true
      }
    });


  function CalendarController(Calendar) {
    this.daysInMonth = Calendar.getMonth;
    this.current = null;

    this.getMonthName = function() {
      return MONTHS[Calendar.currentMonth];
    };

    this.addEvent = function () {
      if (!this.current || !this.model.text) {
        return;
      }

      if (!this.current.events) {
        this.current.events = [];
      }

      this.current.events.push({text: this.model.text});
    };

    this.editEvents = function (day) {
      this.model = null;
      this.current = day;
    };

    // TODO: Add view for display and edit all month(s) events
    this.getEvents = function (days) {
      if (!Array.isArray(days)) {
        days = [days];
      }

      return days.reduce(function (result, day) {
        var key;
        if (!day.disabled) {
          key = [day.year, day.month, day.dayNum];
          result[key] = day;
        }

        return result;
      }, {})
    };
  }
}());