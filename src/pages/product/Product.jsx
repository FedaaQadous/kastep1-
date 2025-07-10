import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import Loader from '../../components/shared/Loader'
import axios from 'axios';
import { QueryClient} from '@tanstack/react-query'
import { Button, Card, CardContent, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import axiosAuth from '../../api/axiosAuth.jsx';


function Product() {
  const queryClient = new QueryClient()

     const {id} = useParams ('id');
 

    const fetchProduct =async ()=>{
        const {data} = await axios.get(`https://mytshop.runasp.net/api/products/${id}`)
        return data;
    }


const {data,isError,isLoading,error}= useQuery({
  queryKey:['product',id],
  queryFn:fetchProduct,
  staleTime:5000,
})


    const addToCartMutation= useMutation( {
        mutationFn:(productId)=>{
          return axiosAuth.post(`/Carts/${productId}`, {});
        },
        onSuccess :()=>{
          queryClient.invalidateQueries({queryKey:['cartItems']})

        },
        onError:()=>{
          console.log(`error.. ` ,error.message)
        }
      })
      
    

    
     if (isError) return <p>Error:{error.message}</p>

    if(isLoading){
        return <Loader />
    }


  return (
    <Card>
        <CardContent>
            <Typography component ={'h3'}>
              {data.name}
            </Typography>

             <Typography component ={'h3'}>
              {data.description}
            </Typography>

            <Typography component ={'h3'}>
              {data.price}
            </Typography>

            <Button onClick={()=>addToCartMutation.mutate(data.id)}  disabled={addToCartMutation.isPending} >
              {addToCartMutation.isPending ? 'adding ...' : `add to cart`}
              </Button>

            

        </CardContent>
    </Card>
  )
}

export default Product