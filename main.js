// ring timer and time display
const circle = document.querySelector('circle')
const radius = circle.r.baseVal.value;
const circumference = radius * 2 * Math.PI;
let TIME_LIMIT = 300
let resetTimers = false // resetting when pomodoro timer is set in the settings page, when true
//let resetTimeSelectors = false
let resetShort = false // resetting when short timer is set in the settings page, when true
let resetLong = false // // resetting when long timer is set in the settings page, when true

const start__pause = document.querySelector(".start__pause")
let paused = false // Pausing the timer
let alarm = "./assets/blingbling.mp3"
console.log(start__pause)

const break__selectors = Array.from(document.querySelectorAll(".break__mode--btn"))
//console.log(break__selectors)
const change__settings = document.querySelector(".menu__options--btn") //menu options selector
const close__menu = document.querySelector(".close__menu") //close the settings menu
const modal = document.querySelector(".modal__settings") // modal settings page
const pomodoroBtn = document.querySelector(".pomodoro--btn") // to set focus on this button on load
// timer controller setter
const timer__controller = document.querySelector(".time__settings")
console.log(timer__controller)

//pomodoro time controllers
const count__up = document.querySelector(".btn--up")
const count__down = document.querySelector(".btn--down")
const input__control__time = document.querySelector(".time__control") //pomodoro control
const time__control__short = document.querySelector(".time__control__short") //short break control
const time__control__long = document.querySelector(".time__control__long") // long break control
let pomodoro__count = Number(input__control__time.value)
let short__count = Number(time__control__short.value)
let long__count = Number(time__control__long.value)
console.log(pomodoro__count)
TIME_LIMIT = pomodoro__count * 60
const main__settings = document.querySelector(".main__ctrl__panel")
console.log(change__settings)
console.log(circumference)

/*-------------------------------------------------
               LAZY LOADING
    --------------------------------------------*/

let imagesToLoad = document.querySelectorAll('img[data-src]');

let loadImages = (image) => {
  image.setAttribute('src', image.getAttribute('data-src'));
  image.onload = () => {
    image.removeAttribute('data-src');
  };
};

if ('IntersectionObserver' in window) {
  let observer = new IntersectionObserver((items, observer) => {
    items.forEach((item) => {
      if (item.isIntersecting) {
        loadImages(item.target);
        observer.unobserve(item.target);
      }
    });
  });
  imagesToLoad.forEach((img) => {
    observer.observe(img);
  });
}
else {
  imagesToLoad.forEach((img) => {
    loadImages(img);
  });
}


/*-------------------------------------------------
             END OF  LAZY LOADING
   --------------------------------------------*/

//input__control__time.addEventListener

circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = `${circumference}`;

function setProgress(percent) {
  const offset = circumference - percent / TIME_LIMIT * circumference;
  circle.style.strokeDashoffset = offset;
  //  console.log(offset)
}

function timer(seconds) {
  const temp = seconds
  const progressChecker = setInterval(function () {
    const displayTime = document.querySelector("time")
    const mins = Math.floor(seconds / 60)
    const displayMin = mins < 10 ? `0${mins}` : mins
    const secs = seconds % 60
    const displaySec = secs < 10 ? `0${secs}` : secs
    seconds--
    displayTime.innerText = `${displayMin}:${displaySec}`

    //reset timers when changes has been implemented in the
    //form and form has been submitted.
    if (resetTimers) {
      clearInterval(progressChecker)
      resetTimers = false
    }
    if (resetShort) {
      clearInterval(progressChecker)
      resetShort = false
    }
    if (resetLong) {
      clearInterval(progressChecker)
      resetLong = false
    }


    if (seconds === 0) {
      displayTime.innerHTML = "00:00"
      start__pause.innerHTML = "Start"
      alarmSetter()
      clearInterval(progressChecker)
    }

    if (!paused) {
      clearInterval(progressChecker)
      // console.log(seconds)
    }


    setProgress((temp - seconds))
  }, 1000)

}

timer(TIME_LIMIT)
/* make a selection among pomodoro, short and long breaks 
      ________-----------------------------____________
*/
window.onload = () => {
  break__selectors[0].checked == true
}

const timeselectors = () => break__selectors.forEach(selector => {

  selector.onchange = () => {
    resetTimeSelectors = true
    if (selector.checked) {
      if (selector.id == "short") {
        shortBreakMode()
      } else if (selector.id == "long") {
        longBreakMode()
      } else {
        setPomodoro()
      }
    }

  }
})
timeselectors()
/* modal setting */
change__settings.addEventListener("click", () => {
  modal.classList.toggle("modal__settings__hide")
})
close__menu.addEventListener("click", () => {
  modal.classList.toggle("modal__settings__hide")
  resetTimers = false
  resetLong = false
  resetShort = false
  //resetTimeSelectors = true
})

