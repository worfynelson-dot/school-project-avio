const sections = document.querySelectorAll('.section');
const startBtn = document.getElementById('start-btn');
const musicBtn = document.getElementById('music-btn');
const bgMusic = document.getElementById('bg-music');
const restartBtn = document.getElementById('restart-btn');
const scoreDiv = document.getElementById('score');

let current = 0;
let musicPlaying = false;
let userInteracted = false;
let score = 0;

function playMusic() {
  bgMusic.volume = 0.35;
  bgMusic.play();
  musicBtn.textContent = "🔊";
  musicPlaying = true;
}

function pauseMusic() {
  bgMusic.pause();
  musicBtn.textContent = "🔇";
  musicPlaying = false;
}

musicBtn.addEventListener('click', () => {
  musicPlaying ? pauseMusic() : playMusic();
});

document.body.addEventListener('click', () => {
  if (!userInteracted) {
    playMusic();
    userInteracted = true;
  }
}, { once: true });

function showSection(index) {
  sections.forEach((s, i) => {
    s.classList.remove('active');
    if (i === index) {
      s.classList.add('active');
      gsap.fromTo(s, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7 });
    }
  });
}

startBtn.addEventListener('click', () => {
  current = 1;
  showSection(current);
});

document.querySelectorAll('.next-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    current++;
    showSection(current);
  });
});

document.querySelectorAll('.quiz').forEach((quizDiv) => {
  const form = quizDiv.querySelector('form');
  const feedback = quizDiv.querySelector('.quiz-feedback');
  const nextBtn = quizDiv.querySelector('.next-btn');
  const submitBtn = form.querySelector('.quiz-btn');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const checked = form.querySelector('input[type="radio"]:checked');
    if (!checked) {
      feedback.textContent = "Pilih jawaban dulu!";
      feedback.className = "quiz-feedback wrong";
      return;
    }

    if (checked.value === "B") {
      feedback.textContent = "Benar!";
      feedback.className = "quiz-feedback correct";
      score++;
    } else {
      feedback.textContent = "Salah. Jawaban yang benar adalah 17 Agustus 1945.";
      feedback.className = "quiz-feedback wrong";
    }

    form.querySelectorAll('input[type="radio"]').forEach(r => r.disabled = true);
    submitBtn.disabled = true;
    nextBtn.disabled = false;
  });
});

restartBtn.addEventListener('click', () => {
  score = 0;
  current = 1;
  document.querySelectorAll('.quiz').forEach((quizDiv) => {
    const form = quizDiv.querySelector('form');
    form.querySelectorAll('input[type="radio"]').forEach(r => {
      r.checked = false;
      r.disabled = false;
    });
    form.querySelector('.quiz-btn').disabled = false;
    quizDiv.querySelector('.quiz-feedback').textContent = "";
    quizDiv.querySelector('.quiz-feedback').className = "quiz-feedback";
    quizDiv.querySelector('.next-btn').disabled = true;
  });
  showSection(current);
});

showSection(0);
