let selectedRate = 2500;
  function selectType(el){
    document.querySelectorAll('.type-opt').forEach(o => o.classList.remove('active'));
    el.classList.add('active');
    selectedRate = parseInt(el.getAttribute('data-rate'));
  }
  function formatLakh(num){ return (num/100000).toFixed(1) + ' lac'; }
  function calculate(){
    const plotSize = parseFloat(document.getElementById('plotSize').value);
    const floors = parseInt(document.getElementById('floors').value);
    if(!plotSize || plotSize <= 0){
      document.getElementById('plotSize').focus();
      document.getElementById('plotSize').style.borderColor = '#c2953f';
      return;
    }
    const coveredAreaPerFloor = plotSize * 9 * 0.85;
    const totalCoveredArea = coveredAreaPerFloor * floors;
    const midCost = totalCoveredArea * selectedRate;
    const lowCost = midCost * 0.9, highCost = midCost * 1.1;
    document.getElementById('resultEmpty').style.display = 'none';
    document.getElementById('resultBox').style.display = 'block';
    document.getElementById('resultRange').textContent = 'Rs ' + formatLakh(lowCost) + ' – Rs ' + formatLakh(highCost);
    window._lastEstimate = {plotSize, floors, selectedRate, lowCost, highCost};
  }
  function sendToWhatsApp(){
    const loc = document.getElementById('location').value;
    const est = window._lastEstimate;
    if(!est) return;
    const typeLabel = est.selectedRate === 2500 ? 'Grey Structure with material' : 'Complete/Turnkey with material';
    const floorsLabel = est.floors === 1 ? 'Ground Floor' : est.floors === 2 ? 'Ground + 1' : 'Ground + 2';
    const msg = `Hi AMKO, I'd like a personalized estimate.\nLocation: ${loc}\nPlot size: ${est.plotSize} sq. yd.\nFloors: ${floorsLabel}\nConstruction type: ${typeLabel}`;
    window.open('https://wa.me/923222538025?text=' + encodeURIComponent(msg), '_blank');
  }
  function sendContactForm(){
    const name = document.getElementById('cName').value || 'there';
    const phone = document.getElementById('cPhone').value;
    const area = document.getElementById('cArea').value;
    const type = document.getElementById('cType').value;
    const msg = `Hi AMKO, my name is ${name}.\nPhone: ${phone}\nArea: ${area}\nProject type: ${type}`;
    window.open('https://wa.me/923222538025?text=' + encodeURIComponent(msg), '_blank');
  }
