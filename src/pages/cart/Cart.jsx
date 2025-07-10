import { Box, CardContent, CardMedia, Grid, Typography ,Card, IconButton ,Button} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Loader from '../../components/shared/Loader'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Product from './../product/Product';
import { Link } from 'react-router';
import axiosAuth from '../../api/axiosAuth';
import { useQuery, useQueryClient } from '@tanstack/react-query';

function Cart() {
    const queryClient =  useQueryClient();
    const {data ,isLoading ,isError ,error, refetch}=useQuery({
      queryKey:['cartItems'],
      queryFn:async()=>{
        const response= await axiosAuth.get('/Carts');
        return response.data;
      },
      staleTime:0,

    })
    if (isLoading) return <Loader/>
    if (isError) return <p>error... {error.message}</p>

    const increaseQTY=async (id)=>{
      await axiosAuth.patch(`/Carts/increaseCount/${id}`);
      queryClient.setQueriesData(['cartItems'], oldData=>{
      const newCart = oldData.cartResponse.map(p=>p.id==id ? {...p,count : p.count +1 }: p );
      return {...oldData , cartResponse:newCart}
    })
    }

    const decreaseQTY =async (id)=> {
      await axiosAuth.patch(`/Carts/decreaseCount/${id}`);
      refetch();
    }


    const deleteProduct = async (id) => {
  await axiosAuth.delete(`/Carts/${id}`);
  refetch();
};



    const clearCart = async () => {
  try {
    await axiosAuth.delete('/Carts/clearCart');
    queryClient.invalidateQueries(['cartItems']);
  } catch (error) {
    console.error("Failed to clear cart:", error);
  }
};

const totalItems = data.cartResponse.reduce((total, item) => total + item.count, 0);
const totalPrice = data.cartResponse.reduce((total, item) => total + (item.price * item.count), 0);

  return (
   <Box>
    <Typography variant='h3' gutterBottom >Shopping Cart </Typography>
     <Button variant="contained" color="error"  onClick={clearCart}  sx={{ borderRadius: 2 }}>Clear Cart</Button>
    <Grid container spacing={2}>
      <Grid item size={{xs:12,md:8}}>
        {data.cartResponse.map((product)=>
         <Card sx={{ display:'flex',alignItems:'center' ,textAlign:'center',p:4 , mb:2}} key={product.id}>
          <CardMedia component={'img'} image='https://placehold.co/200' alt="this img" sx={{borderRadius:2,width:200}}></CardMedia>
          <CardContent>
            <Typography variant='h5'>{product.name}</Typography>
            <Typography variant='h6'>{product.price}</Typography>
          </CardContent>


          <Box sx={{display:'flex', alignItems:'center',gap:1 }}>
          <IconButton onClick={()=>decreaseQTY(product.id)}><RemoveIcon /></IconButton>
            <Typography>{product.count}</Typography>
           <IconButton onClick={()=>increaseQTY(product.id)}><AddIcon/></IconButton>
            <IconButton color='error'    onClick={() => deleteProduct(product.id)}  ><DeleteIcon /></IconButton>


          </Box>
        </Card>
        )}
      </Grid>


      <Grid item size={{xs:12,md:4}}>
        <Card sx={{p:2}}>
        <Typography variant='h3' gutterBottom > Order Summary</Typography>
         <Typography>Total Items : {totalItems}</Typography> 
         <Typography>Total Price : {totalPrice}$</Typography>
        </Card>
        <Button variant='contained' fullWidth component={Link} to='/checkout'>Process to checkout</Button>
        </Grid>

    </Grid>
   </Box>
  )
}

export default Cart