let TargetId = 0;

//Calling get api
function get() {
  let loader = document.getElementsByClassName("loader");
  let tbody = document.querySelector("tbody");
  let table = document.querySelector("table");

  // tbody.children.length >= 1
  //   ? table.removeAttribute("style")
  //   : table.setAttribute("style", "display:none");

  let req = new XMLHttpRequest();

  req.open("GET", "https://gorest.co.in/public/v2/users", true);
  // req.open("GET", "http://localhost:3000/user", true);
  req.setRequestHeader("Content-Type", "application/json");
  req.setRequestHeader(
    "Authorization",
    "Bearer bf48a2155a23c66e8570badd02a145f845e158e884ccdc777fa82ab13a425ca5"
  );
  req.send();

  req.onreadystatechange = () => {
    if (req.readyState == 4 && req.status === 200) {
      let Arr = JSON.parse(req.responseText);
      let tbody = document.querySelector("tbody");
      if (Arr !== []) {
        table.removeAttribute("style");

        Arr.forEach((element) => {
          let row = document.createElement("tr");
          let name = document.createElement("td");
          let email = document.createElement("td");
          let gender = document.createElement("td");
          let status = document.createElement("td");
          let upBtn = document.createElement("button");
          let delBtn = document.createElement("button");

          row.setAttribute("id", element.id);
          name.innerText = element.name;
          email.innerText = element.email;
          gender.innerText = element.gender;
          status.innerText = element.status;
          upBtn.setAttribute("id", "upBtn");
          upBtn.innerText = "Update";
          delBtn.setAttribute("id", "delBtn");
          delBtn.innerText = "Delete";

          row.appendChild(name);
          row.appendChild(email);
          row.appendChild(gender);
          row.appendChild(status);
          row.appendChild(upBtn);
          row.appendChild(delBtn);

          tbody.appendChild(row);
        });
        loader[0].setAttribute("style", "display:none");
      }
    }

    let upBtns = document.querySelectorAll('button[id="upBtn"]')
      ? document.querySelectorAll('button[id="upBtn"]')
      : "";
    let delBtn = document.querySelectorAll('button[id="delBtn"]')
      ? document.querySelectorAll('button[id="delBtn"]')
      : "";

    upBtns &&
      upBtns.forEach((btn) => {
        btn.addEventListener("click", sendToInput);
      });

    delBtn &&
      delBtn.forEach((btn) => {
        btn.addEventListener("click", delete_Entry);
      });
  };
}

function cleanTbody() {
  let tbody = document.querySelector("tbody");
  while (tbody.hasChildNodes()) {
    tbody.removeChild(tbody.firstChild);
  }
}
//Caliing post api for new Entry
function post(user) {
  let req = new XMLHttpRequest();
  req.open("POST", `https://gorest.co.in/public/v2/users`, true);
  // req.open("POST", "http://localhost:3000/user", true);
  req.setRequestHeader("Content-Type", "application/json");
  req.setRequestHeader(
    "Authorization",
    "Bearer bf48a2155a23c66e8570badd02a145f845e158e884ccdc777fa82ab13a425ca5"
  );

  let formData = new FormData(user);

  console.log(formData, "formData");
  req.send(JSON.stringify(user));
}

//Calling put api for Update Entry
function put(user) {
  let req = new XMLHttpRequest();
  req.open("PUT", `https://gorest.co.in/public/v2/users/${TargetId}`, true);
  // req.open("PUT", `http://localhost:3000/user/${TargetId}`, true);
  req.setRequestHeader("Content-Type", "application/json");
  req.setRequestHeader(
    "Authorization",
    "Bearer bf48a2155a23c66e8570badd02a145f845e158e884ccdc777fa82ab13a425ca5"
  );
  req.send(JSON.stringify(user));
}

//send data to input fields for Re-write entry
function sendToInput(e) {
  TargetId = e.path[1].id;

  let TdArr = Array.from(e.path[1].children);

  let inputfields = Array.from(document.querySelectorAll("input"));

  for (let i = 0; i < TdArr.length; i++) {
    if (inputfields[i].name == "name" || inputfields[i].name == "email") {
      inputfields[i].value = TdArr[i].innerText;
    } else if (
      TdArr[i].innerText == "male" ||
      TdArr[i].innerText == "female" ||
      TdArr[i].innerText == "active" ||
      TdArr[i].innerText == "inactive"
    ) {
      document.querySelector(
        `input[value=${TdArr[i].innerText}`
      ).checked = true;
    }
  }
}

//Calling api for delete entry
function delete_Entry(e) {
  if (confirm("Do you want to delete this entry ?") === true) {
    let req = new XMLHttpRequest();

    req.open(
      "DELETE",
      `https://gorest.co.in/public/v2/users/${e.path[1].id}`,
      true
    );
    // req.open("DELETE", `http://localhost:3000/user/${e.path[1].id}`, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader(
      "Authorization",
      "Bearer bf48a2155a23c66e8570badd02a145f845e158e884ccdc777fa82ab13a425ca5"
    );

    req.send();

    e.path[1].remove();
  }
}

//Submit function for mange input fields data
function submit() {
  let user = {};

  let allFields = document.querySelectorAll('input[type="text"]');
  let radio_btns = document.querySelectorAll('input[type="radio"]:checked');

  allFields.forEach((element) => {
    user[element.name] = element.value;
  });

  radio_btns.forEach((element) => {
    user[element.name] = element.value;
  });

  if (TargetId == 0) {
    if (user) {
      post(user);
    }
  } else {
    if (user && TargetId) {
      let Target_entry = Array.from(document.getElementById(TargetId).children);

      let userArr = Object.values(user);

      for (let i = 0; i < userArr.length; i++) {
        if (Target_entry[i].tagName === "TD") {
          Target_entry[i].innerText = userArr[i];
        }
      }
      put(user);
    }
  }
  clean();
  cleanTbody();
}

