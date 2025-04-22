'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
// const section1 = document.querySelector('#section--1');
// const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

//// OLD CODE:
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

//// NEW CODE (better way):
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////////////////////////////////
//Implementing Smooth Scrolling:

/// CZĘŚĆ 1:
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  //DOMRect {x: 0, y: 498, width: 1169, height: 1405.6875, top: 498, …}

  //CZĘŚĆ 3: Scrolling:
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  //CZĘŚĆ 4: Scrolling -> BETER way:
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  //////////////////////////////////////////////////////////
  //CZĘŚĆ 5: MODERN way -> the BEST way:
  section1.scrollIntoView({ behavior: 'smooth' });
  /////////////////////////////////////////////////////////

  //// CZEŚĆ 2 / To pokazywał, jak nam tłumaczył wszystko:
  console.log(e.target.getBoundingClientRect());
  //DOMRect {x: 30, y: 82.65625, width: 110, height: 29, top: 82.65625, …}

  console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset); // Current scroll (X/Y) 0 575

  // !!! It's also posible to read the height and the width of the 'viewport':
  //Calculating the current window position and size
  console.log(
    'height/width of the viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );
}); //height/width of the viewport 1073 1169

/////////////////////////////////////////////////////////////////////
//Page navigation

/*
// 1st way - less efficient
document.querySelectorAll('.nav__link').forEach(function (el) {
  el.addEventListener('click', function (e) {
    // console.log('LINK');
    e.preventDefault();
    const id = this.getAttribute('href');
    // console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  });
});
*/

// The BEST way  -> event delegation
/////////////////////////////////////////////////
// 1. Add event listener to common parent element
// 2. Determine what element originated the event
/////////////////////////////////////////////////
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  //Matching strategy:
  // console.log(e.target);
  if (e.target.classList.contains('nav__link')) {
    // console.log('LINK');
    const id = e.target.getAttribute('href');
    // console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//////////////////////////////////////////////////
// Tabbed Component

// 1st way - worse
// tabs.forEach(tab => tab.addEventListener('click', () => console.log('TAB')));

//Instead of the above code, we'll use an event delegation:
tabsContainer.addEventListener('click', function (e) {
  // const clicked = e.target.parentElement;
  const clicked = e.target.closest('.operations__tab');
  // console.log(clicked);

  //Guard clause:
  if (!clicked) return;

  //Removing the active-class from all buttons, before adding it to the right button / tab
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));

  //Active tab:
  clicked.classList.add('operations__tab--active');

  //Removing the active-content class from all the elements, before adding
  //that class ony to the active content area :
  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );

  //Activate content area
  // console.log(clicked.dataset.tab);
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu fade animation
const nav = document.querySelector('.nav');

const handleHover = function (e) {
  // console.log(this, e.currentTarget);

  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

//Passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

//Sticky navigation - 1st way

// window.addEventListener('scroll', function (e) {
//   console.log(e);
// });

const section1 = document.querySelector('#section--1');
// const nav = document.querySelector('.nav');

const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);

window.addEventListener('scroll', function () {
  // console.log(window.scrollY);

  if (this.window.scrollY > initialCoords.top) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
});

// Sticky navigation - 2nd way
// Intersection Observer API

// const section1 = document.querySelector('#section--1');

// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// 'threshold' property with just one value:
// const obsOptions = {
//   root: null,
//   threshold: 0.1,
// };

// 'threshold' property with multiple values:
// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

//Implementing sticky navigation to our App with Intersection Observer:

// const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
// console.log(navHeight);

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  // rootMargin: '-90px',
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// Reveal sections:
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  // console.log(entries);
  /////////We get rid of this one entry:
  // const [entry] = entries;
  //////// We'll take ALL the entries and run the code for ALL of them:
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  });
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');
// console.log(imgTargets);

const loadImg = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;

  //Replace 'src' attribute with 'data-src' attribute:
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

