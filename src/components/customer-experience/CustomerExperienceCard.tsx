import {
  Clock,
  Award,
  Users
} from "lucide-react";



interface CustomerExperienceItem {

  title: string;

  total_mentions: number;

  positive_mentions: number;

  negative_mentions: number;

  positive_percentage: number;

  negative_percentage: number;

}



interface Props {

  item: CustomerExperienceItem;

}



export default function CustomerExperienceCard({

  item

}: Props) {



  const getIcon = () => {


    if (item.title.includes("زمان")) {

      return <Clock size={68} strokeWidth={2} />;

    }


    if (item.title.includes("برخورد")) {

      return <Users size={68} strokeWidth={2} />;

    }


    return <Award size={68} strokeWidth={2} />;


  };




  const isPositive =
    item.positive_percentage >= 50;




  return (


    <div

      className={`
        rounded-2xl
        p-6
        border
        shadow-sm

        ${
          isPositive
          ?
          "bg-emerald-50 border-emerald-200"
          :
          "bg-red-50 border-red-200"
        }

      `}

    >



      {/* Top */}

      <div

        className="
          flex
          items-start
          justify-between
        "

      >



        {/* Icon */}

        <div

          className="
            w-22
            h-22
            rounded-full
            bg-white/70
            flex
            items-center
            justify-center
            text-emerald-700
          "

        >

          {getIcon()}

        </div>




        {/* Customer count */}

        <div

          className="
            text-sm
            text-zinc-600
          "

        >

          بر اساس تجربه {item.total_mentions} مشتری

        </div>



      </div>






      {/* Center */}

      <div

        className="
          text-center
          mt-5
        "

      >



        <h3

          className="
            text-3xl
            font-bold
            text-zinc-900
          "

        >

          {item.title}

        </h3>




        <div

          className={`
            mt-3
            text-4xl
            font-bold

            ${
              isPositive
              ?
              "text-emerald-700"
              :
              "text-red-600"
            }

          `}

        >

          {item.positive_percentage}%

        </div>




        <div

          className="
            text-sm
            text-zinc-500
            mt-1
          "

        >

          رضایت مشتریان

        </div>


      </div>






      {/* Bar */}

      <div

        dir="ltr"

        className="
          mt-6
          h-3
          rounded-full
          overflow-hidden
          bg-zinc-200
          flex
        "

      >


        <div

          className="bg-green-500"

          style={{

            width:
            `${item.positive_percentage}%`

          }}

        />



        <div

          className="bg-red-400"

          style={{

            width:
            `${item.negative_percentage}%`

          }}

        />



      </div>






      {/* Bottom */}

      <div

        className="
          mt-5
          flex
          justify-between
          text-sm
        "

      >


        <span className="text-green-700">

          ✓ {item.positive_mentions} مثبت

        </span>




        <span className="text-red-600">

          × {item.negative_mentions} منفی

        </span>



      </div>




    </div>


  );


}