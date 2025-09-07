const blobURL = 'https://vercel.blob/api/school-project-avio-blob';

// Login
if (document.getElementById('login-btn')) {
  document.getElementById('login-btn').addEventListener('click', () => {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const feedback = document.getElementById('login-feedback');

    if (user === 'user' && pass === 'user') {
      localStorage.setItem('role', 'user');
      window.location.href = 'dashboard.html';
    } else if (user === 'adityagalihpratama' && pass === 'aditya1717') {
      localStorage.setItem('role', 'admin');
      window.location.href = 'dashboard.html';
    } else {
      feedback.textContent = 'Login gagal. Coba lagi.';
    }
  });
}

// Dashboard
if (document.getElementById('lesson-menu')) {
  const lessonMenu = document.getElementById('lesson-menu');
  const lessonContent = document.getElementById('lesson-content');

  fetch(blobURL)
    .then(res => res.json())
    .then(data => {
      data.forEach(lesson => {
        const opt = document.createElement('option');
        opt.value = lesson.title;
        opt.textContent = lesson.title;
        lessonMenu.appendChild(opt);
      });
    });

  document.getElementById('load-lesson').addEventListener('click', () => {
    const selected = lessonMenu.value;
    fetch(blobURL)
      .then(res => res.json())
      .then(data => {
        const lesson = data.find(l => l.title === selected);
        lessonContent.textContent = lesson ? lesson.content : "Pelajaran tidak ditemukan.";
      });
  });

  if (localStorage.getItem('role') === 'admin') {
    document.getElementById('admin-access').style.display = 'inline-block';
    document.getElementById('admin-access').addEventListener('click', () => {
      window.location.href = 'admin.html';
    });
  }
}

// Admin Panel
if (document.getElementById('add-lesson-btn')) {
  document.getElementById('add-lesson-btn').addEventListener('click', () => {
    const title = document.getElementById('new-lesson-title').value;
    const content = document.getElementById('new-lesson-content').value;
    const feedback = document.getElementById('admin-feedback');

    if (title && content) {
      fetch(blobURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
      })
      .then(res => {
        if (res.ok) {
          feedback.textContent = `Pelajaran "${title}" berhasil ditambahkan.`;
        } else {
          feedback.textContent = "Gagal menambahkan pelajaran.";
        }
      });
    } else {
      feedback.textContent = "Judul dan konten harus diisi.";
    }
  });
}
