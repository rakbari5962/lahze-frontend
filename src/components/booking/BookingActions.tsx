"use client";


import {
  useState
} from "react";

import Link from "next/link";


import {
  cancelBooking,
  cancelConfirmedBooking,
  BookingResponse
} from "@/services/booking.service";



interface BookingActionsProps {

  booking: BookingResponse;

  onUpdated?: (
    booking: BookingResponse
  ) => void;

}




export default function BookingActions({

  booking,

  onUpdated

}: BookingActionsProps) {


  const [
    loading,
    setLoading
  ] = useState(false);




  async function executeAction(
    action: () => Promise<BookingResponse>
  ) {


    try {

      setLoading(true);


      const updatedBooking =
        await action();


      onUpdated?.(
        updatedBooking
      );


    }
    catch(error){


      console.log(
        "BOOKING ACTION ERROR:",
        error
      );


      alert(
        "خطا در انجام عملیات"
      );


    }
    finally{

      setLoading(false);

    }


  }





  function handleCancelPending(){


    const confirmed =
      window.confirm(
        "آیا از لغو این رزرو مطمئن هستید؟"
      );


    if(!confirmed)
      return;



    executeAction(
      () =>
        cancelBooking(
          booking.id
        )
    );


  }






  function handleCancelConfirmed(){


    const confirmed =
      window.confirm(
        "این رزرو تایید شده است. آیا می‌خواهید لغو کنید؟"
      );


    if(!confirmed)
      return;



    executeAction(
      () =>
        cancelConfirmedBooking(
          booking.id
        )
    );


  }







  if(
    booking.status === "PENDING_CONFIRMATION"
  ){

    return (

      <button

        onClick={
          handleCancelPending
        }

        disabled={loading}

        className="
          mt-4
          rounded-lg
          bg-red-600
          px-4
          py-2
          text-white
          disabled:opacity-50
        "

      >

        {
          loading
          ?
          "در حال لغو..."
          :
          "لغو رزرو"
        }


      </button>

    );

  }








  if(
    booking.status === "CONFIRMED"
  ){

    return (

      <button

        onClick={
          handleCancelConfirmed
        }

        disabled={loading}

        className="
          mt-4
          rounded-lg
          bg-orange-600
          px-4
          py-2
          text-white
          disabled:opacity-50
        "

      >

        {
          loading
          ?
          "در حال لغو..."
          :
          "درخواست لغو رزرو"
        }


      </button>

    );

  }








  if(
  booking.status === "COMPLETED"
  ){

    return (

      <div className="mt-4">


        <div className="text-green-400 mb-4">

          این رزرو تکمیل شده است

        </div>



        <Link

          href={`/bookings/${booking.id}/review`}

          className="
          inline-block
          rounded-lg
          bg-blue-600
          px-5
          py-2
          text-white
          hover:bg-blue-700
          "

        >

          ثبت نظر

        </Link>


      </div>

    );

  }








  if(
    booking.status === "CANCELLED"
  ){

    return (

      <div className="mt-4 text-zinc-400">

        این رزرو لغو شده است

      </div>

    );

  }








  if(
    booking.status === "NO_SHOW_REPORTED"
  ){

    return (

      <div className="mt-4 text-yellow-400">

        گزارش عدم حضور ثبت شده است

      </div>

    );

  }






  return null;


}