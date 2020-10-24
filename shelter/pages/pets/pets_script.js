let randomizer = (min, max) => Math.floor(Math.random() * (max - min) + min);

class Slider {
    constructor(petsOnPage = 8) {
        this.randomArr = []
        this.pages = []
        this.pageCounter = 0

        for (let i = 0; i < 6; i++) {
            let pageSet = new Set()

            while (pageSet.size < 8) {
                pageSet.add(randomizer(0, 8))
            }

            pageSet.forEach(elem => {
                this.randomArr.push(elem)
            })
        }
        this.createPagination(petsOnPage)
    }

    createPagination(petsOnPage = 8) {
        let dumpArr = new Array(this.randomArr).flat()
        let pagesCount = Math.floor(dumpArr.length / petsOnPage)
        this.pages = []

        for (let i = 0; i < pagesCount; i++) {
            let pageSet = new Set()
            let page = []
            let counter = 0

            while (pageSet.size < petsOnPage) {
                let setLen = pageSet.size
                pageSet.add(dumpArr[counter])
                if (pageSet.size - setLen === 1) {
                    dumpArr.splice(counter, 1)
                } else {
                    counter ++
                }
            }
            pageSet.forEach(elem => page.push(elem))
            this.pages.push(page)
        }

        if(this.pageCounter >= this.pages.length) this.pageCounter = this.pages.length - 1
    }

    getPagesLength() { return this.pages.length}

    getCurrentPage() {
        return this.pages[this.pageCounter];
    }

    getNextPage() {
        this.pageCounter ++
        if (this.pageCounter === this.pages.length) {
            this.pageCounter = this.pages.length - 1
            return -1
        }
        return {
            page: this.pages[this.pageCounter],
            counter: this.pageCounter
        }
    }

    getPrevPage() {
        this.pageCounter --
        if (this.pageCounter < 0) {
            this.pageCounter = 0
            return -1
        }
        return {
            page: this.pages[this.pageCounter],
            counter: this.pageCounter
        }
    }

    getFirstPage() {
        this.pageCounter = 0
        return {
            page: this.pages[this.pageCounter],
            counter: this.pageCounter
        }
    }

    getLastPage() {
        this.pageCounter = this.pages.length - 1
        return {
            page: this.pages[this.pageCounter],
            counter: this.pageCounter
        }
    }

    getCounter() { return this.counter}
}

const getSliderElementsCount = (windowWidth = 1300) => {
    if (windowWidth > 1280) return 8
    if (windowWidth > 768) return 6
    return 3
}

const createSliderElement = (data) => {
    let petCard = document.createElement('div')
    petCard.id = data.name
    petCard.className = 'slider-card'

    let img = document.createElement('img')
    img.src = data.img
    img.alt = data.name

    let header = document.createElement('span')
    header.innerText = data.name

    let learnBtn = document.createElement('div')
    learnBtn.className = 'slider-btn slider-btn-learn'
    learnBtn.innerHTML = '<p>Learn more</p>'

    petCard.append(img)
    petCard.append(header)
    petCard.append(learnBtn)
    petCard.style.transition = 'left 0.6s ease-in-out'
    return petCard
}

const getArrToStr = (arr) => arr.join(', ')

// Fill popup window
const createPopup = (pet) => {
    let popImgWrap = document.getElementById('pop-img-wrap')
    let popImg = document.createElement('img')
    popImg.src = pet.img
    popImg.alt = pet.name
    popImgWrap.innerHTML = ''
    popImgWrap.append(popImg)

    document.getElementById('pop-header').innerHTML = '<p>' + pet.name + '</p>'
    document.getElementById('pop-subheader').innerHTML = '<p>' + pet.type + ' - ' + pet.breed + '</p>'
    document.getElementById('pop-main-text').innerHTML = '<p>' + pet.description + '</p>'

    let popList = document.getElementById('pop-list').getElementsByTagName('ul')[0]
    
    let ageLi = document.createElement('li')
    ageLi.innerHTML = '<b>Age: ' + pet.age + '</b>'

    let inocLi = document.createElement('li')
    inocLi.innerHTML = '<b>Inoculations: ' + getArrToStr(pet.inoculations) + '</b>'

    let disLi = document.createElement('li')
    disLi.innerHTML = '<b>Diseases: ' + getArrToStr(pet.diseases) + '</b>'
    
    let parasitesLi = document.createElement('li')
    parasitesLi.innerHTML = '<b>Parasites: ' + getArrToStr(pet.parasites) + '</b>'
    
    popList.innerHTML = ''
    popList.append(ageLi)
    popList.append(inocLi)
    popList.append(disLi)
    popList.append(parasitesLi)
}

const insertItemsToSlider = (sliderPage, data, container) => {
    for (let i = 0; i < sliderPage.length; i++) {
        let pet = data[sliderPage[i]]
        
        container.append(createSliderElement(pet))

        let petCard = document.getElementById(pet.name)

        petCard.addEventListener('click', function () {
            let pet = data.filter(elem => elem.name === this.id)
            createPopup(pet[0])
            body.className = 'noscroll'
            popup.style = 'display: flex'
        })
    }
}

