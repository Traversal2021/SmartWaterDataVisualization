// // function controlFromInput(fromSlider, fromInput, toInput, controlSlider) {

// //   console.log(fromInput)
// //     const [from, to] = getParsed(fromInput, toInput);
// //     fillSlider(fromInput, toInput, '#C6C6C6', '#25daa5', controlSlider);
// //     if (from > to) {
// //         fromSlider.value = to;
// //         fromInput.value = to;
// //     } else {
// //         fromSlider.value = from;
// //     }
// // }
    
// // function controlToInput(toSlider, fromInput, toInput, controlSlider) {
// //     const [from, to] = getParsed(fromInput, toInput);
// //     fillSlider(fromInput, toInput, '#C6C6C6', '#25daa5', controlSlider);
// //     setToggleAccessible(toInput);
// //     if (from <= to) {
// //         toSlider.value = to;
// //         toInput.value = to;
// //     } else {
// //         toInput.value = from;
// //     }
// // }

// function controlFromSlider(fromSlider, toSlider) {
//   const [from, to] = getParsed(fromSlider, toSlider);
//   fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
//   if (from > to) {
//     fromSlider.value = to;
//     //fromInput.value = to;
//   } 
//   // else {
//   //   fromInput.value = from;
//   // }
// }

// function controlToSlider(fromSlider, toSlider) {
//   const [from, to] = getParsed(fromSlider, toSlider);
//   fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
//   setToggleAccessible(toSlider);
//   if (from <= to) {
//     toSlider.value = to;
//     //toInput.value = to;
//   } else {
//     //toInput.value = from;
//     toSlider.value = from;
//   }
// }

// function getParsed(currentFrom, currentTo) {
//   const from = parseInt(currentFrom.value, 10);
//   const to = parseInt(currentTo.value, 10);
//   return [from, to];
// }

// function fillSlider(from, to, sliderColor, rangeColor, controlSlider) {
//   console.log(from.value)
//     const rangeDistance = to.max-to.min;
//     const fromPosition = from.value - to.min;
//     const toPosition = to.value - to.min;
//     controlSlider.style.background = `linear-gradient(
//       to right,
//       ${sliderColor} 0%,
//       ${sliderColor} ${(fromPosition)/(rangeDistance)*100}%,
//       ${rangeColor} ${((fromPosition)/(rangeDistance))*100}%,
//       ${rangeColor} ${(toPosition)/(rangeDistance)*100}%, 
//       ${sliderColor} ${(toPosition)/(rangeDistance)*100}%, 
//       ${sliderColor} 100%)`;
// }

// function setToggleAccessible(currentTarget) {
//   const toSlider = document.querySelector('#toSlider');
//   if (Number(currentTarget.value) <= 0 ) {
//     toSlider.style.zIndex = 2;
//   } else {
//     toSlider.style.zIndex = 0;
//   }
// }

// const fromSlider = document.querySelector('#fromSlider');
// const toSlider = document.querySelector('#toSlider');
// // const fromInput = document.querySelector('#fromInput');
// // const toInput = document.querySelector('#toInput');
// fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
// setToggleAccessible(toSlider);

// fromSlider.oninput = () => controlFromSlider(fromSlider, toSlider);
// toSlider.oninput = () => controlToSlider(fromSlider, toSlider);
// // fromInput.oninput = () => controlFromInput(fromSlider, fromInput, toInput, toSlider);
// // toInput.oninput = () => controlToInput(toSlider, fromInput, toInput, toSlider);

// $(function() {
//   $( "#slider-range" ).slider({
//     range: true,
//     min: new Date('2010.01.01').getTime() / 1000,
//     max: new Date('2014.01.01').getTime() / 1000,
//     step: 86400,
//     values: [ new Date('2013.01.01').getTime() / 1000, new Date('2013.02.01').getTime() / 1000 ],
//     slide: function( event, ui ) {
//       $( "#amount" ).val( (new Date(ui.values[ 0 ] *1000).toDateString() ) + " - " + (new Date(ui.values[ 1 ] *1000)).toDateString() );
//     }
//   });
//   $( "#amount" ).val( (new Date($( "#slider-range" ).slider( "values", 0 )*1000).toDateString()) +
//     " - " + (new Date($( "#slider-range" ).slider( "values", 1 )*1000)).toDateString());
// });