//clean
function clean() {
  let inputFields = document.querySelectorAll('input[type="text"]');
  let radioBtn = document.querySelectorAll('input[type="radio"]');

  inputFields.forEach((e) => {
    e.value = "";
  });

  radioBtn.forEach((e) => {
    e.checked = false;
  });
}

//validation code
function validateForm() {
  let allFields = document.querySelectorAll("input");
  let error = [];
  let dataArr = [];

  allFields.forEach((field) => {
    checkValidation(field, dataArr, error);
  });

  if (error.length === 0) {
    submit();
  }
}

function checkValidation(field, dataArr, error) {
  if (field.dataset.validation) {
    let isInvalid = false;
    const validationRules = field.dataset.validation.split("|");
    validationRules.map((validation) => {
      // debugger;
      if (!isInvalid) {
        if (validation === "required") {
          let isValidMessage;
          if (field.type.includes("checkbox") || field.type.includes("radio")) {
            isValidMessage = validateCheckBox_And_RadioBtn(field.name);
          } else {
            isValidMessage = validateRequired(field.value, field.name);
          }
          if (isValidMessage) {
            document.getElementById(`${field.name}Err`).innerHTML =
              isValidMessage;
            error.push(field.name);
            isInvalid = true;
          } else {
            document.getElementById(`${field.name}Err`).innerHTML = "";
            // showData({[field.name]:field.value})
          }
        } else if (validation.includes("min:")) {
          const isValidMessage = validateMin(
            field.value,
            validation,
            field.name
          );
          if (isValidMessage) {
            document.getElementById(`${field.name}Err`).innerHTML =
              isValidMessage;
            error.push(field.name);
            isInvalid = true;
          } else {
            document.getElementById(`${field.name}Err`).innerHTML = "";
          }
        } else if (validation.includes("max:")) {
          const isValidMessage = validateMax(
            field.value,
            validation,
            field.name
          );
          if (isValidMessage) {
            document.getElementById(`${field.name}Err`).innerHTML =
              isValidMessage;
            error.push(field.name);
            isInvalid = true;
          } else {
            document.getElementById(`${field.name}Err`).innerHTML = "";
          }
          // logic for max validation
        } else if (validation.includes("duplicate")) {
          // logic for regex validation
          const isValidMessage = checkDuplicate(field.value, field.name);
          if (isValidMessage) {
            document.getElementById(`${field.name}Err`).innerHTML =
              isValidMessage;
            error.push(field.name);
            isInvalid = true;
          } else {
            // debugger;

            document.getElementById(`${field.name}Err`).innerHTML = "";
          }
        } else if (validation.includes("regex:")) {
          // logic for regex validation
          const isValidMessage = validateRegex(
            field.value,
            validation,
            field.name
          );
          if (isValidMessage) {
            document.getElementById(`${field.name}Err`).innerHTML =
              isValidMessage;
            error.push(field.name);
            isInvalid = true;
          } else {
            // debugger;

            document.getElementById(`${field.name}Err`).innerHTML = "";
          }
        }
      }
    });
    dataArr.push({ [field.name]: field.value });
  }
}

function validateRequired(value, fieldName) {
  if (!value || value === "" || value.trim() === "") {
    return `${fieldName} is required.`;
  }
  return undefined;
}

function validateMin(value, validationRule, fieldName) {
  const [rule, param] = validationRule.split(":");

  if (
    fieldName === "Age"
      ? parseInt(value) < parseInt(param)
      : !value || parseInt(value.length) < parseInt(param)
  ) {
    if (fieldName === "Age") {
      return `${fieldName} must not les than ${param}.`;
    } else {
      return `${fieldName} must not contain less than ${param} characters.`;
    }
  }
  return undefined;
}

function validateMax(value, validationRule, fieldName) {
  const [rule, param] = validationRule.split(":");

  if (
    fieldName === "Age"
      ? parseInt(value) > parseInt(param)
      : !value || parseInt(value.length) > parseInt(param)
  ) {
    if (fieldName === "Age") {
      return `${fieldName} must not more than ${param}.`;
    } else {
      return `${fieldName} must not contain more than ${param} characters.`;
    }
  }
  return undefined;
}

function validateRegex(value, validationRule, fieldName) {
  const [rule, param] = validationRule.split(":");
  const regex = new RegExp(param);
  if (regex.test(value) === false) {
    return `Please enter a valid ${fieldName} `;
  }
  return undefined;
}

function validateCheckBox_And_RadioBtn(fieldName) {
  let field = document.getElementsByName(fieldName);
  let IsValid = false;

  field.forEach((element) => {
    if (element.checked === true) {
      IsValid = true;
    }
  });
  if (!IsValid) {
    return `${fieldName} is required.`;
  }
}

function checkDuplicate(value, name) {
  let Isduplicate = false;
  if (!TargetId) {
    let Table_Fields = document.querySelectorAll("td");
    Table_Fields.forEach((element) => {
      if (element.innerText == value) {
        Isduplicate = true;
      }
    });
  }
  if (Isduplicate === true) {
    return `${name} is duplicate`;
  }
}