const showHideBurger = (flag) => {
    burger.style.transform = (flag) ? 'rotate(90deg)': 'rotate(0deg)'
    burgerWrap.style.display = (flag) ? 'flex': 'none'
    burgerOpen.style.transform = (flag) ? 'rotate(90deg)': 'rotate(0deg)'
    body.className = (flag) ? 'noscroll': ''
    headerDesktopNav.style.display = (flag) ? 'none': 'flex'
}

let currentWindWidth = document.documentElement.clientWidth
let countSliderItems = getSliderElementsCount(currentWindWidth)
let slider = new Slider(countSliderItems)
let sliderPage = slider.getCurrentPage()

let sliderContainer = document.getElementById('friends-slider')
let popup = document.getElementById('popup')
let startPageBtn = document.getElementById('to-start-page-btn')
let prevPageBtn = document.getElementById('prev-page-btn')
let pageNumber = document.getElementById('page-number')
let nextPageBtn = document.getElementById('next-page-btn')
let lastPageBtn = document.getElementById('to-last-page-btn')
let body = document.getElementsByTagName('body')[0]
let burger = document.getElementById('burger-menu-btn')
let burgerFlag = false
let burgerWrap = document.getElementById('burger-wrap')
let burgerOpen = document.getElementById('burger-menu-open-btn')
let headerDesktopNav = document.getElementById('header-desktop-nav')

sliderContainer.innerHTML = ''
insertItemsToSlider(sliderPage, pets, sliderContainer)
pageNumber.innerHTML = '<p>1</p>'

window.addEventListener('resize', function () {
    let windowWidth = document.documentElement.clientWidth
    countSliderItems = getSliderElementsCount(windowWidth)
    slider.createPagination(countSliderItems)
    sliderPage = slider.getCurrentPage()
    sliderContainer.innerHTML = ''
    insertItemsToSlider(sliderPage, pets, sliderContainer)

    if(burgerFlag) {
        let burgerFlagResize = (document.documentElement.clientWidth > 768) ? false : true
        showHideBurger(burgerFlagResize)
    }
})

popup.addEventListener('click', function(e) {
    let clickElem = e.target
    if ((clickElem.id === 'popup') || (clickElem.id === 'pop-close-btn') || (clickElem.id === 'pop-close-btn-wrap')) this.style = 'display: none'
    body.className = ''
})

const createEnableBtns = (btn1, btn2, prop = '') => {
    btn1.className = 'slider-btn slider-btn-nav center' + ' ' + prop
    btn2.className = 'slider-btn slider-btn-nav center' + ' ' + prop
}

prevPageBtn.addEventListener('click', function () {
    let page = slider.getPrevPage()
    createEnableBtns(nextPageBtn, lastPageBtn)

    if (page === -1) {
        createEnableBtns(prevPageBtn, startPageBtn, 'disabled')
    } else {
        prevPageBtn.className = 'slider-btn slider-btn-nav center'
        pageNumber.innerHTML = '<p>' + (page.counter + 1) + '</p>'
        sliderContainer.innerHTML = ''
        insertItemsToSlider(page.page, pets, sliderContainer)

        if(page.counter === 0) {
            createEnableBtns(prevPageBtn, startPageBtn, 'disabled')
        }
    }
})

nextPageBtn.addEventListener('click', function () {
    let page = slider.getNextPage()
    createEnableBtns(prevPageBtn, startPageBtn)
    if (page === -1) {
        createEnableBtns(nextPageBtn, lastPageBtn, 'disabled')
    } else {
        this.className = 'slider-btn slider-btn-nav center'
        lastPageBtn.className = 'slider-btn slider-btn-nav center'
        pageNumber.innerHTML = '<p>' + (page.counter + 1) + '</p>'
        sliderContainer.innerHTML = ''
        insertItemsToSlider(page.page, pets, sliderContainer)

        if(page.counter === slider.getPagesLength() - 1) {
            createEnableBtns(nextPageBtn, lastPageBtn, 'disabled')
        }
    }
})

startPageBtn.addEventListener('click', function() {
    let page = slider.getFirstPage();
    createEnableBtns(prevPageBtn, startPageBtn, 'disabled')
    createEnableBtns(nextPageBtn, lastPageBtn)
    sliderContainer.innerHTML = ''
    insertItemsToSlider(page.page, pets, sliderContainer)
    pageNumber.innerHTML = '<p>' + (page.counter + 1) + '</p>'
})

lastPageBtn.addEventListener('click', function () {
    let page = slider.getLastPage();
    createEnableBtns(nextPageBtn, lastPageBtn, 'disabled')
    createEnableBtns(prevPageBtn, startPageBtn)
    sliderContainer.innerHTML = ''
    insertItemsToSlider(page.page, pets, sliderContainer)
    pageNumber.innerHTML = '<p>' + (page.counter + 1) + '</p>'
})

burger.addEventListener('click', function() {
    burgerFlag = !burgerFlag
    showHideBurger(burgerFlag)
})

burgerOpen.addEventListener('click', function() {
    burgerFlag = !burgerFlag
    showHideBurger(burgerFlag)
})

burgerWrap.addEventListener('click', function(e) {
    let clickElem = e.target
    if (clickElem.id === 'burger-wrap') {
        burgerFlag = !burgerFlag
        showHideBurger(burgerFlag)
        body.className = ''
    }
})
