"use client";


import {
  useState,
  useEffect
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

  const [resendTimer, setResendTimer] = useState(0);

useEffect(() => {

  if (resendTimer <= 0) {
    return;
  }


  const timer = setInterval(() => {

    setResendTimer(
      prev => prev - 1
    );

  }, 1000);



  return () => clearInterval(timer);


}, [resendTimer]);

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

  if (!phone) {

    alert(
      "لطفا شماره موبایل را وارد کنید"
    );

    return;

  }


  console.log(
    "REQUEST OTP START",
    phone
  );


  try {


    setLoading(true);



    const result = await requestOtp(
      phone
    );



    console.log(
      "OTP RESPONSE:",
      result
    );



    setStep(
      "otp"
    );


    setResendTimer(
      60
    );



  } catch(error:any) {


    console.log(
      "OTP ERROR:",
      error
    );


    let message = "خطا در ارسال کد";


    if ( 
      error.message?.includes( 
        "Please wait before requesting another OTP" 
      ) 
    ) { 

      setResendTimer(60);


      message = 
        "⏳ لطفاً کمی صبر کنید.\n\nارسال مجدد کد تا ۶۰ ثانیه دیگر امکان‌پذیر است."; 

    }


    alert(message);


  } finally {


    console.log(
      "OTP FINISHED"
    );


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

    <main
      dir="rtl"
      className="
        min-h-screen
        flex
        items-center
        justify-center
        p-6
        bg-gradient-to-br
        from-zinc-950
        via-slate-900
        to-blue-950
      "
    >

      <div
        className="
          w-full
          max-w-5xl
          rounded-3xl
          overflow-hidden
          border
          border-zinc-700/50
          bg-zinc-900/90
          backdrop-blur-xl
          shadow-2xl
          grid
          md:grid-cols-2
        "
      >


        {/* برند */}

        <div
          className="
            hidden
            md:flex
            flex-col
            justify-center
            items-center
            p-16
            bg-gradient-to-br
            from-blue-950
            via-blue-900
            to-zinc-950
            border-l
            border-zinc-800
            text-center
          "
        >


          {/* لوگوی لحظه */}

          <div
            className="
              w-36
              h-36
              rounded-[2.5rem]
              bg-blue-600/20
              border
              border-blue-400/30
              flex
              items-center
              justify-center
              mb-10
              shadow-2xl
            "
          >

            <div
              className="
                relative
                w-20
                h-20
                rounded-full
                border-4
                border-blue-400
                flex
                items-center
                justify-center
              "
            >

              <span
                className="
                  text-5xl
                  font-black
                  text-blue-400
                "
              >
                ✦
              </span>


            </div>


          </div>




          <h2
            className="
              text-5xl
              font-black
              text-white
              mb-5
              tracking-wide
            "
          >
            لحظه
          </h2>


          <p
            className="
              text-zinc-300
              text-xl
              leading-9
              max-w-xs
            "
          >
            سامانه هوشمند خدمات و رزرو آنلاین
          </p>



          <div
            className="
              mt-12
              text-amber-400
              text-base
              font-bold
            "
          >
            خدمات هوشمند، در یک لحظه
          </div>


        </div>





        {/* فرم ورود */}

        <div
          className="
            p-10
            md:p-14
            flex
            flex-col
            justify-center
          "
        >


          <h1
            className="
              text-4xl
              font-black
              text-white
              mb-4
            "
          >
            ورود به حساب کاربری
          </h1>



          <p
            className="
              text-zinc-400
              text-base
              mb-10
            "
          >
            برای ادامه، شماره موبایل خود را وارد کنید
          </p>



          {
            step === "phone" ? (

              <>


                <input
                  value={phone}

                  onChange={
                    e => setPhone(e.target.value)
                  }

                  onKeyDown={
                    e => {
                      if (e.key === "Enter" && !loading) {
                        handleRequestOtp();
                      }
                    }
                  }

                  placeholder="شماره موبایل"

                  className="
                    w-full
                    rounded-2xl
                    bg-zinc-800
                    border
                    border-zinc-700
                    p-5
                    text-lg
                    text-white
                    placeholder:text-zinc-500
                    outline-none
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-500/30
                  "
                />



                <button

                  type="button"

                    onClick={handleRequestOtp}

                    disabled={
                      loading || resendTimer > 0
                    }

                    className="
                      mt-6
                      w-full
                      rounded-2xl
                      bg-blue-600
                      hover:bg-blue-700
                      transition
                      p-5
                      text-lg
                      text-white
                      font-bold
                    "


                >

                  {
                    loading
                      ? "در حال ارسال..."
                      : resendTimer > 0
                        ? `ارسال مجدد کد تا ${resendTimer} ثانیه دیگر`
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

                  className="
                    w-full
                    rounded-2xl
                    bg-zinc-800
                    border
                    border-zinc-700
                    p-5
                    text-lg
                    text-white
                    outline-none
                    focus:border-blue-500
                  "

                />



                <button
                  type="button"

                    onClick={handleVerifyOtp}

                    disabled={loading}

                    className="
                      mt-6
                      w-full
                      rounded-2xl
                      bg-blue-600
                      hover:bg-blue-700
                      transition
                      p-5
                      text-lg
                      text-white
                      font-bold
                    "
                >

                  {
                    loading
                    ? "در حال بررسی..."
                    : "تایید کد"
                  }

                </button>


                  {
                    resendTimer > 0 && (
                      <p className="
                        mt-4
                        text-center
                        text-zinc-400
                      ">
                        ارسال مجدد کد تا {resendTimer} ثانیه دیگر
                      </p>
                    )
                  }

                  {
                    resendTimer === 0 && (
                      <button
                        type="button"
                        onClick={handleRequestOtp}
                        className="
                          mt-4
                          w-full
                          text-blue-400
                          font-bold
                        "
                      >
                        ارسال مجدد کد
                      </button>
                    )
                  }      

              </>


            )
          }




          <div
            className="
              mt-12
              pt-6
              border-t
              border-zinc-800
              text-center
              text-sm
              text-zinc-500
            "
          >

            © 2026 Lahzeh
            <br/>
            تمام حقوق محفوظ است

          </div>


        </div>


      </div>


    </main>

  );


}