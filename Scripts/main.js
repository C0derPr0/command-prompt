var questions = 
[
    ["1: Access", "test1"],
    ["2: Command", "test2"]
]


const responseTimerLength = 30000;
const textarea = document.getElementById('console-textarea');
const timerTextbox = document.getElementById('timer');

var timer;
var commandIndex = 0, secondsElapsed = 0

var commandStartPosition = textarea.value.length;
var caretPos = textarea.value.length;

const initializationMessage = "Microsoft Windows [Version 10.0.18363.1016]\n" 
    + "(c) 2019 Microsoft Corporation. All rights reserved.\n"
    + `You have ${responseTimerLength/1000} seconds to complete the challenge.\n\n`
    + `${questions[0][0]}\n`
    + "C:\\WINDOWS\\System32>";

const failMessage = "Microsoft Windows [Version 10.0.18363.1016]\n"
                                + "(c) 2019 Microsoft Corporation. All rights reserved.\n\n"
                                + "You have run out of the allocated time, returning to beginning.\n\n"
                                + "C:\\WINDOWS\\System32>";

const successMessage = '\n\nYou have successfully completed the module. Congrats!';                                                                

textarea.focus();
textarea.setSelectionRange(caretPos, caretPos);

textarea.addEventListener('keydown', function(e) {
    switch(e.keyCode) {
        case 13: // Enter
            var commandStartPosition = textarea.value.lastIndexOf('>') + 1;
            var command = textarea.value.substring(commandStartPosition).toLowerCase();
            
            var response = `\n'${command}' is not recognized as an internal or external command, operable program or batch file.`;
            

            e.preventDefault();
            textarea.setSelectionRange(textarea.value.length,textarea.value.length);
            
            // Check command versus keys.
            if(command.toUpperCase() === questions[commandIndex][1].toUpperCase()) {
                if(commandIndex === questions.length - 1) {
                    response = successMessage;
                    textarea.value += `${response}`;
                   
                    clearInterval(timer);
                    textarea.disabled = false;
                    return;
                }
                else {
                    response = `\n${questions[commandIndex + 1][0]}`;
                }

                commandIndex += 1;
                secondsElapsed = -1;
            }
            else if(command === "") {
                response = "";
            }

            textarea.value += `${response}\nC:\\WINDOWS\\System32>`;

            // Scroll to bottom.
            textarea.scrollTop = textarea.scrollHeight;

            clearInterval(timer);
            timer = resetTimer(responseTimerLength);

            break;
        case 8: // Backspace
            var commandStartPosition = textarea.value.lastIndexOf('>') + 1;
            var currentPosition = textarea.value.length;
            
            if(currentPosition <= commandStartPosition)
            {
                e.preventDefault();
            }

            break;
    }
});

document.addEventListener("DOMContentLoaded", function(event) { 
    textarea.value += initializationMessage;    
    timerTextbox.style.visibility = "visible";
    
    // Start timer and begin the challenge.
    timer = resetTimer(responseTimerLength);
});

//#region HELPERS
function resetTimer(milliseconds) {
    return setInterval(function() {
        if(secondsElapsed === (responseTimerLength / 1000)) {
            textarea.value = failMessage;
            secondsElapsed = 0;
            commandIndex = 1;
        } else {
            secondsElapsed++;
        }

        timerTextbox.value = `00:${((responseTimerLength/1000) - secondsElapsed).pad(2)}`
    }, 1000);
}

Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
  }
//#endregion