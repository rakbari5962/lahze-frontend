"use client";

import { toJalali } from "@/lib/date";

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
          flex
          items-center
          justify-center
          p-6
          bg-gradient-to-br
          from-zinc-950
          via-slate-900
          to-blue-950
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
  p-6
  bg-[#F6F7FB]
  text-zinc-900
  "
  >

  <div
  className="
  max-w-5xl
  mx-auto
  bg-white
  border
  border-zinc-200
  rounded-2xl
  p-8
  shadow-sm
  "
  >


  {/* Header */}

  <div
  className="
  flex
  items-center
  justify-between
  mb-12
  "
  >

  <div>

  <h1
  className="
  text-4xl
  font-black
  "
  >
  پروفایل من
  </h1>


  <p
  className="
  mt-3
  text-zinc-400
  "
  >
  اطلاعات شخصی حساب کاربری
  </p>

  </div>



  <div
  className="
  flex
  gap-3
  "
  >


  <Link
  href="/profile/edit"
  className="
  bg-blue-600
  hover:bg-blue-700
  px-6
  py-3
  rounded-xl
  font-bold
  transition
  shadow-lg
  shadow-blue-600/20
  "
  >
  ویرایش
  </Link>



  <Link
  href="/"
  className="
  bg-zinc-100
  hover:bg-zinc-200
  text-zinc-700
  px-6
  py-3
  rounded-xl
  font-bold
  transition
  "
  >
  بازگشت
  </Link>


  </div>


  </div>





  <ProfileSection title="اطلاعات تماس">

  <div className="grid md:grid-cols-3 gap-5">

  <ProfileCard
  title="شماره موبایل"
  value={user?.phone_number}
  />


  <ProfileCard
  title="شماره موبایل دوم"
  value={user?.secondary_phone}
  />


  <ProfileCard
  title="ایمیل"
  value={user?.email}
  />


  </div>

  </ProfileSection>





  <ProfileSection title="اطلاعات شخصی">


  <div
  className="
  grid
  md:grid-cols-2
  gap-x-12
  gap-y-2
  "
  >


  <ProfileCard
  title="نام"
  value={user?.first_name}
  />


  <ProfileCard
  title="نام خانوادگی"
  value={user?.last_name}
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
  value={
  user?.birth_date
  ?
  toJalali(user.birth_date)
  :
  "تکمیل نشده"
  }
  />


  </div>


  </ProfileSection>





  <ProfileSection title="اطلاعات کاری">


  <div
  className="
  grid
  md:grid-cols-3
  gap-x-12
  gap-y-2
  "
  >


  <ProfileCard
  title="تحصیلات"
  value={user?.education}
  />


  <ProfileCard
  title="شغل"
  value={user?.job_title}
  />


  <ProfileCard
  title="شماره شبا"
  value={user?.iban}
  />


  </div>


  </ProfileSection>





  <ProfileSection title="درباره من">


  <ProfileCard
  title=""
  value={user?.bio}
  />


  </ProfileSection>




  </div>


  </main>

  );


}

function ProfileSection({

  title,
  children

}:{

  title:string;
  children:React.ReactNode;

}) {


  return (

    <section
      className="
        mb-12
      "
    >

      <div className="mb-6">

      <h2
      className="
      text-xl
      font-bold
      text-zinc-900
      "
      >
      {title}
      </h2>


      <p
      className="
      text-sm
      font-medium
      text-zinc-400
      mt-2
      "
      >
      اطلاعات مربوط به این بخش
      </p>


      </div>


      {children}


    </section>

  );

}


function ProfileCard({

  title,
  value

}:{

  title:string;
  value?:string|null;

}) {


  return (

    <div
      className="
        py-5
        border-b
        border-zinc-800
        last:border-none
      "
    >

      {
        title &&
        <p
          className="
            text-sm
            font-bold
            text-zinc-500
            mb-3
          "
        >
          {title}
        </p>
      }


      <p
        className="
        text-base
        font-semibold
        text-zinc-900
        "
      >

        {
          value || "تکمیل نشده"
        }

      </p>


    </div>

  );

}