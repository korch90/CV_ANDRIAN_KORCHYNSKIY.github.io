import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState, useContext } from "react";
import ThemeContext from "./Context";
import s from "../components/Test.module.css"
import reactStringReplace from 'react-string-replace';

const Test=()=>{
    console.log("render1")
const [list, setList]=useState([])
const [listReserv, setListReserv]=useState([])
const [list2, setList2]=useState([])







useEffect(()=>{
    console.log("usw")
    setList ( [{ weekday: "nu99meric", year: 'numeric', month: 'long', day: 'numeric' },
    { weekday: '<strong>9</strong>', year: 'numesdric', month: 'long', day: 'numeric' }
])
setListReserv(
    [{weekday: "num99eric", year: 'numeric', month: 'long', day: 'numeric' },
    { weekday: 'lon9912dg', year: 'numesdric', month: 'long', day: 'numeric' }
]
)
},[])



const fff=(e,el)=>{
    let pattern = new RegExp(`${e}`, "gi")
    
 let res=el.replace(pattern,  function (match) {
    console.log(match)
 
    return  <mark>{match}</mark>
  }   )
let res2= <span>{res}</span> 
  console.log(res)
  return res2
}

// {
//     text.split('\n').map((line, i) => (<span key={i}>{line}<br/></span>))
//   }



// console.log(list)
const markList=(e)=>{  
    let pattern = new RegExp(`${e}`, "gi")

let newList=[...list]

if(e?.length>0){
    // newList[0].weekday = newList[0].weekday.replace(pattern, (match) =>` <strong>${match}</strong>`)
    newList[0].weekday=fff(e,newList[0].weekday)
      console.log(newList[0].weekday)
  
                setList2(newList)
            } 

            return newList 
}










    
    // const markList=(e)=>{
    //     let pattern = new RegExp(`${e}`, "gi")
      
        


    // const newList=[...list]
    //     console.log(newList[0]?.weekday)
    //     if(e?.length>0){
    //         if(e[e.length-1]=="9"){
        
    //            newList.map(el=>el.weekday= <mark>0y00</mark>
    //           ) 
    //           setList2(newList)
    //           console.log(newList[0].weekday)
    //              return newList     
                 
    //         }
    //         else{
    //             console.log(e)
    //            newList.map(el=>
                

    //     {   
     
    //         el.weekday =el.weekday.replace(
    //                 pattern, " <mark>" +e+  "</mark>"
    //                 // console.log(el.weekday)
    //              )}
                 
    //              )
    //              console.log(newList[0].weekday)

               
    //         }
  
    //          setList2(newList)
    //     }
    //     // console.log("func")
    //     // console.log(list)
    //     let fff=JSON.parse(JSON.stringify(newList))
    //     return fff 



    // }

    // console.log("rend")
return(
    <div className={s.wrapper} >

<br />
<br />

<br />
 {/* <button  onClick={ ()=>sum() } >s{s}</button> */}
<input type="text"  onChange={(e)=>markList(e.currentTarget.value)}/>

<ul>
    {markList().map(el=><li   key={el.weekday}  >{el.weekday}</li>)}
    
</ul>


    </div>
)
}


export default Test