import React from 'react'

function Quiz() {
  return (
    <div class="main">
        <div id="box">
            <h2 id="quesBox">1) This is a dumy question</h2>
            <div class="row">
                <input class="Options" type="radio" value="a" id="option1" name="Option"/>
                <label for="option1">a) Option 1</label>
            </div>
            <div class="row">
                <input class="Options" type="radio" value="b" id="option2" name="Option"/>
                <label for="option2">b) Option 2</label>
            </div>
            <div class="row">
                <input class="Options" type="radio" value="c" id="option3" name="Option"/>
                <label for="option3">c) Option 3</label>
            </div>
            <div class="row">
                <input  class="Options" type="radio" value="d" id="option4" name="Option"/>
                <label for="option4">d) Option 4</label>
            </div>
            <button class="btn"onclick="submitquiz()">Submit</button>
        </div>
    </div>
  )
}

export default Quiz