/*-----------Namespacing-----------------------*/ 
const myApp = {};

/*-----------Bootcamp Cat Object---------------*/ 
myApp.bootcampCat = {};

/*-----------System Parameters----------------*/ 
// default game time is set to 5 minutes (1 tick = approx. 1 second)
myApp.ticks = 300;
// system variables 
myApp.isGameRunning = false;
// variable defining if it's the first game
myApp.isFirstGame = true;
// variable defining if messages are updating
myApp.isMessageFrozen = false;

// a string of text to be gradually appended to the welcome page 
myApp.prehistory = 'Months of struggling, reading books and forums, solving tech challenges, passing a personality test, overcoming self-doubt and crying next to the fridge in the middle of the night, and a long-awaited email from Juno lands in the inbox. Its contents will be life-changing.';
// cancel code for clearing interval for appearing text on welcome page  
myApp.cancelPrehistoryCode;

// funny keywords related to our cohort to be randomly dispayed on screen
myApp.keywords = ['ThreatenedSwan', 'calc(30 - 3)', 'orbitz', 'Marley', 'Riley', 'pineappleJuice', 'dank', 'survivor', 'cookies', 'gityourselfabreak', 'sonOfJson', 'zoominplz', 'JS = magic', 'undefined', 'keepitdry', 'pizza+sushi',  'projectproject', 'curlyboys', 'gridouttahere', 'gitoffyourlaptop', 'conCATenation', 'cohort27', 'flexYESfloatNO'];

// reseting bootcamp cat object every time user starts a new game in order to keep the default property values 
myApp.resetBootcampCat = () => {
    myApp.bootcampCat = {
        energyLevel: 100,
        hungerLevel: 0,
    };
};

/*-----------Secondary Functions----------------*/ 
// making the text gradually appear on the welcome screen
myApp.showPrehistory = () => {
    // myApp.prehistory
    const prehistoryText = $('#prehistory').text();
    if (prehistoryText.length + 1 <= myApp.prehistory.length) {
        const newParticle = myApp.prehistory.slice(0, prehistoryText.length + 1);
        $('#prehistory').text(newParticle);
    } else {
        clearInterval(myApp.cancelPrehistoryCode);
    }
}

// formatting time from numbers to strings allowing for zeros to appear before digits
myApp.formatTime = (int) => {
    const tempString = String(int);
    return tempString.length !== 1 ? tempString : `0${tempString}`;
};

// taking a random item from the keywords array and displaying it on screen (this function will be called in init with setinterval and will run every 4 seconds)
myApp.getRandomKeyword = () => {
    if (!myApp.isGameRunning) return;
    const randomKeyword = myApp.keywords[Math.floor(Math.random() * myApp.keywords.length)];
    $('.randomKeyword').text(`#${randomKeyword}`);
};

/*-----------Status Updates----------------*/ 
// calculating time out of ticks and updating UI
myApp.updateTime = () => {
    const seconds = myApp.ticks % 60;
    const minutes = (myApp.ticks - seconds) / 60;
    // formatting seconds and minutes and displaying them on screen 
    const strSeconds = myApp.formatTime(seconds);
    const strMinutes = myApp.formatTime(minutes);
    $('.minutes').html(strMinutes);
    $('.seconds').html(strSeconds);
};

// updating ticks only if isGameRunning variable is set to true (it is set to true once the user clicks to start or restart the game)
myApp.updateTicks = () => {
    if (myApp.isGameRunning) {
       myApp.ticks -= 1;
    };
    // if ticks run below zero, game ends automatically
    if (myApp.ticks <= 0) {
        myApp.endGame();
    };
};

// updating energy and displaying it on the screen
myApp.updateEnergy = () => {
    // energy is automatically decreasing by 10 points every 5 seconds 
    if (myApp.ticks % 5 === 0 && myApp.ticks !== 300) {
        myApp.bootcampCat.energyLevel -= 10;
    }
    // once the energy level is hitting zero, set it to equal zero   
    if (myApp.bootcampCat.energyLevel < 0) {
        myApp.bootcampCat.energyLevel = 0;
    };
    // displaying the energy level on screen  
    $('.energyNumber').html(`${myApp.bootcampCat.energyLevel}`);
};