///////////////  Slider  ///////////////////
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let currentSlide = 0;
  const maxSlide = slides.length;

  //Things we did at the beginning, so that we could
  //bettersee ALL slides while creating the slider:
  // const slider = document.querySelector('.slider');
  // slider.style.transform = 'scale(0.4) translateX(-800px)';
  // slider.style.overflow = 'visible';

  // Functions:
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide=${i}></button>`
      );
    });
  };

  const activateDot = function (slide) {
    // Removing the 'active class' fromm all the dots
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    // Adding an active class ONLY to the dot that is active at the moment
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  const nextSlide = function () {
    if (currentSlide === maxSlide - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }

    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  const prevSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlide - 1;
    } else {
      currentSlide--;
    }

    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  const int = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };

  int();

  // Event handlers:
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    // console.log(e);
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
    // LUB we could do 'short circuiting':
    // e.key === 'ArrowLeft' && prevSlide();
    // e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      console.log('DOT');
      currentSlide = Number(e.target.dataset.slide);
      goToSlide(currentSlide);
      activateDot(currentSlide);
    }
  });
};
// Here we call ALL the code / our 'slider' function
slider();

/////////////////////////////////////////////////////
/////////////////   Lessons   //////////////////////
/////////////////////////////////////////////////

/*
// Lesson 1: Selecting, Creating and Deleting elements

// 1) Selecting elements:
console.log(document.documentElement);

console.log(document.head);
console.log(document.body);

console.log(document.querySelector('.header'));

const allSections = document.querySelectorAll('.section');
console.log(allSections);

console.log(document.getElementById('section--1'));
// elementS - with "s" at the end:
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);

console.log(document.getElementsByClassName('btn'));

// 2) Creating and inserting elements

// -> .insertAdjacentHTML()
// Ta metoda była w poprzedniej sekcji przy Bankist App

// -> .createElement()
const message = document.createElement('div');
message.classList.add('cookie-message');

//adding plain text to our 'div' element:
// message.textContent = 'We use cookies for improved functionality and analytics';

//adding text and HTML elements to our 'div' element:
message.innerHTML =
  'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie" > Got it!</button> ';

// Inserting our 'div' element to the DOM (We will attach it to 'header' element):
// const header = document.querySelector('.header');
//adding as the 1st child of the parent node:
// header.prepend(message);
//adding as the last child of the parent node:
// header.append(message);

//Inserting multiple copies of the same element:
// const header = document.querySelector('.header');
//First we add our 'message' element to the DOM by attaching it to the beginning of the 'header' element
// header.prepend(message);
//Now we'll copy the 'message' element so that it will also appear at the end of the 'header' element:
// header.append(message.cloneNode(true));

const header = document.querySelector('.header');
header.append(message);

// 2 more methods
header.before(message);
header.after(message);

//Deleting elements:

//1st way (the BEST):
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
  });

//2nd way - zamiast 'message' variable I can reach for it using the class name:
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     document.querySelector('.cookie-message').remove();
//   });

//OLD way:
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     message.parentElement.removeChild(message);
//   });

*/

/*
////////////////////////////////////////////////////////////////
// Lesson 2: Styles, Attributes and Classes

// 1) STYLES
//Adding background color and width to our 'div' (cookie-message) element:
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

//Trying to read 'height' from the 'style' property:
// -> here we WON'T get 'height' because it NOT an inline style
console.log(message.style.height);
// -> here we'll get 'backgroundColor' because it's an inline style
console.log(message.style.backgroundColor); //rgb(55, 56, 61)
console.log(message.style.color);

//getComputedStyle() function
console.log(getComputedStyle(message)); //we get back huge object with All the style

console.log(getComputedStyle(message).color); //rgb(187, 187, 187)
console.log(getComputedStyle(message).height); //50px

//Increasing the height of our 'div':
//(On miał po przecinku wynik 'height' więc użył parseFloat())
// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 40 + 'px';
// console.log(getComputedStyle(message).height); //Now it's: 90px (50px + 40px)

//Ja miałam w konsoli 'height' 50px, więc użyłam 'parseInt()'
// message.style.height =
//   Number.parseInt(getComputedStyle(message).height, 10) + 40 + 'px';
// console.log(getComputedStyle(message).height); //Now it's: 90px (50px + 40px)

//Working wit the CSS variables (CSS custom properties)
document.documentElement.style.setProperty('--color-primary', 'orangered');

// 2) ATTRIBUTES

// -> reading values of attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.alt); // Bankist logo
console.log(logo.src);
// http://127.0.0.1:5502/complete-javascript-course/13-Advanced-DOM-Bankist/starter/img/logo.png
console.log(logo.className); //nav__logo

//This WON'T work -> it's NOT standard property for the 'img' element
console.log(logo.designer); //undefined
//////  BUT  //////////
//If we use 'getAttribute' it will work:
console.log(logo.getAttribute('designer')); // Jonas

// -> setting the values of attributes:
logo.alt = 'Beautiful minimalist logo';

//setting all new attribute:
logo.setAttribute('company', 'Bankist');

//Getting the URL attribute -  2 ways

//Getting the ABSOLUTE path:
console.log(logo.src);
// http://127.0.0.1:5502/complete-javascript-course/13-Advanced-DOM-Bankist/starter/img/logo.png

//Getting the RELATIVE path:
console.log(logo.getAttribute('src')); // img/logo.png

//With 'href' for links it works the same as with 'src' for images:
const link = document.querySelector('.twitter-link');
console.log(link.href); // -> absolute path
console.log(link.getAttribute('href')); // -> relative path

const navLink = document.querySelector('.nav__link');
console.log(navLink.href);
console.log(navLink.getAttribute('href'));

// Data attributes
console.log(logo.dataset.versionNumber); // 3.0

// Classes
logo.classList.add('c', 'j');
logo.classList.remove('c', 'j');
logo.classList.toggle('c');
logo.classList.contains('c'); // NOT 'includes' as it's called in arrays

//Setting a class:
//Don't use it !!!
logo.className = 'jonas';

*/

/*
////////////////////////////////////////////////////////////////
// Lesson 3: Types of events and event handlers
const h1 = document.querySelector('h1');

// -> 1st way of handling events
////////////////////////////////////////////////////////////////////
h1.addEventListener('mouseenter', function () {
  alert(`addEventListener: Great! You're reading the header :D`);
});

