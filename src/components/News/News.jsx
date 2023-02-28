import axios from "axios";
import React from "react";
import { useState , useEffect} from "react";
import s from "../News/News.module.css"
import { useContext } from "react";
import ThemeContext from "../Context"
import Preloader from "../Preloader/Preloader";

const News = () => {

    const errorRef = React.createRef()
    const [newsData, setNewsData] = useState([])
    const [previousNewsData, setPreviousNewsData] = useState([])
    const {
      themeMode
    } = useContext(ThemeContext)
    const [isActiveClass, setIsActiveClass] = useState("hiddenItem")
    const [isResponseCome, setIsResponseCome] = useState(true)
    const [newItemsSectionShow, setNewItemsSectionShow] = useState(9)


    window.addEventListener('scroll', function () {
      var scrollHeight = document.documentElement.scrollHeight;
      var clientHeight = document.documentElement.clientHeight;
      var height = scrollHeight - clientHeight;
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

      if (height === scrollTop) {
        setNewItemsSectionShow(newItemsSectionShow + 9)
        // console.log(newItemsSectionShow)
      }

    })


    const newsUrl="https://newsapi.org/v2/everything?q=tesla&from=2022-12-11&sortBy=publishedAt&apiKey=94ecac4d82874e44a171d09756f3b460"

    useEffect(() => {
      const options = {
        method: 'GET',
        url: newsUrl,
  
      };

      axios.request(options)
        .then(function (response) {
          setPreviousNewsData(response.data.articles)
          setNewsData(response.data.articles)
          console.log(response.data.articles[0])
        
       
          if (errorRef.current) {
            errorRef.current.classList.remove(`${s.errorHidden}`)
            errorRef.current.classList.add(`${s.errorHidden}`)
          }
          setIsResponseCome(false)

        }).catch(function (error) {

          if (errorRef.current) {
            errorRef.current.classList.remove(`${s.errorHidden}`)
            errorRef.current.classList.add(`${s.errorShow}`)
          }
        })
    }, [])


    function searchNews(e) {
      let filterSearch = e.target.value.toLowerCase()
      setNewsData(previousNewsData.filter(el => el.name.toLowerCase().includes(filterSearch)))
    }

    function seeMoreInNewsItems(e) {
      e.preventDefault()
      e.stopPropagation()
      if (!themeMode) {
        if (isActiveClass === "hiddenItem") {
          setIsActiveClass("activeItemDarkTheme")
          e.currentTarget.parentNode.firstChild.classList.remove(`${s.hiddenItem}`);
          e.currentTarget.parentNode.firstChild.classList.add(`${s.activeItemDarkTheme}`);
          document.getElementsByClassName("wrapper")[0].addEventListener("click", function () {
            if (document.getElementsByClassName(`${s.activeItemDarkTheme}`)[0]) {
              setIsActiveClass("hiddenItem")
              document.getElementsByClassName(`${s.activeItemDarkTheme}`)[0].classList.add(`${s.hiddenItem}`);
              document.getElementsByClassName(`${s.activeItemDarkTheme}`)[0].classList.remove(`${s.activeItemDarkTheme}`);
            }
          })

        } else {
          setIsActiveClass("hiddenItem")
          e.currentTarget.parentNode.classList.remove(`${s.activeItemDarkTheme}`);
          e.currentTarget.parentNode.classList.add(`${s.hiddenItem}`);
        }
      } else {
        if (isActiveClass === "hiddenItem") {
          // console.log(e.currentTarget.parentNode.firstChild)
          setIsActiveClass("activeItem")
          e.currentTarget.parentNode.firstChild.classList.remove(`${s.hiddenItem}`);
          e.currentTarget.parentNode.firstChild.classList.add(`${s.activeItem}`);
          document.getElementsByClassName("wrapper")[0].addEventListener("click", function () {
            if (document.getElementsByClassName(`${s.activeItem}`)[0]) {
              setIsActiveClass("hiddenItem")
              document.getElementsByClassName(`${s.activeItem}`)[0].classList.add(`${s.hiddenItem}`);
              document.getElementsByClassName(`${s.activeItem}`)[0].classList.remove(`${s.activeItem}`);
            }


          })
        } else {

          setIsActiveClass("hiddenItem")
          e.currentTarget.parentNode.classList.remove(`${s.activeItem}`);
          e.currentTarget.parentNode.classList.add(`${s.hiddenItem}`);

        }

      }

    }


return(
    <div  className={s.wrapper +' '+(themeMode? s.news_light:s.news_dark)} >


    <input type="text" placeholder="find"  onChange={(e)=>searchNews(e)} />
<Preloader isResponseCome={isResponseCome} />

<div  ref={errorRef} className={s.errorHidden} >internet problem...</div>

<ul> 
    {newsData.filter((el,index)=>index<newItemsSectionShow).map(el =><li   key={el.name} > 

    
   <div className={ s.hiddenItem}   >
   <div className={s.title} >{el.name}</div> 
   <br />
   <div> {el.title}</div>
   <br />

   {/* <Link to={el.link}>{el.link}</Link> */}
   

   <br />
   <div> {el.time}</div>
   <br />
   <div> {el.title}</div>
   <br />
   <a target="_blank" href={el.link} >{el.link}</a>
   <br />
   <img  src= {el.urlToImage} className={s.imgNewsItemActive} alt={el.urlToImage}/>
<a onClick={(e)=>seeMoreInNewsItems(e)}  href="#" >close</a>


   </div> 

    <div className={s.title} >{el.name}</div> 
    <br/>
    {el.title} <br/>


<a onClick={(e)=>seeMoreInNewsItems(e)}  href="" >see more...</a>
 <img className={s.imgNewsItem}  src= {el.urlToImage}alt={el.urlToImage} />
 
     </li>
     )}
    </ul>


    </div> 
)
}


export default News

// 94ecac4d82874e44a171d09756f3b460