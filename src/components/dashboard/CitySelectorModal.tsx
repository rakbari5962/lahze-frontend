"use client";

import {
  useEffect,
  useState
} from "react";

import {
  createPortal
} from "react-dom";


import {
  X,
  MapPin,
  ChevronDown,
  Check
} from "lucide-react";

import {
  getProvinces,
  getCitiesByProvince,
  Province,
  City
} from "@/services/location.service";

import {
  getToken
} from "@/lib/auth";

import {
  getCurrentUser,
  updateUserProfile,
  updateUserCity
} from "@/services/user.service";

interface Props {
  currentProvinceId?: number;
  currentCityId?: number;
  onClose: () => void;
  onSaved: (updatedUser: any) => void;
}


export default function CitySelectorModal({
  currentProvinceId,
  currentCityId,
  onClose,
  onSaved,
}: Props) {

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const [provinceId, setProvinceId] = useState<number | undefined>(
    currentProvinceId
  );

  const [cityId, setCityId] = useState<number | undefined>(
    currentCityId
  );

  const [loading,setLoading] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {

	  setMounted(true);

    }, []);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);


  /*
   * دریافت لیست استان‌ها
   */
  useEffect(() => {

    async function loadProvinces() {

      try {

        const data = await getProvinces();

        setProvinces(data);

      } catch (error) {

        console.error("خطا در دریافت استان‌ها:", error);

        setError("دریافت لیست استان‌ها با مشکل مواجه شد.");

      }

    }

    loadProvinces();

  }, []);


  /*
   * دریافت شهرهای استان انتخاب‌شده
   */
  useEffect(() => {

    if (!provinceId) {

      setCities([]);

      return;

    }


    async function loadCities() {

      try {

        setCities([]);

        const data = await getCitiesByProvince(
          provinceId
        );

        setCities(data);

      } catch (error) {

        console.error("خطا در دریافت شهرها:", error);

        setError("دریافت لیست شهرها با مشکل مواجه شد.");

      }

    }

    loadCities();

  }, [provinceId]);


  /*
   * ذخیره استان و شهر
   */
  async function handleSave() {


  if (!provinceId || !cityId) {

    setError("لطفاً استان و شهر را انتخاب کنید");

    return;

  }


  try {


    setLoading(true);

    setError("");


    const token = getToken();


    if (!token) {

      setError("نشست شما منقضی شده است");

      return;

    }



    const updatedUser = await updateUserCity(

      token,

      {
        province_id: provinceId,
        city_id: cityId,
      }

    );


	console.log("DEBUG onSaved:", onSaved);
	console.log("DEBUG type:", typeof onSaved);

    onSaved(updatedUser);



  } catch (error:any) {


    console.log(error);


    setError(
      "ذخیره تغییرات انجام نشد. لطفاً دوباره تلاش کنید."
    );


  } finally {


    setLoading(false);


  }


}
	
	
	
	if (!mounted) {
		return null;
	}

	return createPortal(

	<div

	className="
	fixed
	inset-0
	z-50
	flex
	items-center
	justify-center
	bg-black/30
	backdrop-blur-sm
	p-5
      "
    >

      <div
        className="
          home-city-modal-panel
          w-full
          max-w-md
          rounded-3xl
          bg-white
          p-6
          shadow-2xl
        "
      >


        {/* Header */}

        <div
          className="
            flex
            items-center
            justify-between
            mb-6
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                w-11
                h-11
                rounded-2xl
                bg-blue-50
                text-blue-600
                flex
                items-center
                justify-center
              "
            >

              <MapPin
                size={22}
                strokeWidth={2}
              />

            </div>


            <div className="text-right">

              <h2
                className="
                  font-black
                  text-lg
                  text-slate-900
                "
              >
                انتخاب شهر
              </h2>


              <p
                className="
                  text-sm
                  text-slate-500
                  mt-1
                "
              >
                ابتدا استان و سپس شهر را انتخاب کنید
              </p>

            </div>

          </div>


          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              text-slate-400
              hover:text-slate-700
              transition-colors
              duration-200
              disabled:opacity-50
            "
          >

            <X
              size={22}
            />

          </button>

        </div>


        {/* استان */}

        <div className="mb-4">

          <label
            className="
              block
              text-sm
              font-bold
              text-slate-700
              mb-2
              text-right
            "
          >
            استان
          </label>


          <div className="relative">

            <select
              value={provinceId || ""}
              onChange={(e) => {

                const value = e.target.value;

                setProvinceId(
                  value
                    ? Number(value)
                    : undefined
                );

                setCityId(undefined);

                setError("");

              }}
              disabled={loading}
              className="
                w-full
                rounded-2xl
                border
                border-slate-200
                bg-white
                px-4
                py-4
                text-right
                text-slate-900
                font-medium
                outline-none
                transition
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-100
                disabled:bg-slate-50
                disabled:text-slate-400
                appearance-none
                cursor-pointer
              "
            >

              <option value="">
                انتخاب استان
              </option>


              {
                provinces.map((province) => (

                  <option
                    key={province.id}
                    value={province.id}
                  >
                    {province.name}
                  </option>

                ))
              }

            </select>


            <ChevronDown
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
                pointer-events-none
              "
              size={18}
            />

          </div>

        </div>


        {/* شهر */}

        <div className="mb-4">

          <label
            className="
              block
              text-sm
              font-bold
              text-slate-700
              mb-2
              text-right
            "
          >
            شهر
          </label>


          <div className="relative">

            <select
              disabled={!provinceId || loading}
              value={cityId || ""}
              onChange={(e) => {

                const value = e.target.value;

                setCityId(
                  value
                    ? Number(value)
                    : undefined
                );

                setError("");

              }}
              className="
                w-full
                rounded-2xl
                border
                border-slate-200
                bg-white
                px-4
                py-4
                text-right
                text-slate-900
                font-medium
                outline-none
                transition
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-100
                disabled:bg-slate-50
                disabled:text-slate-400
                appearance-none
                cursor-pointer
              "
            >

              <option value="">
                انتخاب شهر
              </option>


              {
                cities.map((city) => (

                  <option
                    key={city.id}
                    value={city.id}
                  >
                    {city.name}
                  </option>

                ))
              }

            </select>


            <ChevronDown
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
                pointer-events-none
              "
              size={18}
            />

          </div>

        </div>


        {/* خطا */}

        {
          error && (

            <div
              className="
                mb-4
                rounded-2xl
                bg-red-50
                border
                border-red-100
                px-4
                py-3
                text-sm
                font-medium
                text-red-600
                text-right
              "
            >
              {error}
            </div>

          )
        }


        {/* ذخیره */}

        <button
          type="button"
          onClick={handleSave}
          disabled={
            loading ||
            !provinceId ||
            !cityId
          }
          className="
            w-full
            rounded-2xl
            bg-blue-600
            py-4
            font-black
            text-white
            transition-all
            duration-300
            hover:bg-blue-700
            hover:-translate-y-0.5
            hover:shadow-lg
            disabled:opacity-50
            disabled:cursor-not-allowed
            disabled:hover:translate-y-0
            flex
            items-center
            justify-center
            gap-2
          "
        >

          <Check
            size={18}
            strokeWidth={2.5}
          />

          {
            loading
              ? "در حال ذخیره..."
              : "ذخیره تغییرات"
          }

        </button>


	</div>

    </div>

	, document.body
	);


	}