"use client";


import {
  useState
} from "react";


import {
  requestOtp,
  verifyOtp
} from "@/services/auth.service";


import {
  saveToken,
  saveUserId
} from "@/lib/auth";





export default function LoginPage() {


  const [phone, setPhone] = useState("");

  const [code, setCode] = useState("");

  const [step, setStep] = useState<
    "phone" | "otp"
  >("phone");


  const [loading, setLoading] = useState(false);





  function saveLoginData(
    result: {
      session_token?: string;
      user_id: number;
    }
  ) {

    if (result.session_token) {

      saveToken(
        result.session_token
      );


      saveUserId(
        result.user_id
      );

    }

  }







  async function handleRequestOtp() {

    try {

      setLoading(true);


      await requestOtp(
        phone
      );


      setStep("otp");


    } finally {

      setLoading(false);

    }

  }








  async function handleVerifyOtp() {


    try {


      setLoading(true);



      const result = await verifyOtp(

        phone,

        code

      );





      saveLoginData(
        result
      );





      if (

        result.requires_city_selection

      ) {


        window.location.href =

          `/select-city?user_id=${result.user_id}`;


        return;

      }







      window.location.href = "/";





    } finally {


      setLoading(false);


    }


  }









  return (


    <main className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">


      <div className="w-full max-w-md rounded-xl bg-zinc-900 p-8 border border-zinc-800">



        <h1 className="text-2xl font-bold text-white mb-6">

          ورود به لحظه

        </h1>





        {
          step === "phone" ? (


            <>


              <input


                value={phone}


                onChange={

                  e => setPhone(e.target.value)

                }


                placeholder="شماره موبایل"


                className="w-full rounded-lg bg-zinc-800 p-3 text-white outline-none"


              />





              <button


                onClick={handleRequestOtp}


                disabled={loading}


                className="mt-4 w-full rounded-lg bg-white text-black p-3 disabled:opacity-50"


              >


                {

                  loading

                    ? "در حال ارسال..."

                    : "دریافت کد"

                }


              </button>



            </>



          ) : (


            <>



              <input


                value={code}


                onChange={

                  e => setCode(e.target.value)

                }


                placeholder="کد ۶ رقمی"


                className="w-full rounded-lg bg-zinc-800 p-3 text-white outline-none"


              />





              <button


                onClick={handleVerifyOtp}


                disabled={loading}


                className="mt-4 w-full rounded-lg bg-white text-black p-3 disabled:opacity-50"


              >



                {

                  loading

                    ? "در حال بررسی..."

                    : "تایید کد"

                }



              </button>



            </>



          )

        }





      </div>


    </main>


  );


}