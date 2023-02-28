
import React from "react";
import { useState , useEffect} from "react";
import s from "../News2/OpenCart.module.css"
import { useContext } from "react";
import ThemeContext from "../Context"




const OpenCart = ({cart,seeMoreInNewsItems}) => {

  console.log({seeMoreInNewsItems})
    const {themeMode} = useContext(ThemeContext)

const closeCart=(e)=>{
  e.preventDefault()
  e.stopPropagation()
  seeMoreInNewsItems()
}


return(
    <div  className={s.wrapper +' '+(themeMode? s.news_light:s.news_dark)} >

<div className={s.headerImg}  style={{ backgroundImage: `url(${cart[0].image})` }}></div>
<div className={s.main}  > 
<div className={s.description}>{cart[0].description}</div>
<div className={s.title} >{cart[0].title}</div>
<div className={s.link} >{cart[0].link}</div>
<div className={s.date} >{cart[0].date}</div>


<div className={s.backWrapper}>
  <div className={s.backIMG} ></div>
    <div className={s.back} >Back to homepage
    {/* <a onClick={(e)=>seeMoreInNewsItems(e)}  href="#" ></a> */}
   
    <a onClick={(e)=>closeCart(e)}  href="#"  ></a>
    </div> 
    </div>
</div>





    </div> 
)
}


export default OpenCart

