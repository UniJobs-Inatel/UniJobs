import { Tag } from "@/domain/tags"
import instance from "@/lib/axios"
import { ApiResponse } from "../inteface"
import { GetAllTagsResponse } from "./inteface"

export const getAllTags = async ():Promise<ApiResponse<GetAllTagsResponse>> => {
    try{
      const response = await instance.get<Tag[]>('tags')
      return {tags:response.data, success:true}

    }catch(error){
      return{error:'Erro ao buscar tags',success:false}
      
    }
  }