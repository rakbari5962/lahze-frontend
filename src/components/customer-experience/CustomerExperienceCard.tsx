interface CustomerExperienceItem {

  title: string;

  total_mentions: number;

  positive_percentage: number;

  negative_percentage: number;

}



interface Props {

  item: CustomerExperienceItem;

}



export default function CustomerExperienceCard({

  item

}: Props) {


  return (

    <div className="py-2 min-w-[220px]">


      <div className="flex flex-col gap-2">


        {/* Title */}

        <div>


          <h3 className="text-sm font-medium text-gray-900">

            {item.title}

          </h3>


          <p className="mt-1 text-xs text-gray-500">

            تجربه {item.total_mentions} مشتری

          </p>


        </div>





        {/* Sentiment */}

        <div

          dir="ltr"

          className="flex items-center gap-2 w-full"

        >


          {/* Positive Percentage */}

          <span className="text-xs whitespace-nowrap text-green-600">

            {item.positive_percentage}%

          </span>





          {/* Sentiment Bar */}

          <div

            className="flex-1 h-2 overflow-hidden rounded-full bg-gray-200 flex"

          >


            {item.positive_percentage > 0 && (

              <div

                className="bg-green-500 h-full"

                style={{

                  width: `${item.positive_percentage}%`

                }}

              />

            )}





            {item.negative_percentage > 0 && (

              <div

                className="bg-red-500 h-full"

                style={{

                  width: `${item.negative_percentage}%`

                }}

              />

            )}


          </div>





          {/* Negative Percentage */}

          <span className="text-xs whitespace-nowrap text-red-500">

            {item.negative_percentage}%

          </span>


        </div>


      </div>


    </div>

  );

}