document.getElementById('lawnmower').addEventListener('click', function() {
  console.log('click');
  document.getElementById('background').style.transform= 'scale(3)';
  document.getElementById('lawnmower').style.opacity = 1;
  document.getElementById('lawnmower').scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
});