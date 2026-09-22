"use client";

import Link from "next/link";

import BookingActions from "@/components/booking/BookingActions";


import {
  useEffect,
  useState
} from "react";


import {
  getUserBookings,
  BookingResponse
} from "@/services/booking.service";


import {
  getUserId
} from "@/lib/auth";





function translateStatus(
  status: string
) {

  const statuses: Record<string,string> = {

    PENDING_CONFIRMATION:
      "در انتظار تایید",

    CONFIRMED:
      "تایید شده",

    COMPLETED:
      "تکمیل شده",

    CANCELLED:
      "لغو شده",

    NO_SHOW_REPORTED:
      "گزارش عدم حضور"

  };


  return statuses[status] ?? status;

}





function formatPrice(
  price?: number
) {

  if (!price) {
    return "-";
  }


  return (
    price.toLocaleString("fa-IR")
    +
    " تومان"
  );

}





function formatTime(
  date?: string
) {

  if (!date) {
    return "-";
  }


  return new Date(date)
    .toLocaleTimeString(
      "fa-IR",
      {
        hour:"2-digit",
        minute:"2-digit"
      }
    );

}






export default function BookingsPage() {


  const [
    bookings,
    setBookings
  ] = useState<BookingResponse[]>([]);




  const [
    loading,
    setLoading
  ] = useState(true);




  const [
    error,
    setError
  ] = useState("");







  useEffect(()=>{


    async function loadBookings(){


      try {


        const userId = getUserId();



        if(!userId){


          setError(
            "کاربر وارد نشده است"
          );


          return;


        }





        const result =
          await getUserBookings(
            userId
          );



        setBookings(
          result
        );



      }
      catch(error){


        setError(
          "خطا در دریافت رزروها"
        );


      }
      finally{


        setLoading(false);


      }


    }



    loadBookings();



  },[]);






  if(loading){


    return (

      <main className="min-h-screen bg-zinc-950 p-6 text-white">

        در حال دریافت رزروها...

      </main>

    );


  }






  if(error){


    return (

      <main className="min-h-screen bg-zinc-950 p-6 text-red-400">

        {error}

      </main>

    );


  }







  return (

    <main className="min-h-screen bg-zinc-950 p-6">


      <h1 className="text-3xl text-white mb-6">

        رزروهای من

      </h1>





      <div className="space-y-4">


      {

        bookings.map(

          (booking)=>(


          <div

            key={booking.id}

            className="
            rounded-xl
            bg-zinc-900
            border
            border-zinc-800
            p-5
            text-white
            "

          >




            <div className="flex justify-between mb-4">


            <Link

            href={`/bookings/${booking.id}`}

            className="font-bold text-lg hover:text-blue-400"

            >

            رزرو #{booking.id}

            </Link>




              <span>

                {
                  translateStatus(
                    booking.status
                  )
                }

              </span>



            </div>







            <p>

              کسب‌وکار:

              {" "}

              {
                booking.business?.name
                ??
                "-"
              }

            </p>







            <p>

              زمان:

              {" "}


              {
                formatTime(
                  booking.opportunity?.start_time
                )
              }



              {" تا "}



              {
                formatTime(
                  booking.opportunity?.end_time
                )
              }


            </p>








            <p>

              مبلغ:

              {" "}


              {
                formatPrice(
                  booking.opportunity?.final_price
                )
              }


            </p>








            <BookingActions


              booking={booking}



              onUpdated={

                (updatedBooking)=>{


                  setBookings(

                    bookings.map(

                      (item)=>

                        item.id === updatedBooking.id

                        ?

                        updatedBooking

                        :

                        item

                    )

                  );


                }

              }


            />






          </div>


        ))

      }


      </div>





    </main>

  );


}