// updating hunger level and displaying it on the screen
myApp.updateHunger = () => {
    // the hunger level is automatically increasing by 10 points every 10 seconds 
    if (myApp.ticks % 10 === 0 && myApp.ticks !== 300) {
        myApp.bootcampCat.hungerLevel += 10;
    }
    // once the hunger level is hitting 100, prevent it from going above 100   
    if (myApp.bootcampCat.hungerLevel >= 100) {
        myApp.bootcampCat.hungerLevel = 100;
    };
    // displaying the hunger level on screen  
    $('.hungerNumber').html(`${myApp.bootcampCat.hungerLevel}`);
};

// updating messages based on energy and hunger level
myApp.updateMessage = () => {
    if (!myApp.isGameRunning || myApp.isMessageFrozen) return;
    const energyCritical = myApp.bootcampCat.energyLevel <= 30;
    const hungerCritical = myApp.bootcampCat.hungerLevel >= 70
    const energyMiddle = myApp.bootcampCat.energyLevel <= 70;
    const hungerMiddle = myApp.bootcampCat.hungerLevel >= 30;
    const coffeeMax = myApp.bootcampCat.energyLevel > 100;
    if (energyCritical && hungerCritical) {
        $('.appendedMessage').html(`Energy and food-deprived cat considers finding a better buddy.`);
    } else if (energyCritical) {
        $('.appendedMessage').html(`The cat is struggling to keep its eyes open.`);
    } else if (hungerCritical) {
        $('.appendedMessage').html(`It's shocking to see you keeping your cool while your cat hasn't eaten for more than a minute!`);
    } else if (energyMiddle && hungerMiddle) {
        $('.appendedMessage').html(`Your cat keeps working but now and then it is giving you a cold stare.`);
    } else if (hungerMiddle) {
        $('.appendedMessage').html(`Is that stomach growl?`);
    } else if (energyMiddle) {
        $('.appendedMessage').html(`Your cat is yawning so cute... Wait, maybe it needs some boost?`);
    } else if (coffeeMax) {
        $('.appendedMessage').html(`You are turning your cat into a coffee junkie!`);
    } else {
        $('.appendedMessage').html(`Your cat is efficient, focused and productive.`);
    }
};

// checking lower und upper energy thresholds and add relevant classes to alert user once thresholds are met
myApp.reactToLevel = () => {
    // once the energy level is hitting 30 or lower, make it blink on screen by adding a corresponding class
    if (myApp.bootcampCat.energyLevel <= 30) {
        $('.energyNumber').addClass('blinking');
    // if it does not meet the above condition, remove the added class
    } else {
        $('.energyNumber').removeClass('blinking');
    };
    // once the energy level is going above 100, make it red on screen by adding a corresponding class
    if (myApp.bootcampCat.energyLevel > 100) {
        $('.energyNumber').addClass('updatedEnergy');
    // if it does not meet the above condition, remove the added class
    } else {
        $('.energyNumber').removeClass('updatedEnergy');
    };
    // once the hunger level is going above 70, add blinking class
    if (myApp.bootcampCat.hungerLevel >= 70) {
        $('.hungerNumber').addClass('blinking');
          // if it does not meet the above condition, remove the added class
    } else {
        $('.hungerNumber').removeClass('blinking');
    };
};

// updating time, ticks, and energy and reacting if energy thresholds are met
myApp.update = () => {
    // run the function only if the isGameRunning variable is set to true (it is set to true once the user clicks to start or restart the game), otherwise exit the function
    if (!myApp.isGameRunning) return;
    myApp.updateTime();
    myApp.updateEnergy();
    myApp.updateHunger();
    myApp.updateTicks();
    myApp.reactToLevel();
    myApp.updateMessage();
};

/*-----------Event Listeners on Buttons----------------*/
// updating the energy level based on user interaction 
myApp.handleBoost = () => {
    if (!myApp.isGameRunning) return;

    // increse the energy level by 10 points based on user input
    myApp.bootcampCat.energyLevel += 10;
    // prevent the energy level from going above 150
    if (myApp.bootcampCat.energyLevel >= 150) {
        myApp.bootcampCat.energyLevel = 150;
    };
    // display energy level on the screen
    $('.energyNumber').html(`${myApp.bootcampCat.energyLevel}`);
    // call the function to check energy thresholds after user input and alert user once thresholds are met
    myApp.reactToLevel();
};

// updating the hunger level based on user interaction 
myApp.handleFeed = () => {
    if (!myApp.isGameRunning) return;

    // decrese the hunger level by 10 points if user clicks the Feed button
    myApp.bootcampCat.hungerLevel -= 10;
    // prevent the hunger level from going below 0
    if (myApp.bootcampCat.hungerLevel <= 0) {
        myApp.bootcampCat.hungerLevel = 0;
    };
    // display hunger level on the screen
    $('.hungerNumber').html(`${myApp.bootcampCat.hungerLevel}`);
    // call the function to check hunger thresholds after user input and alert user once thresholds are met
    myApp.reactToLevel();
};

