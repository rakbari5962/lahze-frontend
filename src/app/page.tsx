"use client";

import { 
Heart,
CalendarDays,
Store,
Users
} from "lucide-react";


import {
  useEffect,
  useState
} from "react";

import { useRouter } from "next/navigation";


import {
  getToken,
  removeToken
} from "@/lib/auth";

import {
  logout
} from "@/services/auth.service";

import {
  getCurrentUser
} from "@/services/user.service";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import CityCard from "@/components/dashboard/CityCard";
import MainActionCard from "@/components/dashboard/MainActionCard";
import QuickActionCard from "@/components/dashboard/QuickActionCard";
import StatsCard from "@/components/dashboard/StatsCard";


export default function HomePage() {

  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);




  useEffect(() => {


    async function loadUser() {


      const token = getToken();


      if (!token) {

        setLoading(false);

        return;

      }




      try {


        const data = await getCurrentUser(
          token
        );


        setUser(data);



      } catch (error) {


        console.log(
          error
        );



      } finally {


        setLoading(false);

      }


    }



    loadUser();



  }, []);


async function handleLogout() {

  const token = getToken();


  if (token) {

    try {

      await logout(token);

    } catch(error) {

      console.log(error);

    }

  }


  removeToken();


  router.push("/login");

}



  if (loading) {


    return (

      <main className="min-h-screen bg-zinc-950 flex items-center justify-center">

        <p className="text-white">
          در حال بارگذاری...
        </p>

      </main>

    );

  }






  return (

  <main 
dir="rtl" 
className="
min-h-screen
bg-[#f5f7fb]
flex
justify-center
p-6
text-right
  "
  >


  <div
  className="
  w-full
  max-w-6xl
  mx-auto
  "
  >


  <div
  className="
  bg-white
  rounded-[32px]
  shadow-sm
  border
  border-slate-100
  p-10
  "
  >


  <DashboardHeader

  name={user?.first_name}
  phone={user?.phone_number}

  />



  <CityCard

  city={user?.city_name}

  />



  <div
  className="
  mt-6
  "
  >


  <MainActionCard

  title="مشاهده فرصت‌های لحظه‌ای"

  subtitle="فرصت‌های موجود امروز در شهر شما"

  />


  </div>



  <div
  className="
  grid
  md:grid-cols-2
  gap-5
  mt-6
  "
  >


  <QuickActionCard

  title="علاقه‌مندی‌ها"

  subtitle="فرصت‌های ذخیره شده"

  icon="❤️"
  theme="red"

  />



  <QuickActionCard

  title="رزروهای من"

  subtitle="مشاهده و مدیریت رزروها"

  icon="📅"
  theme="green"

  />



  <QuickActionCard

  title="افزودن کسب و کار خودم"

  subtitle="کسب و کار خود را در لحظه ثبت کنید"

  icon="🏪"
  theme="purple"

  />



  <QuickActionCard

  title="دعوت دوستان"

  subtitle="لحظه را به دوستان معرفی کن"

  icon="👥"
  theme="blue"

  />



  <QuickActionCard

  title="راهنما و پشتیبانی"

  subtitle="سوالات متداول و ارتباط با ما"

  icon="❓"
  theme="teal"

  />



  </div>




  <div
  className="
  grid
  grid-cols-2
  md:grid-cols-4
  gap-4
  mt-8
  "
  >


  <StatsCard

  title="فرصت فعال امروز"

  value="12"

  icon={<Store size={28}/>}

  theme="blue"
/>


<StatsCard

title="فرصت ذخیره شده"

value="3"

icon={<Heart size={28}/>}

theme="red"
/>


<StatsCard

title="رزرو آینده"

value="2"

icon={<CalendarDays size={28}/>}

theme="green"
/>


<StatsCard

title="دعوت ارسال شده"

value="1"

icon={<Users size={28}/>}

theme="purple"

  />



  </div>




  <button

  onClick={()=>router.push("/profile")}

  className="
  w-full
  mt-8
  rounded-2xl
  bg-slate-100
  py-4
  font-bold
  text-slate-700
  "

  >

  مشاهده و ویرایش پروفایل

  </button>




  <button

  onClick={handleLogout}

  className="
  w-full
  mt-4
  rounded-2xl
  bg-red-500
  py-4
  font-bold
  text-white
  "

  >

  خروج از حساب

  </button>



  </div>


  </div>


  </main>


  );


}