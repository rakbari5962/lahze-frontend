interface Props {
  city?: string;
}


export default function CityCard({
  city
}: Props) {


return (

<div
className="
rounded-3xl
bg-blue-50
p-4
flex
items-center
justify-between
mb-5
"
>


{/* اطلاعات شهر */}

<div
className="
flex
items-center
gap-4
"
>

<div
className="
w-11
h-11
rounded-2xl
bg-white
flex
items-center
justify-center
text-2xl
shadow-sm
"
>
📍
</div>


<div
className="
text-right
"
>

<p
className="
text-sm
text-slate-500
font-medium
"
>
شهر انتخابی من
</p>


<h3
className="
mt-1
text-lg
font-black
text-slate-900
"
>
{city || "انتخاب نشده"}
</h3>


</div>


</div>




{/* تغییر شهر */}

<button
className="
bg-white
px-4
py-2
rounded-2xl
font-bold
text-blue-600
shadow-sm
hover:shadow
transition
"
>
تغییر شهر
</button>



</div>

)

}