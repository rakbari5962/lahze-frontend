interface Props {
  title:string;
  subtitle:string;
  onClick?:()=>void;
}


export default function MainActionCard({
  title,
  subtitle,
  onClick
}:Props){


return (

<button

onClick={onClick}

className="
w-full
rounded-3xl
bg-gradient-to-l
from-blue-600
to-blue-500
p-6
text-white
flex
items-center
justify-between
shadow-lg
shadow-blue-200/30
transition
hover:-translate-y-1
duration-200
"

>


{/* متن */}

<div
className="
text-right
"
>

<h2
className="
text-xl
font-black
"
>
{title}
</h2>


<p
className="
mt-2
text-blue-100
font-medium
text-xs
"
>
{subtitle}
</p>


</div>



{/* آیکون */}

<div

className="
w-14
h-14
rounded-2xl
bg-white/25
flex
items-center
justify-center
text-3xl
"

>
⚡
</div>



</button>


)

}