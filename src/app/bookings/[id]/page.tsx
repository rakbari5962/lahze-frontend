"use client";

import BookingActions from "@/components/booking/BookingActions";

import {
  useEffect,
  useState
} from "react";


import {
  useParams
} from "next/navigation";


import { 
  getBooking, 
  BookingResponse
} from "@/services/booking.service";




function translateStatus(
  status:string
){

const map:Record<string,string>={

PENDING_CONFIRMATION:"در انتظار تایید",

CONFIRMED:"تایید شده",

COMPLETED:"تکمیل شده",

CANCELLED:"لغو شده",

NO_SHOW_REPORTED:"گزارش عدم حضور"

};


return map[status] ?? status;

}





function formatPrice(
price?:number
){

if(!price)
return "-";


return price.toLocaleString("fa-IR")
+
" تومان";

}





function formatDate(
date?:string
){

if(!date)
return "-";


return new Date(date)
.toLocaleString(
"fa-IR"
);

}





function formatTime(
date?:string
){

if(!date)
return "-";


return new Date(date)
.toLocaleTimeString(
"fa-IR",
{
hour:"2-digit",
minute:"2-digit"
}
);

}





function translatePaymentStatus(
status?:string
){

const map:Record<string,string>={

ACTIVE:
"مبلغ بلوکه شده",

CAPTURED:
"پرداخت شده",

RELEASED:
"مبلغ آزاد شده"

};


return map[status ?? ""] ?? "-";

}







export default function BookingDetailPage(){


const params = useParams();


const id = Number(
params.id
);



const [
booking,
setBooking
]=useState<BookingResponse|null>(null);







useEffect(()=>{


async function load(){


const result =
await getBooking(id);


setBooking(result);


}



if(id){

load();

}


},[id]);



if(!booking){

return (

<main className="min-h-screen bg-zinc-950 p-6 text-white">

در حال دریافت...

</main>

);

}








return (

<main className="min-h-screen bg-zinc-950 p-6">


<div

className="
max-w-xl
rounded-xl
bg-zinc-900
border
border-zinc-800
p-6
text-white
"

>


<h1 className="text-2xl font-bold mb-6">

جزئیات رزرو #{booking.id}

</h1>





<p>

کسب‌وکار:

{" "}

{booking.business?.name ?? "-"}

</p>





<p className="mt-3">

زمان:

{" "}

{formatTime(
booking.opportunity?.start_time
)}

{" تا "}

{formatTime(
booking.opportunity?.end_time
)}

</p>





<p className="mt-3">

مبلغ:

{" "}

{formatPrice(
booking.opportunity?.final_price
)}

</p>





<p className="mt-3">

وضعیت:

{" "}

{translateStatus(
booking.status
)}

</p>





<p className="mt-3">

تاریخ ایجاد:

{" "}

{formatDate(
booking.created_at
)}

</p>





{
booking.confirmed_at
&&

<p className="mt-3">

تاریخ تایید:

{" "}

{formatDate(
booking.confirmed_at
)}

</p>

}





{
booking.completed_at
&&

<p className="mt-3">

تاریخ تکمیل:

{" "}

{formatDate(
booking.completed_at
)}

</p>

}





{
booking.cancelled_at
&&

<p className="mt-3">

تاریخ لغو:

{" "}

{formatDate(
booking.cancelled_at
)}

</p>

}








<div className="mt-6 border-t border-zinc-700 pt-5">


<h2 className="font-bold text-lg mb-3">

وضعیت پرداخت

</h2>




<p>

مبلغ:

{" "}

{

booking.wallet_hold

?

formatPrice(
booking.wallet_hold.amount
)

:

"-"

}

</p>





<p className="mt-3">

وضعیت:

{" "}

{

translatePaymentStatus(
booking.wallet_hold?.status
)

}

</p>



</div>


<BookingActions

  booking={booking}

  onUpdated={
    (updatedBooking)=>{

      setBooking(
        updatedBooking
      );

    }
  }

/>


</div>


</main>


);


}