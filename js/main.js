window.addEventListener('DOMContentLoaded', () => {

    ///Tabs
    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');
          

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent(0);

    tabsParent.addEventListener('click', () => {
        const target = event.target;
        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            })
        }
    });

    ///Timer

    const deadline = '2024-05-20';

    function getTimerRemaining(endtime) {

        let days, hours, minutes, seconds;
        const t = Date.parse(endtime) - Date.parse(new Date());

        if (t <= 0 ){
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        } else {
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor((t / (1000 * 60 * 60)) % 24),
            minutes = Math.floor((t / (1000 * 60)) % 60),
            seconds = Math.floor((t / 1000) % 60);
        }
            
    return {
        'total' : t,
        'days' : days,
        'hours' : hours,
        'minutes' : minutes,
        'seconds' : seconds
    };
}

    function getZeroDown(num) {
        if (num >= 0 && num <10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

            updateClock();

        function updateClock() {
            const t = getTimerRemaining(endtime);

            days.innerHTML = getZeroDown(t.days);
            hours.innerHTML = getZeroDown(t.hours);
            minutes.innerHTML = getZeroDown(t.minutes);
            seconds.innerHTML = getZeroDown(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
}
    setClock('.timer', deadline);


    ///Modal

    const btnTrigger = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal');


    btnTrigger.forEach(btn => {
        btn.addEventListener('click', openModal)
    });
    
    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('fade');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }
    
    function closeModal(){
        modal.classList.add('fade');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }


    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == '') {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) {
            closeModal();
        }
    })

    const modalTimerId = setTimeout(openModal, 50000);

    function showModalByScroll() {
        if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    //Используем классы для карточек

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUah();
        }

        changeToUah() {
            this.price = this.price * this.transfer;
        }

        render() {
            const element = document.createElement('div');

            if (this.classes.length === 0) {
                this.element = 'menu__item';
                element.classList.add(this.element);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }
    
            element.innerHTML = `
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
            `;
            this.parent.append(element);
        }
    }
    const getResource = async (url) => {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
         }
        return await res.json();
    };

/*     getResource('http://localhost:3000/menu')
        .then(data =>  {
            data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            });
        }); */

        getResource('http://localhost:3000/menu')
        .then(data => createCard(data))

        function createCard(data) {
            data.forEach(({img, altimg, title, descr, price}) => {
                const element = document.createElement('div');
                const transfered = 27;
                price = price * transfered;
                element.classList.add('menu__item');

                element.innerHTML = `
                <img src=${img} alt=${altimg}>
                    <h3 class="menu__item-subtitle">${title}</h3>
                    <div class="menu__item-descr">${descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${price}</span> грн/день</div>
                    </div>
                `;

                document.querySelector('.menu .container').append(element);
            });
        };
    //Forms

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };


    forms.forEach(item => {
        bindPostData(item);
    }); 

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-type': 'aplication/json'
            }, 
            body: data
        });
        return await res.json();
    };

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
            display: block;
            margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

           postData('http://localhost:3000/requests', json)
           .then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
           }).catch(() => {
                showThanksModal(message.failure);
           }).finally(() => {
                form.reset();
           });

/*             request.addEventListener('load', () => {
                if (request.status === 200) {
                    console.log(request.response);
                    showThanksModal(message.success);
                    form.reset();
                    statusMessage.remove();
                } else {
                    showThanksModal(message.failure);
                }
            }); */
        });
    } 

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
        <div class="modal__content" >
            <div class="modal__close" data-close>×</div>
            <div class="modal__title">${message}</div>
        </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(()=> {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    };

/*     fetch('https://jsonplaceholder.typicode.com/posts', {
        method: "POST",
        body: JSON.stringify({name: 'Alex'}),
        headers: {
            'Content-type': 'application/json'
        }
    })
      .then(response => response.json())
      .then(json => console.log(json)); */

});