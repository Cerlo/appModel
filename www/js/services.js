var app = angular.module('starter.services', [])

app.factory('Events', function(PouchDBListener) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var events ;
  return {
    all: function() {
      return events;
    },
    remove: function(evt) {
      events.splice(events.indexOf(evt), 1);
    },
    get: function(evtId) {
      for (var i = 0; i < events.length; i++) {
        if (events[i]._id === parseInt(evtId)) {
          return events[i] + events[i].title;
        }
      }
      return null;
    }
  };
});
