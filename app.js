gameSeq = [];
userSeq = [];
let btns = ["red", "green", "blue", "yellow"];

let heading = document.querySelector("span");
let h2 = document.querySelector("h2")
let gameStart = false;
let level = 0;


// GAME starting 
document.addEventListener("keypress", function () {
    if (gameStart == false) {
        console.log("Game started");
        gameStart = true;
        levelUp();
    };
});
document.addEventListener("click", function () {
    if (gameStart == false) {
        console.log("Game started");
        gameStart = true;
        levelUp();
    };
});
// ----------

// for flashing of buttons
function flash(btn) {
    btn.classList.add("flash");
    setTimeout(function () {
        btn.classList.remove("flash");
    }, 350);
}
function btnflash(btn){
    btn.classList.add("btnflash");
    setTimeout(function () {
        btn.classList.remove("btnflash");
    }, 200);
}
// ----------


// Increase level
function levelUp() {
    level++;
    h2.innerText = `Level ${level} `;

    let randIndx = Math.floor(Math.random() * 3);
    let randColor = btns[randIndx];
    let randbtn = document.querySelector(`.${randColor}`);

    // console.log(randIndx);
    // console.log(randColor);
    // console.log(randbtn);
    gameSeq.push(randColor);
    flash(randbtn);

    userSeq = [];
}


function checklvl(idx) {
    console.log("level : ", level);

    if (userSeq[idx] === gameSeq[idx]) {
        if (userSeq.length == gameSeq.length) {
            // setTimeout(levelUp, 100);
            levelUp();
        }
    } else {
        // h2.innerText = `Game Over... Your score was <b>${level}</b><br> try again !!`;
        document.querySelector("body").style.backgroundColor = "red";
        setTimeout(function () {
            document.querySelector("body").style.backgroundColor = "white";
        }, 1500);
        // h2.innerText = `game over ${level} `;
        setTimeout(function() {
            h2.innerText = `Your score was ${level}, press any key to try again `;
        }, 10);

        reset();
        console.log("false");
    }
}

function btnPress() {
    // console.log(this);
    let btn = this;
    btnflash(btn);

    userColor = btn.getAttribute("id");
    userSeq.push(userColor);
    checklvl(userSeq.length - 1);
}


let allBtn = document.querySelectorAll(".btn");

for (btn of allBtn) {
    btn.addEventListener("click", btnPress);
};
function reset() {
    gameStart = false;
    gameSeq = [];
    userSeq = [];
    level = 0;

}


    setTimeout(function(){
        heading.style.color = "red";
    }, 2000);
    setTimeout(() => {
        heading.style.color = "green"; 
    }, 4000);