timer__controller.addEventListener("click", (evt) => {
  const target = evt.target
  console.log(target)
  //get parent div of target
  const parent__div = target.closest("div")
  // get parent div of input element
  const parent__input = parent__div.previousElementSibling
  // get input element
  const target__input = parent__input.firstElementChild
  console.log(target__input)
  if (target__input == null || parent__input == null) {
    return
  }
  if (target__input.classList.contains("time__control")) {
    console.log("pomodoro timer control")
    if (target.classList.contains("btn--up")) {
      console.log("increase the pomodoro timer")
      countUp(90, short__count, target__input, 5)
    }
    else if (target.classList.contains("btn--down")) {
      console.log("decrease the pomodoro timer")
      countDown(5, pomodoro__count, target__input, 90)
    }
  } else if (target__input.classList.contains("time__control__short")) {
    console.log("short timer break controll")
    if (target.classList.contains("btn--up")) {
      console.log("increase the short break timer")
      countUp(10, short__count, target__input, 1)
    }
    else if (target.classList.contains("btn--down")) {
      console.log("decrease the short break timer")
      countDown(1, short__count, target__input, 10)
    }
  } else if (target__input.classList.contains("time__control__long")) {
    console.log("long timer break controll")
    if (target.classList.contains("btn--up")) {
      console.log("increase the long break timer")
      countUp(20, long__count, target__input, 11)
    }
    else if (target.classList.contains("btn--down")) {
      console.log("decrease the long break timer")
      countDown(11, long__count, target__input, 20)
    }
  }
  console.log(target__input)
})

const countUp = (maxvalue, counter, targetInput, checkmin) => {

  if (Number(targetInput.value < checkmin)) {
    //alert(`Minimum value should not be below ${checkmin}`)
    targetInput.value = checkmin
  }

  if (Number(targetInput.value > maxvalue)) {
    //alert(`Maximum value should not exceed ${maxvalue}`)
    targetInput.value = maxvalue
  }
  counter = Number(targetInput.value)
  if (counter < maxvalue) {
    counter = counter + 1
    targetInput.value = counter
    console.log(counter)
    console.log(maxvalue)
    console.log(targetInput.value)
  }
}

const countDown = (minvalue, counter, targetInput, checkmax) => {
  if (Number(targetInput.value < minvalue)) {
    //alert(`Minimum value should not be below ${minvalue}`)
    targetInput.value = minvalue
  }

  counter = Number(targetInput.value)
  if (counter > minvalue) {
    counter = counter - 1
    targetInput.value = counter
    console.log(counter)
    console.log(minvalue)
    console.log(targetInput.value)
  }

  if (Number(targetInput.value > checkmax)) {
    //alert(`Maximum value should not exceed ${checkmax}`)
    targetInput.value = checkmax
  }
}

//main settings panel form
main__settings.addEventListener("submit", (evt) => {
  console.log("form submit")
  evt.preventDefault()
  modal.classList.toggle("modal__settings__hide")
  changeColor()
  changeFont()
  // setPomodoro()
  // shortBreakMode()
  //  longBreakMode()
  alert("changes initiated")

})

//color selector function
const changeColor = () => {
  //progress ring
  const progress__ring = document.querySelector(".progress-ring__circle")
  const checkedBtns = document.querySelector("input[type='radio']:checked + label.break__mode__ctrls")
  // console.log(checkedBtn)
  const colors = Array.from(document.querySelectorAll(".color__list"))
  colors.forEach(colored => {
    if (colored.checked) {

      console.log(colored.id)
      if (colored.id == "turquoise") {
        progress__ring.classList.add("lime__ring")
        //checkedBtns.forEach(btn => {
        // btn.classList.add("lime__btn")
        checkedBtns.style.backgroundColor = "#70F380"
        //})
        // checkedBtn.classList.add("lime__btn")
        //checkedBtn.style.backgroundColor = "#70F380"
      } else if (colored.id == "purple") {
        progress__ring.classList.add("purple__ring")
        // checkedBtn.style.backgroundColor = "#D881F8"
      } else {
        progress__ring.classList.remove("purple__ring")
        progress__ring.classList.remove("lime__ring")
      }
    }
  })
}

//change font function
const changeFont = () => {
  const fonts = Array.from(document.querySelectorAll(".fonts__list"))
  const body = document.querySelector("body")
  console.log(fonts)
  fonts.forEach(fontSelect => {
    if (fontSelect.checked) {
      console.log(fontSelect.id)
      if (fontSelect.id == "roboto") {
        console.log(fontSelect.id)
        body.classList.add("roboto__font")
        body.classList.remove("kumbh__font")
        body.classList.remove("mono__font")
      } else if (fontSelect.id == "mono") {
        body.classList.add("mono__font")
        body.classList.remove("roboto__font")
        body.classList.remove("kumbh__font")
      } else {
        body.classList.remove("roboto__font")
        body.classList.remove("mono__font")
        body.classList.add("kumbh__font")
      }
    }
    // console.log(fontSelect)
  })
}

const setPomodoro = () => {
  resetTimers = true
  //const pomodoroTimer = document.querySelector(".time__control")
  TIME_LIMIT = input__control__time.value * 60
  timer(TIME_LIMIT)
  // resetTimers = false
}

