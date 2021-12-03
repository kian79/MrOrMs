//In this section we get desired elements from our page using their css class
// and name and their place in the page.
const firstnameInput = document.querySelector('input#firstname_input');
const genderInputs = document.querySelectorAll('input[name="gender"]');
const saveButton = document.querySelector('button.button.save');
const form = document.querySelector('form.form');
const clearBtn = document.querySelector('button.button.clear');
const predictedGender = document.querySelector('div.gender_prediction_result');
const savedGender = document.querySelector('div.saved_gender');
const information = document.querySelector('div.info');


// This function first checks input corrrection then requests to api
// and while requesting writes loading on the information section
// then if it finds the gender it returns it with its probablity 
// in the other case it says that it doesn't know the answer.
async function get_gender(firstname) {
    if (checkInput() == false) {
        throw new Error('Enter name properly!');
    }
    information.innerText = 'Getting data from API...';
    information.classList.add('show');
    information.classList.add('loading');
    const result = await fetch(`https://api.genderize.io/?name=${firstname}`);
    clearInformation();
    if (result.status != 200) {
        throw new Error('There was an error in calling API:' + result.status);
    }
    try {
        predictedGender.innerText = '';
        const resolvedResult = await result.json();
        if (resolvedResult.gender != null)
            predictedGender.innerText = firstname + " is " + resolvedResult.gender +
            " by " + resolvedResult.probability * 100 + "% chance.";
        else {
            predictedGender.innerText = 'I am not god! I dont know everythong.';

        }
        getSavedData();
    } catch (error) {
        information.innerText = error;
        information.classList.add('show');
        information.classList.add('error');
        setTimeout(clearInformation, 2000);
    }
}

// This function gets the saved gender for the input name.
// If there is'nt any saved gender it says that nothing saved.
function getSavedData() {
    const name = firstnameInput.value;
    const gender = localStorage.getItem(name) || 'Nothing Saved for ' + name;
    savedGender.innerText = gender;
}


//This function saves name with user's desired gender that he/she inputed 
// in the radio buttons.
function saveGender() {
    if (!checkInput()) {
        showMsg('Name should only include English letters and space');
        return;
    }
    const name = firstnameInput.value;
    gender = '';
    if (genderInputs[0].checked) {
        gender = 'male';
    } else {
        gender = 'female';
    }
    localStorage.setItem(name, gender);
    showMsg(name + ' saved as ' + gender)
}



//User's information Functions

// Sets the opacity of information section to 0
function clearInformation() {
    information.classList = 'info';
    information.innerText = '';
}

// Shows desired msg in the information section and sets it opacity 
// to 1 for 3 seconds.
function showMsg(msg) {
    information.innerText = msg;
    information.classList.add('show');
    setTimeout(clearInformation, 3000);
}


//This function checks if the input is ok or not.
function checkInput() {
    const name = firstnameInput.value;
    const regex = /^[a-zA-Z ]*$/;
    if (!name.match(regex) || name.length == 0) {
        firstnameInput.classList.add('invalid');
        showMsg('Name should only include English letters and space');
        return false;
    } else {
        firstnameInput.classList.remove('invalid');
        return true;
    }
}

// Listeners

// This will add listener to form so that it will happen when user submits a name.
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const result = get_gender(firstnameInput.value);
});


// Add listener to save button to save gender as selected in radio buttons
saveButton.addEventListener('click', (e) => {
    e.preventDefault();
    saveGender();
});

// Add listener to clear button so it removes the saved value from local storage
clearBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const name = firstnameInput.value;
    localStorage.removeItem(name);
    showMsg('Saved gender cleared from storage(If saved before)');
});

// This adds a listener on input and calls back checkInput
firstnameInput.addEventListener('input', checkInput);