import { addHours } from "date-fns";
import { useCalendarStore, useUiStore } from "../../hooks"


export const FabAddNew = () => {

   const { setActiveEvent } = useCalendarStore()

   const { openDateModal } = useUiStore();

   const handleClickNew = () => {
    setActiveEvent({
        title: '',
        notes: '',
        start: new Date(),
        end: addHours( new Date(), 2 ),
        bgColor: 'red',
        user: {
        _id: '123',
        name: 'Sergio'
        }
    });

    openDateModal()
   }

  return (
    <button
    className="btn btn-primary fab"
    onClick={ handleClickNew }
    >
    <i className="fas fa-plus" ></i>
    </button>
  )
}
