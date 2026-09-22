"use client";


import {
  useEffect,
  useState
} from "react";


import {
  useParams,
  useRouter
} from "next/navigation";


import {
  createReview,
  getBookingReview,
  ReviewResponse
} from "@/services/review.service";





export default function ReviewPage(){


  const params = useParams();

  const router = useRouter();


  const bookingId = Number(
    params.id
  );



  const [
    existingReview,
    setExistingReview
  ] = useState<ReviewResponse | null>(null);



  const [
    checked,
    setChecked
  ] = useState(false);



  const [
    rating,
    setRating
  ] = useState(0);



  const [
    comment,
    setComment
  ] = useState("");



  const [
    loading,
    setLoading
  ] = useState(false);



  const [
    error,
    setError
  ] = useState("");





  useEffect(()=>{


    async function checkReview(){


      try{


        const result =
          await getBookingReview(
            bookingId
          );


        setExistingReview(
          result
        );


      }
      catch(error){

        console.log(
          "CHECK REVIEW ERROR:",
          error
        );

      }
      finally{

        setChecked(true);

      }


    }



    if(bookingId){

      checkReview();

    }


  },[bookingId]);







  async function handleSubmit(){


    if(rating === 0){

      setError(
        "لطفاً امتیاز را انتخاب کنید"
      );

      return;

    }



    try{


      setLoading(true);

      setError("");



      await createReview({

        booking_id: bookingId,

        rating,

        comment

      });



      alert(
        "نظر شما با موفقیت ثبت شد"
      );



      router.push(
        `/bookings/${bookingId}`
      );


    }
    catch(error){


      console.log(
        "REVIEW ERROR:",
        error
      );


      setError(
        "خطا در ثبت نظر"
      );


    }
    finally{


      setLoading(false);


    }


  }





  if(!checked){

    return (

      <main className="min-h-screen bg-zinc-950 p-6 text-white">

        در حال بررسی...

      </main>

    );

  }







  if(existingReview){


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

            نظر شما ثبت شده است

          </h1>



          <p className="text-yellow-400 text-3xl mb-4">

            {"★".repeat(existingReview.rating)}

          </p>



          <p className="mb-4">

            {existingReview.comment ?? "-"}

          </p>



          <p className="text-zinc-400">

            تاریخ ثبت:

            {" "}

            {
              new Date(
                existingReview.created_at
              ).toLocaleString("fa-IR")
            }

          </p>



        </div>


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

          ثبت تجربه شما

        </h1>





        <p className="mb-3">

          امتیاز شما:

        </p>




        <div className="flex gap-2 mb-6">


          {
            [1,2,3,4,5].map((item)=>(


              <button

                key={item}

                type="button"

                onClick={()=>setRating(item)}

                className={`
                  text-3xl
                  ${
                    item <= rating
                    ?
                    "text-yellow-400"
                    :
                    "text-zinc-600"
                  }
                `}

              >

                ★

              </button>


            ))
          }


        </div>







        <textarea

          value={comment}

          onChange={
            e=>setComment(
              e.target.value
            )
          }

          placeholder="تجربه خود را بنویسید..."

          className="
          w-full
          h-32
          rounded-lg
          bg-zinc-800
          border
          border-zinc-700
          p-3
          text-white
          "

        />







        {
          error
          &&
          <p className="mt-4 text-red-400">

            {error}

          </p>
        }







        <button

          onClick={handleSubmit}

          disabled={loading}

          className="
          mt-6
          rounded-lg
          bg-blue-600
          px-5
          py-2
          text-white
          disabled:opacity-50
          "

        >

          {
            loading
            ?
            "در حال ثبت..."
            :
            "ثبت نظر"
          }


        </button>





      </div>


    </main>

  );


}