let randomizer = (min, max) => Math.floor(Math.random() * (max - min) + min);

class Slider {
    constructor (dataCount = 8, itemsOnPageCount = 3) {
        this.sliderItemsSet = new Set()
        this.sliderItems = []
        this.sliderPages = []
        this.counter = 0;
        
        // Create random non-repeat items set
        while (this.sliderItemsSet.size < dataCount) {
            this.sliderItemsSet.add(randomizer(0, dataCount))
        }

        // Rewrite set to array
        this.sliderItemsSet.forEach(elem => this.sliderItems.push(elem))
        this.sliderItemsSet.clear()
        this.splitPages(itemsOnPageCount)
    }

    // Create pages with items
    splitPages (elemCount = 3) {
        let pageCounter = 0
        let page = []
        this.sliderPages = []

        // Fill main full pages
        for (let i = 0; i < this.sliderItems.length; i++) {
            page.push(this.sliderItems[i])
            pageCounter ++
            if (pageCounter === elemCount) {
                pageCounter = 0
                this.sliderPages.push(page)
                page = []
            }
        }

        // Write elements to last page
        if ((page.length !== 0) && (page.length < elemCount)) {
            let diff = elemCount - page.length
            for (let i = 0; i < diff; i++) {
                page.push(this.sliderItems[i])
            }
            this.sliderPages.push(page)
        }
    }

    getCurrentPage() {
        return this.sliderPages[this.counter];
    }

    getNextPage() {
        this.counter ++
        if (this.counter === this.sliderPages.length) this.counter = 0
        return this.sliderPages[this.counter];
    }

    getPrevPage() {
        this.counter --
        if (this.counter < 0) this.counter = this.sliderPages.length - 1
        return this.sliderPages[this.counter];
    }

    getAllPages() {
        return this.sliderPages;
    }

    getAllItems() {
        return this.sliderItems;
    }
}

const getSliderElementsCount = (windowWidth = 1300) => {
    if (windowWidth > 1280) return 3
    if (windowWidth > 768) return 2
    return 1
}

// Create html structure of sloder element
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

const getArrToStr = (arr) => arr.join(', ')

// Fill slider
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

let showHideBurger = (flag) => {
    burger.style.transform = (flag) ? 'rotate(90deg)': 'rotate(0deg)'
    burgerWrap.style.display = (flag) ? 'flex': 'none'
    burgerOpen.style.transform = (flag) ? 'rotate(90deg)': 'rotate(0deg)'
    body.className = (flag) ? 'noscroll': ''
    headerDesktopNav.style.display = (flag) ? 'none': 'flex'
}

let dataArraySize = pets.length
let currentWindWidth = document.documentElement.clientWidth

let countSliderItems = getSliderElementsCount(currentWindWidth)
let sliderContainer = document.getElementById('friends-slider')
let popup = document.getElementById('popup')
let mainElement = document.getElementsByTagName('main')[0]
let sliderLeftNav = document.getElementById('slider-left-nav')
let sliderRightNav = document.getElementById('slider-right-nav')
let sliderLeftNavMob = document.getElementById('slider-left-nav-mobile')
let sliderRightNavMob = document.getElementById('slider-right-nav-mobile')
let body = document.getElementsByTagName('body')[0]
let burger = document.getElementById('burger-menu-btn')
let burgerFlag = false
let burgerWrap = document.getElementById('burger-wrap')
let burgerOpen = document.getElementById('burger-menu-open-btn')
let headerDesktopNav = document.getElementById('header-desktop-nav')

let slider = new Slider(dataArraySize, countSliderItems);
let sliderPage = slider.getCurrentPage()

sliderContainer.innerHTML = ''
insertItemsToSlider(sliderPage, pets, sliderContainer)

window.addEventListener('resize', function () {
    countSliderItems = getSliderElementsCount(document.documentElement.clientWidth)
    slider.splitPages(countSliderItems)
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

sliderLeftNav.addEventListener('click', () => {
    sliderContainer.innerHTML = ''
    sliderPage = slider.getPrevPage()
    insertItemsToSlider(sliderPage, pets, sliderContainer)
})

sliderRightNav.addEventListener('click', () => {
    sliderContainer.innerHTML = ''
    sliderPage = slider.getNextPage()
    insertItemsToSlider(sliderPage, pets, sliderContainer)
})

sliderLeftNavMob.addEventListener('click', () => {
    sliderContainer.innerHTML = ''
    sliderPage = slider.getPrevPage()
    insertItemsToSlider(sliderPage, pets, sliderContainer)
})

sliderRightNavMob.addEventListener('click', () => {
    sliderContainer.innerHTML = ''
    sliderPage = slider.getNextPage()
    insertItemsToSlider(sliderPage, pets, sliderContainer)
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
