/* Bộ máy chạy trắc nghiệm dùng chung cho mọi chương.
   Mỗi trang chương chỉ cần khai báo const cauHoi = [...] rồi nạp file này. */
(function () {
  const KY = ["A", "B", "C", "D", "E", "F"];
  const quiz = document.getElementById("quiz");
  const tong = cauHoi.length;
  let daNop = false;

  function xaoTron(mang) {
    const a = mang.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Thứ tự câu hỏi: xáo trộn nếu trang bật XAO_TRON = true
  let ds = cauHoi.map((c, i) => ({ c, goc: i }));
  if (typeof XAO_TRON !== "undefined" && XAO_TRON) ds = xaoTron(ds);

  // Xáo đáp án trong từng câu (nếu bật), vẫn nhớ đáp án đúng
  ds = ds.map(({ c }) => {
    let thuTu = c.dapan.map((_, j) => j);
    if (typeof XAO_DAP_AN !== "undefined" && XAO_DAP_AN) thuTu = xaoTron(thuTu);
    return { de: c.de, giai: c.giai, dapan: thuTu.map(j => c.dapan[j]), dung: thuTu.indexOf(c.dung) };
  });

  ds.forEach((c, i) => {
    const div = document.createElement("div");
    div.className = "q";
    div.innerHTML =
      `<div class="de">Câu ${i + 1}. ${c.de}</div>` +
      c.dapan.map((d, j) =>
        `<label id="c${i}_${j}"><input type="radio" name="q${i}" value="${j}"><span>${KY[j]}. ${d}</span></label>`
      ).join("") +
      (c.giai ? `<div class="giaithich" id="g${i}"><b>Lời giải.</b> ${c.giai}</div>` : "");
    quiz.appendChild(div);
  });

  const dem = document.getElementById("dem");
  function capNhatDem() {
    const lam = document.querySelectorAll("#quiz input:checked").length;
    dem.innerHTML = `Đã làm <b>${lam}/${tong}</b> câu`;
  }
  quiz.addEventListener("change", capNhatDem);
  capNhatDem();

  window.nopBai = function () {
    if (daNop) return;
    const lam = document.querySelectorAll("#quiz input:checked").length;
    if (lam < tong && !confirm(`Bạn mới làm ${lam}/${tong} câu. Vẫn nộp bài?`)) return;
    daNop = true;
    let diem = 0;
    ds.forEach((c, i) => {
      const chon = document.querySelector(`input[name="q${i}"]:checked`);
      document.getElementById(`c${i}_${c.dung}`).classList.add("dung");
      if (chon) {
        if (+chon.value === c.dung) diem++;
        else document.getElementById(`c${i}_${chon.value}`).classList.add("sai");
      }
      document.querySelectorAll(`input[name="q${i}"]`).forEach(x => (x.disabled = true));
      const g = document.getElementById(`g${i}`);
      if (g) g.classList.add("show");
    });
    const kq = document.getElementById("ketqua");
    kq.innerHTML = `<div class="diem">${(diem * 10 / tong).toFixed(2)} điểm</div>
      <div>Đúng ${diem}/${tong} câu. Xem lời giải ở từng câu bên trên.</div>`;
    kq.classList.add("show");
    kq.scrollIntoView({ behavior: "smooth", block: "center" });
    if (window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise();
  };
})();