// updating the energy level based on user interaction 
myApp.handlePraise = () => {
    // run it only if the game is running
    if (!myApp.isGameRunning) return;
    // increse the energy level by 10 points if user clicks the Praise button
    myApp.bootcampCat.energyLevel += 10;
    // prevent the energy level from going above 150
    if (myApp.bootcampCat.energyLevel >= 100) {
        myApp.bootcampCat.energyLevel = 100;
    };
    // display energy level on the screen
    $('.energyNumber').html(`${myApp.bootcampCat.energyLevel}`);
    // call the function to check energy thresholds after user input and alert user once thresholds are met
    myApp.reactToLevel();
};

// adding a funny message once user clicks on Sleep button 
myApp.handleSleep = () => {
    // run it only if the game is running and the Sleep button is not disabled
    if (!myApp.isGameRunning || $('.sleep').hasClass('disabled')) return;
    // preventing other messages from appearing so that user can read the funny message
    myApp.isMessageFrozen = true;
    $('.appendedMessage').html(`Are you kidding me? Is it even legal during the bootcamp?`);
    // disabling the Sleep button so that the user can click it only once, it stays disabled even after restart
    $('.sleep').addClass('disabled');
    // unfreezing other messages after 3 seconds
    setTimeout(() => {
        myApp.isMessageFrozen = false;
    }, 3000);
};

/*-----------Start / Restart / End Game----------------*/ 
myApp.startNewGame = () => {
    // add a gif
    $('.catImage').html(`<div class="tenor-gif-embed" data-postid="13203096" data-share-method="host" data-width="100%" data-aspect-ratio="1.4035087719298245"><a href="https://tenor.com/view/typing-cat-neko-lolyinthesky-gif-13203096">Typing Cat GIF</a> from <a href="https://tenor.com/search/typing-gifs">Typing GIFs</a></div><script type="text/javascript" async src="https://tenor.com/embed.js"></script>`);
    // add event listeners on click on respective buttons 
    if (myApp.isFirstGame) {
        $('.boost').on('click', myApp.handleBoost);
        $('.feed').on('click', myApp.handleFeed);
        $('.praise').on('click', myApp.handlePraise);
        $('.sleep').on('click', myApp.handleSleep);
        myApp.isFirstGame = false;
        // start picking random keywords every 4 seconds
        setInterval(myApp.getRandomKeyword, 4000);
    };
    // once the user clicks to start or restart, variable is set to true which is triggering the ticks update above
    myApp.isGameRunning = true;
    // user is given 5 minutes to play
    myApp.ticks = 300;
    // reset bootcamp cat object every time user starts a new game 
    myApp.resetBootcampCat();
    // once user starts the game, the button text is changed from 'start' to 'restart' 
    $('.resetButton').text('Restart');
    myApp.updateTime();
    myApp.updateEnergy();
    myApp.updateHunger();
};

// ending the game, called once the set amount of ticks elapses, isGameRunning is set to false to prevent ticks from updating
myApp.endGame = () => {
    myApp.isGameRunning = false;
    setTimeout(() => {
        myApp.isMessageFrozen = false;
        myApp.updateTime();
        $('.catImage').html(`<img src="assets/staticCat.jpg" alt="A cat typing on its laptop, a representation of a developer cat">`);
        $('.appendedMessage').html(`Congrats, you made it through! Assignment has been pushed to GitHub. Time for a celebratory Orbitz and up to #partyroom.`);
        $('.energyNumber').removeClass('blinking');
        $('.hungerNumber').removeClass('blinking');
    }, 1000);
};

/*-----------Init----------------*/ 
myApp.init = () => {
    myApp.cancelPrehistoryCode = setInterval(myApp.showPrehistory, 30);
     // add an event listener to load to the game screen and enable the game start
    $('.buttonDown').on('click', function(){
        // clear interval for appearing text on welcome page with cancel code 
        clearInterval(myApp.cancelPrehistoryCode);
        // transition to game screen
        $('.welcomePage').slideUp('slow');
        $('.gamePage').show().slideDown('slow');
        // run the update function every second 
        setInterval(myApp.update, 1000);
        // add an event listener to the start button to start or restart the game
        $('.resetButton').on('click', myApp.startNewGame);
    });
};
 
// document ready: once the page has loaded, call the init function
$(function() {
    myApp.init();
})