var screenInit = {			
  setDefaultFontSize: function() {					
      var fontsizeAll=window.innerWidth / 750 * 100;
      if(window.innerWidth > 750){
        fontsizeAll = '100'
      }
      document.querySelector('html').style.fontSize = fontsizeAll + 'px';

      // var bodyFontSize= parseFloat(window.getComputedStyle(document.getElementsByTagName('html')[0]).fontSize);													
      // fontsizeAll= fontsizeAll*fontsizeAll/bodyFontSize;			
      // document.querySelector('html').style.fontSize = fontsizeAll + 'px';						
  },
};		
screenInit.setDefaultFontSize();				
window.addEventListener('resize',screenInit.setDefaultFontSize,false);