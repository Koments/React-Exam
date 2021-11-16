import styles from "./Main.module.css";
import { useState } from "react";

export default function Main() {

    const [jokes, setJoke] = useState([]);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');
    const [currentCategorie, setCurrentCategorie] = useState('');
    const [jokeType, setJokeType] = useState("random", "search", "categories")
    const [display, setDisplay] = useState('none')

    function handleChange(event) {
        setJoke("")
        setCategories("")
        setJokeType(event.target.id)
        if (event.target.id === "categories") {
            loadCategiries()
            setDisplay('none')
        } else if (event.target.id === "search") {
            setDisplay('block')
        } else setDisplay('none')
    }
    function searchForName(event) {
        let searchText = event.target.value
        setSearch(searchText)
    }
    function addCategoriName(name) {
        setJoke("")
        let categorieTextName = (name.target.innerHTML).toLowerCase()
        setCurrentCategorie(categorieTextName)
    }

    function loadCategiries() {
        fetch(
            "https://api.chucknorris.io/jokes/categories"
        )
            .then((response) => response.json())
            .then((categoriesMass) => {
                console.log(categoriesMass)
                setCategories([...categories, ...categoriesMass]);
            });
    };

    function loadJoke() {
        console.log(jokeType)
        let categorie = currentCategorie
        let searchForRender = search


        if (jokeType === "random") {
            fetch(
                "https://api.chucknorris.io/jokes/random"
            )
                .then((response) => response.json())
                .then((jokeInfo) => {
                    console.log(jokeInfo)
                    setJoke([...jokes, jokeInfo]);
                });
        } else if (jokeType === "categories") {
            fetch(
                `https://api.chucknorris.io/jokes/random?category=${categorie}`
            )
                .then((response) => response.json())
                .then((jokeInfo) => {
                    setJoke([...jokes, jokeInfo]);
                });
        } else {
            console.log(searchForRender)
            fetch(
                `https://api.chucknorris.io/jokes/search?query=${searchForRender}`
            )
                .then((response) => response.json())
                .then((jokeInfo) => {
                    console.log(jokeInfo)
                    setJoke(...jokes, jokeInfo.result);
                });
        }

    }

    return (
        <>
            <div className={styles.container}>
                <h3>MSI 2020</h3>
                <h2>Hey!</h2>
                <p>Let's try to find a joke for you:</p>
                <div className={styles.inputFlex}>
                    <div className={styles.inputContainer}>
                        <input type="radio" id="random"
                            name="categories" className={styles.input} onChange={handleChange} />
                        <label htmlFor="random">Random</label>
                    </div>
                    <div className={styles.inputContainer}>
                        <input type="radio" id="categories"
                            name="categories" className={styles.input} onChange={handleChange} />
                        <label htmlFor="categories">From categories</label>
                    </div>

                    <div>
                        {categories === '' ? '' : categories.map((el) => <button className={styles.categoriesBtn} onClick={addCategoriName} key={el}>{el.toUpperCase()}</button>)}
                    </div>
                    <div className={styles.inputContainer}>
                        <input type="radio" id="search"
                            name="categories" className={styles.input} onChange={handleChange} />
                        <label htmlFor="search">Search</label>
                    </div>
                    <div>
                        <input type="text" className={styles.inputSearch} placeholder="Free text search..." onChange={searchForName} style={{ display: display === 'none' ? 'none' : 'block' }} />
                    </div>
                    <button onClick={loadJoke} className={styles.getJokeBtn}>Get a joke</button>
                    <div>
                        {jokes === '' ? '' : jokes.map((item) => (
                            <div key={item.id} className={styles.card}>
                                <div className={styles.cardImgPositionAbsolute}><div className={styles.cardImg}></div></div>
                                <div className={styles.cardInfo}>
                                    <div><a className={styles.cardLink}>ID: {item.id}</a></div>
                                    <div className={styles.cardDescription}>{item.value}</div>
                                    <div className={styles.cardLastUpdate}>Last update: {item.updated_at}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}