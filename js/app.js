/*
Author: Akshay Chavan
Last Updates on: 26-05-2021
*/

var questions = null;           // an array to store questions list from local server response
var optns = null;               // an array to store options for any question


// create connection with server and call API to get questions
var request = new XMLHttpRequest();
request.open('GET', 'http://localhost:8000/questions', false);      // true-> asynchronous connection; false-> synchronous connection 
request.send(null);

if (request.status === 200) {
    console.log(JSON.parse(request.responseText));
    questions = JSON.parse(request.responseText);           // store questions in questions array for future reference

    // generate questionnaire view
    var outputView = [];

    for (var i = 0; i < questions.length; i++) {

        options = [];                                       // to store options view
        var requiredFlag = '';                              // flag to check if question is required on not

        // check if the question is required or not
        if (questions[i].mandatory) {
            requiredFlag = 'required';
        }

        // check if a question has any options, if yes then fetch its options from server
        if (questions[i].has_options) {
            request.open('GET', 'http://localhost:8000/options?question=' + questions[i].id, false);
            request.send(null);

            if (request.status === 200) {
                optns = JSON.parse(request.responseText);                       // store options list
                // console.log(optns);
                for (var j = 0; j < optns.length; j++) {
                    // console.log(optns[j].value);
                    switch (questions[i].type) {
                        case 'radio':
                            options.push(
                                '<label>'
                                + '<input type="radio" name="q' + questions[i].id + '" value="c' + j + '"' + requiredFlag + '>'
                                + optns[j].label
                                + '</label>'
                                + '<br />'
                            );
                            break;
                        case 'checkbox':
                            options.push(
                                '<label>'
                                + '<input type="checkbox" id= c' + j + ' name="q' + questions[i].id + '" value="c' + j + '">'
                                + optns[j].label
                                + '</label>'
                                + '<br />'
                            );
                            break;
                    }
                }
                console.log(options);
            }
        } else {            // question does not have any option

            if (questions[i].type != 'textarea' && questions[i].type != 'rating') {
                options.push(
                    '<input type="' + questions[i].type + '"' + requiredFlag + '>'
                    + '</input>'
                );
            } else if (questions[i].type == 'textarea') {
                options.push(
                    '<textarea rows="4" cols="70"' + requiredFlag + '>'
                    + '</textarea>'
                );
            } else {      // for rating
                var id = questions[i].id;
                options.push(
                    '<label class="ratingLabel"><input class = "ratingInput" type="radio" name="q' + id + '" value="c1"' + requiredFlag + '><span class="ratingSpan">1</span></label>'
                    + '<label class="ratingLabel"><input class = "ratingInput" type="radio" name="q' + id + '" value="c2"><span class="ratingSpan">2</span></label>'
                    + '<label class="ratingLabel"><input class = "ratingInput" type="radio" name="q' + id + '" value="c3"><span class="ratingSpan">3</span></label>'
                    + '<label class="ratingLabel"><input class = "ratingInput" type="radio" name="q' + id + '" value="c4"><span class="ratingSpan">4</span></label>'
                    + '<label class="ratingLabel"><input class = "ratingInput" type="radio" name="q' + id + '" value="c4"><span class="ratingSpan">5</span></label>'
                    + '<label class="ratingLabel"><input class = "ratingInput" type="radio" name="q' + id + '" value="c4"><span class="ratingSpan">6</span></label>'
                    + '<label class="ratingLabel"><input class = "ratingInput" type="radio" name="q' + id + '" value="c4"><span class="ratingSpan">7</span></label>'
                    + '<label class="ratingLabel"><input class = "ratingInput" type="radio" name="q' + id + '" value="c4"><span class="ratingSpan">8</span></label>'
                    + '<label class="ratingLabel"><input class = "ratingInput" type="radio" name="q' + id + '" value="c4"><span class="ratingSpan">9</span></label>'
                    + '<label class="ratingLabel"><input class = "ratingInput" type="radio" name="q' + id + '" value="c5"><span class="ratingSpan">10</span></label></tr></table>'

                );
            }
        }

        var mandatory = '';
        if (questions[i].mandatory) {
            mandatory = '<span class="mandatoryQuestion"> *</span>'
        }
        outputView.push(
            '<div class="questionDiv">'
            + ' <h4>' + questions[i].id + '. ' + questions[i].title + mandatory + '</h4>'
            + options.join('')
            + '</div>'
        );


    }

    // build view using DOM
    var questionsContainer = document.getElementById('container');
    questionsContainer.innerHTML = outputView.join('');



    // function to perform task after form submission
    function submitForm() {

        // check if checkbox is selected correctly or not
        if(validateCheckbox()) {                                
            if (confirm('Are you to submit this response?')) {                          // confirm before submission
                // hide form and display success message
                var questionsContainer = document.getElementById('outer-container');
                document.getElementById("outer-container").style.display = "none";
                document.getElementById("successDiv").style.visibility = "visible";
                document.getElementById("successDiv").style.display = "block";
                document.getElementById("footer").style.marginTop = "25%";
                alert('Form submitted successfully!');
    
            }
        } else {
            alert('Please select at least one value for check box!');
        }
    }


    // function to check if at least one option is selected from checkbox group or not
    function validateCheckbox() {
        if(document.getElementById('c0').checked || document.getElementById('c1').checked || document.getElementById('c2').checked || document.getElementById('c3').checked || document.getElementById('c4').checked || document.getElementById('c5').checked) {
            return true;
        }
        return false;
    }

}