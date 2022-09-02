import { useSelector, useDispatch } from "react-redux";
import {
  onAddNewEvent,
  onDeleteEvent,
  onLoadEvents,
  onSetActiveEvent,
  onUpdateEvent,
} from "../store/calendar/calendarSlice";

import { calendarApi } from "../api";
import { parseISO } from "date-fns";
import Swal from "sweetalert2";
// import { convertEventsToDateEvents } from '../helpers';

export const useCalendarStore = () => {
  const dispatch = useDispatch();

  const { events, activeEvent } = useSelector((state) => state.calendar);
  const { user } = useSelector((state) => state.auth);

  const setActiveEvent = ( calendarEvent ) => {
    dispatch(onSetActiveEvent( calendarEvent ));
  };

  const startSavingEvent = async ( calendarEvent ) => {
    
    try {

      if ( calendarEvent.id ) {
        // estoy actualizando
        const { data } = await calendarApi.put(`/events/${ calendarEvent.id }`, calendarEvent)
        dispatch(onUpdateEvent({ ...calendarEvent, user }));
        return
      } 
        //creando
  
        const { data } = await calendarApi.post("/events", calendarEvent); //calendarEvent es el body que viaja al back
        console.log({ data });
        dispatch(onAddNewEvent({ ...calendarEvent, id: data.evento.id, user }));
      
      
    } catch (error) {
      console.log(error)
      Swal.fire('Error al guardar', error.response.data.msg, 'error')
      
    }

    
  };

  const startDeletingEvent = async ( ) => {
    //llegar al backend primero
    try {
      const { data } = await calendarApi.delete(`/events/${ activeEvent.id }`) // Para eliminar uso la activeEvent porque son las notas activas
      console.log(data)
      dispatch( onDeleteEvent() );
      
    } catch (error) {
      Swal.fire('Error al eliminar',error.response.data.msg, 'error' )
    };
      
    }

  const startLoadingEvents = async () => {
    try {
      const { data } = await calendarApi.get("/events");
      // console.log(data);
      const events = data.eventos.map((event) => {
        return {
          ...event,
          end: parseISO(event.end),
          start: parseISO(event.start),
        };
      });
      console.log(events)
      dispatch(onLoadEvents( events ));
    } catch (error) {
      console.log(error);
    }
  };

  return {
    //Properties
    events,
    activeEvent,
    hasEventSelected: !!activeEvent,

    //metodos
    setActiveEvent,
    startSavingEvent,
    startDeletingEvent,
    startLoadingEvents,
  };
};
