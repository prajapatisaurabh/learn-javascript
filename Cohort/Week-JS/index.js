function eternal(guest) {
  const guestName = guest;
  let count = 0;

  function zomato() {
    console.log(`Hie ${guestName}, From zamoto`);
  }

  function blinkTt() {
    if (count == 1) return;
    console.log(`Hie ${guestName}, From blinkIt`);
    count++;
  }

  return {
    zomato,
    blinkTt,
  };
}

const hitesh = eternal("HJ");
hitesh.blinkTt();
hitesh.zomato();
hitesh.blinkTt();
hitesh.zomato();
hitesh.blinkTt();
hitesh.zomato();
