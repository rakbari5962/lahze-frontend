import {
  apiGet
} from "./api";



export interface Province {

  id: number;

  name: string;

}



export interface City {

  id: number;

  name: string;

}





export async function getProvinces() {


  return apiGet<Province[]>(

    "/locations/provinces"

  );


}







export async function getCitiesByProvince(

  provinceId: number

) {


  return apiGet<City[]>(

    `/locations/provinces/${provinceId}/cities`

  );


}