import { Tag } from "@/domain/tags"
import instance from "@/lib/axios"

export const getAllTags = async () => {
    try{
      const response = await instance.get<Tag[]>('tags')
      return response.data

    }catch(error){
      console.error(error)
      
    }
  }