function iniciarReloj() {
  const hourHand = document.getElementById("manesilla-hora");
  const minuteHand = document.getElementById("manesilla-minuto");
  const secondHand = document.getElementById("manesilla-segundo");

  let now = null;
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  let hourRotation = 0;
  let minuteRotation = 0;
  let secondRotation = 0;

  let rotateClockHands = () => {
    now = new Date();
    hours = now.getHours();
    minutes = now.getMinutes();
    seconds = now.getSeconds();

    hourRotation = 30 * hours + 0.5 * minutes; // 30 degrees per hour
    minuteRotation = 6 * minutes; // 6 degrees per minute
    secondRotation = 6 * seconds; // 6 degrees per second

    hourHand.style.transform = `translate(-50%, -100%) rotate(${hourRotation}deg)`;
    minuteHand.style.transform = `translate(-50%, -100%) rotate(${minuteRotation}deg)`;
    secondHand.style.transform = `translate(-50%, -100%) rotate(${secondRotation}deg)`;
  };
  rotateClockHands();
  setInterval(rotateClockHands, 1000);
}
iniciarReloj();
