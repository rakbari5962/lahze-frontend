"use client";

import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  GraduationCap,
  Headphones,
  Heart,
  Home,
  Landmark,
  LogOut,
  MapPin,
  Mail,
  Pencil,
  Phone,
  Save,
  Search,
  Settings,
  UserRound,
  UsersRound,
} from "lucide-react";

import type { ReactNode } from "react";
import {
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { getToken, removeToken } from "@/lib/auth";
import { toJalali } from "@/lib/date";

import {
  toGregorian
} from "@/lib/date";

import {
  getCurrentUser,
  updateUserProfile,
  CurrentUser,
} from "@/services/user.service";

import {
  getProvinces,
  getCitiesByProvince,
  Province,
  City,
} from "@/services/location.service";


export default function ProfilePage() {

  const router = useRouter();

  const [user, setUser] =
    useState<CurrentUser | null>(null);

  const [draftUser, setDraftUser] =
    useState<CurrentUser | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [editingField, setEditingField] =
    useState<keyof CurrentUser | null>(null);

  const [saving, setSaving] =
    useState(false);


  const [provinces, setProvinces] =
  useState<Province[]>([]);

  const [cities, setCities] =
  useState<City[]>([]);

  const [citiesLoading, setCitiesLoading] =
    useState(false);

  const cityRequestId =
    useRef(0);
    
  async function handleProvinceChange(
    provinceId: number
  ) {

    const selectedProvince =
      provinces.find(
        province =>
          province.id === provinceId
      );

    // هر درخواست جدید، درخواست قبلی را منسوخ می‌کند
    const requestId =
      ++cityRequestId.current;

    // استان جدید انتخاب شد
    // بنابراین شهر قبلی باید پاک شود
    setDraftUser(prev =>
      prev
        ? {
            ...prev,

            province_id:
              provinceId,

            province_name:
              selectedProvince?.name ?? "",

            city_id: null,

            city_name: "",
          }
        : prev
    );

    // شهرهای قبلی را فوراً پاک کن
    setCities([]);

    setCitiesLoading(true);

    try {


      console.log(
        "PROVINCE SELECTED:",
        {
          provinceId,
          selectedProvince,
        }
      );

      const cityList =
        await getCitiesByProvince(
          provinceId
            );

      console.log(
        "CITIES RECEIVED:",
        {
          provinceId,
          cityCount: cityList.length,
          cities: cityList,
        }
      );
      // اگر در این فاصله استان دیگری انتخاب شده،
      // این پاسخ دیگر معتبر نیست
      if (
        requestId !==
        cityRequestId.current
      ) {
        return;
      }

      setCities(cityList);

    } catch (error) {

      console.error(
        "LOAD CITIES ERROR:",
        error
      );

      if (
        requestId ===
        cityRequestId.current
      ) {
        setCities([]);
      }

    } finally {

      if (
        requestId ===
        cityRequestId.current
      ) {
        setCitiesLoading(false);
      }

    }
  }

  function handleCityChange(
    cityId: number
  ) {

    const selectedCity =
      cities.find(
        city =>
          city.id === cityId
      );

    setDraftUser(prev =>
      prev
        ? {
            ...prev,

            city_id:
              cityId,

            city_name:
              selectedCity?.name ?? "",
          }
        : prev
    );

  }

  async function handleSave() {

  if (!draftUser) return;

  const token = getToken();

  if (!token) {
    alert("لطفاً دوباره وارد حساب شوید.");
    return;
  }

  try {

    setSaving(true);

    const birthDateGregorian =
        draftUser.birth_date
          ? toGregorian(
              draftUser.birth_date
            )
          : null;


      if (
        draftUser.birth_date &&
        !birthDateGregorian
      ) {

        alert(
          "تاریخ تولد نامعتبر است. مثال: ۱۳۶۵/۰۴/۲۶"
        );

        setSaving(false);

        return;
      }


      const payload = {

        first_name: draftUser.first_name,
        last_name: draftUser.last_name,
        secondary_phone: draftUser.secondary_phone,
        national_id: draftUser.national_id,
        gender: draftUser.gender,

        birth_date:
          birthDateGregorian,

        education: draftUser.education,
        job_title: draftUser.job_title,
        bio: draftUser.bio,
        iban: draftUser.iban,
        email: draftUser.email,
          };

    console.log(
      "PROFILE SAVE PAYLOAD:",
      payload
    );

    const updated =
      await updateUserProfile(
        token,
        payload
      );

    console.log(
      "UPDATED USER:",
      updated
    );


    /* =========================
      SAVE LOCATION
    ========================= */

    if (
      draftUser.province_id &&
      draftUser.city_id
    ) {

      const locationResponse =
        await fetch(
          "http://127.0.0.1:8000/users/me/city?token=" +
            token,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              province_id:
                draftUser.province_id,

              city_id:
                draftUser.city_id,
            }),
          }
        );


      if (!locationResponse.ok) {

        const errorText =
          await locationResponse.text();

        console.error(
          "LOCATION SAVE ERROR:",
          errorText
        );

        throw new Error(
          "خطا در ذخیره استان و شهر"
        );

      }

    }


    /* =========================
      LOAD FRESH USER
    ========================= */

    const freshUser =
      await getCurrentUser(token);

    console.log(
      "FRESH USER AFTER SAVE:",
      freshUser
    );

    setUser(
      freshUser
    );

    setDraftUser(
      freshUser
    );

    setEditingField(null);

    alert(
      "اطلاعات شما با موفقیت ذخیره شد"
    );

  } catch (error: any) {

    console.error(
      "PROFILE SAVE ERROR:",
      error
    );

    alert(
      error?.message ||
      "خطا در ذخیره اطلاعات"
    );

  } finally {

    setSaving(false);

  }
}

  useEffect(() => {

    async function loadProfile() {

      const token = getToken();

      if (!token) {

        setLoading(false);

        router.push("/login");

        return;

      }


      try {

        const data =
          await getCurrentUser(token);


        console.log(
          "PROFILE COMPLETION DATA:",
          {
            province_id:
              data.province_id,

            city_id:
              data.city_id,

            province_name:
              data.province_name,

            city_name:
              data.city_name,
          }
        );


        setUser(data);

        setDraftUser(data);


        /* =========================
          LOAD PROVINCES
        ========================= */

        const provinceList =
          await getProvinces();

        setProvinces(
          provinceList
        );


        /* =========================
          LOAD CITIES
        ========================= */

        if (data.province_id) {

          const requestId =
            ++cityRequestId.current;

          const cityList =
            await getCitiesByProvince(
              data.province_id
            );

          // اگر کاربر بعداً استان دیگری انتخاب کرده باشد،
          // پاسخ قدیمی را اعمال نکن
          if (
            requestId ===
            cityRequestId.current
          ) {

            setCities(
              cityList
            );

          }

        }
      } catch (error) {

        console.error(
          "PROFILE LOAD ERROR:",
          error
        );

      } finally {

        setLoading(false);

      }

    }


    loadProfile();


  }, [router]);


  /*
   * درصد تکمیل پروفایل
   */
  const completionPercent = useMemo(() => {

  if (!user) return 0;

  const fields = [

    user.first_name,
    user.last_name,
    user.phone_number,
    user.national_id,
    user.gender,
    user.birth_date,
    user.email,
    user.education,
    user.job_title,
    user.bio,
    user.iban,

    // Location
    user.province_name,
    user.city_name,

  ];

  const completed =
    fields.filter(
      value =>
        value !== null &&
        value !== undefined &&
        String(value).trim() !== ""
    ).length;

  return Math.round(
    (completed / fields.length) * 100
  );

}, [user]);


  function handleLogout() {

    removeToken();

    router.push("/login");

  }


  if (loading) {

    return (

      <main
        dir="rtl"
        className="
          profile-page
          min-h-screen
          flex
          items-center
          justify-center
          text-[#171c4b]
        "
      >

        در حال بارگذاری...

      </main>

    );

  }


  if (!user) {

    return (

      <main
        dir="rtl"
        className="
          profile-page
          min-h-screen
          flex
          items-center
          justify-center
          text-[#171c4b]
        "
      >

        اطلاعات پروفایل یافت نشد.

      </main>

    );

  }


  const fullName =
    [user.first_name, user.last_name]
      .filter(Boolean)
      .join(" ")
      || "کاربر لحظه";


  return (

    <main
      dir="rtl"
      className="
        profile-page
        min-h-screen
        text-[#171c4b]
        p-3
        sm:p-5
        lg:p-6
        xl:p-7
      "
    >

      <div className="profile-shell max-w-[1520px] mx-auto">

        <div
          className="
            flex
            flex-col
            lg:flex-row
            gap-4
            xl:gap-5
            items-stretch
          "
        >


          {/* =========================
              RIGHT SIDEBAR
          ========================= */}

          <aside
            className="
              order-1
              w-full
              lg:w-[285px]
              lg:shrink-0
            "
          >

            <div
              className="
                lg:sticky
                lg:top-5
                rounded-[28px]
                border
                border-white/90
                bg-white/95
                shadow-[0_18px_55px_rgba(66,48,170,0.10)]
                overflow-hidden
                backdrop-blur-xl
              "
            >


              {/* LOGO + USER */}

              <div
                className="
                  px-5
                  pt-5
                  pb-5
                  text-center
                  border-b
                  border-[#ecebfa]
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-center
                    gap-1.5
                    text-[26px]
                    font-black
                    text-[#2f258e]
                  "
                >

                  <span>
                    لحظه
                  </span>

                  <span
                    className="
                      text-[#6b38ef]
                      text-2xl
                    "
                  >
                    ◢
                  </span>

                </div>


                <div
                  className="
                    relative
                    mx-auto
                    mt-5
                    h-[78px]
                    w-[78px]
                    rounded-full
                    bg-gradient-to-br
                    from-[#eeeaff]
                    to-[#ffffff]
                    border-4
                    border-white
                    shadow-[0_10px_28px_rgba(78,52,215,0.16)]
                    flex
                    items-center
                    justify-center
                  "
                >

                  <UserRound
                    className="
                      h-10
                      w-10
                      text-[#5a35e8]
                    "
                    strokeWidth={1.8}
                  />

                  {/* VERIFIED BADGE — SIDEBAR PHOTO ONLY */}
                  <div
                    className="
                      absolute
                      -bottom-1
                      -right-1
                      h-7
                      w-7
                      rounded-full
                      bg-[#3f6ff6]
                      border-[3px]
                      border-white
                      flex
                      items-center
                      justify-center
                      shadow-[0_3px_9px_rgba(63,111,246,0.25)]
                    "
                    aria-label="تأیید شده"
                  >
                    <CheckCircle2
                      className="h-4 w-4 text-white"
                      strokeWidth={3}
                    />
                  </div>

                </div>


                <h2
                  className="
                    mt-3
                    text-[17px]
                    font-black
                    text-[#171c4b]
                  "
                >

                  {fullName}

                </h2>


                <p
                  className="
                    mt-1
                    text-xs
                    text-[#8c90a7]
                  "
                >

                  {user.job_title || "عضو لحظه"}

                </p>

              </div>


              {/* MENU */}

              <nav className="p-4 sm:p-5">

                <SidebarItem
                  href="/"
                  icon={<Home />}
                  label="خانه"
                />

                <SidebarItem
                  href="/opportunities"
                  icon={<Search />}
                  label="فرصت‌ها"
                />

                <SidebarItem
                  href="/favorites"
                  icon={<Heart />}
                  label="علاقه‌مندی‌ها"
                />

                <SidebarItem
                  href="/profile"
                  icon={<UserRound />}
                  label="پروفایل من"
                  active
                />

                <SidebarItem
                  href="/business"
                  icon={<Building2 />}
                  label="مدیریت کسب‌وکارهای من"
                />

                <SidebarItem
                  href="/settings"
                  icon={<Settings />}
                  label="تنظیمات"
                />

                <SidebarItem
                  href="/support"
                  icon={<Headphones />}
                  label="پشتیبانی"
                />


                <div
                  className="
                    my-4
                    h-px
                    bg-[#eeeef7]
                  "
                />


                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    w-full
                    flex
                    items-center
                    gap-4
                    rounded-2xl
                    px-4
                    py-3.5
                    text-[#4d5270]
                    hover:bg-[#f7f5ff]
                    transition
                  "
                >

                  <LogOut className="h-5 w-5" />

                  <span className="font-semibold">
                    خروج از حساب
                  </span>

                </button>

              </nav>

            </div>

          </aside>


          {/* =========================
              MAIN
          ========================= */}

          <section
            className="
              order-2
              min-w-0
              flex-1
            "
          >

            <div
              className="
                relative
                overflow-hidden
                rounded-[30px]
                border
                border-white/90
                bg-white/65
                shadow-[0_18px_60px_rgba(66,48,170,0.08)]
                backdrop-blur-xl
              "
            >


              {/* TOP DECORATION */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-x-0
                  top-0
                  h-[190px]
                  overflow-hidden
                  bg-gradient-to-l
                  from-[#eee9ff]
                  via-[#fbfaff]
                  to-[#e9e5ff]
                "
              >
                <div className="absolute -right-[8%] -top-[58%] h-[250px] w-[62%] rounded-[50%] border border-white/80 bg-white/20 blur-[1px]" />
                <div className="absolute right-[17%] -top-[68%] h-[300px] w-[48%] rounded-[50%] border border-white/70 bg-[#c9c0ff]/15" />
                <div className="absolute -left-[12%] -top-[55%] h-[260px] w-[54%] rounded-[50%] border border-white/75 bg-[#d7d0ff]/20" />
                <div className="absolute left-[20%] -bottom-[105px] h-[210px] w-[55%] rounded-full bg-white/35 blur-3xl" />
                <div className="absolute right-[2%] top-[35px] h-32 w-32 rounded-full bg-[#7d5cf5]/10 blur-3xl" />
              </div>


              <div
                className="
                  relative
                  p-3
                  sm:p-4
                  lg:p-5
                "
              >


                {/* =========================
                    PROFILE HEADER
                ========================= */}

                <section
                  className="
                    rounded-[24px]
                    border
                    border-white/90
                    bg-white/72
                    px-5
                    py-5
                    sm:px-6
                    sm:py-5
                    shadow-[0_10px_35px_rgba(73,55,175,0.07)]
                    backdrop-blur-md
                  "
                >

                  <div
                    className="
                      flex
                      flex-col
                      sm:flex-row
                      sm:items-center
                      gap-5
                    "
                  >


                    {/* AVATAR */}

                    <div className="relative shrink-0">

                      <div
                        className="
                          h-[104px]
                          w-[104px]
                          rounded-full
                          border-4
                          border-white
                          bg-gradient-to-br
                          from-[#dfe0e8]
                          to-[#f7f7fa]
                          shadow-[0_10px_28px_rgba(48,42,96,0.17)]
                          flex
                          items-center
                          justify-center
                        "
                      >

                        <UserRound
                          className="
                            h-14
                            w-14
                            text-[#5a5e78]
                          "
                          strokeWidth={1.6}
                        />

                      </div>

                      {/* VERIFIED BADGE */}
                      <div
                        className="
                          absolute
                          -bottom-1
                          -right-1
                          h-8
                          w-8
                          rounded-full
                          bg-[#3f6ff6]
                          border-[3px]
                          border-white
                          flex
                          items-center
                          justify-center
                          shadow-[0_3px_10px_rgba(63,111,246,0.28)]
                        "
                        aria-label="تأیید شده"
                      >
                        <CheckCircle2
                          className="h-5 w-5 text-white"
                          strokeWidth={3}
                        />
                      </div>

                      {/* EDIT BADGE — MAIN PROFILE PHOTO ONLY */}
                      <div
                        className="
                          absolute
                          -bottom-1
                          -left-1
                          h-8
                          w-8
                          rounded-full
                          bg-white
                          border-[3px]
                          border-white
                          flex
                          items-center
                          justify-center
                          text-[#5a31ed]
                          shadow-[0_3px_10px_rgba(63,48,180,0.18)]
                        "
                        aria-hidden="true"
                      >
                        <div
                          className="
                            h-7
                            w-7
                            rounded-full
                            bg-[#f0edff]
                            flex
                            items-center
                            justify-center
                          "
                        >
                          <Pencil
                            className="h-4 w-4"
                            strokeWidth={2.5}
                          />
                        </div>
                      </div>

                    </div>


                    {/* NAME */}

                    <div
                      className="
                        min-w-0
                        flex-1
                      "
                    >

                      <h1
                        className="
                          text-[26px]
                          sm:text-[31px]
                          font-black
                          tracking-tight
                          text-[#11184d]
                        "
                      >

                        {fullName}

                      </h1>


                      <div
                        className="
                          mt-2
                          inline-flex
                          items-center
                          gap-1.5
                          rounded-full
                          bg-[#e8f8ed]
                          px-3
                          py-1.5
                          text-[11px]
                          font-bold
                          text-[#26934b]
                        "
                      >

                        <CheckCircle2
                          className="h-4 w-4"
                        />

                        مورد تایید  

                      </div>


                      <p
                        className="
                          mt-2
                          text-sm
                          sm:text-[15px]
                          font-medium
                          text-[#626984]
                        "
                      >

                        {user.job_title ||
                          "عنوان شغلی تکمیل نشده"}

                        {user.education
                          ? ` · ${user.education}`
                          : ""}

                      </p>

                    </div>


                    {/* PROFILE COMPLETION */}

                    <div
                      className="
                        shrink-0
                        self-center
                        sm:self-auto
                        text-center
                      "
                    >

                      <div
                        className="
                          relative
                          h-[98px]
                          w-[98px]
                          rounded-full
                          flex
                          items-center
                          justify-center
                        "
                        style={{
                          background:
                            `conic-gradient(
                              #6235e9
                              ${completionPercent * 3.6}deg,
                              #ece8ff 0deg
                            )`,
                        }}
                      >

                        <div
                          className="
                            h-[74px]
                            w-[74px]
                            rounded-full
                            bg-white
                            flex
                            items-center
                            justify-center
                          "
                        >

                          <span
                            className="
                              text-[21px]
                              font-black
                              text-[#1d2350]
                            "
                          >

                            {completionPercent}٪

                          </span>

                        </div>

                      </div>


                      <p
                        className="
                          mt-2
                          text-sm
                          font-bold
                          text-[#666b82]
                        "
                      >

                        تکمیل پروفایل

                      </p>

                    </div>

                  </div>

                </section>


                {/* =========================
                    PERSONAL
                ========================= */}

                <ProfileSection
                  title="اطلاعات شخصی"
                  icon={<UserRound />}
                  className="mt-5"
                >

                  <div
                    className="
                      grid
                      grid-cols-1
                      md:grid-cols-2
                      gap-3
                    "
                  >

                    <ProfileField
                      title="نام"
                      value={user.first_name}
                      editableKey="first_name"
                      draftUser={draftUser}
                      editingField={editingField}
                      setDraftUser={setDraftUser}
                      setEditingField={setEditingField}
                    />

                    <ProfileField
                      title="نام خانوادگی"
                      value={user.last_name}
                      editableKey="last_name"
                      draftUser={draftUser}
                      editingField={editingField}
                      setDraftUser={setDraftUser}
                      setEditingField={setEditingField}
                    />

                    <ProfileField
                      title="شماره موبایل"
                      value={user.phone_number}
                      dir="ltr"
                      showEditIcon={false}
                    />

                    <ProfileField
                      title="شماره موبایل دوم"
                      value={user.secondary_phone}
                      dir="ltr"
                      editableKey="secondary_phone"
                      draftUser={draftUser}
                      editingField={editingField}
                      setDraftUser={setDraftUser}
                      setEditingField={setEditingField}
                    />

                    <ProfileField
                      title="کد ملی"
                      value={user.national_id}
                      dir="ltr"
                      editableKey="national_id"
                      draftUser={draftUser}
                      editingField={editingField}
                      setDraftUser={setDraftUser}
                      setEditingField={setEditingField}
                    />

                    <ProfileField
                      title="جنسیت"
                      value={user.gender}
                      editableKey="gender"
                      draftUser={draftUser}
                      editingField={editingField}
                      setDraftUser={setDraftUser}
                      setEditingField={setEditingField}
                    />

                    <ProfileField
                      title="تاریخ تولد"
                      value={toJalali(
                        user.birth_date
                      )}
                      editableKey="birth_date"
                      draftUser={draftUser}
                      editingField={editingField}
                      setDraftUser={setDraftUser}
                      setEditingField={setEditingField}
                    />

                    <ProfileField
                      title="ایمیل"
                      value={user.email}
                      dir="ltr"
                      editableKey="email"
                      draftUser={draftUser}
                      editingField={editingField}
                      setDraftUser={setDraftUser}
                      setEditingField={setEditingField}
                    />

                  </div>

                </ProfileSection>


                {/* =========================
                    LOCATION
                ========================= */}

                <ProfileSection
                  title="اطلاعات موقعیت مکانی"
                  icon={<MapPin />}
                  className="mt-5"
                >

                  <div
                    className="
                      grid
                      grid-cols-1
                      md:grid-cols-2
                      gap-3
                    "
                  >

                    <ProfileField
                      title="استان"
                      value={draftUser?.province_name ?? ""}
                      selectLike

                      editableKey="province_id"

                      draftUser={draftUser}
                      editingField={editingField}
                      setDraftUser={setDraftUser}
                      setEditingField={setEditingField}

                      provinces={provinces}
                      cities={cities}
                      citiesLoading={citiesLoading}

                      onProvinceChange={
                        handleProvinceChange
                      }

                      onCityChange={
                        handleCityChange
                    }
                    />

                    <ProfileField
                      title="شهر"
                      value={draftUser?.city_name ?? ""}
                      selectLike

                      editableKey="city_id"

                      draftUser={draftUser}
                      editingField={editingField}
                      setDraftUser={setDraftUser}
                      setEditingField={setEditingField}

                      provinces={provinces}
                      cities={cities}
                      citiesLoading={citiesLoading}

                      onProvinceChange={
                        handleProvinceChange
                      }

                      onCityChange={
                        handleCityChange
                      }
                    />

                  </div>

                </ProfileSection>


                {/* =========================
                    PROFESSIONAL
                ========================= */}

                <ProfileSection
                  title="اطلاعات حرفه‌ای و تحصیلی"
                  icon={<BriefcaseBusiness />}
                  className="mt-5"
                >

                  <div
                    className="
                      grid
                      grid-cols-1
                      md:grid-cols-2
                      gap-3
                    "
                  >

                    <ProfileField
                      title="تحصیلات"
                      value={user.education}
                      editableKey="education"
                      draftUser={draftUser}
                      editingField={editingField}
                      setDraftUser={setDraftUser}
                      setEditingField={setEditingField}
                    />

                    <ProfileField
                      title="عنوان شغلی"
                      value={user.job_title}
                      editableKey="job_title"
                      draftUser={draftUser}
                      editingField={editingField}
                      setDraftUser={setDraftUser}
                      setEditingField={setEditingField}
                    />

                    <ProfileField
                      title="درباره من"
                      value={user.bio}
                      full
                      multiline
                      editableKey="bio"
                      draftUser={draftUser}
                      editingField={editingField}
                      setDraftUser={setDraftUser}
                      setEditingField={setEditingField}
                    />

                  </div>

                </ProfileSection>


                {/* =========================
                    FINANCIAL
                ========================= */}

                <ProfileSection
                  title="اطلاعات مالی"
                  icon={<Landmark />}
                  className="mt-5"
                >

                  <ProfileField
                    title="شماره شبا (IBAN)"
                    value={user.iban}
                    dir="ltr"
                    full
                    editableKey="iban"
                    draftUser={draftUser}
                    editingField={editingField}
                    setDraftUser={setDraftUser}
                    setEditingField={setEditingField}
                  />

                </ProfileSection>


                {/* =========================
                    SAVE
                ========================= */}

                <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="
                      mt-4
                      w-full
                      rounded-[18px]
                      bg-gradient-to-l
                      from-[#4c28e8]
                      via-[#6838ef]
                      to-[#8b62ff]
                      hover:from-[#4220d6]
                      hover:to-[#7446f1]
                      transition-all
                      duration-200
                      text-white
                      min-h-[50px]
                      flex
                      items-center
                      justify-center
                      gap-2
                      font-extrabold
                      shadow-[0_10px_25px_rgba(93,52,235,0.24)]
                      disabled:opacity-60
                      disabled:cursor-not-allowed
                    "
                  >
                    <Save className="h-5 w-5" />

                    {saving
                      ? "در حال ذخیره..."
                      : "ذخیره تغییرات"}

                  </button>

              </div>

            </div>

          </section>

        </div>

      </div>

    </main>

  );
}


/* =====================================================
   SIDEBAR ITEM
===================================================== */

function SidebarItem({
  href,
  icon,
  label,
  active = false,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  active?: boolean;
}) {

  return (

    <Link
      href={href}
      className={[
        "flex items-center gap-4 rounded-2xl px-4 py-3.5 transition",

        active
          ? "bg-gradient-to-l from-[#552ce8] to-[#8b62ff] text-white font-extrabold shadow-[0_10px_24px_rgba(91,49,232,0.22)]"
          : "text-[#4d5270] hover:bg-[#f7f5ff]",

      ].join(" ")}
    >

      <span
        className={
          active
            ? "text-white"
            : "text-[#626981]"
        }
      >

        {icon}

      </span>

      <span>
        {label}
      </span>

    </Link>

  );
}


/* =====================================================
   SECTION
===================================================== */

function ProfileSection({
  title,
  icon,
  children,
  className = "",
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}) {

  return (

    <section
      className={[
        `
          rounded-[22px]
          border
          border-white/95
          bg-white/78
          p-3
          sm:p-4
          shadow-[0_8px_28px_rgba(73,55,175,0.055)]
          backdrop-blur-md
        `,
        className,
      ].join(" ")}
    >

      <div
        className="
          mb-3
          flex
          items-center
          justify-between
          gap-3
          text-[#171c4b]
        "
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f0edff] text-[#5a31ed]">
            {icon}
          </span>
          <div className="min-w-0">
            <h2 className="text-[16px] sm:text-[17px] font-black leading-6">
              {title}
            </h2>
            <p className="mt-0.5 text-[10px] sm:text-[11px] font-medium text-[#8b90a8]">
              {title === "اطلاعات شخصی"
                ? "اطلاعات فردی و تماس شما"
                : title === "اطلاعات موقعیت مکانی"
                  ? "استان و شهر محل زندگی شما"
                  : title === "اطلاعات حرفه‌ای و تحصیلی"
                    ? "اطلاعات شغلی و تحصیلی شما"
                    : "اطلاعات حساب بانکی شما"}
            </p>
          </div>
        </div>

        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f4f1ff] text-[#5b32eb]">
          <ChevronDown className="h-5 w-5" strokeWidth={2.6} />
        </span>
      </div>

      {children}

    </section>

  );
}


/* =====================================================
   FIELD
===================================================== */

function ProfileField({
  title,
  value,
  dir = "rtl",
  full = false,
  multiline = false,
  selectLike = false,
  showEditIcon = true,
  editableKey,
  draftUser,
  editingField,
  provinces,
  cities,
  citiesLoading,
  onProvinceChange,
  onCityChange,
  setDraftUser,
  setEditingField,
}: {
  title: string;
  value?: string | null;
  dir?: "rtl" | "ltr";
  full?: boolean;
  multiline?: boolean;
  selectLike?: boolean;
  showEditIcon?: boolean;
  provinces?: Province[];

  cities?: City[];
  citiesLoading?: boolean;
  onProvinceChange?: (
    provinceId: number
  ) => void;

  onCityChange?: (
    cityId: number
  ) => void;

  editableKey?:
  | "first_name"
  | "last_name"
  | "secondary_phone"
  | "national_id"
  | "gender"
  | "birth_date"
  | "education"
  | "job_title"
  | "bio"
  | "iban"
  | "province_id"
  | "city_id"
  | "email";
  

  draftUser?: CurrentUser | null;

  editingField?: keyof CurrentUser | null;

  setDraftUser?: (
    value:
      | CurrentUser
      | null
      | ((
          prev: CurrentUser | null
        ) => CurrentUser | null)
  ) => void;

  setEditingField?: (
    value: keyof CurrentUser | null
  ) => void;
}) {

  const hasValue =
    value !== null &&
    value !== undefined &&
    String(value).trim() !== "";

  const isEditing =
    editableKey !== undefined &&
    editingField === editableKey;

  const draftValue =
    editableKey !== undefined
      ? draftUser?.[editableKey] ?? ""
      : "";

  let editingContent: any = null;

  function handleChange(
    nextValue: string
  ) {

    if (
      !editableKey ||
      !setDraftUser
    ) {
      return;
    }

    setDraftUser(prev =>
      prev
        ? {
            ...prev,
            [editableKey]: nextValue,
          }
        : prev
    );
  }

  const fieldIcon = (() => {
    const iconClass = "h-[19px] w-[19px]";

    switch (title) {
      case "نام":
      case "نام خانوادگی":
        return <UserRound className={iconClass} strokeWidth={2} />;
      case "شماره موبایل":
      case "شماره موبایل دوم":
        return <Phone className={iconClass} strokeWidth={2} />;
      case "کد ملی":
        return <CreditCard className={iconClass} strokeWidth={2} />;
      case "جنسیت":
        return <UsersRound className={iconClass} strokeWidth={2} />;
      case "تاریخ تولد":
        return <CalendarDays className={iconClass} strokeWidth={2} />;
      case "ایمیل":
        return <Mail className={iconClass} strokeWidth={2} />;
      case "استان":
        return <MapPin className={iconClass} strokeWidth={2} />;
      case "شهر":
        return <Building2 className={iconClass} strokeWidth={2} />;
      case "تحصیلات":
        return <GraduationCap className={iconClass} strokeWidth={2} />;
      case "عنوان شغلی":
        return <BriefcaseBusiness className={iconClass} strokeWidth={2} />;
      case "درباره من":
        return <Pencil className={iconClass} strokeWidth={2} />;
      case "شماره شبا (IBAN)":
        return <Landmark className={iconClass} strokeWidth={2} />;
      default:
        return <UserRound className={iconClass} strokeWidth={2} />;
    }
  })();

  const fieldClass = [
    `
      group
      relative
      min-h-[62px]
      rounded-[15px]
      border
      border-[#e6e3ff]
      bg-white/72
      hover:border-[#c9bfff]
      hover:bg-white
      transition-all
      duration-200
      px-3
      py-2.5
      shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]
    `,

    full
      ? "md:col-span-2"
      : "",

  ].join(" ");

  if (
    editableKey === "province_id"
  ) {

    editingContent = (

      <select
        value={
          String(
            draftValue ?? ""
          )
        }

        onChange={(e) => {

          const provinceId =
            Number(
              e.target.value
            );

          if (
            onProvinceChange
          ) {
            onProvinceChange(
              provinceId
            );
          }

        }}

        autoFocus

        className="
          mt-1
          w-full
          rounded-xl
          border
          border-[#dfe3ef]
          bg-white
          px-3
          py-2
          text-[15px]
          sm:text-[16px]
          font-bold
          text-[#1c224d]
          outline-none
          focus:border-[#6a3bea]
          focus:ring-2
          focus:ring-[#6a3bea]/10
        "
      >

        <option value="">
          انتخاب استان
        </option>

        {provinces?.map(
          province => (

            <option
              key={province.id}
              value={province.id}
            >
              {province.name}
            </option>

          )
        )}

      </select>

    );

  } else if (
    editableKey === "city_id"
  ) {

    editingContent = (

      <select
        value={
          String(
            draftValue ?? ""
          )
        }

        onChange={(e) => {

          const cityId =
            Number(
              e.target.value
            );

          if (
            onCityChange
          ) {
            onCityChange(
              cityId
            );
          }

        }}

        disabled={
          !draftUser?.province_id ||
          citiesLoading
        }

        autoFocus

        className="
          mt-1
          w-full
          rounded-xl
          border
          border-[#dfe3ef]
          bg-white
          px-3
          py-2
          text-[15px]
          sm:text-[16px]
          font-bold
          text-[#1c224d]
          outline-none
          disabled:bg-[#f3f4f8]
          disabled:text-[#a1a5b5]
          focus:border-[#6a3bea]
          focus:ring-2
          focus:ring-[#6a3bea]/10
        "
      >

        <option value="">
          {
            citiesLoading
              ? "در حال دریافت شهرها..."
              : draftUser?.province_id
                ? "انتخاب شهر"
                : "ابتدا استان را انتخاب کنید"
          }
        </option>

        {cities?.map(
          city => (

            <option
              key={city.id}
              value={city.id}
            >
              {city.name}
            </option>

          )
        )}

      </select>

    );

  } else if (
    editableKey === "gender"
  ) {

    editingContent = (
      <select
        value={String(draftValue ?? "")}
        onChange={(e) =>
          handleChange(e.target.value)
        }
        autoFocus
        className="
          mt-1
          w-full
          rounded-xl
          border
          border-[#dfe3ef]
          bg-white
          px-3
          py-2
          text-[15px]
          sm:text-[16px]
          font-bold
          text-[#1c224d]
          outline-none
          focus:border-[#6a3bea]
          focus:ring-2
          focus:ring-[#6a3bea]/10
        "
      >
        <option value="">
          انتخاب جنسیت
        </option>

        <option value="مرد">
          مرد
        </option>

        <option value="زن">
          زن
        </option>
      </select>
    );

  } else if (
    multiline
  ) {

    editingContent = (
      <textarea
        value={String(draftValue ?? "")}
        onChange={(e) =>
          handleChange(e.target.value)
        }
        rows={4}
        autoFocus
        dir={dir}
        className="
          mt-1
          w-full
          resize-none
          rounded-xl
          border
          border-[#dfe3ef]
          bg-white
          px-3
          py-2
          text-[15px]
          sm:text-[16px]
          font-bold
          text-[#1c224d]
          outline-none
          focus:border-[#6a3bea]
          focus:ring-2
          focus:ring-[#6a3bea]/10
        "
      />
    );

  } else {

    editingContent = (
      <input
        type={
          editableKey === "email"
            ? "email"
            : "text"
        }
        value={String(draftValue ?? "")}
        onChange={(e) =>
          handleChange(e.target.value)
        }
        autoFocus
        dir={dir}
        placeholder={
          editableKey === "birth_date"
            ? "مثلاً ۱۳۶۵/۰۴/۲۶"
            : undefined
        }
        className="
          mt-1
          w-full
          bg-transparent
          outline-none
          border-0
          p-0
          text-[15px]
          sm:text-[16px]
          font-bold
          text-[#1c224d]
          placeholder:text-[#a1a5b5]
        "
      />
    );

  }
  const fieldContent = (
    <>

      {/* EDIT ICON */}

      {showEditIcon && (
        <div
          className="
            absolute
            left-3
            top-1/2
            -translate-y-1/2
            h-9
            w-9
            rounded-xl
            border
            border-[#e6e4f2]
            bg-white/95
            flex
            items-center
            justify-center
            text-[#59617c]
            shadow-[0_2px_8px_rgba(60,45,140,0.04)]
            group-hover:text-[#5d32e7]
            group-hover:border-[#cfc5ff]
            transition
          "
        >
          {editableKey ? (
            <button
              type="button"
              onClick={() => {
                if (editableKey === "birth_date") {
                  setDraftUser?.(prev =>
                    prev
                      ? {
                          ...prev,
                          birth_date: ""
                        }
                      : prev
                  );
                }

                setEditingField?.(editableKey);
              }
              }
              className="
                h-full
                w-full
                flex
                items-center
                justify-center
              "
              aria-label={`ویرایش ${title}`}
            >
              <Pencil className="h-4 w-4" />
            </button>
          ) : (
            <Pencil className="h-4 w-4" />
          )}
        </div>
      )}

      {/* CONTENT */}

      <div className="flex min-w-0 items-center gap-2.5 pr-0 pl-11 sm:pl-12">
        <div className="min-w-0 flex-1 text-right">
          <div className="text-[10px] sm:text-[11px] text-[#7f849d] font-medium leading-4">
            {title}
          </div>

          {isEditing ? (
            editingContent
          ) : (
            <div
              dir={dir}
              className={[
                `
                  mt-0.5
                  text-[14px]
                  sm:text-[15px]
                  font-black
                  text-[#131a4d]
                  break-words
                  leading-5
                `,

                !hasValue
                  ? "text-[#a1a5b5] font-medium"
                  : "",

                multiline
                  ? "leading-6"
                  : "",

              ].join(" ")}
            >
              {hasValue
                ? value
                : "تکمیل نشده"}
            </div>
          )}
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#ddd8ff] bg-[#f1eeff] text-[#5730ed]">
          {fieldIcon}
        </div>
      </div>

    </>
  );


  /*
   * اگر فیلد قابل ویرایش باشد،
   * دیگر Link نیست.
   *
   * بنابراین با کلیک روی مداد
   * به /profile/edit نمی‌رود.
   */

  if (editableKey || showEditIcon === false) {
    return (
      <div className={fieldClass}>
        {fieldContent}
      </div>
    );
  }

  return (
    <Link
      href="/profile/edit"
      className={fieldClass}
    >
      {fieldContent}
    </Link>
  );
  }

/* =====================================================
   PERSIAN DATE
===================================================== */

function formatPersianDate(
  value?: string | null
) {

  if (!value) {
    return null;
  }


  const date =
    new Date(value);


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return value;

  }


  return new Intl.DateTimeFormat(
    "fa-IR-u-ca-persian",
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
  ).format(date);

}