
document.addEventListener("DOMContentLoaded", function () {
  [].forEach.call(document.querySelectorAll('._phone'), function (input) {
    var keyCode;
    function mask(event) {
      event.keyCode && (keyCode = event.keyCode);
      var pos = this.selectionStart;
      if (pos < 3) event.preventDefault();
      var matrix = "+7 (___) ___ ____",
        i = 0,
        def = matrix.replace(/\D/g, ""),
        val = this.value.replace(/\D/g, ""),
        new_value = matrix.replace(/[_\d]/g, function (a) {
          return i < val.length ? val.charAt(i++) || def.charAt(i) : a
        });
      i = new_value.indexOf("_");
      if (i != -1) {
        i < 5 && (i = 3);
        new_value = new_value.slice(0, i)
      }
      var reg = matrix.substr(0, this.value.length).replace(/_+/g,
        function (a) {
          return "\\d{1," + a.length + "}"
        }).replace(/[+()]/g, "\\$&");
      reg = new RegExp("^" + reg + "$");
      if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
      if (event.type == "blur" && this.value.length < 5) this.value = ""
    }

    input.addEventListener("input", mask, false);
    input.addEventListener("focus", mask, false);
    input.addEventListener("blur", mask, false);
    input.addEventListener("keydown", mask, false)

  });

  const form = document.getElementById("form");
  form.addEventListener("submit", formSend);
  let formData = new FormData(form);
  async function formSend(e) {
    let formData = new FormData(form);
    e.preventDefault();
    let error = formValidate(form);
    if (error === 0) {
      form.classList.add("_sending");
      let response = await fetch("send/mail.php", {
        method: "POST",
        body: formData
      });
      if (response.ok) {
        let result = await response.json();
        alert(result.message);
        popup.classList.add('_hide')
        overlay.classList.add('_hide')
        form.reset();
        form.classList.remove("_sending");

      } else {
        alert("Ошибка");
        form.classList.remove("_sending");
      }
    } else {
      alert("Заполните обязательные поля");
    }
  }
  function formValidate(form) {
    let error = 0;
    let formReq = document.querySelectorAll('._req');
    for (let index = 0; index < formReq.length; index++) {
      const input = formReq[index];
      formRemoveError(input);
      if (input.classList.contains("_email")) {
        if (emailTest(input)) {
          formAddError(input);
          error++;
        }
      } else {
        if (input.value === "") {
          formAddError(input);
          error++;
        }
      }
    }
    return error;
  }
  function formAddError(input) {
    input.parentElement.classList.add("_error");
    input.classList.add("_error");
  }
  function formRemoveError(input) {
    input.parentElement.classList.remove("_error");
    input.classList.remove("_error");
  }
  function emailTest(input) {
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
  }
  const click = document.querySelector('.red')
  const popup = document.querySelector('.popup')
  const overlay = document.querySelector('.btn_overlay')
  const close = document.querySelector('.close')
  click.addEventListener('click', () => {
    popup.classList.remove('_hide')
    overlay.classList.remove('_hide')
  })
  close.addEventListener('click', () => {
    popup.classList.add('_hide')
    overlay.classList.add('_hide')
  })
});