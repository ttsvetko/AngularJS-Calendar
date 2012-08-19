angular.module('Calendar', [])
	.directive('searchfilter', function() {
		return {
			controller: function() {},
			restrict: 'E',
			templateUrl: 'templates/searchFilter.html',
			replace: true,
			link: function(scope, element, attrs, controller) {
				scope.searchText = "";
				scope.searchFilterSelect = "subject";
			}
		}
	})
	.directive('calendar', function() {
		return {
			controller: function($scope) {
				//Available locates current locate
				$scope.locales = ["bg", "en-gb", "jp", "ko"];
				$scope.lang = $scope.locales[0];

				//Set current date
				$scope.date = (new Date).setHours(0, 0, 0, 0);

				$scope.events = [];

				//adding new event flag - used to toggle newEvent page
				$scope.newEvent = false;
			},
			restrict: 'E',
			templateUrl: 'templates/calendar.html',
			replace: true,

			link: function(scope, element, attrs, controller) {
                /* private methods */
               function setNewEventDate() {
                    var selectedDate = moment(scope.date),
                        now = moment();
                    
                    scope.newEventHour = now.hours();
                    scope.newEventMinutes = now.minutes();
                    scope.newEventDate = selectedDate.date();
                    scope.newEventMonth = selectedDate.month();
                    scope.newEventYear = selectedDate.year();
                }
                
				/* public method */

                scope.setMonth = function(month) {
                    return scope.months().indexOf(month)
                }
                    
                scope.getDaysInMonth = function() {
                    var date = new Date(scope.newEventYear, scope.newEventMonth, 1);
                    return moment(date).daysInMonth();
                }
                    
                scope.newEventMonthChange = function() {
                    scope.newEventDate = Math.min(scope.newEventDate, scope.getDaysInMonth());
                }
                
				//Get localized months' names
				scope.months = function () {
					return moment.months;
				}

				scope.toggleNewEventPage = function(addNew) {
					if (addNew) {
						scope.newEventSubject = "";
						scope.newEventLocation = "";
                        setNewEventDate();
					}
					scope.newEvent = !!addNew;
				}

				//Change date event listener
				scope.changeDate = function(step) {
					var dateObj = new Date(scope.date),
						date = dateObj.getDate();

					scope.date = dateObj.setDate(date + step);
                    
                    setNewEventDate();
				}

				//Set date today event listener
				scope.today = function() {
					scope.date = (new Date).setHours(0, 0, 0, 0);
                    
                    setNewEventDate();
				}

				//Add new event to the list
				scope.addNew = function() {
					scope.events.push({
						subject: scope.newEventSubject,
						location: scope.newEventLocation,
						date: (new Date(scope.newEventYear, scope.newEventMonth, scope.newEventDate, scope.newEventHour, scope.newEventMinutes)).getTime()
					})
					scope.toggleNewEventPage(false);
				}

				//Change locale listener. Sets moment.js with selected locale
				scope.changeLocale = function() {
					moment.lang(scope.lang);
				}

				//Filtering events function. 
				//Filters events based on the selected filter and entered text
				scope.filteredEvents = function(element, element2) {
					return function(element) {
						return (new Date(element.date).setHours(0, 0, 0, 0) === scope.date) && 
								element[scope.searchFilterSelect].toLowerCase()
									.match((scope.searchText || "").toLowerCase());
					};
				}

				//set initial locale
				scope.changeLocale();
			}
		}
	})
	.filter('dateFilter', function() {
		return function(input, format) {
			return moment(input).format(format || "LL");
		}
	})