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

  const INITIAL_COURSES = [
    ['ITSC', '3688', 'Computing and AI: Ethics, Society & Communication', 'To learn professional soft skills used in the tech industry.'],
    ['ITIS', '4350', 'Design Prototyping', 'To gain experience with design techniques.'],
    ['ITIS', '3135', 'Front-End Web Development', 'To understand the steps to build web applications.'],
    ['ITSC', '2175', 'Logic and Algorithms', 'Required for my degree.'],
    ['ITIS', '3140', 'User Experience Methods', 'To grasp UX/UI concepts used in the design process.']
  ];

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  /* ---------- Course rows ---------- */
  function courseRow(c) {
    return '<li class="course-group" style="margin-bottom:10px;">' +
      '<input type="text" name="department" value="' + esc(c[0]) + '" placeholder="Dept (ITIS)" aria-label="Department" required> ' +
      '<input type="text" name="number" value="' + esc(c[1]) + '" placeholder="No. (3135)" aria-label="Course number" required> ' +
      '<input type="text" name="courseName" value="' + esc(c[2]) + '" placeholder="Course name" aria-label="Course name" required> ' +
      '<input type="text" name="reason" value="' + esc(c[3]) + '" placeholder="Reason for taking it" aria-label="Reason for taking it" required> ' +
      '<button type="button" class="delete-course" aria-label="Delete this course" style="color:red;">Delete</button></li>';
  }
  
  coursesEl.innerHTML = INITIAL_COURSES.map(courseRow).join('');

  function updateDeleteButtons() {
    const only = coursesEl.children.length < 2;
    coursesEl.querySelectorAll('.delete-course').forEach((b) => { b.disabled = only; });
  }
  updateDeleteButtons();

  $('add-course').addEventListener('click', () => {
    coursesEl.insertAdjacentHTML('beforeend', courseRow(['', '', '', '']));
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

  /* ---------- Collect form data into object ---------- */
  function collect() {
    const v = (id) => $(id).value.trim();
    const first = v('first-name'), last = v('last-name'), nick = v('nickname');
    const mi = v('middle-name');
    const mid = mi ? ' ' + mi : '';
    const fullName = (first + mid + (nick ? ' "' + nick + '"' : '') + ' ' + last).replace(/\s+/g, ' ').trim();
    
    return {
      name: { first: first, middle: mi, nickname: nick, last: last, heading: last + ', ' + first + mid },
      acknowledgment: { statement: v('acknowledgment'), date: v('acknowledgment-date') },
      mascot: { adjective: v('mascot-adj'), animal: v('mascot-animal'), divider: v('divider') },
      displayName: fullName + ' ' + v('divider') + ' ' + v('mascot-adj') + ' ' + v('mascot-animal'),
      picture: { src: imageSrc, file: imageFile, caption: v('picture-caption') },
      personalStatement: v('personal-statement'),
      background: { personal: v('personal-background'), professional: v('professional-background'), academic: v('academic-background') },
      workComputer: v('work-cpu'),
      workLocation: v('work-location'),
      alternate: v('alt-cpu-location'),
      courses: Array.from(coursesEl.children).map((li) => {
        const g = (n) => li.querySelector('[name="' + n + '"]').value.trim();
        return { department: g('department'), number: g('number'), code: g('department') + ' ' + g('number'), name: g('courseName'), reason: g('reason') };
      }),
      quote: { text: v('quote'), author: v('author-quote') },
      funnyItem: v('interesting-thing'),
      alsoToShare: v('share'),
      links: Array.from(document.querySelectorAll('.link-input')).map((i) => ({ name: i.dataset.name, url: i.value.trim() }))
    };
  }

  /* ---------- Output Render Builders ---------- */
  function entryHTML(d) {
    const bullet = (label, text) => '    <li><strong>' + esc(label) + '</strong> ' + esc(text) + '</li>\n';
    let h = '<h3>' + esc(d.displayName) + '</h3>\n';
    h += '<figure style="text-align:center;">\n  <img src="' + esc(d.picture.src) + '" width="250" height="250" alt="Profile photo">\n';
    h += '  <figcaption>' + esc(d.picture.caption) + '</figcaption>\n</figure>\n';
    h += '<p>' + esc(d.personalStatement) + '</p>\n<ul>\n';
    h += bullet('Personal Background:', d.background.personal);
    h += bullet('Professional Background:', d.background.professional);
    h += bullet('Academic Background:', d.background.academic);
    h += bullet('Primary Work Computer:', d.workComputer);
    h += bullet('Primary Work Location:', d.workLocation);
    h += bullet('Alternate Computer & Location:', d.alternate);
    h += '    <li><strong>Courses I’m taking & Why:</strong>\n      <ul>\n';
    h += d.courses.map((c) => '        <li><strong>' + esc(c.code) + ' - ' + esc(c.name) + ':</strong> ' + esc(c.reason) + '</li>\n').join('');
    h += '      </ul>\n    </li>\n';
    if (d.funnyItem) h += bullet('Funny/Interesting Item to Remember Me by:', d.funnyItem);
    if (d.alsoToShare) h += bullet('I’d Also Like to Share:', d.alsoToShare);
    h += '</ul>\n<blockquote>\n  <p>' + esc(d.quote.text) + '</p>\n  <cite>&mdash; ' + esc(d.quote.author) + '</cite>\n</blockquote>\n';
    h += '<p><em>' + esc(d.acknowledgment.statement) + '</em> &mdash; <strong>' + esc(d.acknowledgment.date) + '</strong></p>\n<hr>\n';
    h += '<p>' + d.links.map((l) => '<a href="' + esc(l.url) + '" target="_blank">' + esc(l.name) + '</a>').join(' ' + esc(d.mascot.divider) + ' ') + '</p>\n';
    return h;
  }

  function htmlDoc(d) {
    return '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n' +
      '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
      '  <title>' + esc(d.displayName) + ' | Introduction</title>\n' +
      '  <link rel="stylesheet" href="styles/default.css">\n' +
      '</head>\n<body>\n<main class="content-block">\n' + entryHTML(d) + '</main>\n</body>\n</html>\n';
  }

  function exportData(d) {
    return Object.assign({}, d, { picture: { file: d.picture.file, caption: d.picture.caption } });
  }

  function toXml(name, val, ind) {
    if (Array.isArray(val)) {
      const item = name === 'courses' ? 'course' : 'link';
      return ind + '<' + name + '>\n' + val.map((x) => toXml(item, x, ind + '  ')).join('') + ind + '</' + name + '>\n';
    }
    if (val && typeof val === 'object') {
      return ind + '<' + name + '>\n' + Object.keys(val).map((k) => toXml(k, val[k], ind + '  ')).join('') + ind + '</' + name + '>\n';
    }
    return ind + '<' + name + '>' + esc(val) + '</' + name + '>\n';
  }

  const FORMATS = {
    html: { label: 'HTML', ext: 'html', mime: 'text/html', build: htmlDoc },
    json: { label: 'JSON', ext: 'json', mime: 'application/json', build: (d) => JSON.stringify(exportData(d), null, 2) },
    xml:  { label: 'XML',  ext: 'xml',  mime: 'application/xml', build: (d) => '<?xml version="1.0" encoding="UTF-8"?>\n' + toXml('introduction', exportData(d), '') }
  };

  function generate(kind) {
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

  ['html', 'json', 'xml'].forEach((k) => $('gen-' + k).addEventListener('click', () => generate(k)));

  $('output').addEventListener('click', (ev) => {
    if (!ev.target.classList.contains('download')) return;
    const f = FORMATS[ev.target.dataset.kind];
    const url = URL.createObjectURL(new Blob([$('out-' + ev.target.dataset.kind).value], { type: f.mime }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'introduction.' + f.ext;
    a.click();
    URL.revokeObjectURL(url);
  });

  /* ---------- Form Actions ---------- */
  function showForm() {
    result.hidden = true;
    form.hidden = false;
    $('form-heading').hidden = false;
  }

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    result.innerHTML = entryHTML(collect()) + '<p style="text-align:center; margin-top:20px;"><button type="button" id="reset-link" style="padding:8px 16px;">Fill out form again</button></p>';
    form.hidden = true;
    $('form-heading').hidden = true;
    result.hidden = false;
  });

  form.addEventListener('reset', () => {
    coursesEl.innerHTML = INITIAL_COURSES.map(courseRow).join('');
    updateDeleteButtons();
    resetImage();
  });

  result.addEventListener('click', (ev) => {
    if (ev.target.id === 'reset-link') {
      ev.preventDefault();
      form.reset();
      showForm();
    }
  });

  $('clear-btn').addEventListener('click', () => {
    form.querySelectorAll('input:not([type="submit"]):not([type="reset"]), textarea').forEach((el) => { el.value = ''; });
    resetImage();
  });
})();