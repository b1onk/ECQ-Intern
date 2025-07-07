import { ENDPOINTS } from "./config.js";

class Auth {
  constructor() {
    this.token = "";
    this.sessionId = "";
    this.username = "";
    this.password = "";
    this.msgBox = document.getElementById("message");
  }

  setUserInfo(name, pass) {
    this.username = name;
    this.password = pass;
  }

  show(msg, color = "red") {
    if (this.msgBox) {
      this.msgBox.textContent = msg;
      this.msgBox.style.color = color;
    } else {
      alert(msg);
    }
  }

  async handleTokenAndSession() {
    try {
      const res1 = await fetch(ENDPOINTS.token);
      const data1 = await res1.json();
      if (!data1.success) {
        alert("Token lỗi, thử lại sau");
        return false;
      }
      this.token = data1.request_token;

      const res2 = await fetch(ENDPOINTS.validateLogin, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: this.username,
          password: this.password,
          request_token: this.token,
        }),
      });
      const data2 = await res2.json();
      if (!data2.success) {
        alert("Sai tài khoản hoặc mật khẩu!");
        return false;
      }

      const res3 = await fetch(ENDPOINTS.createSession, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request_token: this.token }),
      });
      const data3 = await res3.json();
      if (!data3.success) {
        alert("Tạo session thất bại!");
        return false;
      }

      this.sessionId = data3.session_id;
      return true;
    } catch (err) {
      alert("Lỗi mạng hoặc server: " + err.message);
      return false;
    }
  }

  async login(name, pass) {
    this.setUserInfo(name, pass);
    const ok = await this.handleTokenAndSession();
    if (ok) {
      localStorage.setItem("session_id", this.sessionId);
      alert("Đăng nhập thành công!");
      location.href = "/D5W2/page/home.html";
    }
  }
  async logout(){
 localStorage.removeItem("session_id");
  alert("Bạn đã đăng xuất");
  location.href = "/D5W2/page/login.html";
  }
}




const auth = new Auth();
const form = document.getElementById("login-form");
if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const u = document.getElementById("username").value.trim();
    const p = document.getElementById("password").value.trim();
    if (!u || !p) {
      auth.show("Điền đầy đủ tài khoản và mật khẩu!");
      return;
    }
    await auth.login(u, p);
  });
}

window.addEventListener("DOMContentLoaded", function () {
  const auth = new Auth(); 
  const btn = document.getElementById("logout-button");
  if (btn) btn.addEventListener("click", () => auth.logout());


  // Kiểm tra đăng nhập 
  const path = window.location.pathname;
  if (path === "/D5W2/page/home.html") {
    const sess = localStorage.getItem("session_id");
    if (!sess) {
      alert("Bạn cần đăng nhập trước!");
      location.href = "/D5W2/page/login.html";
    }
  }
});