"use client";


import {
  useEffect,
  useState
} from "react";


import Link from "next/link";


import {
  getToken
} from "@/lib/auth";


import {
  getCurrentUser,
  CurrentUser
} from "@/services/user.service";






export default function ProfilePage(){


  const [user,setUser] =
    useState<CurrentUser | null>(null);


  const [loading,setLoading] =
    useState(true);






  useEffect(()=>{


    async function loadProfile(){

      console.log("LOAD PROFILE STARTED");


      const token = getToken();



      if(!token){

        setLoading(false);

        return;

      }




      try{


        const data = await getCurrentUser(token);

        console.log("DATA FROM API:", data);

        console.log("API USER DATA:", data);

        setUser(data);



      }catch(error){


        console.log(error);



      }finally{


        setLoading(false);


      }


    }



    loadProfile();



  },[]);








  if(loading){


    return (

      <main
        className="
          min-h-screen
          bg-zinc-950
          flex
          items-center
          justify-center
          text-white
        "
      >

        در حال بارگذاری...

      </main>

    );


  }


  console.log("PROFILE USER:", user);



  return (




    <main

      dir="rtl"

      className="
        min-h-screen
        bg-zinc-950
        p-6
        text-white
      "

    >



      <div

        className="
          max-w-3xl
          mx-auto
        "

      >



        <div

          className="
            bg-zinc-900
            border
            border-zinc-800
            rounded-3xl
            p-8
            shadow-xl
          "

        >



          <div

            className="
              flex
              items-center
              justify-between
              mb-8
            "

          >



            <div>


              <h1

                className="
                  text-3xl
                  font-bold
                "

              >

                پروفایل من

              </h1>



              <p

                className="
                  text-zinc-400
                  mt-2
                "

              >

                اطلاعات شخصی حساب کاربری

              </p>



            </div>





            <Link

              href="/profile/edit"

              className="
                bg-blue-600
                hover:bg-blue-700
                transition
                px-5
                py-3
                rounded-xl
                font-bold
              "

            >

              ویرایش

            </Link>



          </div>








          <div
            className="
              space-y-4
            "
          >


            <ProfileCard

              title="شماره موبایل"

              value={user?.phone_number}

            />


            <ProfileCard

              title="نام"

              value={user?.first_name}

            />




            <ProfileCard

              title="نام خانوادگی"

              value={user?.last_name}

            />



            <ProfileCard

              title="شماره موبایل دوم"

              value={user?.secondary_phone}

            />



            <ProfileCard

              title="کد ملی"

              value={user?.national_id}

            />



            <ProfileCard

              title="جنسیت"

              value={user?.gender}

            />



            <ProfileCard

              title="تاریخ تولد"

              value={user?.birth_date}

            />



            <ProfileCard

              title="تحصیلات"

              value={user?.education}

            />



            <ProfileCard

              title="شغل"

              value={user?.job_title}

            />



            <ProfileCard

              title="ایمیل"

              value={user?.email}

            />



            <ProfileCard

              title="شماره شبا"

              value={user?.iban}

            />



            <ProfileCard

              title="درباره من"

              value={user?.bio}

            />



          </div>





        </div>



      </div>



    </main>


  );


}








function ProfileCard({

  title,

  value

}:{

  title:string;

  value?:string|null;

}){


  return (


    <div

      className="
        bg-zinc-800/60
        border
        border-zinc-700
        rounded-2xl
        p-5
      "

    >


      <p

        className="
          text-sm
          text-zinc-400
          mb-2
        "

      >

        {title}

      </p>



      <p

        className="
          text-lg
          font-medium
        "

      >

        {
          value || "تکمیل نشده"
        }

      </p>



    </div>


  );


}