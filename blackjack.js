'use strict'
var myCradsPlace;
var dealerCardsPlace;
var resultPlace;
var tweetPlace;

var myStandFlag=false;
var dealerStandFlag=false;

var dealerCards=[];

var myScore=[];
var dealerScore=[];

function cardAppend(memberID){
    let theScore=Math.floor(Math.random()*10+1);
    switch(memberID){
        case 0:
            dealerScore.push(theScore);
            if(dealerScore.length===1){
                dealerCards.push(theScore*4-Math.floor(Math.random()*4));
                let card=document.createElement('img');
                card.setAttribute('src','trampcards/tramp'+(dealerCards[0])+'.gif');
                dealerCardsPlace.appendChild(card);
            }else{
                dealerCards.push(theScore*4-Math.floor(Math.random()*4));
                let card=document.createElement('img');
                card.setAttribute('src','trampcards/tramp0.png');
                dealerCardsPlace.appendChild(card);
            }
            break;
        case 1:
            myScore.push(theScore);
            let card=document.createElement('img');
            card.setAttribute('src','trampcards/tramp'+(theScore*4-Math.floor(Math.random()*4))+'.gif');
            myCradsPlace.appendChild(card);
            break;
    }
}

//読み込み時に行われる処理
window.onload=function(){
    myCradsPlace=document.getElementById('myCardsPlace');
    dealerCardsPlace=document.getElementById('dealerCardsPlace');
    resultPlace=document.getElementById('result-area');
    tweetPlace=document.getElementById('tweet-area');
    for(let i=0;i<2;i++){
        cardAppend(1);
        judgeACards(myScore);
        cardAppend(0);
        judgeACards(dealerScore);
    }
};

//カードの合計値を返す
function sumCards(score){
    let sum=0;
    for(let i=0;i<score.length;i++){
        sum = sum+score[i];
    }
    return sum;
}

//Aの位置を返す。なければ-1を返す
function searchA(score){
    let Aindex=-1;
    for(var i=0;i<score.length;i++){
        if(score[i]===1 || score[i]===11) Aindex=i;
    }
    return Aindex;
}

//Aの条件分けをする。カードを引いた後に呼ぶこと。
function judgeACards(score){
    let Aindex=searchA(score)
    if(Aindex>-1 && sumCards(score)<=11){
        score[Aindex]=11;
    }else if(Aindex>-1 && sumCards(score)>11){
        score[Aindex]=1;
    }
}

//バストの判定。
function judgebust(score){
    if(sumCards(score)>21){
        return true;
    }else{
        return false;
    }
}

//ディーラーカードを表示する
function returnDealerCards(){
    while(dealerCardsPlace.firstChild){
        dealerCardsPlace.removeChild(dealerCardsPlace.firstChild);
    }

    for(var i=0;i<dealerScore.length;i++){
        let card=document.createElement('img');
        card.setAttribute('src','trampcards/tramp'+(dealerCards[i])+'.gif');
        dealerCardsPlace.appendChild(card);
    }
}

//ディーラーのAI スコア15以上でスタンドする
function dealerAI(){
    if(!dealerStandFlag){
        if(myStandFlag){
            while(sumCards(dealerScore)<15){
                cardAppend(0);
                judgeACards(dealerScore);
                if(judgebust(dealerScore)){
                    gameSet(-999);
                }
            }
            dealerStandFlag=true;
        }else{
            if(sumCards(dealerScore)<15){
                cardAppend(0);
                judgeACards(dealerScore);
                if(judgebust(dealerScore)){
                    gameSet(-999);
                }
                if(sumCards(dealerScore)>=15){
                    dealerStandFlag=true;
                }
            }
        }
    }
    gameSetJudge();
}

function hitButton(){
    cardAppend(1);
    judgeACards(myScore);
    if(judgebust(myScore)){
        gameSet(999);
    }
    dealerAI();
}

function standButton(){
    myStandFlag=true;
    judgeACards(myScore);
    dealerAI();
}

function gameSetJudge(){
    if(myStandFlag && dealerStandFlag && sumCards(dealerScore)<22 && sumCards(myScore)<22){
        let status;
        if(sumCards(myScore)>sumCards(dealerScore)){
            status=1;
        }else if(sumCards(myScore)===sumCards(dealerScore)){
            status=0;
        }else{
            status=-1;
        }
        gameSet(status);
    }
}

function resultWindow(status){
    switch(status){
        case 1:
            resultPlace.innerText='You Win!';
            resultPlace.style.color='#ff6a6a';
            break;
        case 0:
            resultPlace.innerText='Draw!';
            resultPlace.style.color='#fff241';
            break;
        case -1:
            resultPlace.innerText='You Lose!';
            resultPlace.style.color='#4184ff';
            break;
        case 999:
            resultPlace.innerText='You Bust!';
            resultPlace.style.color='#4184ff';
            break;
        case -999:
            resultPlace.innerText='Dealer Bust!';
            resultPlace.style.color='#ff6a6a';
            break;
    }
}

function tweetMaker(status){
    const anchor = document.createElement('a');
    const hrefValue =
    'https://twitter.com/intent/tweet?button_hashtag=' +
    encodeURIComponent('HK_BlackJack') +
    '&ref_src=twsrc%5Etfw';

    anchor.setAttribute('href', hrefValue);
    anchor.className = 'twitter-hashtag-button';

    let message;
    switch(status){
        case 1:
            message='おめでとう！キミの勝ち！';
            break;
        case 0:
            message='引き分け！';
            break;
        case -1:
            message='残念、キミの負け…';
            break;
        case 999:
            message='残念、キミの負け…';
            break;
        case -999:
            message='おめでとう！キミの勝ち！';
            break;
    }

    anchor.setAttribute('data-text', message);
    anchor.innerText = 'Tweet #HK_BlackJack';

    tweetPlace.appendChild(anchor);

    const script = document.createElement('script');
    script.setAttribute('src', 'https://platform.twitter.com/widgets.js');

    tweetPlace.appendChild(script);
}

function gameSet(status){
    returnDealerCards();
    resultWindow(status);
    tweetMaker(status);
}