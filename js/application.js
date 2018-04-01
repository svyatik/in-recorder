// const remote = require('electron').remote;


let record_process = 0;
// 0 - stop
// 1 - pause
// 2 - record


function Color(class_name, color) {
  this.class_name = class_name;
  this.color = color;
}

const action_record = new Color('record', '#c0392b'),
      action_pause = new Color('pause', '#d35400'),
      action_stop = new Color('stop', '#34495e');

const $button_panel = document.getElementById('left_group');

function addAnim(object) {
  $button_panel.classList.remove(action_record.class_name);
  $button_panel.classList.remove(action_pause.class_name);
  $button_panel.classList.remove(action_stop.class_name);

  document.getElementById('button_recorder').classList.remove('cool');

  setTimeout(function() {
    document.getElementById('button_recorder').classList.add('cool');
  }, 10);

  setTimeout(function() {
    $button_panel.classList.add(object.class_name);
  }, 50);

  setTimeout(function() {
    $button_panel.style.backgroundColor = object.color;
  }, 500);
}


let long_press;
let up_disabling = false;

document.getElementById('button_recorder').onmousedown = function() {
  up_disabling = false;

  if(record_process === 2) {
    addAnim(action_pause);
    record_process = 1;
    up_disabling = true;
  }

  long_press = setTimeout(function() {
    record_process = 0;
    addAnim(action_stop);
    up_disabling = true;
    $button_panel.classList.remove('active');
    document.getElementById('buttons_group').classList.remove('active');
  }, 1000);
}

document.getElementById('button_recorder').onmouseup = function() {
  if(!up_disabling && (record_process === 0 || record_process === 1)) {
    addAnim(action_record);
    record_process = 2;
    $button_panel.classList.add('active');
    document.getElementById('buttons_group').classList.add('active');
  }

  clearTimeout(long_press);
}

document.getElementById('button_recorder').onmouseout = function() {
  console.log('out');
}

const $button_region = document.getElementById('button_region');
const $button_full = document.getElementById('button_full_screen');

$button_region.onclick = function() {
  $button_region.classList.add('active');
  $button_full.classList.remove('active');
}

$button_full.onclick = function() {
  $button_region.classList.remove('active');
  $button_full.classList.add('active');
}

let speaker = true;
const $button_speaker = document.getElementById('button_sound');
$button_speaker.onclick = function() {
  if(speaker) {
    $button_speaker.classList.remove('disabled');
    speaker = false;
  } else {
    $button_speaker.classList.add('disabled');
    speaker = true;
  }
}


const $range = document.getElementById('range');
const $range_circle = document.getElementById('range_circle');

const range_offset = $range.offsetTop + 15; // 15 - it's margin top;
const range_height = $range.clientHeight;

console.log('height', range_height);

let range_active = false;

// console.log(range_height + range_offset);

$range.addEventListener('mousedown', function(evt) {
  console.log(evt.clientY);
    if(evt.clientY+12 > range_height + range_offset) {
      $range_circle.style.top = range_offset + range_height - 30 + 'px';
      console.log('top');
    } else {
      console.log('else');
      $range_circle.style.top = evt.clientY - range_offset + 'px';
    }
});

$range_circle.addEventListener("mousedown", function() {
    range_active = true;
});

document.addEventListener("mousemove", function(evt) {
    if(range_active) {
      if(range_height > evt.clientY - range_offset + 11 && evt.clientY - range_offset + 1 > 0)
        $range_circle.style.top = evt.clientY - range_offset + 'px';
    }
});

document.addEventListener("mouseup", function() {
    range_active = false;
});


const $colors = document.getElementById('colors');
const $items = $colors.getElementsByTagName("li");

for (var i = 0; i < $items.length; ++i) {
  $items[i].addEventListener('click', function() {
    if(this.dataset.color === '#fff') {
      $range_circle.style.borderWidth = '1px';
    } else {
      $range_circle.style.borderWidth = '0px';
    }
    $range_circle.style.backgroundColor = this.dataset.color;
  });
}
