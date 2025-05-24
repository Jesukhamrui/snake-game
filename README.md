Snake Game
A classic Snake game with a customizable logo, themes, and audio effects, built with HTML, CSS, and JavaScript.
Features

Logo in the top-left navbar (customizable).
Themes: Green, Blue, Red, Purple, Yellow.
Speed options: High (200ms), Medium (300ms), Low (500ms).
Audio: Start (~1s), Eat (~0.2s), End (~1s) sounds.
Score tracking with usernames.
Responsive for mobile devices.

Set Up

Download Files:

Clone or download the project.

git clone <repository-url>


Add Logo:

Default: https://img.icons8.com/ios-filled/50/00ff00/snake.png.

Custom: Place logo.png (30x30px) in the project folder and update index.html:
<img id="logo" src="logo.png" alt="Snake Game Logo">




Add Audio:

Download from freesound.org:

Start: 316847
End: 171671
Eat: 387232


Place start.wav, end.wav, eat.wav in the project folder.

Or use base64 in index.html:
startSound.src = 'data:audio/wav;base64,[YOUR_BASE64]';




Run:

Open index.html in a browser or host:
python -m http.server 8000

Visit http://localhost:8000.




Usage

Start: Click “Start Game” or press Space.
Move: Use arrow keys (Up, Down, Left, Right).
Features:
Select speed (High, Medium, Low).
Change themes via dropdown.
Enter username to save scores.
View scores or toggle fullscreen.




License
MIT License. See LICENSE for details.
