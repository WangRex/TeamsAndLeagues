    $(document).ready(function() {


        /* initialize the external events
        -----------------------------------------------------------------*/

        $('#external-events div.external-event').each(function() {

            // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
            // it doesn't need to have a start or end
            var eventObject = {
                title: $.trim($(this).text()) // use the element's text as the event title
            };

            // store the Event Object in the DOM element so we can get to it later
            $(this).data('eventObject', eventObject);

            // make the event draggable using jQuery UI
            $(this).draggable({
                zIndex: 999,
                revert: true, // will cause the event to go back to its
                revertDuration: 0 //  original position after the drag
            });

        });


        /* initialize the calendar
        -----------------------------------------------------------------*/

        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();

        $('#calendar').fullCalendar({
            dayClick: function() {
                console.log($(this));
            },
            header: {
                left: 'prev,next  today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            editable: true,
            droppable: true,
            events: [{
                title: '大连 VS 皇马',
                start: new Date(y, m, 1)
            }, ],
            eventClick: function(calEvent, jsEvent, view) {

                //alert('Event: ' + calEvent.title);
                $("#eventsDetails").find("span").html(calEvent.title);
                //alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
                //alert('View: ' + view.name);

                // change the border color just for fun
                //$(this).css('border-color', 'red');

            }
        });
    });
