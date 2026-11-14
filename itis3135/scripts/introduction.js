(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const DEFAULT_IMG = 'images/LinkedInImage.jpeg';
  const form = $('intro-form');
  const result = $('result');
  const coursesEl = $('courses');
  const preview = $('photo-preview');
  let imageSrc = DEFAULT_IMG;
  let imageFile = DEFAULT_IMG;

  // Assignment data model schema matching requirements
  const DEFAULT_DATA = {
    firstName: "Malik",
    middleName: "",
    nickname: "",
    lastName: "Lawson",
    acknowledgment: "I understand that this is a public document, and I won't put anything here I wouldn't want anyone to see.",
    acknowledgmentDate: "11/06/2026",
    prettyNameDivider: "~",
    adjectives: "Mighty",
    animal: "Lion",
    img: DEFAULT_IMG,
    pictureAlt: "LinkedIn profile image",
    caption: "LinkedIn profile image",
    personalInfo: {
      statement: "I am a Computer Science major specializing in Human Computer Interaction. My goal is to build industry ready skills and prepare for a successful career in tech. Looking forward to the journey ahead.",
      personalBackground: "Reidsville native, moved to Charlotte in 2024.",
      professionalBackground: "Military veteran of nearly 7 years, now focused on completing my degree to secure employment in the tech industry.",
      academicBackground: "Computer Science Human Computer Interaction class of 2028.",
      primaryWorkComputer: "Macbook Air (macOS)",
      primaryWorkLocation: "Home office space.",
      alternateComputerLocation: "Desktop & UNCC library."
    },
    courses: [
      {
        department: "ITSC",
        courseNumber: "3688",
        courseTitle: "Computing and AI: Ethics, Society & Communication",
        reasonForTaking: "To learn professional soft skills used in the tech industry."
      },
      {
        department: "ITIS",
        courseNumber: "4350",
        courseTitle: "Design Prototyping",
        reasonForTaking: "To gain experience with design techniques."
      },
      {
        department: "ITIS",
        courseNumber: "3135",
        courseTitle: "Front-End Web Development",
        reasonForTaking: "To understand the steps to build web applications."
      },
      {
        department: "ITSC",
        courseNumber: "2175",
        courseTitle: "Logic and Algorithms",
        reasonForTaking: "Required for my degree."
      },
      {
        department: "ITIS",
        courseNumber: "3140",
        courseTitle: "User Experience Methods",
        reasonForTaking: "To grasp UX/UI concepts used in the design process."
      }
    ],
    quote: "“A wise man will always follow the footsteps of great men”",
    quoteAuthor: "Niccolo Machiavelli",
    funnyItem: "I can type fast and manage complex frontend systems.",
    somethingToShare: "Dedicated to building clean, accessible web components.",
    footerLinks: [
      { label: "CLT Web", url: "https://webpages.charlotte.edu/mlawso23/" },
      { label: "GitHub.io", url: "https://maliklawson.github.io" },
      { label: "GitHub", url: "https://github.com/maliklawson" },
      { label: "freeCodeCamp", url: "https://www.freecodecamp.org/mlawso23" },
      { label: "Codecademy", url: "https://www.codecademy.com/profiles/mlawso23" },
      { label: "LinkedIn", url: "https://www.linkedin.com/in/malik-lawson-b0a8ab3b2/" }
    ]
  };

  const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  /* ---------- Helper Functions ---------- */
  function updateDeleteButtons() {
    const only = coursesEl.children.length < 2;
    coursesEl.querySelectorAll('.delete-course').forEach((b) => { b.disabled = only; });
  }

  function courseRow(c) {
    return '<li class="course-group" style="margin-bottom:10px;">' +
      '<input type="text" name="department" value="' + esc(c.department) + '" placeholder="Dept (ITIS)" aria-label="Department" required> ' +
      '<input type="text" name="number" value="' + esc(c.courseNumber) + '" placeholder="No. (3135)" aria-label="Course number" required> ' +
      '<input type="text" name="courseName" value="' + esc(c.courseTitle) + '" placeholder="Course name" aria-label="Course name" required> ' +
      '<input type="text" name="reason" value="' + esc(c.reasonForTaking) + '" placeholder="Reason for taking it" aria-label="Reason for taking it" required> ' +
      '<button type="button" class="delete-course" aria-label="Delete this course" style="color:rgb(239, 238, 238);">Delete</button></li>';
  }

  function loadInitialCourses() {
    coursesEl.innerHTML = DEFAULT_DATA.courses.map(courseRow).join('');
    updateDeleteButtons();
  }

  loadInitialCourses();

  $('add-course').addEventListener('click', () => {
    coursesEl.insertAdjacentHTML('beforeend', courseRow({ department: '', courseNumber: '', courseTitle: '', reasonForTaking: '' }));
    coursesEl.lastElementChild.querySelector('input').focus();
    updateDeleteButtons();
  });

  coursesEl.addEventListener('click', (ev) => {
    if (ev.target.classList.contains('delete-course')) {
      ev.target.closest('li').remove();
      updateDeleteButtons();
    }
  });

  /* ---------- Picture handling ---------- */
  function resetImage() {
    imageSrc = DEFAULT_IMG;
    imageFile = DEFAULT_IMG;
    preview.src = DEFAULT_IMG;
    $('picture-file').value = '';
  }

  $('picture-file').addEventListener('change', () => {
    const file = $('picture-file').files[0];
    if (!file) { resetImage(); return; }
    const reader = new FileReader();
    reader.onload = () => {
      imageSrc = reader.result;
      imageFile = 'images/' + file.name;
      preview.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

  /* ---------- Collect form data into exact data model ---------- */
  function collect() {
    const v = (id) => $(id).value.trim();
    return {
      firstName: v('first-name'),
      middleName: v('middle-name'),
      nickname: v('nickname'),
      lastName: v('last-name'),
      acknowledgment: v('acknowledgment'),
      acknowledgmentDate: v('acknowledgment-date'),
      prettyNameDivider: v('divider'),
      adjectives: v('mascot-adj'),
      animal: v('mascot-animal'),
      img: imageSrc,
      pictureAlt: v('picture-caption') || "Profile photo",
      caption: v('picture-caption'),
      personalInfo: {
        statement: v('personal-statement'),
        personalBackground: v('personal-background'),
        professionalBackground: v('professional-background'),
        academicBackground: v('academic-background'),
        primaryWorkComputer: v('work-cpu'),
        primaryWorkLocation: v('work-location'),
        alternateComputerLocation: v('alt-cpu-location')
      },
      courses: Array.from(coursesEl.children).map((li) => {
        const g = (n) => li.querySelector('[name="' + n + '"]').value.trim();
        return {
          department: g('department'),
          courseNumber: g('number'),
          courseTitle: g('courseName'),
          reasonForTaking: g('reason')
        };
      }),
      quote: v('quote'),
      quoteAuthor: v('author-quote'),
      funnyItem: v('interesting-thing'),
      somethingToShare: v('share'),
      footerLinks: Array.from(document.querySelectorAll('.link-input')).map((i) => ({
        label: i.dataset.name,
        url: i.value.trim()
      }))
    };
  }

  /* ---------- Output Render Builders ---------- */
  function entryHTML(d) {
    const mid = d.middleName ? ' ' + d.middleName : '';
    const nick = d.nickname ? ' "' + d.nickname + '"' : '';
    const fullName = d.firstName + mid + nick + ' ' + d.lastName;
    const headerTitle = fullName + ' ' + d.prettyNameDivider + ' ' + d.adjectives + ' ' + d.animal;

    const bullet = (label, text) => '    <li><strong>' + esc(label) + '</strong> ' + esc(text) + '</li>\n';
    
    let h = '<h3 style="text-align:center;">' + esc(headerTitle) + '</h3>\n';
    h += '<figure style="text-align:center;">\n  <img src="' + esc(d.img) + '" width="250" height="250" alt="' + esc(d.pictureAlt) + '">\n';
    h += '  <figcaption><em>' + esc(d.caption) + '</em></figcaption>\n</figure>\n';
    h += '<p>' + esc(d.personalInfo.statement) + '</p>\n<ul>\n';
    h += bullet('Personal Background:', d.personalInfo.personalBackground);
    h += bullet('Professional Background:', d.personalInfo.professionalBackground);
    h += bullet('Academic Background:', d.personalInfo.academicBackground);
    h += bullet('Primary Work Computer:', d.personalInfo.primaryWorkComputer);
    h += bullet('Primary Work Location:', d.personalInfo.primaryWorkLocation);
    h += bullet('Alternate Computer & Location:', d.personalInfo.alternateComputerLocation);
    h += '    <li><strong>Courses I’m taking & Why:</strong>\n      <ol>\n';
    h += d.courses.map((c) => '        <li><strong>' + esc(c.department) + ' ' + esc(c.courseNumber) + ' - ' + esc(c.courseTitle) + ':</strong> ' + esc(c.reasonForTaking) + '</li>\n').join('');
    h += '      </ul>\n    </li>\n';
    if (d.funnyItem) h += bullet('Funny/Interesting Item to Remember Me by:', d.funnyItem);
    if (d.somethingToShare) h += bullet('I’d Also Like to Share:', d.somethingToShare);
    h += '</ul>\n<blockquote>\n  <p>' + esc(d.quote) + '</p>\n  <cite>&mdash; ' + esc(d.quoteAuthor) + '</cite>\n</blockquote>\n';
    h += '<p><em>' + esc(d.acknowledgment) + '</em> &mdash; <strong>' + esc(d.acknowledgmentDate) + '</strong></p>\n<hr>\n';
    h += '<p style="text-align:center;">' + d.footerLinks.map((l) => '<a href="' + esc(l.url) + '" target="_blank">' + esc(l.label) + '</a>').join(' | ') + '</p>\n';
    return h;
  }

  function htmlDoc(d) {
    return '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n' +
      '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
      '  <title>' + esc(d.firstName) + ' ' + esc(d.lastName) + ' | Introduction</title>\n' +
      '  <link rel="stylesheet" href="styles/default.css">\n' +
      '</head>\n<body>\n<main class="content-block">\n' + entryHTML(d) + '</main>\n</body>\n</html>\n';
  }

  function toXml(name, val, ind) {
    if (Array.isArray(val)) {
      const itemName = name === 'courses' ? 'course' : (name === 'footerLinks' ? 'link' : 'item');
      return ind + '<' + name + '>\n' + val.map((x) => toXml(itemName, x, ind + '  ')).join('') + ind + '</' + name + '>\n';
    }
    if (val && typeof val === 'object') {
      return ind + '<' + name + '>\n' + Object.keys(val).map((k) => toXml(k, val[k], ind + '  ')).join('') + ind + '</' + name + '>\n';
    }
    return ind + '<' + name + '>' + esc(val) + '</' + name + '>\n';
  }

  const FORMATS = {
    html: { label: 'HTML', ext: 'html', mime: 'text/html', build: htmlDoc },
    json: { label: 'JSON', ext: 'json', mime: 'application/json', build: (d) => JSON.stringify(d, null, 2) },
    xml:  { label: 'XML',  ext: 'xml',  mime: 'application/xml', build: (d) => '<?xml version="1.0" encoding="UTF-8"?>\n' + toXml('introduction', d, '') }
  };

  function generate(kind, ev) {
    if (ev) ev.preventDefault();
    const f = FORMATS[kind];
    let box = $('out-' + kind);
    if (!box) {
      const wrap = document.createElement('div');
      wrap.className = 'output-block';
      wrap.style.marginTop = '15px';
      wrap.innerHTML = '<label for="out-' + kind + '"><strong>' + f.label + ' Output</strong></label><br>' +
        '<textarea id="out-' + kind + '" rows="6" style="width:100%;" readonly></textarea>' +
        '<p><button type="button" class="download" data-kind="' + kind + '">Download ' + f.label + ' File</button></p>';
      $('output').appendChild(wrap);
      box = $('out-' + kind);
    }
    box.value = f.build(collect());
  }

  ['html', 'json', 'xml'].forEach((k) => {
    const btn = $('gen-' + k);
    if (btn) {
      btn.addEventListener('click', (ev) => generate(k, ev));
    }
  });

  $('output').addEventListener('click', (ev) => {
    if (!ev.target.classList.contains('download')) return;
    const kind = ev.target.dataset.kind;
    const f = FORMATS[kind];
    const url = URL.createObjectURL(new Blob([$('out-' + kind).value], { type: f.mime }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'introduction.' + f.ext;
    a.click();
    URL.revokeObjectURL(url);
  });

  /* ---------- Form Actions & View Switching ---------- */
  function showForm() {
    result.hidden = true;
    result.innerHTML = '';
    $('output').innerHTML = '';
    form.reset();
    resetImage();
    loadInitialCourses();
    form.hidden = false;
    $('form-heading').hidden = false;
  }

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    
    // Read whatever is currently entered in the inputs and render it into the result container
    result.innerHTML = entryHTML(collect()) + 
      '<p style="text-align:center; margin-top:30px;"><button type="button" id="reset-form-btn" style="padding:10px 20px; font-weight:bold; cursor:pointer;">Reset and fill out the form again</button></p>';
    
    // Keep form visible so user inputs remain on screen
    form.hidden = false;
    result.hidden = false;
    
    // Smoothly scroll down to view the rendered results below the form
    result.scrollIntoView({ behavior: 'smooth' });
  });

  form.addEventListener('reset', () => {
    setTimeout(() => {
      loadInitialCourses();
      resetImage();
      result.hidden = true;
      result.innerHTML = '';
      $('output').innerHTML = '';
    }, 10);
  });

  result.addEventListener('click', (ev) => {
    if (ev.target.id === 'reset-form-btn') {
      ev.preventDefault();
      showForm();
      form.scrollIntoView({ behavior: 'smooth' });
    }
  });

  $('clear-btn').addEventListener('click', () => {
    form.querySelectorAll('input:not([type="submit"]):not([type="reset"]), textarea').forEach((el) => { el.value = ''; });
    coursesEl.innerHTML = '';
    resetImage();
  });
})();