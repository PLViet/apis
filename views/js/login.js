const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
  container.classList.toggle("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.toggle("sign-up-mode");
});

/* ========== LOGIN + REGITER ========== */

const login = async function() {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const data = {
    username,
    password
  }
  if (!username) {
    alert('Vui lòng nhập username');
  } else if (!password) {
    alert('Vui lòng nhập mật khẩu');
  }
  const res = await axios.post('/auth/login', data);
  //console.log(res)
  if (res.data.status === true) {
    new Toasteur("top-right", 4000).success(res.data.message, 'Success');
    setTimeout(function() {
      window.location.href = "/api/docs";
    }, 4000)
    //window.location.href = '/home';
  }
  else {
    new Toasteur("top-right", 4000).error('Error', res.data.message);
  }
}
const register = async function() {
  event.preventDefault();
  const username = document.getElementById('usernameR').value;
  const email = document.getElementById('emailR').value;
  const password = document.getElementById('passwordR').value;
  const data = {
    username,
    email,
    password
  }

  var length = username.length;

  const res = await axios.post('/auth/register', data)

  if (res.data.status === true) {
    new Toasteur("top-right", 4000).success(res.data.message, 'Success');
    setTimeout(function() {
      window.location.href = "login";
    }, 4000)
  }
  else if (res.data.status == false) {
    new Toasteur("top-right", 4000).error('Error', res.data.message);
  }

}