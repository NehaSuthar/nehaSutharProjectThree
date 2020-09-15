
//----------------------Variable decalaration----------------------------//
const simonApp = {};
//array to show matrix colors
simonApp.buttonColours = ["red", "yellow", "green", "blue","pink","blueViolet","mediumAquaMarine","magenta","mediumVioletRed","tomato", "steelBlue", "goldenRod", "indigo","teal","maroon","white"];
simonApp.gamePattern = [];//stores random pattern h=generated by game
simonApp.userClickedPattern = [];//stores pattern recreated by player
simonApp.userSelectedMatrix = [];//stores truncated buttonColors[] array as per difficult level selcetd by the player
simonApp.started = false;
simonApp.level = 0;
simonApp.selectedOption = 0;//stores martix size as per difficult level selcetd by the player(eg 2,3,4)
//array to store media breakpoint for application responsiveness
simonApp.matchMediaListner =[
  window.matchMedia('(max-width: 600px) and (min-width: 451px'),
  window.matchMedia('(max-width: 450px)')
];
//----------------------to start the game on any key press-------------------//
$(document).on('keypress',()=> {
  if (!simonApp.started) {
    $(".gameTitle").text("Level " + simonApp.level);
    simonApp.started = true;
    simonApp.nextSequence(simonApp.selectedOption);
  }
});
$('.startButton').on('click',()=>{
  if (!simonApp.started) {
    $(".gameTitle").text("Level " + simonApp.level);
    simonApp.started = true;
    simonApp.nextSequence(simonApp.selectedOption);
  }
})
//---------------to store and compare user pattern with game pattern----------//
$(".gridContainer").on('click','.btn',function() {
  let userChosenColour = $(this).attr("id");//get the id of the div clicked by player
  simonApp.userClickedPattern.push(userChosenColour); 
  simonApp.playSound("green");
  simonApp.animatePress(userChosenColour); 
  if(simonApp.userClickedPattern !== null)
    simonApp.checkAnswer(simonApp.userClickedPattern.length-1);//checompar the game pattern with user pattern
});
//--------------to nullify all arrays and variable at the end of the game-----//
simonApp.startOver=()=>{
  simonApp.level = 0;
  simonApp.gamePattern = [];
  simonApp.started = false;
  $('.gameTitle').text('Press any key to start the game or click');
}
//----------------------to play sound --------------------------//
simonApp.playSound = (color)=>{
  let audio = new Audio(`sounds/${color}.mp3`);
  audio.play();
}
//-----------------to animate key prssed and key release action------//
simonApp.animatePress = (currentColor)=>{
  $("#" + currentColor).addClass("pressed");
  setTimeout(()=>{
    $("#" + currentColor).removeClass("pressed");
  }, 100);
}
//--------------to generate game pattern as per user selected difficulty level---//
//input argument for the function is matrix size eg for 2X2 matrix, 2 will be passed--//
simonApp.nextSequence = (matrixSize)=>{
  if(matrixSize > 0){
    simonApp.userClickedPattern = [];
    simonApp.level++;
    $(".gameTitle").text("Level " + simonApp.level);
    let randomNumber = Math.floor(Math.random() * (matrixSize*matrixSize));//generate random number between 0-3,0-8 or 0-15
    let randomChosenColour = simonApp.userSelectedMatrix[randomNumber];
    simonApp.gamePattern.push(randomChosenColour);
    $("#" + randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);//to highlight random generated game pattern
    simonApp.playSound("green");
  }
}
//----------------for default 2X2 matrix load at the start of the game---------------//
simonApp.intialLoad =()=>{
  $('#selectMatrix').find('option:first').attr('selected', 'selected');
  simonApp.selectedOption  = parseInt($('option:first').val());
  simonApp.loadMatrix(simonApp.selectedOption );
}
//----------------event is trigger on difficulty level selection by user---------//
$('#selectMatrix').on('change',function(){
  simonApp.startOver();
  simonApp.selectedOption = parseInt($(this).val());
  simonApp.loadMatrix(simonApp.selectedOption );
});
//-----------------function is called to laod the matrix as per the difficulty level--//
//called from simonApp.intialLoad() and  $('#select-matrix').on('change',function()....//
//input argument for the function is matrix size eg for 2X2 matrix, 2 will be passed--//
simonApp.loadMatrix =(matrixSize)=>{
  if(matrixSize >0){
    simonApp.userSelectedMatrix = simonApp.buttonColours.slice(0,(matrixSize*matrixSize));
    $('.gridContainer').empty();
    $('.gridContainer').css('--row-num',matrixSize);
    $('.gridContainer').css('--col-num',matrixSize);
    for(let i=0;i<simonApp.userSelectedMatrix.length;i++){
        const matrixDiv = $('<div>').addClass(`btn ${simonApp.userSelectedMatrix[i]}`).attr({"id":simonApp.userSelectedMatrix[i],"tabindex":i+4});
        $('.gridContainer').append(matrixDiv);
      }
      for(let i=0;i<simonApp.matchMediaListner.length;i++){
        simonApp.mediaQueryUpdate(simonApp.matchMediaListner[i]);
      }
    }
}
//-------------function campare the user pattern with the game pattern----------//
//called from $(".grid-container").on('click','.btn',function() event-------//
simonApp.checkAnswer = (currentLevel) => {
  if (simonApp.gamePattern[currentLevel] === simonApp.userClickedPattern[currentLevel]) {//user pattern is equal to game pattern----continue the game
    if (simonApp.userClickedPattern.length === simonApp.gamePattern.length){
      setTimeout(()=>{
        simonApp.nextSequence(simonApp.selectedOption);
      }, 1000);
    }
  } else {//user pattern is not equal to game pattern----End the game
    simonApp.playSound("wrong");
    $("body").addClass("gameOver");
    $(".gameTitle").text("Press any key to start the game or click");

    setTimeout(function () {
      $("body").removeClass("gameOver");
    }, 200);
    simonApp.startOver();//to reset all the arrays and variables.
  }
}
//-------------------------mediaQuery to adjust matrix element size-----------------// 
simonApp.mediaQueryUpdate = (mediaWidth)=>{
  if(simonApp.matchMediaListner[0].matches){//-------(max-width: 600px) and (min-width: 451px')
    if(simonApp.selectedOption  === 4)
      simonApp.matrixDivSize("100px");
    else if(simonApp.selectedOption  === 3)
      simonApp.matrixDivSize("120px");
    else
      simonApp.matrixDivSize("160px");
  }
  else if(simonApp.matchMediaListner[1].matches){//-----------(max-width: 450px')
    if(simonApp.selectedOption  === 4)
      simonApp.matrixDivSize("70px");
    else if(simonApp.selectedOption  === 3)
      simonApp.matrixDivSize("90px");
    else
      simonApp.matrixDivSize("140px");
  }else{
    if(simonApp.selectedOption  === 4)
      simonApp.matrixDivSize("120px");
    else if(simonApp.selectedOption  === 3)
      simonApp.matrixDivSize("140px");
    else
      simonApp.matrixDivSize("170px");
  }
}
//-----------------------generic function to set matrix element's height and width-------//
simonApp.matrixDivSize = (sizePx)=>{
  $('.btn').css({"height":sizePx,"width":sizePx});
}
//---------call from document ready to intialize the default matrix--//
simonApp.init = ()=>{
  try{
    simonApp.intialLoad();//load default color matrix on website load/reload. 
    for(let i=0;i<simonApp.matchMediaListner.length;i++){
      simonApp.mediaQueryUpdate(simonApp.matchMediaListner[i]);//to set the intiall  matrix elements;s size as per current screen width
      simonApp.matchMediaListner[i].addListener(simonApp.mediaQueryUpdate);//Attach listner to trigger function to set matrix element's size  run time on screen resize 
    }
    $("span").text(new Date().getFullYear());//to set footer year dynamically
  }
  catch(e){
    print("Caught: " + e.message);
  }
}
//---------------------------document ready-------------------------//
$(()=>{
  simonApp.init();
});
