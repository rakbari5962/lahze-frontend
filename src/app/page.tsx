"use client";

import {
  Heart,
  CalendarDays,
  Store,
  Users,
  CircleHelp,
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

import InviteBusinessCard from "@/components/dashboard/InviteBusinessCard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import CityCard from "@/components/dashboard/CityCard";
import MainActionCard from "@/components/dashboard/MainActionCard";
import QuickActionCard from "@/components/dashboard/QuickActionCard";
import StatsCard from "@/components/dashboard/StatsCard";
import CitySelectorModal from "@/components/dashboard/CitySelectorModal";


export default function HomePage() {

  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCityModal, setShowCityModal] = useState(false);




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


        setUser({
  ...data
});



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
home-page
min-h-screen
flex
justify-center
p-4
sm:p-5
lg:p-6
text-right
"
>


  <div
  className="
  home-shell
  w-full
  max-w-[1320px]
  mx-auto
  "
  >


  <div
  className="
  home-content
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
  city={`${user?.city_name || "انتخاب نشده"}`}
  onChangeCity={()=>setShowCityModal(true)}

  />



  <div className="home-main-action-wrap home-hero-wrap mt-6">
  <MainActionCard
    title="مشاهده فرصت‌های لحظه آخری"
    subtitle="فرصت‌های موجود امروز در شهر شما"
  />
</div>

<div className="home-invite-wrap home-feature-invite-wrap mt-5">
  <InviteBusinessCard
  onScanQR={() => {
    console.log("QR scanner clicked");
  }}
  onInviteSMS={() => {
    console.log("SMS invite clicked");
  }}
  />


  </div>



  <div
  className="
  home-quick-grid
  grid
  md:grid-cols-2
  gap-5
  mt-6
  "
  >


  <QuickActionCard
  title="علاقه‌مندی‌ها"
  subtitle="فرصت‌های ذخیره شده"
  icon={<Heart size={28} strokeWidth={2} />}
  theme="red"
/>

<QuickActionCard
  title="رزروهای من"
  subtitle="مشاهده و مدیریت رزروها"
  icon={<CalendarDays size={28} strokeWidth={2} />}
  theme="green"
/>

<QuickActionCard
  title="افزودن کسب‌وکار من"
  subtitle="کسب‌وکارتان را ثبت کنید و از فرصت‌های جدید بهره‌مند شوید"
  icon={<Store size={28} strokeWidth={2} />}
  theme="purple"
  onClick={() => router.push("/business/add")}
/>

<QuickActionCard
  title="دعوت دوستان"
  subtitle="لحظه را به دوستان معرفی کن"
  icon={<Users size={28} strokeWidth={2} />}
  theme="blue"
/>

<QuickActionCard
  title="راهنما و پشتیبانی"
  subtitle="سوالات متداول و ارتباط با ما"
  icon={<CircleHelp size={28} strokeWidth={2} />}
  theme="teal"

  />



  </div>




  <div
  className="
  home-stats-grid
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
  status="+۳ امروز"
  icon={<Store size={28} strokeWidth={2} />}
  theme="blue"
/>

<StatsCard
  title="فرصت ذخیره شده"
  value="3"
  status="+۱ امروز"
  icon={<Heart size={28} strokeWidth={2} />}
  theme="red"
/>

<StatsCard
  title="رزرو آینده"
  value="2"
  status="۲ رزرو جدید"
  icon={<CalendarDays size={28} strokeWidth={2} />}
  theme="green"
/>

<StatsCard
  title="دعوت ارسال شده"
  value="1"
  status="آخرین بروزرسانی"
  icon={<Users size={28} strokeWidth={2} />}
  theme="purple"

  />



  </div>




  <button

  onClick={()=>router.push("/profile")}

  className="
  home-profile-btn
  w-full
  mt-8
  rounded-2xl
  bg-slate-100
  py-4
  font-bold
  text-slate-700
  "

  >

  <span className="home-profile-content">
    <span className="home-profile-icon" aria-hidden="true">
      <svg
        width="25"
        height="25"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </span>

    <span className="home-profile-copy">
      <span className="home-profile-title">مشاهده و ویرایش پروفایل</span>
      <span className="home-profile-subtitle">اطلاعات حساب کاربری شما</span>
    </span>

    <svg
      className="home-profile-arrow"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M14 6L8 12L14 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>

  </button>




  <button
  onClick={handleLogout}
  className="
    home-logout-btn
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


{
showCityModal && (

<CitySelectorModal

  currentProvinceId={user?.province_id}

  currentCityId={user?.city_id}

  onClose={()=>setShowCityModal(false)}

  onSaved={(updatedUser)=>{

  console.log(
    "CITY NAME:",
    updatedUser.city_name
  );

  console.log(
    "STATE UPDATE CITY:",
    updatedUser.city_name
  );

  setUser(prev => ({
  ...prev,
  ...updatedUser
}));

  setShowCityModal(false);

  }}

/>

)
}


</div>


</div>


</main>

);

}