const shortBreakMode = () => {
  resetShort = true
  //resetTimers = true
  TIME_LIMIT = time__control__short.value * 60
  timer(TIME_LIMIT)
  //resetTimers = false
}

const longBreakMode = () => {
  resetLong = true
  // resetTimers = true
  TIME_LIMIT = time__control__long.value * 60
  timer(TIME_LIMIT)
  // resetTimers = false
}

start__pause.addEventListener("click", () => {

  console.log("start and pause button")
  paused = !paused
  console.log(paused)

  if (paused) {
    start__pause.innerHTML = "Pause"
  } else {
    start__pause.innerHTML = "Start"
    if (TIME_LIMIT <= 0) {
      return
    } else {
      time__left()
      timer(TIME_LIMIT)
    }

  }

  if (TIME_LIMIT <= 0) {
    start__pause.innerHTML = "Start"
    break__selectors.forEach(selected => {
      if (selected.checked) {

        if (selected.id == "short") {
          // resetShort = false
          shortBreakMode()
        } else if (selected.id == "long") {
          longBreakMode()
        } else {
          setPomodoro()
        }
      }
      // paused = !paused
      // start__pause.innerHTML = "Pause"
    })
    //start__pause.innerHTML = "Start"
    return
  } else {
    timer(TIME_LIMIT)
  }

})

//calculate time left on clock
const time__left = () => {
  const time__left = document.querySelector("time").innerHTML
  const splitTime = time__left.split(":")
  const minutes__left = Number(splitTime[0])
  const seconds__left = Number(splitTime[1])
  console.log(minutes__left, seconds__left)
  TIME_LIMIT = minutes__left * 60 + seconds__left

  // setProgress(TIME_LIMIT)
  console.log(TIME_LIMIT)
}

const playSound = () => {
  const audio = new Audio(alarm)
  audio.play()
}

let alarmSetter = () => setTimeout(playSound, 1000);
//alarmSetter()

document.addEventListener('DOMContentLoaded', function() {
  const quotes = [
    '"The future belongs to those who believe in the beauty of their dreams." - Eleanor Roosevelt',
  '"Success is not final, failure is not fatal: It is the courage to continue that counts." - Winston Churchill',
  '"The only way to do great work is to love what you do." - Steve Jobs',
  '"Your education is a dress rehearsal for a life that is yours to lead." - Nora Ephron',
  '"Study as if you were going to live forever; live as if you were going to die tomorrow." Maria Mitchell',
  '"Hard work beats talent when talent doesn’t work hard." - Tim Notke',
  '"Believe you can and you’re halfway there." - Theodore Roosevelt',
  '"Education is the most powerful weapon you can use to change the world." - Nelson Mandela',
  '"A person who never made a mistake never tried anything new." - Albert Einstein',
  '"There are plenty of difficult obstacles in your path. Don’t become one of them." Ralph Marston',
  '"Only I can change my life. No one can do it for me." - Carol Burnett',
  '"I think I can. I know I can." - Jennifer Wittwer',
  '"Learning is never done without error and defeat." - Vladimir Lenin',
  '"You must be the change you wish to see in the world." - Mahatma Gandhi',
  '"There is no substitute for hard work." - Thomas Alva Edison',
  '"Don’t wait for the opportunity. Create it." - George Bernard Shaw',
  '"Success is the sum of all efforts, repeated day-in and day-out." - R. Collier',
  '"Failure will never overtake me if my determination to succeed is strong enough." - Og Mandino',
  '"Self-belief and hard work will always earn you success." - Virat Kohli',
  '"I am indeed a king because I know how to rule myself." - Pietro Aretino',
  '"When you reach the end of your rope, tie a knot in it and hang on." - Franklin D. Roosevelt',
  '"Always remember that you are absolutely unique. Just like everyone else." - Margaret Mead',
  '"Tell me and I forget. Teach me and I remember. Involve me, and I learn." - Benjamin Franklin',
  '"In the end, it’s not the years in your life that count. It’s the life in your years." - Abraham Lincoln',
  '"Every day is a second chance."',
  '"I never dreamed about success. I worked for it." - Estée Lauder'
  ];

  // Get a random index
  const randomIndex = Math.floor(Math.random() * quotes.length);

  // Display the random quote
  document.getElementById('quote-text').textContent = quotes[randomIndex];
});




document.addEventListener("DOMContentLoaded", function() {
  dragElement(document.getElementById("spotify-widget"));
});

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  // If the element has a header, use it for dragging
  if (elmnt.querySelector(".header")) {
    elmnt.querySelector(".header").onmousedown = dragMouseDown;
  } else {
    // Otherwise, use the whole element
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // Get the initial cursor position
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.addEventListener("mouseup", closeDragElement);
    document.addEventListener("mousemove", elementDrag);
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // Calculate the new cursor position
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // Set the element's new position
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // Stop moving when mouse button is released
    document.removeEventListener("mouseup", closeDragElement);
    document.removeEventListener("mousemove", elementDrag);
  }
}