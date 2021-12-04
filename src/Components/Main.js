import styles from './Main.module.css';
import { useEffect, useState } from 'react';
//
import '../../node_modules/font-awesome/css/font-awesome.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/fontawesome-free-solid';

export default function Main() {
  const [jokes, setJoke] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [currentCategorie, setCurrentCategorie] = useState('');
  const [jokeType, setJokeType] = useState('random', 'search', 'categories');
  const [display, setDisplay] = useState('none');
  const [favourites, setFavourites] = useState([]);

  function handleChange(event) {
    setJoke('');
    setCategories('');
    setJokeType(event.target.id);
    if (event.target.id === 'categories') {
      loadCategiries();
      setDisplay('none');
      return;
    }
    if (event.target.id === 'search') {
      setDisplay('block');
      return;
    }
    setDisplay('none');
  }

  function searchForName(event) {
    let searchText = event.target.value;
    setSearch(searchText);
  }
  function addCategoriName(name) {
    setJoke('');
    let categorieTextName = name.target.innerHTML.toLowerCase();
    setCurrentCategorie(categorieTextName);
  }

  function loadCategiries() {
    fetch('https://api.chucknorris.io/jokes/categories')
      .then((response) => response.json())
      .then((categories) => setCategories(categories));
  }

  function loadJoke(url) {
    console.log(jokeType);
    let categorie = currentCategorie;
    let searchForRender = search;

    //use or early function exit or switch
    // try not to do fetch, but create string and then fetch
    if (jokeType === 'random') {
      fetch('https://api.chucknorris.io/jokes/random')
        .then((response) => response.json())
        .then((jokeInfo) => {
          console.log(jokeInfo);
          setJoke([...jokes, jokeInfo]);
        });
    } else if (jokeType === 'categories') {
      fetch(`https://api.chucknorris.io/jokes/random?category=${categorie}`)
        .then((response) => response.json())
        .then((jokeInfo) => {
          setJoke([...jokes, jokeInfo]);
        });
    } else {
      console.log(searchForRender);
      fetch(`https://api.chucknorris.io/jokes/search?query=${searchForRender}`)
        .then((response) => response.json())
        .then((jokeInfo) => {
          console.log(jokeInfo);
          setJoke(jokeInfo.result);
        });
    }
  }
  // alway with small letter
  function HandleOnClickAdd(joke) {
    const newFavouriteListAdd = [...favourites, joke];
    const saveToLocalStorage = (joke) => {
      localStorage.setItem('FavouritesJoke', JSON.stringify(joke));
    };

    saveToLocalStorage(newFavouriteListAdd);
    setFavourites(newFavouriteListAdd);
  }
  //same here
  function HandleOnClickRemove(joke) {
    const newFavouriteList = favourites.filter((favourite) => {
      return favourite.id !== joke.id;
    });
    const saveToLocalStorage = (joke) => {
      localStorage.setItem('FavouritesJoke', JSON.stringify(joke));
    };
    setFavourites(newFavouriteList);
    saveToLocalStorage(newFavouriteList);
  }
  useEffect(() => {
    const movieFavourites = JSON.parse(localStorage.getItem('FavouritesJoke'));
    if (movieFavourites) {
      setFavourites(movieFavourites);
    }
  }, [setFavourites]);
  //try to create more components
  return (
    <>
      <div className={styles.container}>
        <div className={styles.leftContainer}>
          <h3>MSI 2020</h3>
          <h2>Hey!</h2>
          <p>Let's try to find a joke for you:</p>
          <div className={styles.inputFlex}>
            {/* move radio button to component */}
            <div className={styles.inputContainer}>
              <input
                type="radio"
                id="random"
                name="categories"
                className={styles.input}
                onChange={handleChange}
              />
              <label htmlFor="random">Random</label>
            </div>
            <div className={styles.inputContainer}>
              <input
                type="radio"
                id="categories"
                name="categories"
                className={styles.input}
                onChange={handleChange}
              />
              <label htmlFor="categories">From categories</label>
            </div>

            <div>
              {/* always move element in map to component.  */}
              {/* always add key when render arrays */}
              {categories === ''
                ? ''
                : categories.map((el) => (
                    <button
                      className={styles.categoriesBtn}
                      onClick={addCategoriName}
                      key={el}
                    >
                      {el.toUpperCase()}
                    </button>
                  ))}
            </div>
            <div className={styles.inputContainer}>
              <input
                type="radio"
                id="search"
                name="categories"
                className={styles.input}
                onChange={handleChange}
              />
              <label htmlFor="search">Search</label>
            </div>
            <div>
              <input
                type="text"
                className={styles.inputSearch}
                placeholder="Free text search..."
                onChange={searchForName}
                //   nobody likes inline styles
                style={{ display: display === 'none' ? 'none' : 'block' }}
              />
            </div>
            <button onClick={loadJoke} className={styles.getJokeBtn}>
              Get a joke
            </button>
            <div>
              {jokes === ''
                ? ''
                : jokes.map((item) => {
                    const isFavourite = Boolean(
                      favourites.find(
                        (favouriteFilm) => favouriteFilm.id === item.id,
                      ),
                    );
                    return (
                      //remove React.Fragment (<> </>)
                      <>
                        <div key={item.id} className={styles.card}>
                          <div className={styles.cardImgPositionAbsoluteSecond}>
                            <div className={styles.cardImg}></div>
                          </div>
                          <div className={styles.cardInfoSecond}>
                            {!isFavourite ? (
                              <FontAwesomeIcon
                                className={styles.hearthAdd}
                                icon={faHeart}
                                onClick={() => HandleOnClickAdd(item)}
                              />
                            ) : (
                              <FontAwesomeIcon
                                className={styles.hearthRemove}
                                icon={faHeart}
                                onClick={() => HandleOnClickRemove(item)}
                              />
                            )}
                            <div>
                              <a className={styles.cardLink}>ID: {item.id}</a>
                            </div>
                            <div className={styles.cardDescription}>
                              {item.value}
                            </div>
                            <div className={styles.cardLastUpdate}>
                              Last update: {item.updated_at}
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })}
            </div>
          </div>
        </div>
        <div className={styles.rightContainer}>
          <h2 className={styles.rightContainerHeader}>Favorite</h2>
          {favourites.map((jokes) => {
            const isFavourite = Boolean(
              favourites.find((favouriteFilm) => favouriteFilm.id === jokes.id),
            );
            return (
              <>
                <div key={jokes.id} className={styles.card}>
                  {/* create resuable card component */}
                  {!isFavourite ? (
                    <FontAwesomeIcon
                      className={styles.hearthAdd}
                      icon={faHeart}
                      onClick={() => HandleOnClickAdd(jokes)}
                    />
                  ) : (
                    <FontAwesomeIcon
                      className={styles.hearthRemove}
                      icon={faHeart}
                      onClick={() => HandleOnClickRemove(jokes)}
                    />
                  )}
                  <div className={styles.cardImgPositionAbsolute}>
                    <div className={styles.cardImg}></div>
                  </div>
                  <div className={styles.cardInfo}>
                    <div>
                      <a className={styles.cardLink}>ID: {jokes.id}</a>
                    </div>
                    <div className={styles.cardDescription}>{jokes.value}</div>
                    <div className={styles.cardLastUpdate}>
                      Last update: {jokes.updated_at}
                    </div>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </>
  );
}
