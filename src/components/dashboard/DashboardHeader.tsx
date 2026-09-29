"use client";

interface Props {
  name?: string;
  phone?: string;
}


export default function DashboardHeader({
  name,
  phone
}: Props) {


return (

<div
className="
flex
items-center
justify-between
mb-8
"
>


{/* خوش آمدگویی */}

<div
className="
text-right
"
>

<h1
className="
text-3xl
font-black
text-slate-900
"
>
سلام {name || "کاربر"} 👋
</h1>


<p
className="
mt-2
text-sm
text-slate-500
font-medium
"
>
آماده‌ای فرصت‌های امروز رو پیدا کنی؟
</p>


</div>





{/* اطلاعات کاربر */}

<div
className="
flex
items-center
gap-4
"
>


<div
className="
text-right
"
>

<p
className="
font-black
text-slate-900
text-base
"
>
{name || "کاربر"}
</p>


<p
className="
text-sm
text-slate-500
mt-1
"
>
{phone}
</p>


</div>



<div
className="
w-14
h-14
rounded-full
bg-blue-100
flex
items-center
justify-center
text-2xl
shadow-sm
"
>
👤
</div>


</div>



</div>


);


}