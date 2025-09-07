// Animation, navigation, quiz, and music logic

const sections = document.querySelectorAll('.section');
const hero = document.getElementById('hero');
const story = document.getElementById('story');
const startBtn = document.getElementById('start-btn');
const nextBtns = document.querySelectorAll('.next-btn');
const restartBtn = document.getElementById('restart-btn');
const resultSection = document.getElementById('result');
const scoreDiv = document.getElementById('score');
const finishBtn = document.getElementById('finish-btn');

// Music player logic
const bgMusic = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');
let musicPlaying = false;
let userInteracted = false;

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
  if (musicPlaying) {
    pauseMusic();
  } else {
    playMusic();
  }
});

// Autoplay music after first user interaction (browser policy)
function enableMusicAutoplay() {
  if (!userInteracted) {
    playMusic();
    userInteracted = true;
  }
}
document.body.addEventListener('click', enableMusicAutoplay, {once: true});
document.body.addEventListener('keydown', enableMusicAutoplay, {once: true});

// Quiz logic
const quizAnswers = [
  "B", // Majapahit: East Java
  "C", // Colonial: Netherlands (Dutch)
  "A", // Independence: 1945
  "B", // Modern: Democracy
];

let userAnswers = [];
let current = 0;
let score = 0;

function showSection(index, animate=true) {
  sections.forEach((s, i) => {
    s.classList.remove('active');
    if (i === index) {
      s.classList.add('active');
      if (animate) {
        gsap.fromTo(s, {opacity: 0, y: 40}, {opacity: 1, y: 0, duration: 0.7, ease: "power2.out"});
      }
    }
  });
}

// Quiz handling
function setupQuizzes() {
  document.querySelectorAll('.quiz').forEach((quizDiv, idx) => {
    const form = quizDiv.querySelector('form');
    const feedback = quizDiv.querySelector('.quiz-feedback');
    const nextBtn = quizDiv.parentElement.querySelector('.next-btn');
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const checked = form.querySelector('input[type="radio"]:checked');
      if (!checked) {
        feedback.textContent = "Please select an answer!";
        feedback.className = "quiz-feedback wrong";
        return;
      }
      nextBtn.disabled = false;
      userAnswers[idx] = checked.value;
      if (checked.value === quizAnswers[idx]) {
        feedback.textContent = "Correct!";
        feedback.className = "quiz-feedback correct";
      } else {
        feedback.textContent = "Wrong. The correct answer is " + quizAnswers[idx] + ".";
        feedback.className = "quiz-feedback wrong";
      }
      // Disable all radios after answer
      form.querySelectorAll('input[type="radio"]').forEach(r => r.disabled = true);
      form.querySelector('.quiz-btn').disabled = true;
    });
  });
}

startBtn.addEventListener('click', () => {
  gsap.to(hero, {opacity: 0, duration: 0.7, onComplete: () => {
    hero.style.display = 'none';
    story.style.display = 'block';
    current = 0;
    userAnswers = [];
    score = 0;
    showSection(current);
  }});
});

nextBtns.forEach((btn, i) => {
  btn.addEventListener('click', () => {
    if (current < sections.length - 2) { // not last story section
      current++;
      showSection(current);
    } else if (btn.id === "finish-btn") {
      // Calculate score and show result
      score = userAnswers.reduce((acc, ans, idx) => ans === quizAnswers[idx] ? acc + 1 : acc, 0);
      scoreDiv.textContent = `You scored ${score} out of 4`;
      current++;
      showSection(current);
    }
  });
});

if (restartBtn) {
  restartBtn.addEventListener('click', () => {
    // Reset all quiz forms
    document.querySelectorAll('.quiz').forEach((quizDiv, idx) => {
      const form = quizDiv.querySelector('form');
      const radios = form.querySelectorAll('input[type="radio"]');
      radios.forEach(radio => { radio.checked = false; radio.disabled = false; });
      form.querySelector('.quiz-btn').disabled = false;
      quizDiv.querySelector('.quiz-feedback').textContent = "";
      quizDiv.querySelector('.quiz-feedback').className = "quiz-feedback";
      quizDiv.parentElement.querySelector('.next-btn').disabled = true;
    });
    userAnswers = [];
    score = 0;
    current = 0;
    showSection(current);
  });
}

// On page load
story.style.display = 'none';
showSection(0, false);
setupQuizzes();