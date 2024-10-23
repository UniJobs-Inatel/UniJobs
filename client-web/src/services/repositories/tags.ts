import instance from "../api/axios"
import { Tag } from "../../domain/tags"

export const getAllTags = async () => {
    try{
      const response = await instance.get<Tag[]>('tags')
      return response.data

    }catch(error){
      console.error(error)
      
    }
  }