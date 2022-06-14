let countQue = document.querySelector(".count span");
let bulletsContainer = document.querySelector(".bullets .spans");
let bullets = document.querySelector(".bullets");
let queArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answers-area");
let submit = document.querySelector(".submit-button");
let resultDiv = document.querySelector(".results");
let countdownDiv = document.querySelector(".countdown");
// //طريقة تانية مشان نرسل ريكوست عن طريق فيتش
// fetch("html-questions.json").then((res) => console.log(res.json()));
let currentIndex = 0;
let rAnswer = 0;
let countInterval;
//فنكشين مشان تجيب الداتا من الجيسون
function getDataFromJson() {
  let req = new XMLHttpRequest();
  req.onreadystatechange = function () {
    if (req.readyState == 4 && req.status == 200) {
      let data = JSON.parse(this.responseText);
      //هيك مشان نجيب العدد تبع الاسئلة وكمان ننشئ سبان بعدد الاسئلة
      createBullets(data.length);
      //هان بدنا نجيب اول سؤال والعدد عشان ننشئ بالصفحة
      createDataFromPage(data[currentIndex], data.length);

      // تفعيل الكاونت
      countDown(3, data.length);
      // هان على شان لما يضغط على السبميت شو يسير
      submit.onclick = () => {
        // هان جبنا الاجابة الصحيحة وبدنا نفوتها بفنكشين عشان نقدر نستخدمها ونقارنها مه اللي بيضغط عليها اليوزر
        let rightAnswre = data[currentIndex].right_answer;
        currentIndex++;
        answersFun(rightAnswre, data.length);
        //هان بدنا نفضي مكان السؤال والاجابة عشان نعرض السؤال التاني
        queArea.innerHTML = "";
        answerArea.innerHTML = "";
        //هان راح نستدعي الفنكشين اللي بتعمل ريندر للعناصر بالصفحة وراح يكون السؤال غير لانه انا زودت الكرنتانديكس
        createDataFromPage(data[currentIndex], data.length);

        // هان بدنا نعمل فنكشين اللي بتضيف كلاس للسبان علشان يشوف وين واصل
        handleBullets();
        clearInterval(countInterval);
        countDown(3, data.length);
        showResults(data.length);
      };
    }
  };
  req.open("GET", "html-questions.json", true);
  req.send();
}
getDataFromJson();

function createBullets(num) {
  countQue.innerHTML = num;
  for (let i = 0; i < num; i++) {
    let span = document.createElement("span");
    //هاد مشان يفحص اذا كان واقف ع اول سبان يعطيها الكلاس اون
    if (i == 0) {
      span.classList.add("on");
    }
    bulletsContainer.appendChild(span);
  }
}

function createDataFromPage(obj, count) {
  if (currentIndex < count) {
    let h2 = document.createElement("h2");
    h2.textContent = obj.title;
    queArea.appendChild(h2);

    for (let i = 1; i <= 4; i++) {
      let answer = document.createElement("div");
      answer.classList.add("answer");
      answerArea.appendChild(answer);

      let input = document.createElement("input");
      input.type = "radio";
      input.name = "questions";
      input.id = `answer_${i}`;
      input.dataset.answer = obj[`answer_${i}`];
      answer.appendChild(input);

      if (i == 1) {
        input.checked = true;
      }

      let label = document.createElement("label");
      label.textContent = obj[`answer_${i}`];
      label.htmlFor = `answer_${i}`;
      answer.appendChild(label);
    }
  }
}

function answersFun(rightAnswre, count) {
  let answres = document.getElementsByName("questions");
  let selectAnswer = "";
  for (let i = 0; i < answres.length; i++) {
    if (answres[i].checked) {
      selectAnswer = answres[i].dataset.answer;
    }
  }
  if (selectAnswer == rightAnswre) {
    rAnswer++;
  }
}

function handleBullets() {
  let bullets = document.querySelectorAll(".bullets .spans span");
  //   for (let i = 0; i < bullets.length; i++) {
  //     if (i == currentIndex) {
  //       bullets[i].classList.add("on");
  //     }
  //   }
  let array = Array.from(bullets);
  array.forEach((span, i) => {
    if (i == currentIndex) {
      span.classList.add("on");
    }
  });
}

function showResults(count) {
  let result;
  if (currentIndex == count) {
    bullets.remove();
    submit.remove();
    queArea.remove();
    answerArea.remove();

    if (rAnswer > count / 2 && rAnswer < count) {
      result = `<span class="good">Good</span>, ${rAnswer} From ${count}`;
    } else if (rAnswer == count) {
      result = `<span class="perfect">Perfect</span>, ${rAnswer} From ${count}`;
    } else {
      result = `<span class="bad">Bad</span>, ${rAnswer} From ${count}`;
    }
    resultDiv.innerHTML = result;
    resultDiv.style.padding = "20px";
    resultDiv.style.textAlign = "center";
    resultDiv.style.fontSize = "20px";
    resultDiv.style.backgroundColor = "white";
    resultDiv.style.marginTop = "10px";
  }
}

function countDown(time, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countInterval = setInterval(() => {
      minutes = parseInt(time / 60);
      seconds = parseInt(time % 60);
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      countdownDiv.innerHTML = `${minutes}:${seconds}`;
      if (--time < 0) {
        clearInterval(countInterval);
        submit.click();
      }
    }, 1000);
  }
}
