import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import s from "../News2/News2.module.css";
import { useContext } from "react";
import ThemeContext from "../../components/Context";
import Preloader from "../../components/Preloader/Preloader";
import OpenCart from "./OpenCart";

const News = () => {
  const [textValue, setTextValue] = useState("");
  const [results, setResults] = useState(0);
  const [cart, setCart] = useState({});
  const errorRef = React.createRef();
  const [newsData, setNewsData] = useState([]);
  const [previousNewsData, setPreviousNewsData] = useState([]);
  const { themeMode } = useContext(ThemeContext);
  const [isActiveClass, setIsActiveClass] = useState("hiddenItem");
  const [isResponseCome, setIsResponseCome] = useState(true);
  const [newItemsSectionShow, setNewItemsSectionShow] = useState(9);
  const [isLinkOpen, setIsLinkOpen] = useState(false);

  window.addEventListener("scroll", function () {
    var scrollHeight = document.documentElement.scrollHeight;
    var clientHeight = document.documentElement.clientHeight;
    var height = scrollHeight - clientHeight;
    var scrollTop =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop;

    if (height === scrollTop) {
      setNewItemsSectionShow(newItemsSectionShow + 9);
    }
  });

  useEffect(() => {
    const options = {
      method: "GET",
      url: "https://movies-news1.p.rapidapi.com/movies_news/recent",
      headers: {
        "X-RapidAPI-Key": "a131363a13mshf6e35ae84961f99p1de50bjsnd98349bfb5b2",
        "X-RapidAPI-Host": "movies-news1.p.rapidapi.com",
      },
    };

    axios
      .request(options)

      .then(function (response) {
        console.log(response);
        setPreviousNewsData(response.data);
        setNewsData(response.data);
        setIsResponseCome(false);
        setResults(response.data.length);
      })
      .catch((error) => {
        if (errorRef.current) {
          errorRef.current.classList.remove(`${s.errorHidden}`);
          errorRef.current.classList.add(`${s.errorShow}`);
        }
      });
  }, []);

  const searchNews = (e) => {
    setTextValue(e.target.value);
    let firstFilter;
    if (firstFilter) {
      firstFilter = null;
    }
    firstFilter = e.target.value.trim().toLowerCase().split(" ");
    let secondFilter = [];

    for (let i = 0; i < firstFilter.length; i++) {
      let newDataSearch = previousNewsData.filter(
        (el) =>
          el.title.toString().toLowerCase().includes(firstFilter[i]) ||
          el.description.toString().toLowerCase().includes(firstFilter[i])
      );
      secondFilter.push(...newDataSearch);
    }

    let finalyResult = Array.from(new Set(secondFilter));
    console.log(finalyResult)
    setNewsData(finalyResult);

    let wordsInArrey = [];
    for (let i = 0; i < finalyResult.length; i++) {
      wordsInArrey[i] = finalyResult[i];
      for (let keys in finalyResult[i]) {
        let pattern = new RegExp(`${firstFilter[0]}`, "gi");
        wordsInArrey[i][keys] = finalyResult[i][keys].replace(
          pattern,
          (match) => `<mark>${match}</mark>`
        );
         console.log( wordsInArrey)
      }
    }
  };
  console.log(newsData);

  const seeMoreInNewsItems = (e) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (isLinkOpen) {
      setIsLinkOpen(false);
    } else {
      console.log(isLinkOpen);
      let openCart = newsData.filter(
        (el) => el.title === e.target.getAttribute("a-key")
      );
      setCart(openCart);
      setIsLinkOpen(true);

      if (!themeMode) {
        if (isActiveClass === "hiddenItem") {
          setIsActiveClass("activeItemDarkTheme");
          setIsLinkOpen(true);
        } else {
          setIsActiveClass("hiddenItem");
        }
      } else {
        if (isActiveClass === "hiddenItem") {
          setIsActiveClass("activeItem");
          setIsLinkOpen(true);
        } else {
          setIsActiveClass("hiddenItem");
        }
      }
    }
  };

  return (
    <div className={s.wrapper + " " + (themeMode ? s.news_light : s.news_dark)}>
      <div>
        {" "}
        {isLinkOpen ? (
          <OpenCart
            cart={cart}
            seeMoreInNewsItems={seeMoreInNewsItems}
            className={s.openCart}
          />
        ) : null}
      </div>

      <div className={s.searchInputContainer}>
        <div className={s.searchInputContainerImg}> </div>
        <input
          type="text"
          placeholder="Filter by keywords"
          value={textValue}
          className={s.searchInput}
          onChange={(e) => searchNews(e)}
        />
      </div>
      <div className={s.results}>Results:{results}</div>

      <Preloader isResponseCome={isResponseCome} />
      <div ref={errorRef} className={s.errorHidden}>
        internet problem...
      </div>

      <ul>
        {/* <mark></mark> */}
        {newsData
          .filter((el, index) => index < newItemsSectionShow)
          .map((el) => (
            <li key={el.link}>
              <img className={s.imgNewsItem} src={el.image} alt={el.image} />
              <div className={s.aftertImg}>
                <div className={s.timeWrapper}>
                  <div className={s.calendar}></div>
                  <div className={s.date}>{el.date.slice(0, -6)}</div>
                </div>

                <div className={s.title}>{el.title} </div>
                <div className={s.description}>{el.description}</div>

                <div className={s.readMore}>
                  Read more
                  <div className={s.readMoreIMG}></div>
                  <a
                    onClick={(e) => seeMoreInNewsItems(e)}
                    a-key={el.title}
                    href="#"
                  ></a>
                </div>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default News;

// 94ecac4d82874e44a171d09756f3b460