// -> 2nd way of attaching an eventListener to an elemeny
// by using the so-called 'on-event' property on the element:
///////////////////////////////////////////////////////////////////
h1.onmouseenter = function () {
  alert(`onmouseenter: Great! You're reading the header :D`);
};

h1.onclick = function () {
  console.log('I was clicked');
};

//**** advantage of the 'addEventListener' over 'on-event' properties:
//We can delete an event handler from 'addEventListener'
//////////////////////////////////////////////////////////////////////
const alertH1 = function (e) {
  alert(`addEventListener: Great! You're reading the header :D`);

  h1.removeEventListener('mouseenter', alertH1);
};

h1.addEventListener('mouseenter', alertH1);

//*** 'removeEventListener' can be in any place in our code:
const alertH1new = function (e) {
  alert(`addEventListener: Great! You're reading the header :D`);
};

h1.addEventListener('mouseenter', alertH1new);

//removing 'addEventListener' after 3 seconds using 'setTimeout'
setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);

// 3rd way of handling events -> using an HTML attribute
// We SHOULDN'T use it
//(we write the code directly in HTML)
////////////////////////////////////////////////////////
*/

/*
////////////////////////////////////////////////////////////////
// Lesson: Event Propagation in Practice

//Creating random color
// example of an 'rgb' color format that we're trying to create:
// rgb(255, 255, 255);
// step 1 -> creating a random number:
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
// step 2 -> creating a random color using a random number function
const randomColor = () =>
  `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

console.log(randomColor(0, 255)); // rgb(213, 150, 140)

document.querySelector('.nav__link').addEventListener('click', function (e) {
  // console.log('LINK');
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);
  console.log(e.currentTarget === this);

  //Stop propagation:
  // e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  // console.log('All links');
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
  console.log(e.currentTarget === this);
});

document.querySelector('.nav').addEventListener(
  'click',
  function (e) {
    // console.log('HEADER');
    this.style.backgroundColor = randomColor();
    console.log('NAV', e.target, e.currentTarget);
    console.log(e.currentTarget === this);
  }
  // true
);
*/

/*
////////////////////////////////////////////
// Lecture: DOM traversing

const h1 = document.querySelector('h1');
console.log(h1);

//Going downwards (children)
console.log(h1.querySelectorAll('.highlight'));

//Selecting all kinds / types of direct children of a parent element:
console.log(h1.childNodes);

//Selecting only children 'elements' of a parent element:
console.log(h1.children);

//.firstElementChild / .lastElementChild:
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'pink';

//Going upwards (parents)
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest('.header').style.background = 'var(--gradient-secondary)';
h1.closest('h1').style.background = 'red';

//Going sideways (siblings)
console.log(h1.previousElementSibling); // null
console.log(h1.nextElementSibling); // h4

console.log(h1.previousSibling); // #text
console.log(h1.nextSibling); // #text

//Trick - getting ALL of the siblings:
console.log(h1.parentElement.children);

console.log([...h1.parentElement.children]);

[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(0.5)';
});
*/

//////////////////////////////////////
/// Lesson: Lifecycle DOM Events  ///
////////////////////////////////////

// 1) 'DOMContentLoaded'event / fired by the 'document':
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built!', e);
});

// 2) 'load' event / fired by the 'window'
window.addEventListener('load', function (e) {
  console.log('Page fully loaded', e);
});

// 3) 'beforeunload' event / fired by the 'window'
// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });
