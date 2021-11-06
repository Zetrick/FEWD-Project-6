// *************************************************
// *                Global Variables               *
// *************************************************
const div_qwerty = document.querySelector( '#qwerty' );
const div_phrase = document.querySelector( '#phrase' );
const div_overlay = document.querySelector( ' #overlay' );
const start_button = document.querySelector( '.btn__reset' );

//Phrases should have only letters and spaces -- no special characters or punctuation
const phrases = [
    'Somewhere over the rainbow',
    'Spread love everywhere you go',
    'May you live all the days of your life',
    'When you wish upon a star',
    'A long time ago in a galaxy far far away'
];

let missed = 0;

// *************************************************
// *                Global Functions               *
// *************************************************

//Return an array of individual characters chosen from a random phrase from the 'phrases' array
function getRandomPhraseAsArray( arr )
{
    let random_index = Math.floor( Math.random() * arr.length );
    return arr[ random_index ].split( '' );
}

//Takes an array and creates a series of li elements inside the #phrase div to 
//form the phrase for the user to guess
function addPhraseToDisplay( phrase_array )
{
    for ( let i = 0; i < phrase_array.length; ++i )
    {
        //Create li element with single character text content
        let li = document.createElement( 'LI' );
        li.textContent = phrase_array[ i ];

        if ( phrase_array[ i ] !== ' ' )
        {
            li.className = 'letter hvr-bounce-to-bottom';
        }
        else
        {
            li.className = 'space';
        }

        //Append li to the #phrase ul
        document.querySelector( '#phrase ul' ).appendChild( li );
    }
}

//Takes a letter (A-Z case insensitive) and checks to see if the phrase contains it.
//If so, the class 'show' is added to the lis that match the letter so they can be shown
function checkLetter( letter )
{
    let letter_found = false;
    let all_letters_in_phrase = document.querySelectorAll( '.letter' );

    for ( let i = 0; i < all_letters_in_phrase.length; ++i )
    {
        if ( letter.toUpperCase() === all_letters_in_phrase[ i ].textContent.toUpperCase() )
        {
            all_letters_in_phrase[ i ].classList.add( 'show', 'hvr-bounce-to-bottom-animate' );
            letter_found = true;
        }
    }

    if ( letter_found )
    {
        return letter;
    }
    else
    {
        return null;
    }
}

function setEndingStatus( player_won )
{
    resetGame();
    div_overlay.removeAttribute( 'style' );
    if ( player_won )
    {
        div_overlay.className = 'win';
        div_overlay.querySelector( 'h2' ).textContent = 'You win!!!';
        start_button.textContent = 'Play Again';
    }
    else
    {
        div_overlay.className = 'lose';
        div_overlay.querySelector( 'h2' ).textContent = 'You Lose!';
        start_button.textContent = 'Try Again';
    }
}

//Check to see if the number of shown letters equals the number of letters in the phrase
//If so, display the winning screen
function checkWin()
{
    const letters = document.querySelectorAll( '.letter' );
    const shown_letters = document.querySelectorAll( '.show' );

    if ( missed >= 5 )
    {
        setTimeout( () => { setEndingStatus( false ) }, 400 );
    }
    else if ( letters.length === shown_letters.length )
    {
        setTimeout( () => { setEndingStatus( true ) }, 800 );
    }
}

//Find the li element corresponding to the keypress or click and return
function findLi( letter )
{
    let letters = document.querySelectorAll( '.keyrow button' );
    for ( let i = 0; i < letters.length; ++i )
    {
        if ( letters[ i ].textContent.toLowerCase() === letter.toLowerCase() )
        {
            return letters[ i ];
        }
    }

    return null;
}

//Takes a LI of a letter resulting from a click or keypress and updates the UI accordingly
//And then check for a winning state
function processLetterLogic( letterLI )
{
    if ( letterLI.disabled === false )
    {
        //reset class names and re-add them depending on if the guess was correct or not
        letterLI.className = '';
        letterLI.classList.add( 'chosen' );
        letterLI.disabled = true;

        if ( !checkLetter( letterLI.textContent ) )
        {
            letterLI.classList.add( 'hvr-buzz-out', 'hvr-buzz-animate', 'incorrect' );
            document.querySelectorAll( '.tries img' )[ missed++ ].src =
                '/images/lostHeart.png'
        }
        else
        {
            letterLI.classList.add( 'hvr-pop', 'hvr-pop-animate', 'correct' );
        }
    }
    checkWin();
}

function between( x, min, max )
{
    return x >= min && x <= max;
}
document.addEventListener( 'keypress', ( e ) =>
{
    //a === 97
    //z === 122
    //A === 65
    //Z === 90
    //Ignore the event if the user is looking at the Start, Win, or Lose overlays
    //Or if the user pressed a non letter key
    //keyCode is deprecated but it is still supported by all browsers and was the easiest solution, imo
    if ( document.querySelector( '#overlay' ).style.display !== 'none' ||
        ( !between( e.keyCode, 65, 90 ) && !between( e.keyCode, 97, 122 ) ) )
        return;

    //Find the li element corresponding to the keypress and add the 'chosen' class
    processLetterLogic( findLi( e.key ) );
} );

div_qwerty.addEventListener( 'click', ( e ) =>
{
    //If we've clicked a button, remove the hvr-grow class pass the letter clicked to the checkLetter func
    if ( e.target.nodeName === 'BUTTON' )
    {
        processLetterLogic( findLi( e.target.textContent ) );
    }
} );

function resetGame()
{
    //Reset Score
    missed = 0;

    //Remove all children from the ul inside #phrase
    let ul = div_phrase.querySelector( 'ul' );
    while ( ul.firstChild )
        ul.removeChild( ul.firstChild );

    //Remove disabled state and additional class names from all previously pressed keys
    let letters = document.querySelectorAll( '.keyrow button' );
    for ( let i = 0; i < letters.length; ++i )
    {
        letters[ i ].className = 'hvr-grow';
        letters[ i ].disabled = false;
    }

    //Reset all missing heart pictures
    let heart_imgs = document.querySelectorAll( '.tries img' );
    for ( let i = 0; i < heart_imgs.length; ++i )
        heart_imgs[ i ].src = '/images/liveHeart.png';

}


//Reset game and disable the overlay when the user clicks start button
start_button.addEventListener( 'click', () =>
{
    addPhraseToDisplay( getRandomPhraseAsArray( phrases ) );
    div_overlay.style.display = 'none';
} );

resetGame();