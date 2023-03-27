import s from "../CV/CV_Admin.module.css"
 import { useDispatch, useSelector } from "react-redux";
 import {CVReducerActions} from "../redux/action/actionsCVReducer.js"
 import ThemeContext from "../Context.jsx"
 import { useState , useEffect, useContext} from "react";
 import db, { storage } from "../../firebase"
 import { collection ,addDoc, onSnapshot, deleteDoc, doc, setDoc} from 'firebase/firestore';
 import { getDownloadURL, ref,uploadBytesResumable} from 'firebase/storage';
 import { async } from "@firebase/util";
import TimePickerSection from "../TimePickerSection"
import dayjs from 'dayjs';
import EditToggleWrapper from "../Toggles/EditeToggleWrapper"
import BasicSelect from "../Select/Select.js"

const CV_Admin=()=>{
    const {themeMode, setThemeMode} =useContext(ThemeContext)
  console.log("render CV")

    

const [state, setState]=useState({
    name:false,sname:false,phone:false,email:false,location:false ,link:false,git:false,fb:false,HTML:false,
    CSS:false, Javasquirt:false,  workExperience:[ false,false,false,false],
    education:[false,false,false,false,false],personalQualities:[false,false,false,false,false],
    hobbies:[false,false,false,false,false], language:false })


//nn

const [editValue, setEditValue]=useState({text:""})
const [isTheSameElement, setIsTheSameElement]=useState('')


const docRef=doc(db,"Info", "EAm5Om0rBU23VlXioEGY")
const cvInfo=useSelector(state=>state.CvReducer.cvInfo)
const dispatch=useDispatch()
const collectionRef=collection(db, "Info")

const editMode=cvInfo[0]?.EditMode

const getInfo=()=>{
    onSnapshot(collectionRef,(snapshot)=>{
        dispatch(CVReducerActions.cvInfoOnInit(snapshot.docs.map(doc=>({ ...doc.data(), id:doc.id}))))
    })
} 
useEffect(()=>{   getInfo()   },[])


const handleEdit=(e)=>{
    //  e.preventDefault()

   //провірка чи закритий попередній едіт
 if(isTheSameElement==="" || isTheSameElement===e){

    //провірка чи редагування чи зберішання
 if(state[e]===false){

    setEditValue(({text:cvInfo[0][e]}))
    setState(prev=>({...prev,[e]:true})) 
    setIsTheSameElement(e)
 }
 else{
    setState(prev=>({...prev,[e]:false})) 
    editInfo(e,editValue)
 setEditValue(({text:""}))
 setIsTheSameElement("")

 } }
 else{

 }

}

const handleMoveForRange = (e,name) => {
    let elem = e.target
    let rect = elem.getBoundingClientRect();
    let resForRange=Math.round(e.clientX-rect.left)
    editInfoRange(name,resForRange)
  }

const handleEditRightSide=(e,key)=>{
 
   //провірка чи закритий попередній едіт
 if(isTheSameElement==="" || isTheSameElement===e){
   
    //провірка чи редагування чи зберігання
 if(state[key][e]===false){
     let newKey=state[key]
     newKey[e]=!newKey[e]
     setIsTheSameElement(e) 
     
     if(key==="education"||key==="workExperience"){
        setEditValue(({text:cvInfo[0][key][e].work}))
     }
else{
    setEditValue(({text:cvInfo[0][key][e]}))
}

  
    state[key][e]=true 
 }
 else{
    
    state[key][e]=false 
    editInfoRightSide(e,key,editValue)
 setEditValue(({text:""}))
 setIsTheSameElement("")

 } }
 else{
    console.log(9)
 }

}
  
const handleEditRightSideAddSection=async(key)=>{

let index=cvInfo[0][key].length
let data=cvInfo[0][key]
console.log(index)

//доробити сьогодгішню дату
if(key==="education"||key==="workExperience"){
    data.push({since: "02/18/2000",
    to: "02/3/2000",
    work: ""})

}
else{
    data.push("") 
}
state[key][index]=true

try{ await setDoc(docRef,{
    ...cvInfo[0],
     [key]:data 
   })}
   catch(e){console.log(e)}
  }


const editInfo= async(e,editValue)=>{
    console.log(e)
    console.log(editValue)
       try{ await setDoc(docRef,{
        ...cvInfo[0],
        [e]:editValue.text
       })}
       catch(e){console.log(e)}
}
const editInfoRange= async(name,resForRange)=>{

    // const docRef=doc(db,"Info", "EAm5Om0rBU23VlXioEGY")
       try{ await setDoc(docRef,{
        ...cvInfo[0],
        [name]:resForRange
       })}
       catch(e){console.log(e)}
}
const editInfoRightSide= async(e,key,editValue)=>{
    let newKey=cvInfo[0][key]

    if(key==="workExperience"||key==="education"){
        newKey[e].work=editValue.text
        try{  await setDoc(docRef,{
         ...cvInfo[0],
         [key]:newKey
        })}
        catch(e){console.log(e)}
 }

else{

    newKey[e]=editValue.text
    try{ await setDoc(docRef,{
     ...cvInfo[0],
     [key]:newKey
    })}
    catch(e){console.log(e)} 
}
    }
   

const handleEditRightSideDeleteSection= async(index,key)=>{
    let newKey=cvInfo[0][key]
    newKey.splice(index,1)
       try{ await setDoc(docRef,{
        ...cvInfo[0],
        [key]:newKey
       })}
       catch(e){console.log(e)}
}

const changeValue=(e,key)=>{
        setEditValue(
            prev=>({...prev, text:cvInfo[0][key]}))
        setEditValue({
       ...editValue,
       text:e.target.value
        }
    )
}

const formData=(data)=>{
    return dayjs(data, "MM/DD/YY").format("MM/YYYY")
}

const languageSelect=()=>{
    setState(prev=>({...prev, language:true}))
}

const handleUploadPhoto=(e)=>{

const storageRef= ref (storage,  `/images/${e.target.files[0].name}`)
console.log(e.target.files[0].name)
const uploadData = uploadBytesResumable(storageRef,e.target.files[0])
uploadData.on("state_changed",(snapshot)=>{
    const prog= ((snapshot.bytesTransferred /snapshot.totalBytes)*100)
    console.log(prog)
}, 
 (err)=>console.log(err),

 ()=>{
    getDownloadURL(uploadData.snapshot.ref)
    .then((url)=> addUrl(url))
})

}

const addUrl=async (url)=>{
    console.log(docRef)
    console.log(url)
    try{ await setDoc(docRef,{
        
        ...cvInfo[0],
        url:url
       })}
       catch(e){console.log(e)}
}
// let arr=["Responsible", "efficient", "erudite", "punctual", "having a good sense of humor"]



return(

    <div className={s.container +' '+(themeMode? s.light:s.dark)  }     >
    <div>  <EditToggleWrapper/></div>


<div className={s.leftSide}  >
<div className={s.bigRound} ></div>
<div  className={s.ava  } style={{backgroundImage:  "url(" + cvInfo[0]?.url + ")"}}  >



<input type="file"  className={ (editMode? s.hidden:s.visible)}  onChange={ (e)=>handleUploadPhoto(e)} /> 
</div>
<div className={s.name}>
<div className={s.parent} >
   {state.name? <input type="text"  value={editValue.text} onChange={(e)=>changeValue(e,"name")} /> 
    :<h2> {cvInfo[0]?.name} </h2> }
     <button className={s.btn+" "+  (editMode? s.hidden:s.visible)} onClick={()=>handleEdit("name")} >{state.name?"save":"edit"}
    </button></div>

    <div className={s.parent}>
   {state.sname? <input type="text" value={editValue.text} onChange={(e)=>changeValue(e,"sname")} /> 
    :<h2> {cvInfo[0]?.sname} </h2> } <button  className={s.btn+" "+  (editMode? s.hidden:s.visible)} onClick={()=>handleEdit("sname")} >{state.sname?"save":"edit"}</button>
</div>
</div>



<div className={s.Contacts}>

    <h3> <span>CON</span>TACT INFO</h3>

  <div className={s.parent}><div  className={s.imgPhone}></div> 
   {state.phone? <input type="text" value={editValue.text} onChange={(e)=>changeValue(e,"phone")} /> 
    :<a href = {"tel:"+cvInfo[0]?.phone}>{cvInfo[0]?.phone}</a> } <button  className={s.btn+" "+  (editMode? s.hidden:s.visible)} onClick={()=>handleEdit("phone")} >{state.phone?"save":"edit"}</button>
</div>
    <div className={s.parent}><div  className={s.imgEmail}></div> 
   {state.email? <input type="text" value={editValue.text} onChange={(e)=>changeValue(e,"email")} /> 
    :<a href = {"mailto:"+cvInfo[0]?.email}>{cvInfo[0]?.email}</a> } <button  className={s.btn+" "+  (editMode? s.hidden:s.visible)} onClick={()=>handleEdit("email")} >{state.email?"save":"edit"}</button>
</div>
    <div className={s.parent}><div  className={s.imgLoc}></div> 
   {state.location? <input type="text" value={editValue.text} onChange={(e)=>changeValue(e,"location")} /> 
    :<a href = "#">{cvInfo[0]?.location}</a> } <button  className={s.btn+" "+  (editMode? s.hidden:s.visible)} onClick={()=>handleEdit("location")} >{state.location?"save":"edit"}</button>
</div>
   <div className={s.parent}><div  className={s.imgLink}></div> 
   {state.link? <input type="text" value={editValue.text} onChange={(e)=>changeValue(e,"link")} /> 
    :<a href = "https://www.linkedin.com/in/andrian-korchinsky-23933715a/">{cvInfo[0]?.link}</a> } <button  className={s.btn+" "+  (editMode? s.hidden:s.visible)} onClick={()=>handleEdit("link")} >{state.link?"save":"edit"}</button>
</div>

<div className={s.parent}><div  className={s.imgGit}></div> 
   {state.git? <input type="text" value={editValue.text} onChange={(e)=>changeValue(e,"email")} /> 
    :<a href = {"https://github.com/"+cvInfo[0]?.git}>{cvInfo[0]?.git}</a> } <button  className={s.btn+" "+  (editMode? s.hidden:s.visible)} onClick={()=>handleEdit("git")} >{state.git?"save":"edit"}</button>
</div>

<div className={s.parent}><div  className={s.imgFB}></div> 
   {state.fb? <input type="text" value={editValue.text} onChange={(e)=>changeValue(e,"fb")} /> 
    :<a href = "https://www.facebook.com/profile.php?id=100001685307964">{cvInfo[0]?.fb}</a> } <button  className={s.btn+" "+  (editMode? s.hidden:s.visible)} onClick={()=>handleEdit("fb")} >{state.fb?"save":"edit"}</button>
</div>
    
    
        
</div>
<div className={s.WorkSkills}>
<h3><span >WOR</span>K SKILLS</h3>

<div className={s.WorkSkillsImg}><div>HTML</div><div onClick={(e)=>handleMoveForRange(e,"html")} className={s.line}><hr style={{ width: cvInfo[0]?.html}} className={s.lineGreen} /> <hr className={s.lineWhite} /></div></div>
<div className={s.WorkSkillsImg}><div>CSS</div><div onClick={(e)=>handleMoveForRange(e,"CSS")} className={s.line}><hr style={{ width: cvInfo[0]?.CSS}} className={s.lineGreen} /> <hr className={s.lineWhite} /></div></div>
<div className={s.WorkSkillsImg}><div>Javasquirt</div><div onClick={(e)=>handleMoveForRange(e,"Javasquirt")} className={s.line}><hr style={{ width: cvInfo[0]?.Javasquirt}} className={s.lineGreen} /> <hr className={s.lineWhite} /></div></div>
<div className={s.WorkSkillsImg}><div>React</div><div onClick={(e)=>handleMoveForRange(e,"React")} className={s.line}><hr style={{ width: cvInfo[0]?.React}} className={s.lineGreen} /> <hr className={s.lineWhite} /></div></div>
<div className={s.WorkSkillsImg}><div>GIT</div><div  onClick={(e)=>handleMoveForRange(e,"GIT")} className={s.line}><hr style={{ width: cvInfo[0]?.GIT}} className={s.lineGreen} /> <hr className={s.lineWhite} /></div></div>
<div className={s.WorkSkillsImg}><div>Typescript</div><div onClick={(e)=>handleMoveForRange(e,"Typescript")} className={s.line}><hr style={{ width: cvInfo[0]?.Typescript}} className={s.lineGreen} /> <hr className={s.lineWhite} /></div></div>
<div className={s.WorkSkillsImg}><div>React Redux </div><div  onClick={(e)=>handleMoveForRange(e,"Redux")} className={s.line}><hr style={{ width: cvInfo[0]?.Redux}} className={s.lineGreen} /> <hr className={s.lineWhite} /></div></div>


</div>
</div>

<div></div>
<div className={s.rightSide}>
<div className={s.rightSideSection}>
    <h2>WORK EXPERIENCE</h2>

   
    {cvInfo[0]?.workExperience?.map((el,index)=> <div  key={ index}  >  <div  className={s.workExpSectionWrapper} >  
      <button className={s.btn2+" "+  (editMode? s.hidden:s.visible)} onClick={()=>handleEditRightSide(index,"workExperience")}  > {state.workExperience[index]?"save":"edit"}</button>
      <button className={s.btn4+" "+ (editMode? s.hidden:s.visible)} onClick={()=>handleEditRightSideDeleteSection(index,"workExperience")}  >delete</button>
    {!state.workExperience[index]?  <> <p> {formData(el?.since)} - {formData(el?.to)}</p>   <h4> {el?.work}</h4>
   </>  :<>
    <div className={s.timeContainer}>
    <div className={s.timeContainerTwoCalendars}> 
    <input onChange={(e)=>changeValue(e,index)} value={editValue.text} type="text" /> 
    </div>
    <div className={s.timeContainerTwoCalendars} >
    <div className={s.timePickerSection} ><TimePickerSection index={index} name={"workExperience"} cvInfo={cvInfo}  since_to="since" /></div> 
    <div className={s.timePickerSection} ><TimePickerSection  index={index}  name={"workExperience"}  cvInfo={cvInfo}  since_to="to" /></div> 
</div>
    </div></>}</div> 
  
      </div> )}
      <button className={s.btn3+" "+ (editMode? s.hidden:s.visible)} onClick={()=>handleEditRightSideAddSection("workExperience")}  >+</button>
   

</div>
<hr />
<div className={s.rightSideSection}>
<h2>EDUCATION</h2>

   
{cvInfo[0]?.education?.map((el,index)=> <div  key={ index}  >  <div  className={s.workExpSectionWrapper} >  
  <button className={s.btn2+" "+(editMode? s.hidden:s.visible)} onClick={()=>handleEditRightSide(index,"education")}  > {state.education[index]?"save":"edit"}</button>
  <button className={s.btn4+" "+(editMode? s.hidden:s.visible)} onClick={()=>handleEditRightSideDeleteSection(index,"education")}  >delete</button>
{!state.education[index]?  <> <p> {formData(el?.since)} - {formData(el?.to)}</p>   <h4> {el?.work}</h4>
</>  :<>
<div className={s.timeContainer}>
<div className={s.timeContainerTwoCalendars}> 
<input onChange={(e)=>changeValue(e,index)} value={editValue.text} type="text" /> 
</div>
<div className={s.timeContainerTwoCalendars} >
<div className={s.timePickerSection} ><TimePickerSection index={index} name={"education"} cvInfo={cvInfo}  since_to="since" /></div> 
<div className={s.timePickerSection} ><TimePickerSection  index={index}  name={"education"}  cvInfo={cvInfo}  since_to="to" /></div> 
</div>
</div></>}</div> 

  </div> )}
  <button className={s.btn3+" "+  (editMode? s.hidden:s.visible)} onClick={()=>handleEditRightSideAddSection("education")}  >+</button>

</div>
<hr />
<div className={s.rightSideSection}>
 <h2>PERSONAL QUALITIES</h2>

 {cvInfo[0]?.personalQualities?.map((el,index)=> <div className={s.personalQualitiesItems}  key={ index}  >  <div  className={s.workExpSectionWrapper} >  
  <button className={s.btn2+" "+ (editMode? s.hidden:s.visible)} onClick={()=>handleEditRightSide(index,"personalQualities")}  > {state.personalQualities[index]?"save":"edit"}</button>
  <button className={s.btn4+" "+ (editMode? s.hidden:s.visible)} onClick={()=>handleEditRightSideDeleteSection(index,"personalQualities")}  >delete</button>
  <div>
{!state.personalQualities[index]?  <div  > <h4> {el}</h4>
</div>  :<div className={s.personaItemsKeepSameHeight}  > 

<input onChange={(e)=>changeValue(e,index)} value={editValue.text} type="text" /> 
</div> } </div></div> 

  </div> )}
  <button className={s.btn3 +" "+ (editMode? s.hidden:s.visible)} onClick={()=>handleEditRightSideAddSection("personalQualities")}  >+</button>
</div>
<hr />
<div className={s.rightSideSection}>
<h2>LANGUAGES</h2>
<div className={s.languageSection} >

<p>ENGLISH</p>
<p> {cvInfo[0]?.Language[0]} </p>
{state?.language?<BasicSelect onChange={()=>{ setState(prev=>({...prev, language:false}))}}  />:null}
<button className={s.btn8+" "+ (editMode?  s.hidden:s.visible)} onClick={()=>{ setState(prev=>({...prev, language:!state?.language}))}}   > {state?.language?"save":"edit"}</button>
</div> 
</div>
<hr />
<div className={s.rightSideSection}>

<h2>HOBBIES</h2>
<div className={s.rightSideSectionHobbies}>

{cvInfo[0]?.hobbies?.map((el,index)=> <div className={s.hobbieItem}  key={ index}  > 
 <div  className={s.hobbiesSectionWrapper} >  
 
{!state.hobbies[index]? <div className={s.textWrapper}>  <h4> {el}</h4></div> 
   : <input onChange={(e)=>changeValue(e,index)} value={editValue.text} type="text" /> 

}
<button className={s.btn5+" "+ (editMode? s.hidden:s.visible)} onClick={()=>handleEditRightSide(index,"hobbies")}  > {state.hobbies[index]?"save":"edit"}</button>
  <button className={s.btn6 +" "+ (editMode? s.hidden:s.visible)} onClick={()=>handleEditRightSideDeleteSection(index,"hobbies")}  >delete</button>
</div> 

  </div> )}

  <button className={s.btn7+" "+(editMode? s.hidden:s.visible)} onClick={()=>handleEditRightSideAddSection("hobbies")}  >+</button>
</div> 

</div>



</div>


    </div> 
)
}

export default CV_Admin
 
