window.onload = () => {
    const container = document.querySelector('#movies_container')
    const titleInput = document.querySelector('#title')
    const notify = document.querySelector('.notify')

    titleInput.addEventListener('keyup', debounce(gettingData, 1000))

    function gettingData() {
        const title = document.querySelector('#title').value

        if (title !== '') searchMovie(title)
        else {
            container.innerHTML = ''
            notify.innerHTML = ''
            document.querySelector('#sort').remove()
        }
    }

    function debounce(callback, delay) {
        let timer
        return () => {
            clearTimeout(timer)
            timer = setTimeout(() => {
                callback()
            }, delay)
        }
    }

    let movies = []

    async function searchMovie(title) {
        const response = await fetch(`http://www.omdbapi.com/?apikey=785b5e00&s=${title}`)
        const res = await response.json()
        container.innerHTML = ''

        if (res.Response === "False") {
            displayMsg(`Couldn't find "${title}"`)
            return
        }
        else {
            notify.innerHTML = ''
            const filterBox = document.querySelector('.filterBox')
            filterBox.append(select)

            movies = res.Search
            movies.map(movie => {
                displayCards(movie)
            })
        }
    }

    const msgBox = document.createElement('div')
    const img = document.createElement('img')

    function displayMsg(msg) {
        msgBox.innerHTML = msg
        msgBox.classList = 'msg'
        img.setAttribute('src', './images/not-found.png')

        notify.insertAdjacentElement('afterbegin', msgBox)
        notify.insertAdjacentElement('beforeend', img)
        document.querySelector('#sort').remove()
    }

    let card = ''

    const select = document.createElement('select')
    select.id = 'sort'
    select.innerHTML = `<option value="">sort by year</option>
                        <option value="2017">2017</option>
                        <option value="2018">2018</option>
                        <option value="2019">2019</option>
                        <option value="2020">2020</option>
                        <option value="2021">2021</option>
                        <option value="2022">2022</option>
                        <option value="2023">2023</option>`

    select.addEventListener('change', (e) => {
        const year = +e.target.value
        if (year !== '') {
            container.innerHTML = ''
            notify.innerHTML = ''
            const newARR = movies.filter(movie => movie.Year >= year)
            if (newARR.length === 0) document.querySelector('.notify').innerHTML = 'Not Found!'
            newARR.map(movie => displayCards(movie))
        }
    })

    function displayCards(movie) {
        card = `
    <div class="col-3">
        <div class="card">
            <div class="card-header">
                <img src=${movie.Poster} alt="">
            </div>
            <div class="card-body">
                <h5>Title: <span>${movie.Title}</span></h5>
                <h6>Year: <span>${movie.Year}</span></h6>   
                <h6>Type: <span>${movie.Type}</span></h6>   
                <h6>IMDB ID: <span>${movie.imdbID}</span></h6>   
            </div>
        </div>
    </div>`
        container.innerHTML += card
    }
}

